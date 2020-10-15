"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var vsc = require("vscode");
var core = require("../core/core.module");
var x12 = require("./x12.module");
__export(require("./commands/EditDocument"));
__export(require("./commands/QueryDocument"));
__export(require("./commands/SelectTradingPartner"));
__export(require("./commands/SelectTransaction"));
__export(require("./models/X12DocumentState"));
__export(require("./providers/EPPHoverProvider"));
__export(require("./providers/EPPValidationProvider"));
__export(require("./providers/X12FormattingEditProvider"));
__export(require("./providers/X12LintingProvider"));
__export(require("./services/EPPService"));
__export(require("./services/X12Config"));
__export(require("./status-bar/EditDocumentButton"));
__export(require("./status-bar/FormatEdiButton"));
__export(require("./status-bar/QueryDocumentButton"));
__export(require("./status-bar/TradingPartnerButton"));
__export(require("./status-bar/TransactionButton"));
__export(require("./utils/TokenUtils"));
exports.MODULE_X12 = "x12";
exports.LANGUAGE_X12 = "x12";
function activate(ctx) {
  ctx.subscriptions.push(
    core.CommandManager.registerTextEditorCommand(
      new x12.EditDocumentCommand()
    ),
    core.CommandManager.registerTextEditorCommand(
      new x12.QueryDocumentCommand()
    ),
    core.CommandManager.registerTextEditorCommand(
      new x12.SelectTradingPartnerCommand()
    ),
    core.CommandManager.registerTextEditorCommand(
      new x12.SelectTransactionCommand()
    ),
    vsc.languages.registerDocumentFormattingEditProvider(
      exports.LANGUAGE_X12,
      new x12.X12FormattingEditProvider()
    ),
    vsc.languages.registerHoverProvider(
      exports.LANGUAGE_X12,
      new x12.EPPHoverProvider()
    )
  );
  core.StatusBarManager.registerStatusBarComponent(
    vsc.StatusBarAlignment.Left,
    400,
    new x12.FormatEdiButton()
  );
  core.StatusBarManager.registerStatusBarComponent(
    vsc.StatusBarAlignment.Left,
    350,
    new x12.EditDocumentButton()
  );
  core.StatusBarManager.registerStatusBarComponent(
    vsc.StatusBarAlignment.Left,
    300,
    new x12.QueryDocumentButton()
  );
  core.StatusBarManager.registerStatusBarComponent(
    vsc.StatusBarAlignment.Left,
    200,
    new x12.TradingPartnerButton()
  );
  core.StatusBarManager.registerStatusBarComponent(
    vsc.StatusBarAlignment.Left,
    100,
    new x12.TransactionButton()
  );
  core.LintingManager.registerLintingProvider(new x12.X12LintingProvider());
  core.LintingManager.registerLintingProvider(new x12.EPPValidationProvider());
  ctx.subscriptions.push(
    vsc.workspace.onDidOpenTextDocument(function (document) {
      if (
        document.languageId === exports.LANGUAGE_X12 &&
        x12.X12Config.formatX12OnOpen
      ) {
        vsc.commands.executeCommand("editor.action.format");
      }
    })
  );
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;
