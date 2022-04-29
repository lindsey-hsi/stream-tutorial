"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _compression = _interopRequireDefault(require("compression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var api = (0, _express.default)(); // var headers = {
//   'Accept': 'application/json',
//   'Content-Type': 'application/json',
//   'Access-Control-Allow-Origin': 'https://celadon-llama-ce8ee1.netlify.app',
//   'Access-Control-Allow-Methods': 'POST,GET',
//   // 'Access-Control-Allow-Headers': 'Content-Type',
//   // 'Access-Control-Max-Age': '86400',
// };
// var corsOptions = {
//   origin: 'https://celadon-llama-ce8ee1.netlify.app',
//   headers: headers,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

api.use((0, _cors.default)()); // app.get('https://celadon-llama-ce8ee1.netlify.app', function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for only example.com.'})
// })
// api.get("/no-cors", (req, res) => {
//   console.info("GET /no-cors");
//   res.json({
//     text: "You should not see this via a CORS request."
//   });
// });
// api.options('https://celadon-llama-ce8ee1.netlify.app/v1/authenticate', cors())
// api.use(cors(corsOptions));
// api.use(cors({
//     origin: 'https://celadon-llama-ce8ee1.netlify.app',
//     methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
// }));

api.use((0, _compression.default)());
api.use((0, _helmet.default)());
api.use(_bodyParser.default.urlencoded({
  extended: false
}));
api.use(_bodyParser.default.json());
api.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.warn(error);
    process.exit(1);
  } // eslint-disable-next-line array-callback-return


  _fs.default.readdirSync(_path.default.join(__dirname, 'routes')).map(file => {
    require('./routes/' + file)(api);
  });

  console.info(`Running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode. 🚀`);
});
module.exports = api;