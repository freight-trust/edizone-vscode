"use strict";
var vsc = require("vscode");
var X12Parser = require("node-x12").X12Parser;
var core = require("../../core/core.module");
var x12 = require("../x12.module");
var EPPHoverProvider = /** @class */ (function () {
    function EPPHoverProvider() {
    }
    EPPHoverProvider.prototype.provideHover = function (document, position) {
        var state = core.DocumentState.get(document.uri, x12.MODULE_X12);
        if (!state || !state.transaction) {
            return null;
        }
        var plugin = state.transaction;
        var parser = new { X12Parser: X12Parser }., X12Parser = (void 0).X12Parser;
        (false);
        var engine = new { X12Parser: X12Parser }.X12QueryEngine(parser);
        var hover = new vsc.Hover("*No Information Available*");
        var _loop_1 = function (i) {
            var token = plugin.tokenIDs[i];
            if (!token.caption) {
                var originalMatch = plugin.tokenIDs.find(function (value) {
                    return value.name === token.name && !!value.caption;
                });
                if (originalMatch) {
                    token.caption = originalMatch.caption;
                }
                if (!token.caption) {
                    return "continue";
                }
            }
            var results = void 0;
            try {
                var query = x12.TokenUtils.getElementReferenceQuery(token);
                if (!query) {
                    return "continue";
                }
                results = engine.query(document.getText(), query);
            }
            catch (error) {
                console.error("Dynamic Element Query Failed!", error);
            }
            if (results && results.length > 0) {
                var flag = false;
                var _loop_2 = function (j) {
                    var result = results[j];
                    var range = new vsc.Range(result.element.range.start.line, result.element.range.start.character - 1, result.element.range.end.line, result.element.range.end.character + 1);
                    if (range.contains(position)) {
                        var content = "**Token ID:** " + token.id + "  \n**Token Name:** " + token.name + "  \n**Transaction Manager Label:** " + token.caption;
                        if (token.items && token.items.length > 0) {
                            var item = token.items.find(function (value) {
                                return value.storedValue === result.element.value;
                            });
                            if (item && item.displayValue) {
                                content += "  \n**Transaction Manager Value:** " + item.displayValue;
                            }
                        }
                        hover = new vsc.Hover(content);
                        flag = true;
                        return "break";
                    }
                };
                for (var j = 0; j < results.length; j++) {
                    var state_2 = _loop_2(j);
                    if (state_2 === "break")
                        break;
                }
                if (flag) {
                    return "break";
                }
            }
        };
        for (var i = 0; i < plugin.tokenIDs.length; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        return hover;
    };
    return EPPHoverProvider;
}());
exports.EPPHoverProvider = EPPHoverProvider;
