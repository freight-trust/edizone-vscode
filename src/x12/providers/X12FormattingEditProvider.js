"use strict";
const vsc = require("vscode");
const { X12Parser } = require("node-x12");
class X12FormattingEditProvider {
  provideDocumentFormattingEdits(document, options) {
    let edi = document.getText();
    let parser = new { X12Parser }(false);
    let interchange;
    try {
      interchange = parser.parseX12(edi);
    } catch (error) {
      vsc.window.showErrorMessage(
        "The document could not be formatted due to X12 syntax errors."
      );
      return;
    }
    edi = interchange.toString({
      format: true,
      elementDelimiter: interchange.elementDelimiter,
      segmentTerminator: interchange.segmentTerminator,
    });
    let lastLineIndex = document.lineCount - 1;
    return [
      vsc.TextEdit.replace(
        new vsc.Range(
          0,
          0,
          lastLineIndex,
          document.lineAt(lastLineIndex).text.length
        ),
        edi
      ),
    ];
  }
}
exports.X12FormattingEditProvider = X12FormattingEditProvider;
