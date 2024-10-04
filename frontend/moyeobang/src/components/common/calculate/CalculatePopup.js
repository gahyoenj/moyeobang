"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CalculatePopup;
var jsx_runtime_1 = require("@emotion/react/jsx-runtime");
/** @jsxImportSource @emotion/react */
var react_1 = require("@emotion/react");
var react_2 = require("react");
var colors_1 = require("@/styles/colors");
var CalculateBtn_1 = require("./CalculateBtn");
var PublicDeposit_1 = require("./PublicDeposit");
var PersonalDeposit_1 = require("./PersonalDeposit");
var messageStyle = (0, react_1.css)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: fixed; /* \uD654\uBA74 \uD558\uB2E8\uC5D0 \uACE0\uC815 */\n  box-sizing: border-box;\n  background-color: white;\n  border: ", " solid 2px;\n  border-radius: 5px;\n  font-size: 12px;\n  font-weight: 500;\n  height: 174px;\n  letter-spacing: -0.25px;\n  margin-top: 6.8px;\n  padding: 10px 8px;\n  width: 100%;\n  max-width: 390px;\n  z-index: 2000; /* Navbar \uC704\uC5D0 \uB098\uD0C0\uB098\uB3C4\uB85D z-index \uC124\uC815 */\n  text-align: center;\n  bottom: 125px; /* Navbar \uC704\uC5D0 \uC704\uCE58\uD558\uB3C4\uB85D \uC870\uC815 */\n  left: 50%;\n  transform: translateX(-50%); //\uC911\uAC04\uC5D0 \uC704\uCE58\uD558\uAE30 \uC704\uD574 left, tranform \uC18D\uC11D \uC0AC\uC6A9\n\n  &:after {\n    border-color: transparent transparent white transparent;\n    border-style: solid;\n    border-width: 0px 8.5px 18px 8.5px; /* \uC0BC\uAC01\uD615 \uD06C\uAE30 */\n    content: '';\n    display: block;\n    left: 50%; /* \uAC00\uC6B4\uB370 \uC815\uB82C */\n    transform: translateX(-50%) rotate(180deg); /* \uAC00\uC6B4\uB370 \uC815\uB82C \uBC0F \uD68C\uC804 */\n    position: absolute;\n    bottom: -17px;\n    width: 0;\n    z-index: 1;\n  }\n\n  &:before {\n    border-color: transparent transparent ", " transparent;\n    border-style: solid;\n    border-width: 0 10px 19px 10px; /* \uD14C\uB450\uB9AC \uC0BC\uAC01\uD615 \uD06C\uAE30 */\n    content: '';\n    display: block;\n    left: 50%; /* \uAC00\uC6B4\uB370 \uC815\uB82C */\n    transform: translateX(-50%) rotate(180deg); /* \uAC00\uC6B4\uB370 \uC815\uB82C \uBC0F \uD68C\uC804 */\n    position: absolute;\n    bottom: -19px;\n    width: 0;\n    z-index: 0;\n  }\n"], ["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: fixed; /* \uD654\uBA74 \uD558\uB2E8\uC5D0 \uACE0\uC815 */\n  box-sizing: border-box;\n  background-color: white;\n  border: ", " solid 2px;\n  border-radius: 5px;\n  font-size: 12px;\n  font-weight: 500;\n  height: 174px;\n  letter-spacing: -0.25px;\n  margin-top: 6.8px;\n  padding: 10px 8px;\n  width: 100%;\n  max-width: 390px;\n  z-index: 2000; /* Navbar \uC704\uC5D0 \uB098\uD0C0\uB098\uB3C4\uB85D z-index \uC124\uC815 */\n  text-align: center;\n  bottom: 125px; /* Navbar \uC704\uC5D0 \uC704\uCE58\uD558\uB3C4\uB85D \uC870\uC815 */\n  left: 50%;\n  transform: translateX(-50%); //\uC911\uAC04\uC5D0 \uC704\uCE58\uD558\uAE30 \uC704\uD574 left, tranform \uC18D\uC11D \uC0AC\uC6A9\n\n  &:after {\n    border-color: transparent transparent white transparent;\n    border-style: solid;\n    border-width: 0px 8.5px 18px 8.5px; /* \uC0BC\uAC01\uD615 \uD06C\uAE30 */\n    content: '';\n    display: block;\n    left: 50%; /* \uAC00\uC6B4\uB370 \uC815\uB82C */\n    transform: translateX(-50%) rotate(180deg); /* \uAC00\uC6B4\uB370 \uC815\uB82C \uBC0F \uD68C\uC804 */\n    position: absolute;\n    bottom: -17px;\n    width: 0;\n    z-index: 1;\n  }\n\n  &:before {\n    border-color: transparent transparent ", " transparent;\n    border-style: solid;\n    border-width: 0 10px 19px 10px; /* \uD14C\uB450\uB9AC \uC0BC\uAC01\uD615 \uD06C\uAE30 */\n    content: '';\n    display: block;\n    left: 50%; /* \uAC00\uC6B4\uB370 \uC815\uB82C */\n    transform: translateX(-50%) rotate(180deg); /* \uAC00\uC6B4\uB370 \uC815\uB82C \uBC0F \uD68C\uC804 */\n    position: absolute;\n    bottom: -19px;\n    width: 0;\n    z-index: 0;\n  }\n"])), colors_1.colors.third, colors_1.colors.third);
var totalAmount = 1000;
var travelName = '아기돼지오형제';
var budget = 100000;
function CalculatePopup() {
    var _a = (0, react_2.useState)('calculateBtn'), showModal = _a[0], setShowModal = _a[1];
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { css: messageStyle, children: [showModal === 'calculateBtn' && ((0, jsx_runtime_1.jsx)(CalculateBtn_1.default, { setShowModal: setShowModal })), showModal === 'publicDeposit' && ((0, jsx_runtime_1.jsx)(PublicDeposit_1.default, { totalAmount: totalAmount, travelName: travelName, budget: budget })), showModal === 'personalDeposit' && ((0, jsx_runtime_1.jsx)(PersonalDeposit_1.default, { travelName: travelName }))] }) }));
}
var templateObject_1;
