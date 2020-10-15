"use strict";
const vsc = require("vscode");
const x12 = require("../x12.module");
class QueryDocumentButton {
  constructor() {
    this._baseItem = null;
  }
  activate(baseItem) {
    this._baseItem = baseItem;
    this._baseItem.text = "$(search) Query";
    this._baseItem.command = x12.CMD_QUERY_DOCUMENT;
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
      return;
    }
    this._baseItem.show();
  }
}
exports.QueryDocumentButton = QueryDocumentButton;
