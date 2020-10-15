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
var core = require("../../core/core.module");
var x12 = require("../x12.module");
exports.CMD_EDIT_DOCUMENT = "tc.x12.editDocument";
var EditDocumentCommand = /** @class */ (function () {
    function EditDocumentCommand() {
        this.name = exports.CMD_EDIT_DOCUMENT;
    }
    EditDocumentCommand.prototype.invoke = function (editor, edit) {
        return __awaiter(this, void 0, Promise, function () {
            var rawData, parser, X12Parser, interchange, fieldChoices, targetChoices, fieldChoice, qualifierPos_1, idPos_1, qualifier_1, identifier_1, value, targetChoice, counter_1, workspaceEdit_1, idPos_2, identifier_2, value, targetChoice, counter_2, workspaceEdit_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawData = editor.document.getText();
                        parser = new { X12Parser: X12Parser }., X12Parser = (void 0).X12Parser;
                        (false);
                        try {
                            interchange = parser.parseX12(rawData);
                        }
                        catch (error) {
                            vsc.window.showErrorMessage("This document cannot be edited as it is not a valid X12 document.");
                            return [2 /*return*/];
                        }
                        fieldChoices = [
                            "Interchange Sender ID (ISA)",
                            "Interchange Receiver ID (ISA)",
                            "Application Sender Code (GS)",
                            "Application Receiver Code (GS)",
                        ];
                        targetChoices = ["This Document", "All Open Documents"];
                        return [4 /*yield*/, vsc.window.showQuickPick(fieldChoices, {
                                placeHolder: "Select Field to Update",
                            })];
                    case 1:
                        fieldChoice = _a.sent();
                        if (!(fieldChoice === fieldChoices[0] || fieldChoice === fieldChoices[1])) return [3 /*break*/, 4];
                        qualifierPos_1 = fieldChoice === fieldChoices[0] ? 5 : 7;
                        idPos_1 = fieldChoice === fieldChoices[0] ? 6 : 8;
                        qualifier_1 = interchange.header.valueOf(qualifierPos_1);
                        identifier_1 = interchange.header.valueOf(idPos_1).trim();
                        return [4 /*yield*/, vsc.window.showInputBox({
                                placeHolder: "<Qualifier>/<Identifier>",
                                prompt: "Please provide the ID qualifier and identifier.",
                            })];
                    case 2:
                        value = _a.sent();
                        if (value.indexOf("/") < 2) {
                            vsc.window.showErrorMessage("The provided format must be: <Qualifier>/<Identifier>!");
                            return [2 /*return*/];
                        }
                        qualifier_1 = this._padRight(value.substring(0, value.indexOf("/")).trim(), 2);
                        identifier_1 = this._padRight(value.substring(value.indexOf("/") + 1).trim(), 15);
                        return [4 /*yield*/, vsc.window.showQuickPick(targetChoices, {
                                placeHolder: "Replace in...",
                            })];
                    case 3:
                        targetChoice = _a.sent();
                        if (targetChoice === targetChoices[0]) {
                            interchange.header.elements[qualifierPos_1 - 1].value = qualifier_1;
                            interchange.header.elements[idPos_1 - 1].value = identifier_1;
                            editor.edit(function (builder) {
                                builder.replace(core.RangeUtil.getRangeForDocument(editor.document), interchange.toString({
                                    format: true,
                                    elementDelimiter: interchange.elementDelimiter,
                                    segmentTerminator: interchange.segmentTerminator,
                                }));
                            });
                        }
                        else if (targetChoice === targetChoices[1]) {
                            if (vsc.workspace) {
                                counter_1 = 0;
                                workspaceEdit_1 = new vsc.WorkspaceEdit();
                                vsc.workspace.textDocuments.forEach(function (document) {
                                    if (document.languageId === x12.LANGUAGE_X12) {
                                        try {
                                            interchange = parser.parseX12(document.getText());
                                            interchange.header.elements[qualifierPos_1 - 1].value = qualifier_1;
                                            interchange.header.elements[idPos_1 - 1].value = identifier_1;
                                            workspaceEdit_1.replace(document.uri, core.RangeUtil.getRangeForDocument(document), interchange.toString({
                                                format: true,
                                                elementDelimiter: interchange.elementDelimiter,
                                                segmentTerminator: interchange.segmentTerminator,
                                            }));
                                            counter_1++;
                                        }
                                        catch (error) {
                                            console.error("Workspace Edit Failed!", error);
                                        }
                                    }
                                });
                                vsc.workspace.applyEdit(workspaceEdit_1);
                                vsc.window.showInformationMessage("Successfully updated " + counter_1 + " documents!");
                            }
                        }
                        return [3 /*break*/, 7];
                    case 4:
                        if (!(fieldChoice === fieldChoices[2] ||
                            fieldChoice === fieldChoices[3])) return [3 /*break*/, 7];
                        idPos_2 = fieldChoice[2] ? 2 : 3;
                        identifier_2 = interchange.functionalGroups[0].header.valueOf(idPos_2);
                        return [4 /*yield*/, vsc.window.showInputBox({
                                placeHolder: "<Identifier>",
                                prompt: "Please provide the partner identifier.",
                            })];
                    case 5:
                        value = _a.sent();
                        return [4 /*yield*/, vsc.window.showQuickPick(targetChoices, {
                                placeHolder: "Replace in...",
                            })];
                    case 6:
                        targetChoice = _a.sent();
                        if (targetChoice === targetChoices[0]) {
                            interchange.functionalGroups[0].header.elements[idPos_2 - 1].value = identifier_2;
                            editor.edit(function (builder) {
                                builder.replace(core.RangeUtil.getRangeForDocument(editor.document), interchange.toString({
                                    format: true,
                                    elementDelimiter: interchange.elementDelimiter,
                                    segmentTerminator: interchange.segmentTerminator,
                                }));
                            });
                        }
                        else if (targetChoice === targetChoices[1]) {
                            if (vsc.workspace) {
                                counter_2 = 0;
                                workspaceEdit_2 = new vsc.WorkspaceEdit();
                                vsc.workspace.textDocuments.forEach(function (document) {
                                    if (document.languageId === x12.LANGUAGE_X12) {
                                        try {
                                            interchange = parser.parseX12(document.getText());
                                            interchange.functionalGroups[0].header.elements[idPos_2 - 1].value = identifier_2;
                                            workspaceEdit_2.replace(document.uri, core.RangeUtil.getRangeForDocument(document), interchange.toString({
                                                format: true,
                                                elementDelimiter: interchange.elementDelimiter,
                                                segmentTerminator: interchange.segmentTerminator,
                                            }));
                                            counter_2++;
                                        }
                                        catch (error) {
                                            console.error("Workspace Edit Failed!", error);
                                        }
                                    }
                                });
                                vsc.workspace.applyEdit(workspaceEdit_2);
                                vsc.window.showInformationMessage("Successfully updated " + counter_2 + " documents!");
                            }
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    EditDocumentCommand.prototype._padRight = function (input, width) {
        while (input.length < width) {
            input += " ";
        }
        return input.substr(0, width);
    };
    return EditDocumentCommand;
}());
exports.EditDocumentCommand = EditDocumentCommand;
