"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function (resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments)).next());
    });
  };
const vsc = require("vscode");
const { X12Parser } = require("node-x12");
const core = require("../../core/core.module");
const x12 = require("../x12.module");
exports.CMD_SELECT_TRADING_PARTNER = "tc.x12.selectTradingPartner";
class SelectTradingPartnerCommand {
  constructor() {
    this.name = exports.CMD_SELECT_TRADING_PARTNER;
  }
  invoke(editor, edit) {
    return __awaiter(this, void 0, Promise, function* () {
      let parser = new { X12Parser }(true);
      let interchange;
      try {
        interchange = parser.parseX12(editor.document.getText());
      } catch (error) {
        vsc.window.showWarningMessage(
          "The trading partner list could not be obtained due to X12 syntax errors. Please correct the file syntax and try again."
        );
        return;
      }
      let statusBarMessage = vsc.window.setStatusBarMessage(
        "Getting EPP List..."
      );
      let eppService = new x12.EPPService();
      let partners;
      let partner;
      try {
        partners = yield eppService.searchPartnersByIsaInfoAsync(
          interchange.header.valueOf(5).trim(),
          interchange.header.valueOf(6).trim(),
          interchange.header.valueOf(7).trim(),
          interchange.header.valueOf(8).trim()
        );
      } catch (error) {
        vsc.window.showErrorMessage(error);
      } finally {
        statusBarMessage.dispose();
      }
      if (!partners || partners.length == 0) {
        vsc.window.showWarningMessage(
          "No trading partners could be found that match the current ISA segment information. Please check the sender/receiver IDs."
        );
        return;
      } else if (partners.length > 1) {
        let qpItems = new Array();
        partners.forEach((partner) => {
          qpItems.push(new TradingPartnerQuickPickItem(partner));
        });
        let pick = yield vsc.window.showQuickPick(qpItems, {
          matchOnDescription: true,
          placeHolder: "Trading Partner or EPP Name",
        });
        if (!pick) {
          return;
        }
        partner = pick.partner;
      } else {
        partner = partners[0];
      }
      let state = core.DocumentState.get(
        editor.document.uri,
        "x12",
        new x12.X12DocumentState()
      );
      state.tradingPartner = partner;
      state.transaction = null;
      core.DocumentState.update(editor.document.uri, x12.MODULE_X12, state);
    });
  }
}
exports.SelectTradingPartnerCommand = SelectTradingPartnerCommand;
class TradingPartnerQuickPickItem {
  constructor(partner) {
    this.partner = partner;
  }
  get description() {
    return `EPP: ${this.partner.eppName}`;
  }
  get label() {
    return this.partner.partnerName;
  }
}
