"use strict";
const vsc = require("vscode");
const x12 = require("../x12.module");
class EditDocumentButton {
  constructor() {
    this._baseItem = null;
  }
  activate(baseItem) {
    this._baseItem = baseItem;
    this._baseItem.text = "$(pencil) Edit";
    this._baseItem.command = x12.CMD_EDIT_DOCUMENT;
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
    } else {
      this._baseItem.show();
    }
  }
}
exports.EditDocumentButton = EditDocumentButton;
