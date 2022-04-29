"use strict";

var _authenticate = require("../controllers/v1/authenticate/authenticate.action");

var _controllers = require("../utils/controllers");

var _virgilCredentials = require("../controllers/v1/virgil-credentials/virgil-credentials.action");

module.exports = api => {
  api.route("/v1/virgil-credentials").post(_authenticate.requireAuthHeader, (0, _controllers.wrapAsync)(_virgilCredentials.virgilCredentials));
};