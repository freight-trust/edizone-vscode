"use strict";
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
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
var http = require("request");
var core = require("../core.module");
exports.CMD_SIGNIN = "tc.core.signin";
var SignInCommand = /** @class */ (function () {
  function SignInCommand() {
    this.name = exports.CMD_SIGNIN;
  }
  SignInCommand.prototype.invoke = function () {
    return __awaiter(this, void 0, Promise, function () {
      var email, token, password_1, statusBarMessage, error_1, selection;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            email = core.ToolboxState.ssoEmail;
            token = core.ToolboxState.ssoToken;
            if (!!token) return [3 /*break*/, 8];
            return [
              4 /*yield*/,
              vsc.window.showInputBox({
                prompt: "Please provide your PSG Single Sign-On email address.",
                placeHolder: "someone@highjump.com",
                value: email,
              }),
            ];
          case 1:
            email = _a.sent();
            if (!email) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              vsc.window.showInputBox({
                prompt: "Please provide your PSG Single Sign-On password.",
                placeHolder: "Password",
                password: true,
              }),
            ];
          case 2:
            password_1 = _a.sent();
            if (!password_1) {
              return [2 /*return*/];
            }
            statusBarMessage = vsc.window.setStatusBarMessage("Signing in...");
            _a.label = 3;
          case 3:
            _a.trys.push([3, 5, 7, 8]);
            return [
              4 /*yield*/,
              new Promise(function (resolve, reject) {
                http(
                  core.CoreConfig.ssoActiveTokenUri,
                  {
                    method: "POST",
                    json: true,
                    body: {
                      client_id: core.CoreConfig.ssoClientId,
                      username: email,
                      password: password_1,
                      connection: "Username-Password-Authentication",
                      grant_type: "password",
                      scope: "openid name email user_metadata app_metadata",
                    },
                  },
                  function (error, response, body) {
                    if (response.statusCode == 401) {
                      reject(body.error_description);
                      return;
                    } else if (response.statusCode > 400) {
                      reject(
                        "Uh-oh. Something went wrong and we couldn't log you in. Please try again later."
                      );
                      return;
                    }
                    resolve(body.id_token);
                  }
                );
              }),
            ];
          case 4:
            token = _a.sent();
            core.ToolboxState.ssoEmail = email;
            core.ToolboxState.ssoToken = token;
            return [3 /*break*/, 8];
          case 5:
            error_1 = _a.sent();
            return [
              4 /*yield*/,
              vsc.window.showErrorMessage(error_1, "Try Again"),
            ];
          case 6:
            selection = _a.sent();
            if (selection === "Try Again") {
              vsc.commands.executeCommand(exports.CMD_SIGNIN);
            }
            return [3 /*break*/, 8];
          case 7:
            statusBarMessage.dispose();
            return [7 /*endfinally*/];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  return SignInCommand;
})();
exports.SignInCommand = SignInCommand;
