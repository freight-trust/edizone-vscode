"use strict";
const vsc = require("vscode");
const x12 = require("../x12.module");
class FormatEdiButton {
  constructor() {
    this._baseItem = null;
  }
  activate(baseItem) {
    this._baseItem = baseItem;
    this._baseItem.text = "$(code) Format EDI";
    this._baseItem.command = "editor.action.format";
    vsc.window.onDidChangeActiveTextEditor((editor) => {
      this._refresh();
    });
  }
  _refresh() {
    let editor = vsc.window.activeTextEditor;
    if (
      !editor ||
      !editor.document ||
      editor.document.languageId !== x12.LANGUAGE_X12
    ) {
      this._baseItem.hide();
    } else if (!x12.X12Config.formatX12OnOpen) {
      this._baseItem.hide();
    } else {
      this._baseItem.show();
    }
  }
}
exports.FormatEdiButton = FormatEdiButton;
