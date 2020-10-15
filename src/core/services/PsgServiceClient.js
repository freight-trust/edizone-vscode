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
const http = require("request");
const core = require("../core.module");
class PsgServiceClient {
  getAsync(uri, urlParameters) {
    return __awaiter(this, void 0, Promise, function* () {
      return yield new Promise((resolve, reject) => {
        if (urlParameters) {
          uri = uri + "?";
          for (let property in urlParameters) {
            if (!urlParameters[property]) {
              continue;
            }
            uri += property;
            uri += "=";
            uri += urlParameters[property].toString();
            uri += "&";
          }
          uri = uri.substr(0, uri.length - 1);
        }
        http(
          uri,
          {
            method: "GET",
            json: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${core.ToolboxState.ssoToken}`,
            },
          },
          (error, response, body) =>
            __awaiter(this, void 0, void 0, function* () {
              if (response.statusCode == 401) {
                core.ToolboxState.ssoToken = null;
                try {
                  yield core.CommandManager.executeCommandAwaitable(
                    core.CMD_SIGNIN
                  );
                  this.getAsync(uri, urlParameters)
                    .then((result) => {
                      resolve(result);
                    })
                    .catch((reason) => {
                      reject(reason);
                    });
                } catch (cmdError) {
                  reject("You must be signed in to use this feature.");
                }
                return;
              } else if (response.statusCode == 403) {
                reject("You are not authorized to use this feature.");
                return;
              }
              resolve(body);
            })
        );
      });
    });
  }
}
exports.PsgServiceClient = PsgServiceClient;
