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
const core = require("../../core/core.module");
const x12 = require("../x12.module");
exports.CMD_SELECT_TRANSACTION = "tc.x12.selectTransaction";
class SelectTransactionCommand {
  constructor() {
    this.name = exports.CMD_SELECT_TRANSACTION;
  }
  invoke(editor, edit) {
    return __awaiter(this, void 0, Promise, function* () {
      let state = core.DocumentState.get(editor.document.uri, "x12");
      if (!state || !state.tradingPartner) {
        vsc.window.showWarningMessage("Please select a trading partner first.");
        return;
      }
      let statusBarMessage = vsc.window.setStatusBarMessage(
        "Getting Transaction List..."
      );
      let eppService = new x12.EPPService();
      let headers;
      try {
        headers = yield eppService.getPluginHeadersForPartnerAsync(
          state.tradingPartner.partnerID
        );
      } catch (error) {
        vsc.window.showErrorMessage(error);
      } finally {
        statusBarMessage.dispose();
      }
      let qpItems = new Array();
      headers.forEach((header) => {
        qpItems.push(new HeaderQuickPickItem(header));
      });
      let pick = yield vsc.window.showQuickPick(qpItems, {
        matchOnDescription: true,
        placeHolder: "Transaction Name or Number",
      });
      if (!pick) {
        return;
      }
      statusBarMessage = vsc.window.setStatusBarMessage(
        "Getting Transaction Plugin..."
      );
      let plugin;
      try {
        plugin = yield eppService.getPluginAsync(pick.header.plugInID);
      } catch (error) {
        vsc.window.showErrorMessage(error);
      } finally {
        statusBarMessage.dispose();
      }
      state = core.DocumentState.get(
        editor.document.uri,
        x12.MODULE_X12,
        new x12.X12DocumentState()
      );
      state.transaction = plugin;
      core.DocumentState.update(editor.document.uri, x12.MODULE_X12, state);
    });
  }
}
exports.SelectTransactionCommand = SelectTransactionCommand;
class HeaderQuickPickItem {
  constructor(header) {
    this.header = header;
  }
  get description() {
    return `${this.header.standardDocument.replace("X12 - ", "")} (${
      this.header.standardVersion
    })`;
  }
  get label() {
    return this.header.txnName;
  }
}
