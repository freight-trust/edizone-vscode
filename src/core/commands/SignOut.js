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
const core = require("../core.module");
exports.CMD_SIGNOUT = "tc.core.signout";
class SignOutCommand {
  constructor() {
    this.name = exports.CMD_SIGNOUT;
  }
  invoke() {
    return __awaiter(this, void 0, Promise, function* () {
      core.ToolboxState.ssoToken = null;
    });
  }
}
exports.SignOutCommand = SignOutCommand;
