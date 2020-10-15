"use strict";
var vsc = require("vscode");
var X12Parser = require("node-x12").X12Parser;
var X12LintingProvider = /** @class */ (function () {
    function X12LintingProvider() {
        this.diagnosticsName = "X12LintingDiagnostics";
    }
    X12LintingProvider.prototype.provideLintingDiagnostics = function (editor, diagnostics) {
        if (!editor || !editor.document || editor.document.languageId !== "x12") {
            return;
        }
        var parser = new { X12Parser: X12Parser }., X12Parser = (void 0).X12Parser;
        (false);
        var interchange;
        try {
            interchange = parser.parseX12(editor.document.getText());
        }
        catch (error) { }
        diagnostics.clear();
        var newDiagnostics = new Array();
        parser.diagnostics.forEach(function (parserDiagnostic) {
            var range = new vsc.Range(parserDiagnostic.range.start.line, parserDiagnostic.range.start.character, parserDiagnostic.range.end.line, parserDiagnostic.range.end.character);
            newDiagnostics.push(new vsc.Diagnostic(range, parserDiagnostic.message));
        });
        diagnostics.set(editor.document.uri, newDiagnostics);
    };
    return X12LintingProvider;
}());
exports.X12LintingProvider = X12LintingProvider;
