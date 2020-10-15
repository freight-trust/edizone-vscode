"use strict";
class TokenUtils {
  static getElementReferenceQuery(token) {
    if (token.elementPos == 0) {
      return null;
    }
    let elementPos = token.elementPos.toString();
    if (elementPos.length < 2) {
      elementPos = "0" + elementPos;
    }
    let elementReference = `${token.elementSegment}${elementPos}`;
    let qualifiers = new Array();
    token.qualifiers
      .filter((qualifier) => {
        return !!qualifier.elementSegment;
      })
      .forEach((qualifier) => {
        let qElementPos = qualifier.elementPos.toString();
        let qElementSegment = qualifier.elementSegment;
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
          `:${qElementSegment}${qElementPos}["${qualifier.value}"]`
        );
      });
    qualifiers.forEach((qualifier) => {
      elementReference += qualifier;
    });
    return elementReference;
  }
}
exports.TokenUtils = TokenUtils;
