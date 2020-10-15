"use strict";
var vsc = require("vscode");
var x12 = require("../x12.module");
var FormatEdiButton = /** @class */ (function () {
  function FormatEdiButton() {
    this._baseItem = null;
  }
  FormatEdiButton.prototype.activate = function (baseItem) {
    var _this = this;
    this._baseItem = baseItem;
    this._baseItem.text = "$(code) Format EDI";
    this._baseItem.command = "editor.action.format";
    vsc.window.onDidChangeActiveTextEditor(function (editor) {
      _this._refresh();
    });
  };
  FormatEdiButton.prototype._refresh = function () {
    var editor = vsc.window.activeTextEditor;
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
  };
  return FormatEdiButton;
})();
exports.FormatEdiButton = FormatEdiButton;
