"use strict";
const vsc = require("vscode");
const { X12Parser } = require("node-x12");
class X12LintingProvider {
  constructor() {
    this.diagnosticsName = "X12LintingDiagnostics";
  }
  provideLintingDiagnostics(editor, diagnostics) {
    if (!editor || !editor.document || editor.document.languageId !== "x12") {
      return;
    }
    let parser = new { X12Parser }(false);
    let interchange;
    try {
      interchange = parser.parseX12(editor.document.getText());
    } catch (error) {}
    diagnostics.clear();
    let newDiagnostics = new Array();
    parser.diagnostics.forEach((parserDiagnostic) => {
      let range = new vsc.Range(
        parserDiagnostic.range.start.line,
        parserDiagnostic.range.start.character,
        parserDiagnostic.range.end.line,
        parserDiagnostic.range.end.character
      );
      newDiagnostics.push(new vsc.Diagnostic(range, parserDiagnostic.message));
    });
    diagnostics.set(editor.document.uri, newDiagnostics);
  }
}
exports.X12LintingProvider = X12LintingProvider;
