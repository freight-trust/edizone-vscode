"use strict";
var vsc = require("vscode");
var X12Parser = require("node-x12").X12Parser;
var X12FormattingEditProvider = /** @class */ (function () {
    function X12FormattingEditProvider() {
    }
    X12FormattingEditProvider.prototype.provideDocumentFormattingEdits = function (document, options) {
        var edi = document.getText();
        var parser = new { X12Parser: X12Parser }., X12Parser = (void 0).X12Parser;
        (false);
        var interchange;
        try {
            interchange = parser.parseX12(edi);
        }
        catch (error) {
            vsc.window.showErrorMessage("The document could not be formatted due to X12 syntax errors.");
            return;
        }
        edi = interchange.toString({
            format: true,
            elementDelimiter: interchange.elementDelimiter,
            segmentTerminator: interchange.segmentTerminator,
        });
        var lastLineIndex = document.lineCount - 1;
        return [
            vsc.TextEdit.replace(new vsc.Range(0, 0, lastLineIndex, document.lineAt(lastLineIndex).text.length), edi),
        ];
    };
    return X12FormattingEditProvider;
}());
exports.X12FormattingEditProvider = X12FormattingEditProvider;
