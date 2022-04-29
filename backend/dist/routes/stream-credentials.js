"use strict";

var _controllers = require("../utils/controllers");

var _authenticate = require("../controllers/v1/authenticate/authenticate.action");

var _streamCredentials = require("../controllers/v1/stream-credentials/stream-credentials.action");

module.exports = api => {
  api.route("/v1/stream-credentials").post(_authenticate.requireAuthHeader, (0, _controllers.wrapAsync)(_streamCredentials.streamCredentials));
};