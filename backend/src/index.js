import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

dotenv.config();

var api = express();
// var headers = {
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
api.use(cors())
// app.get('https://celadon-llama-ce8ee1.netlify.app', function (req, res, next) {
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
api.use(compression());
api.use(helmet());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

api.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.warn(error);
    process.exit(1);
  }

  // eslint-disable-next-line array-callback-return
  fs.readdirSync(path.join(__dirname, 'routes')).map(file => {
    require('./routes/' + file)(api);
  });

  console.info(
    `Running on port ${process.env.PORT} in ${
      process.env.NODE_ENV
    } mode. 🚀`
  );
});

module.exports = api;
