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
exports.CMD_SELECT_TRADING_PARTNER = "tc.x12.selectTradingPartner";
var SelectTradingPartnerCommand = /** @class */ (function () {
    function SelectTradingPartnerCommand() {
        this.name = exports.CMD_SELECT_TRADING_PARTNER;
    }
    SelectTradingPartnerCommand.prototype.invoke = function (editor, edit) {
        return __awaiter(this, void 0, Promise, function () {
            var parser, X12Parser, interchange, statusBarMessage, eppService, partners, partner, error_1, qpItems_1, pick, state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parser = new { X12Parser: X12Parser }., X12Parser = (void 0).X12Parser;
                        (true);
                        try {
                            interchange = parser.parseX12(editor.document.getText());
                        }
                        catch (error) {
                            vsc.window.showWarningMessage("The trading partner list could not be obtained due to X12 syntax errors. Please correct the file syntax and try again.");
                            return [2 /*return*/];
                        }
                        statusBarMessage = vsc.window.setStatusBarMessage("Getting EPP List...");
                        eppService = new x12.EPPService();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, eppService.searchPartnersByIsaInfoAsync(interchange.header.valueOf(5).trim(), interchange.header.valueOf(6).trim(), interchange.header.valueOf(7).trim(), interchange.header.valueOf(8).trim())];
                    case 2:
                        partners = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        vsc.window.showErrorMessage(error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        statusBarMessage.dispose();
                        return [7 /*endfinally*/];
                    case 5:
                        if (!(!partners || partners.length == 0)) return [3 /*break*/, 6];
                        vsc.window.showWarningMessage("No trading partners could be found that match the current ISA segment information. Please check the sender/receiver IDs.");
                        return [2 /*return*/];
                    case 6:
                        if (!(partners.length > 1)) return [3 /*break*/, 8];
                        qpItems_1 = new Array();
                        partners.forEach(function (partner) {
                            qpItems_1.push(new TradingPartnerQuickPickItem(partner));
                        });
                        return [4 /*yield*/, vsc.window.showQuickPick(qpItems_1, {
                                matchOnDescription: true,
                                placeHolder: "Trading Partner or EPP Name",
                            })];
                    case 7:
                        pick = _a.sent();
                        if (!pick) {
                            return [2 /*return*/];
                        }
                        partner = pick.partner;
                        return [3 /*break*/, 9];
                    case 8:
                        partner = partners[0];
                        _a.label = 9;
                    case 9:
                        state = core.DocumentState.get(editor.document.uri, "x12", new x12.X12DocumentState());
                        state.tradingPartner = partner;
                        state.transaction = null;
                        core.DocumentState.update(editor.document.uri, x12.MODULE_X12, state);
                        return [2 /*return*/];
                }
            });
        });
    };
    return SelectTradingPartnerCommand;
}());
exports.SelectTradingPartnerCommand = SelectTradingPartnerCommand;
var TradingPartnerQuickPickItem = /** @class */ (function () {
    function TradingPartnerQuickPickItem(partner) {
        this.partner = partner;
    }
    Object.defineProperty(TradingPartnerQuickPickItem.prototype, "description", {
        get: function () {
            return "EPP: " + this.partner.eppName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TradingPartnerQuickPickItem.prototype, "label", {
        get: function () {
            return this.partner.partnerName;
        },
        enumerable: true,
        configurable: true
    });
    return TradingPartnerQuickPickItem;
}());
