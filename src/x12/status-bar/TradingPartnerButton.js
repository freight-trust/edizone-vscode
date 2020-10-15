"use strict";
const vsc = require("vscode");
const core = require("../../core/core.module");
const x12 = require("../x12.module");
class TradingPartnerButton {
  constructor() {
    this._baseItem = null;
  }
  activate(baseItem) {
    this._baseItem = baseItem;
    this._baseItem.text = "$(organization) - Select Trading Partner -";
    this._baseItem.command = x12.CMD_SELECT_TRADING_PARTNER;
    vsc.window.onDidChangeActiveTextEditor((editor) => {
      this._refresh();
    });
    core.DocumentState.onChange((data, module, uri) => {
      this._refresh();
    });
    core.CommandManager.onAfterInvoke(core.CMD_SIGNIN, () => {
      this._refresh();
    });
    core.CommandManager.onAfterInvoke(core.CMD_SIGNOUT, () => {
      this._refresh();
    });
  }
  _refresh() {
    let editor = vsc.window.activeTextEditor;
    if (
      !editor ||
      !editor.document ||
      editor.document.languageId !== x12.LANGUAGE_X12 ||
      !core.ToolboxState.ssoSignedIn
    ) {
      this._baseItem.hide();
      return;
    }
    let state = core.DocumentState.get(editor.document.uri, x12.MODULE_X12);
    if (state) {
      this._setText(state.tradingPartner.partnerName);
    } else {
      this._setText("- Select Trading Partner -");
    }
    this._baseItem.show();
  }
  _setText(text) {
    this._baseItem.text = `$(organization) ${text}`;
  }
}
exports.TradingPartnerButton = TradingPartnerButton;
