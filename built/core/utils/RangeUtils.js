"use strict";
var vsc = require("vscode");
var RangeUtil = /** @class */ (function () {
  function RangeUtil() {}
  RangeUtil.getRangeForDocument = function (document) {
    var lastLineIndex = document.lineCount - 1;
    var range = new vsc.Range(
      new vsc.Position(0, 0),
      new vsc.Position(lastLineIndex, Number.MAX_VALUE)
    );
    range = document.validateRange(range);
    return range;
  };
  return RangeUtil;
})();
exports.RangeUtil = RangeUtil;
