require('dotenv').config();
const express = require('express');
const request = require('request');
const querystring = require('querystring');

const app = express();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

console.log('client id =', clientId);
console.log('secret =', clientSecret);

const spotifyUrl = 'https://api.spotify.com/v1';
const authUrl = 'https://accounts.spotify.com/api/token';

function getAuthorizationStr(id, secret) {
  return 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
}

app.get('/search', function (req, res) {
  const formData = querystring.stringify({
    grant_type: 'client_credentials'
  });
  request({
    method: 'POST',
    uri: authUrl,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: getAuthorizationStr(clientId, clientSecret)
    },
    body: formData
  }, function (err, response, body) {
    if (err) {
      console.error('Error from Spotify:', err);
      res.send(err);
      return;
    }
    console.log('[resp]' + response);
    console.log('[body]' + body);

    const accessToken = JSON.parse(body).access_token;
    const q = req.query.q;
    const type = req.query.type;
    console.log('[access token] ', accessToken);

    request({
      method: 'GET',
      uri: `${spotifyUrl}/search?q=${q}&type=${type}`,
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
    }, function(err, response, body) {
      if (err) {
        res.status(500).send('Error: ' + err);
        return;
      }
      console.log('[body from spotify] ', body);
      return res.status(200).send(body);
    });

  });
});

app.listen(2750, 'localhost');
