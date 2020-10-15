"use strict";
var vsc = require("vscode");
var x12 = require("../x12.module");
var EditDocumentButton = /** @class */ (function () {
  function EditDocumentButton() {
    this._baseItem = null;
  }
  EditDocumentButton.prototype.activate = function (baseItem) {
    var _this = this;
    this._baseItem = baseItem;
    this._baseItem.text = "$(pencil) Edit";
    this._baseItem.command = x12.CMD_EDIT_DOCUMENT;
    vsc.window.onDidChangeActiveTextEditor(function (editor) {
      _this._refresh();
    });
  };
  EditDocumentButton.prototype._refresh = function () {
    var editor = vsc.window.activeTextEditor;
    if (
      !editor ||
      !editor.document ||
      editor.document.languageId !== x12.LANGUAGE_X12
    ) {
      this._baseItem.hide();
    } else {
      this._baseItem.show();
    }
  };
  return EditDocumentButton;
})();
exports.EditDocumentButton = EditDocumentButton;
