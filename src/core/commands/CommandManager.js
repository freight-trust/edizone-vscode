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
class CommandManager {
  static executeCommandAwaitable(command) {
    return new Promise((resolve, reject) => {
      let cmdCallback = {
        name: command,
        callback: (error) => {
          this._onAfterInvokeCallbacks.splice(
            this._onAfterInvokeCallbacks.indexOf(cmdCallback),
            1
          );
          if (!error) {
            resolve();
          } else {
            reject(error);
          }
        },
      };
      this._onAfterInvokeCallbacks.push(cmdCallback);
      vsc.commands.executeCommand(command);
    });
  }
  static onAfterInvoke(name, callback) {
    if (!this._onAfterInvokeCallbacks) {
      this._onAfterInvokeCallbacks = new Array();
    }
    this._onAfterInvokeCallbacks.push({
      name: name,
      callback: callback,
    });
  }
  static onBeforeInvoke(name, callback) {
    if (!this._onBeforeInvokeCallbacks) {
      this._onBeforeInvokeCallbacks = new Array();
    }
    this._onBeforeInvokeCallbacks.push({
      name: name,
      callback: callback,
    });
  }
  static registerCommand(command) {
    return vsc.commands.registerCommand(command.name, () =>
      __awaiter(this, void 0, void 0, function* () {
        this._doBeforeInvokeCallbacks(command.name, undefined);
        try {
          yield command.invoke();
          this._doAfterInvokeCallbacks(command.name, undefined);
        } catch (error) {
          this._doAfterInvokeCallbacks(command.name, error);
        }
      })
    );
  }
  static registerTextEditorCommand(command) {
    return vsc.commands.registerTextEditorCommand(
      command.name,
      (editor, edit) =>
        __awaiter(this, void 0, void 0, function* () {
          this._doBeforeInvokeCallbacks(command.name, undefined);
          try {
            yield command.invoke(editor, edit);
            this._doAfterInvokeCallbacks(command.name, undefined);
          } catch (error) {
            this._doAfterInvokeCallbacks(command.name, error);
          }
        })
    );
  }
  static _doAfterInvokeCallbacks(commandName, error) {
    if (this._onAfterInvokeCallbacks) {
      this._onAfterInvokeCallbacks
        .filter((value) => {
          return value.name === commandName;
        })
        .forEach((value) => {
          try {
            value.callback(error);
          } catch (error) {}
        });
    }
  }
  static _doBeforeInvokeCallbacks(commandName, error) {
    if (this._onBeforeInvokeCallbacks) {
      this._onBeforeInvokeCallbacks
        .filter((value) => {
          return value.name === commandName;
        })
        .forEach((value) => {
          try {
            value.callback(error);
          } catch (error) {}
        });
    }
  }
}
exports.CommandManager = CommandManager;
