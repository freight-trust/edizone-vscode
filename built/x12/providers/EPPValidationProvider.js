"use strict";
var vsc = require("vscode");
var X12Parser = require("node-x12").X12Parser;
var core = require("../../core/core.module");
var x12 = require("../x12.module");
var EPPValidationProvider = /** @class */ (function () {
    function EPPValidationProvider() {
        this.diagnosticsName = "EPPValidationDiagnostics";
    }
    EPPValidationProvider.prototype.provideLintingDiagnostics = function (editor, diagnostics) {
        if (!editor || !editor.document || editor.document.languageId !== "x12") {
            return;
        }
        var state = core.DocumentState.get(editor.document.uri, x12.MODULE_X12);
        if (!state || !state.tradingPartner || !state.transaction) {
            return;
        }
        var rawData = editor.document.getText();
        var partner = state.tradingPartner;
        var plugin = state.transaction;
        var parser = new { X12Parser: X12Parser }., X12Parser = (void 0).X12Parser;
        (false);
        var interchange = parser.parseX12(rawData);
        var engine = new { X12Parser: X12Parser }.X12QueryEngine(parser);
        var newDiagnostics = new Array();
        var requiredTokens = plugin.tokenIDs.filter(function (token) {
            return token.manditory;
        });
        requiredTokens.forEach(function (token) {
            var query = x12.TokenUtils.getElementReferenceQuery(token);
            var results = null;
            var txnResultCount = 0;
            if (query) {
                try {
                    results = engine.query(rawData, query);
                    var lastTransactionResult = null;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].transaction !== lastTransactionResult) {
                            txnResultCount++;
                            lastTransactionResult = results[i].transaction;
                        }
                    }
                }
                catch (error) { }
            }
            if (txnResultCount !== interchange.functionalGroups[0].transactions.length) {
                var range = new vsc.Range(interchange.header.range.start.line, interchange.header.range.start.character, interchange.header.range.end.line, interchange.header.range.end.character);
                var segResult = null;
                try {
                    engine.querySingle(rawData, token.elementSegment + "01");
                }
                catch (error) { }
                if (segResult) {
                    range = new vsc.Range(segResult.segment.range.start.line, segResult.segment.range.start.character, segResult.segment.range.end.line, segResult.segment.range.end.character);
                }
                newDiagnostics.push(new vsc.Diagnostic(range, "EPP Validation: Required element (" + query + ") is missing from raw data.", vsc.DiagnosticSeverity.Error));
            }
        });
        interchange = parser.parseX12(rawData);
        var rawSegments = new Array();
        interchange.functionalGroups.forEach(function (group) {
            group.transactions.forEach(function (transaction) {
                transaction.segments.forEach(function (segment) {
                    if (plugin.segments.filter(function (value) {
                        return value.name === segment.tag;
                    }).length == 0 &&
                        segment.tag !== "HL") {
                        newDiagnostics.push(new vsc.Diagnostic(new vsc.Range(segment.range.start.line, segment.range.start.character, segment.range.end.line, segment.range.end.character), "EPP Validation: Segment (" + segment.tag + ") is not mapped in the EPP.", vsc.DiagnosticSeverity.Warning));
                    }
                });
            });
        });
        diagnostics.set(editor.document.uri, newDiagnostics);
    };
    return EPPValidationProvider;
}());
exports.EPPValidationProvider = EPPValidationProvider;
