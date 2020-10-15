"use strict";
const vsc = require("vscode");
const { X12Parser } = require("node-x12");
const core = require("../../core/core.module");
const x12 = require("../x12.module");
class EPPValidationProvider {
  constructor() {
    this.diagnosticsName = "EPPValidationDiagnostics";
  }
  provideLintingDiagnostics(editor, diagnostics) {
    if (!editor || !editor.document || editor.document.languageId !== "x12") {
      return;
    }
    let state = core.DocumentState.get(editor.document.uri, x12.MODULE_X12);
    if (!state || !state.tradingPartner || !state.transaction) {
      return;
    }
    let rawData = editor.document.getText();
    let partner = state.tradingPartner;
    let plugin = state.transaction;
    let parser = new { X12Parser }(false);
    let interchange = parser.parseX12(rawData);
    let engine = new { X12Parser }.X12QueryEngine(parser);
    let newDiagnostics = new Array();
    let requiredTokens = plugin.tokenIDs.filter((token) => {
      return token.manditory;
    });
    requiredTokens.forEach((token) => {
      let query = x12.TokenUtils.getElementReferenceQuery(token);
      let results = null;
      let txnResultCount = 0;
      if (query) {
        try {
          results = engine.query(rawData, query);
          let lastTransactionResult = null;
          for (let i = 0; i < results.length; i++) {
            if (results[i].transaction !== lastTransactionResult) {
              txnResultCount++;
              lastTransactionResult = results[i].transaction;
            }
          }
        } catch (error) {}
      }
      if (
        txnResultCount !== interchange.functionalGroups[0].transactions.length
      ) {
        let range = new vsc.Range(
          interchange.header.range.start.line,
          interchange.header.range.start.character,
          interchange.header.range.end.line,
          interchange.header.range.end.character
        );
        let segResult = null;
        try {
          engine.querySingle(rawData, `${token.elementSegment}01`);
        } catch (error) {}
        if (segResult) {
          range = new vsc.Range(
            segResult.segment.range.start.line,
            segResult.segment.range.start.character,
            segResult.segment.range.end.line,
            segResult.segment.range.end.character
          );
        }
        newDiagnostics.push(
          new vsc.Diagnostic(
            range,
            `EPP Validation: Required element (${query}) is missing from raw data.`,
            vsc.DiagnosticSeverity.Error
          )
        );
      }
    });
    interchange = parser.parseX12(rawData);
    let rawSegments = new Array();
    interchange.functionalGroups.forEach((group) => {
      group.transactions.forEach((transaction) => {
        transaction.segments.forEach((segment) => {
          if (
            plugin.segments.filter((value) => {
              return value.name === segment.tag;
            }).length == 0 &&
            segment.tag !== "HL"
          ) {
            newDiagnostics.push(
              new vsc.Diagnostic(
                new vsc.Range(
                  segment.range.start.line,
                  segment.range.start.character,
                  segment.range.end.line,
                  segment.range.end.character
                ),
                `EPP Validation: Segment (${segment.tag}) is not mapped in the EPP.`,
                vsc.DiagnosticSeverity.Warning
              )
            );
          }
        });
      });
    });
    diagnostics.set(editor.document.uri, newDiagnostics);
  }
}
exports.EPPValidationProvider = EPPValidationProvider;
