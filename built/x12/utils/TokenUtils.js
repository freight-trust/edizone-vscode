"use strict";
var TokenUtils = /** @class */ (function () {
  function TokenUtils() {}
  TokenUtils.getElementReferenceQuery = function (token) {
    if (token.elementPos == 0) {
      return null;
    }
    var elementPos = token.elementPos.toString();
    if (elementPos.length < 2) {
      elementPos = "0" + elementPos;
    }
    var elementReference = "" + token.elementSegment + elementPos;
    var qualifiers = new Array();
    token.qualifiers
      .filter(function (qualifier) {
        return !!qualifier.elementSegment;
      })
      .forEach(function (qualifier) {
        var qElementPos = qualifier.elementPos.toString();
        var qElementSegment = qualifier.elementSegment;
        if (qElementSegment.indexOf("-") > -1) {
          qElementSegment = qElementSegment.substr(
            qElementSegment.lastIndexOf("-") + 1
          );
        }
        if (qElementSegment.indexOf("+") > -1) {
          qElementSegment = qElementSegment.substr(
            qElementSegment.lastIndexOf("+") + 1
          );
        }
        if (qElementPos.length < 2) {
          qElementPos = "0" + qElementPos;
        }
        qualifiers.push(
          ":" + qElementSegment + qElementPos + '["' + qualifier.value + '"]'
        );
      });
    qualifiers.forEach(function (qualifier) {
      elementReference += qualifier;
    });
    return elementReference;
  };
  return TokenUtils;
})();
exports.TokenUtils = TokenUtils;
