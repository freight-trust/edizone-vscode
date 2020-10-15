"use strict";
const vsc = require("vscode");
const core = require("../core.module");
class LintingManager {
  static registerLintingProvider(lintingProvider) {
    vsc.window.onDidChangeActiveTextEditor((editor) => {
      if (!editor || !editor.document) {
        return;
      }
      lintingProvider.provideLintingDiagnostics(
        editor,
        this._getDiagnosticCollection(lintingProvider.diagnosticsName)
      );
    });
    vsc.window.onDidChangeTextEditorSelection((e) => {
      if (!e.textEditor || !e.textEditor.document) {
        return;
      }
      lintingProvider.provideLintingDiagnostics(
        e.textEditor,
        this._getDiagnosticCollection(lintingProvider.diagnosticsName)
      );
    });
    core.DocumentState.onChange((data, module, uri) => {
      let editor = vsc.window.visibleTextEditors.find((value) => {
        return (
          value &&
          value.document &&
          value.document.uri.toString() === uri.toString()
        );
      });
      if (editor) {
        lintingProvider.provideLintingDiagnostics(
          editor,
          this._getDiagnosticCollection(lintingProvider.diagnosticsName)
        );
      }
    });
  }
  static _getDiagnosticCollection(name) {
    let dc = vsc.languages.createDiagnosticCollection(name);
    dc.clear();
    return dc;
  }
}
exports.LintingManager = LintingManager;
