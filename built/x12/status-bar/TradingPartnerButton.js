"use strict";
var vsc = require("vscode");
var core = require("../../core/core.module");
var x12 = require("../x12.module");
var TradingPartnerButton = /** @class */ (function () {
  function TradingPartnerButton() {
    this._baseItem = null;
  }
  TradingPartnerButton.prototype.activate = function (baseItem) {
    var _this = this;
    this._baseItem = baseItem;
    this._baseItem.text = "$(organization) - Select Trading Partner -";
    this._baseItem.command = x12.CMD_SELECT_TRADING_PARTNER;
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
  TradingPartnerButton.prototype._refresh = function () {
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
      this._setText(state.tradingPartner.partnerName);
    } else {
      this._setText("- Select Trading Partner -");
    }
    this._baseItem.show();
  };
  TradingPartnerButton.prototype._setText = function (text) {
    this._baseItem.text = "$(organization) " + text;
  };
  return TradingPartnerButton;
})();
exports.TradingPartnerButton = TradingPartnerButton;
