"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaxAmount = void 0;
var constants = require("@shared/constants");
var getTaxAmount = function (price, stateCode, provinceCode) {
    var percentage = stateCode === 'CA' && provinceCode
        ? constants.User.BillingTax.State.CA.Province[provinceCode]
        : 0;
    var tax = Math.round(parseFloat(price) * percentage * 100) / 100;
    return tax.toFixed(2);
};
exports.getTaxAmount = getTaxAmount;
