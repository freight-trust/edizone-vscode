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
const core = require("../../core/core.module");
const x12 = require("../x12.module");
class EPPService {
  constructor() {
    this._baseUri = x12.X12Config.eppServiceUri;
    this._client = new core.PsgServiceClient();
  }
  searchPartnersByIsaInfoAsync(isa05, isa06, isa07, isa08) {
    return __awaiter(this, void 0, Promise, function* () {
      return yield this._client.getAsync(
        `${this._baseUri}/partners/search/isa-info`,
        {
          isa05: isa05,
          isa06: isa06,
          isa07: isa07,
          isa08: isa08,
        }
      );
    });
  }
  getPluginHeadersForPartnerAsync(partnerId) {
    return __awaiter(this, void 0, Promise, function* () {
      return yield this._client.getAsync(
        `${this._baseUri}/partners/${partnerId}/plugin-headers`
      );
    });
  }
  getPluginAsync(plugInId) {
    return __awaiter(this, void 0, Promise, function* () {
      return yield this._client.getAsync(
        `${this._baseUri}/plugins/${plugInId}`
      );
    });
  }
}
exports.EPPService = EPPService;
