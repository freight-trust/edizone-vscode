"use strict";
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
const vsc = require("vscode");
const http = require("request");
const core = require("../core.module");
exports.CMD_SIGNIN = "tc.core.signin";
class SignInCommand {
  constructor() {
    this.name = exports.CMD_SIGNIN;
  }
  invoke() {
    return __awaiter(this, void 0, Promise, function* () {
      let email = core.ToolboxState.ssoEmail;
      let token = core.ToolboxState.ssoToken;
      if (!token) {
        email = yield vsc.window.showInputBox({
          prompt: "Please provide your PSG Single Sign-On email address.",
          placeHolder: "someone@highjump.com",
          value: email,
        });
        if (!email) {
          return;
        }
        let password = yield vsc.window.showInputBox({
          prompt: "Please provide your PSG Single Sign-On password.",
          placeHolder: "Password",
          password: true,
        });
        if (!password) {
          return;
        }
        let statusBarMessage = vsc.window.setStatusBarMessage("Signing in...");
        try {
          token = yield new Promise((resolve, reject) => {
            http(
              core.CoreConfig.ssoActiveTokenUri,
              {
                method: "POST",
                json: true,
                body: {
                  client_id: core.CoreConfig.ssoClientId,
                  username: email,
                  password: password,
                  connection: "Username-Password-Authentication",
                  grant_type: "password",
                  scope: "openid name email user_metadata app_metadata",
                },
              },
              (error, response, body) => {
                if (response.statusCode == 401) {
                  reject(body.error_description);
                  return;
                } else if (response.statusCode > 400) {
                  reject(
                    `Uh-oh. Something went wrong and we couldn't log you in. Please try again later.`
                  );
                  return;
                }
                resolve(body.id_token);
              }
            );
          });
          core.ToolboxState.ssoEmail = email;
          core.ToolboxState.ssoToken = token;
        } catch (error) {
          let selection = yield vsc.window.showErrorMessage(error, "Try Again");
          if (selection === "Try Again") {
            vsc.commands.executeCommand(exports.CMD_SIGNIN);
          }
        } finally {
          statusBarMessage.dispose();
        }
      }
    });
  }
}
exports.SignInCommand = SignInCommand;
