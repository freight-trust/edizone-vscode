"use strict";
const vsc = require("vscode");
const { X12Parser } = require("node-x12");
const core = require("../../core/core.module");
const x12 = require("../x12.module");
class EPPHoverProvider {
  provideHover(document, position) {
    let state = core.DocumentState.get(document.uri, x12.MODULE_X12);
    if (!state || !state.transaction) {
      return null;
    }
    let plugin = state.transaction;
    let parser = new { X12Parser }(false);
    let engine = new { X12Parser }.X12QueryEngine(parser);
    let hover = new vsc.Hover("*No Information Available*");
    for (let i = 0; i < plugin.tokenIDs.length; i++) {
      let token = plugin.tokenIDs[i];
      if (!token.caption) {
        let originalMatch = plugin.tokenIDs.find((value) => {
          return value.name === token.name && !!value.caption;
        });
        if (originalMatch) {
          token.caption = originalMatch.caption;
        }
        if (!token.caption) {
          continue;
        }
      }
      let results;
      try {
        let query = x12.TokenUtils.getElementReferenceQuery(token);
        if (!query) {
          continue;
        }
        results = engine.query(document.getText(), query);
      } catch (error) {
        console.error("Dynamic Element Query Failed!", error);
      }
      if (results && results.length > 0) {
        let flag = false;
        for (let j = 0; j < results.length; j++) {
          let result = results[j];
          let range = new vsc.Range(
            result.element.range.start.line,
            result.element.range.start.character - 1,
            result.element.range.end.line,
            result.element.range.end.character + 1
          );
          if (range.contains(position)) {
            let content = `**Token ID:** ${token.id}  \n**Token Name:** ${token.name}  \n**Transaction Manager Label:** ${token.caption}`;
            if (token.items && token.items.length > 0) {
              let item = token.items.find((value) => {
                return value.storedValue === result.element.value;
              });
              if (item && item.displayValue) {
                content += `  \n**Transaction Manager Value:** ${item.displayValue}`;
              }
            }
            hover = new vsc.Hover(content);
            flag = true;
            break;
          }
        }
        if (flag) {
          break;
        }
      }
    }
    return hover;
  }
}
exports.EPPHoverProvider = EPPHoverProvider;
