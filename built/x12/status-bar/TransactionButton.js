"use strict";
var vsc = require("vscode");
var core = require("../../core/core.module");
var x12 = require("../x12.module");
var TransactionButton = /** @class */ (function () {
  function TransactionButton() {
    this._baseItem = null;
  }
  TransactionButton.prototype.activate = function (baseItem) {
    var _this = this;
    this._baseItem = baseItem;
    this._baseItem.text = "$(mail) - Select Transaction -";
    this._baseItem.command = x12.CMD_SELECT_TRANSACTION;
    vsc.window.onDidChangeActiveTextEditor(function (editor) {
      _this._refresh();
    });
    core.DocumentState.onChange(function (data, module, uri) {
      _this._refresh();
    });
    core.CommandManager.onAfterInvoke(core.CMD_SIGNIN, function () {
      _this._refresh();
    });
    core.CommandManager.onAfterInvoke(core.CMD_SIGNOUT, function () {
      _this._refresh();
    });
  };
  TransactionButton.prototype._refresh = function () {
    var editor = vsc.window.activeTextEditor;
    if (
      !editor ||
      !editor.document ||
      editor.document.languageId !== x12.LANGUAGE_X12 ||
      !core.ToolboxState.ssoSignedIn
    ) {
      this._baseItem.hide();
      return;
    }
    var state = core.DocumentState.get(editor.document.uri, x12.MODULE_X12);
    if (state) {
      this._setText(state.transaction.name);
    } else {
      this._setText("- Select Transaction -");
    }
    this._baseItem.show();
  };
  TransactionButton.prototype._setText = function (text) {
    this._baseItem.text = "$(mail) " + text;
  };
  return TransactionButton;
})();
exports.TransactionButton = TransactionButton;
