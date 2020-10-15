"use strict";
const vsc = require("vscode");
const core = require("../../core/core.module");
const x12 = require("../x12.module");
class TransactionButton {
  constructor() {
    this._baseItem = null;
  }
  activate(baseItem) {
    this._baseItem = baseItem;
    this._baseItem.text = "$(mail) - Select Transaction -";
    this._baseItem.command = x12.CMD_SELECT_TRANSACTION;
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
      this._setText(state.transaction.name);
    } else {
      this._setText("- Select Transaction -");
    }
    this._baseItem.show();
  }
  _setText(text) {
    this._baseItem.text = `$(mail) ${text}`;
  }
}
exports.TransactionButton = TransactionButton;
