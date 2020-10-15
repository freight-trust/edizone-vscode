"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __awaiter = (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                }
                catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                }
                catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : new P(function (resolve) {
                        resolve(result.value);
                    }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments)).next());
        });
    };
var vsc = require("vscode");
var X12Parser = require("node-x12").X12Parser;
exports.CMD_QUERY_DOCUMENT = "tc.x12.queryDocument";
var QueryDocumentCommand = /** @class */ (function () {
    function QueryDocumentCommand() {
        this.name = exports.CMD_QUERY_DOCUMENT;
    }
    QueryDocumentCommand.prototype.invoke = function (editor, edit) {
        return __awaiter(this, void 0, Promise, function () {
            var query, parser, X12Parser, engine, results, channel_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vsc.window.showInputBox({
                            prompt: "Please enter an element reference query.",
                            placeHolder: 'ex. REF02:REF01["PO"]',
                        })];
                    case 1:
                        query = _a.sent();
                        if (!query) {
                            return [2 /*return*/];
                        }
                        parser = new { X12Parser: X12Parser }., X12Parser = (void 0).X12Parser;
                        (true);
                        engine = new { X12Parser: X12Parser }.X12QueryEngine(parser);
                        try {
                            results = engine.query(editor.document.getText(), query);
                        }
                        catch (error) {
                            vsc.window.showErrorMessage(error);
                        }
                        if (results) {
                            channel_1 = vsc.window.createOutputChannel("X12 Query Results");
                            channel_1.show(vsc.ViewColumn.Three);
                            channel_1.clear();
                            channel_1.appendLine("Reference Query: " + query);
                            channel_1.appendLine("");
                            results.forEach(function (result) {
                                channel_1.appendLine("[Line " + (result.element.range.start.line + 1) + "]: " + result.element.value);
                            });
                        }
                        else {
                            vsc.window.showInformationMessage("No results found for that query!");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return QueryDocumentCommand;
}());
exports.QueryDocumentCommand = QueryDocumentCommand;
