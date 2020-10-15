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
const core = require("../../core/core.module");
const x12 = require("../x12.module");
exports.CMD_EDIT_DOCUMENT = "tc.x12.editDocument";
class EditDocumentCommand {
  constructor() {
    this.name = exports.CMD_EDIT_DOCUMENT;
  }
  invoke(editor, edit) {
    return __awaiter(this, void 0, Promise, function* () {
      let rawData = editor.document.getText();
      let parser = new { X12Parser }(false);
      let interchange;
      try {
        interchange = parser.parseX12(rawData);
      } catch (error) {
        vsc.window.showErrorMessage(
          "This document cannot be edited as it is not a valid X12 document."
        );
        return;
      }
      let fieldChoices = [
        "Interchange Sender ID (ISA)",
        "Interchange Receiver ID (ISA)",
        "Application Sender Code (GS)",
        "Application Receiver Code (GS)",
      ];
      let targetChoices = ["This Document", "All Open Documents"];
      let fieldChoice = yield vsc.window.showQuickPick(fieldChoices, {
        placeHolder: "Select Field to Update",
      });
      if (fieldChoice === fieldChoices[0] || fieldChoice === fieldChoices[1]) {
        let qualifierPos = fieldChoice === fieldChoices[0] ? 5 : 7;
        let idPos = fieldChoice === fieldChoices[0] ? 6 : 8;
        let qualifier = interchange.header.valueOf(qualifierPos);
        let identifier = interchange.header.valueOf(idPos).trim();
        let value = yield vsc.window.showInputBox({
          placeHolder: "<Qualifier>/<Identifier>",
          prompt: "Please provide the ID qualifier and identifier.",
        });
        if (value.indexOf("/") < 2) {
          vsc.window.showErrorMessage(
            "The provided format must be: <Qualifier>/<Identifier>!"
          );
          return;
        }
        qualifier = this._padRight(
          value.substring(0, value.indexOf("/")).trim(),
          2
        );
        identifier = this._padRight(
          value.substring(value.indexOf("/") + 1).trim(),
          15
        );
        let targetChoice = yield vsc.window.showQuickPick(targetChoices, {
          placeHolder: "Replace in...",
        });
        if (targetChoice === targetChoices[0]) {
          interchange.header.elements[qualifierPos - 1].value = qualifier;
          interchange.header.elements[idPos - 1].value = identifier;
          editor.edit((builder) => {
            builder.replace(
              core.RangeUtil.getRangeForDocument(editor.document),
              interchange.toString({
                format: true,
                elementDelimiter: interchange.elementDelimiter,
                segmentTerminator: interchange.segmentTerminator,
              })
            );
          });
        } else if (targetChoice === targetChoices[1]) {
          if (vsc.workspace) {
            let counter = 0;
            let workspaceEdit = new vsc.WorkspaceEdit();
            vsc.workspace.textDocuments.forEach((document) => {
              if (document.languageId === x12.LANGUAGE_X12) {
                try {
                  interchange = parser.parseX12(document.getText());
                  interchange.header.elements[
                    qualifierPos - 1
                  ].value = qualifier;
                  interchange.header.elements[idPos - 1].value = identifier;
                  workspaceEdit.replace(
                    document.uri,
                    core.RangeUtil.getRangeForDocument(document),
                    interchange.toString({
                      format: true,
                      elementDelimiter: interchange.elementDelimiter,
                      segmentTerminator: interchange.segmentTerminator,
                    })
                  );
                  counter++;
                } catch (error) {
                  console.error("Workspace Edit Failed!", error);
                }
              }
            });
            vsc.workspace.applyEdit(workspaceEdit);
            vsc.window.showInformationMessage(
              `Successfully updated ${counter} documents!`
            );
          }
        }
      } else if (
        fieldChoice === fieldChoices[2] ||
        fieldChoice === fieldChoices[3]
      ) {
        let idPos = fieldChoice[2] ? 2 : 3;
        let identifier = interchange.functionalGroups[0].header.valueOf(idPos);
        let value = yield vsc.window.showInputBox({
          placeHolder: "<Identifier>",
          prompt: "Please provide the partner identifier.",
        });
        let targetChoice = yield vsc.window.showQuickPick(targetChoices, {
          placeHolder: "Replace in...",
        });
        if (targetChoice === targetChoices[0]) {
          interchange.functionalGroups[0].header.elements[
            idPos - 1
          ].value = identifier;
          editor.edit((builder) => {
            builder.replace(
              core.RangeUtil.getRangeForDocument(editor.document),
              interchange.toString({
                format: true,
                elementDelimiter: interchange.elementDelimiter,
                segmentTerminator: interchange.segmentTerminator,
              })
            );
          });
        } else if (targetChoice === targetChoices[1]) {
          if (vsc.workspace) {
            let counter = 0;
            let workspaceEdit = new vsc.WorkspaceEdit();
            vsc.workspace.textDocuments.forEach((document) => {
              if (document.languageId === x12.LANGUAGE_X12) {
                try {
                  interchange = parser.parseX12(document.getText());
                  interchange.functionalGroups[0].header.elements[
                    idPos - 1
                  ].value = identifier;
                  workspaceEdit.replace(
                    document.uri,
                    core.RangeUtil.getRangeForDocument(document),
                    interchange.toString({
                      format: true,
                      elementDelimiter: interchange.elementDelimiter,
                      segmentTerminator: interchange.segmentTerminator,
                    })
                  );
                  counter++;
                } catch (error) {
                  console.error("Workspace Edit Failed!", error);
                }
              }
            });
            vsc.workspace.applyEdit(workspaceEdit);
            vsc.window.showInformationMessage(
              `Successfully updated ${counter} documents!`
            );
          }
        }
      }
    });
  }
  _padRight(input, width) {
    while (input.length < width) {
      input += " ";
    }
    return input.substr(0, width);
  }
}
exports.EditDocumentCommand = EditDocumentCommand;
