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
const { X12Parser } = require("node-x12");
exports.CMD_QUERY_DOCUMENT = "tc.x12.queryDocument";
class QueryDocumentCommand {
  constructor() {
    this.name = exports.CMD_QUERY_DOCUMENT;
  }
  invoke(editor, edit) {
    return __awaiter(this, void 0, Promise, function* () {
      let query = yield vsc.window.showInputBox({
        prompt: "Please enter an element reference query.",
        placeHolder: 'ex. REF02:REF01["PO"]',
      });
      if (!query) {
        return;
      }
      let parser = new { X12Parser }(true);
      let engine = new { X12Parser }.X12QueryEngine(parser);
      let results;
      try {
        results = engine.query(editor.document.getText(), query);
      } catch (error) {
        vsc.window.showErrorMessage(error);
      }
      if (results) {
        let channel = vsc.window.createOutputChannel("X12 Query Results");
        channel.show(vsc.ViewColumn.Three);
        channel.clear();
        channel.appendLine(`Reference Query: ${query}`);
        channel.appendLine("");
        results.forEach((result) => {
          channel.appendLine(
            `[Line ${result.element.range.start.line + 1}]: ${
              result.element.value
            }`
          );
        });
      } else {
        vsc.window.showInformationMessage("No results found for that query!");
      }
    });
  }
}
exports.QueryDocumentCommand = QueryDocumentCommand;
