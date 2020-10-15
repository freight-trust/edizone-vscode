"use strict";
var vsc = require("vscode");
var core = require("../core.module");
var LintingManager = /** @class */ (function () {
  function LintingManager() {}
  LintingManager.registerLintingProvider = function (lintingProvider) {
    var _this = this;
    vsc.window.onDidChangeActiveTextEditor(function (editor) {
      if (!editor || !editor.document) {
        return;
      }
      lintingProvider.provideLintingDiagnostics(
        editor,
        _this._getDiagnosticCollection(lintingProvider.diagnosticsName)
      );
    });
    vsc.window.onDidChangeTextEditorSelection(function (e) {
      if (!e.textEditor || !e.textEditor.document) {
        return;
      }
      lintingProvider.provideLintingDiagnostics(
        e.textEditor,
        _this._getDiagnosticCollection(lintingProvider.diagnosticsName)
      );
    });
    core.DocumentState.onChange(function (data, module, uri) {
      var editor = vsc.window.visibleTextEditors.find(function (value) {
        return (
          value &&
          value.document &&
          value.document.uri.toString() === uri.toString()
        );
      });
      if (editor) {
        lintingProvider.provideLintingDiagnostics(
          editor,
          _this._getDiagnosticCollection(lintingProvider.diagnosticsName)
        );
      }
    });
  };
  LintingManager._getDiagnosticCollection = function (name) {
    var dc = vsc.languages.createDiagnosticCollection(name);
    dc.clear();
    return dc;
  };
  return LintingManager;
})();
exports.LintingManager = LintingManager;
