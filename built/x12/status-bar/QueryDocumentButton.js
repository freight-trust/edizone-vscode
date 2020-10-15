"use strict";
var vsc = require("vscode");
var x12 = require("../x12.module");
var QueryDocumentButton = /** @class */ (function () {
  function QueryDocumentButton() {
    this._baseItem = null;
  }
  QueryDocumentButton.prototype.activate = function (baseItem) {
    var _this = this;
    this._baseItem = baseItem;
    this._baseItem.text = "$(search) Query";
    this._baseItem.command = x12.CMD_QUERY_DOCUMENT;
    vsc.window.onDidChangeActiveTextEditor(function (editor) {
      _this._refresh();
    });
  };
  QueryDocumentButton.prototype._refresh = function () {
    var editor = vsc.window.activeTextEditor;
    if (
      !editor ||
      !editor.document ||
      editor.document.languageId !== x12.LANGUAGE_X12
    ) {
      this._baseItem.hide();
      return;
    }
    this._baseItem.show();
  };
  return QueryDocumentButton;
})();
exports.QueryDocumentButton = QueryDocumentButton;
