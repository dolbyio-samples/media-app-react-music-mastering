/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';

import axios, { ResponseType } from 'axios';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import { authentication, media } from '@dolbyio/dolbyio-rest-apis-client';

import { environment } from './environments/environment';

const cors = require('cors');
const app = express();

app.use(new cors());
app.use(express.json());
app.use(express.static('public'));

const KEY = environment.mapiApiKey;
const SECRET = environment.mapiApiSecret;
const SERVER = environment.mapiServer;
let token = null;

app.post('/media/master/preview', express.json(), async (req, res, next) => {
  token = await authentication.getApiAccessToken(KEY, SECRET);
  const jobId = await media.mastering.startPreview(
    token,
    JSON.stringify(req.body)
  );
  res.send({ job_id: jobId });
});

app.get('/media/master/preview', express.json(), async (req, res, next) => {
  token = await authentication.getApiAccessToken(KEY, SECRET);
  const jobId: string = req.query['job_id'] as string;
  const status = await media.mastering.getPreviewResults(token, jobId);
  res.send(status);
});

app.post('/media/master', express.json(), async (req, res, next) => {
  token = await authentication.getApiAccessToken(KEY, SECRET);
  const jobId = await media.mastering.start(
    token,
    JSON.stringify(req.body)
  );
  res.send({ job_id: jobId });
});

app.get('/media/master', express.json(), async (req, res, next) => {
  token = await authentication.getApiAccessToken(KEY, SECRET);
  const jobId: string = req.query['job_id'] as string;
  const status = await media.mastering.getResults(token, jobId);
  res.send(status);
});

app.post('/media/input', express.json(), async (req, res, next) => {
  token = await authentication.getApiAccessToken(KEY, SECRET);
  const url = await media.io.getUploadUrl(token, req.body['url']);
  res.send({ url });
});

app.get('/media/output', async (req, res, next) => {
  token = await authentication.getApiAccessToken(KEY, SECRET);
  const { token_type: tokenType, access_token: accessToken } = token;
  const { url } = req.query;
  const { data, headers } = await axios({
    url: `${SERVER}/media/output`,
    method: 'GET',
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/octet-stream',
    },
    params: {
      url,
    },
    responseType: 'stream' as ResponseType,
  });
  res.setHeader('Content-Type', headers['content-type']);
  res.setHeader('Content-Length', headers['content-length']);
  data.pipe(res);
});

const {
  port = 3333,
  hostname = 'localhost',
  usesSSL = 'true',
  sslKeyPath = '',
  sslCertPath = '',
} = environment;
let server = null;

if (usesSSL === 'true') {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, sslKeyPath)),
    cert: fs.readFileSync(path.join(__dirname, sslCertPath)),
  };
  server = https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Listening at https://${hostname}:${port}/media`);
  });
} else {
  server = app.listen(port, () => {
    console.log(`Listening at http://${hostname}:${port}/media`);
  });
}

server.on('error', console.error);
