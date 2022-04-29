"use strict";

var _authenticate = require("../controllers/v1/authenticate");

var _controllers = require("../utils/controllers");

module.exports = api => {
  api.route("/v1/authenticate").post((0, _controllers.wrapAsync)(_authenticate.authenticate));
};