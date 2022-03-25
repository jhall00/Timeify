require('dotenv').config();
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
var bodyParser = require('body-parser');
const { ModifierFlags } = require('typescript');


const scopes = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
];

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.REDIRECT_URI,
  clientId: CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

app.use(express.static('public'));
app.set("view engine", "ejs")


app.get('/loginLanding', (req, res) => {
  // res.sendFile(path.join(__dirname, 'public/login.html'));
  exStr = "passing data example from server to browser"
  res.render("login", {exStr})

});

app.get('/generate', (req, res) => {
  // res.sendFile(path.join(__dirname, 'public/login.html'));
  res.render("generate")

});

app.post('/generate', (req, res) => {
  // req.body object has your form values
  console.log(req.body.length_minutes)
  console.log(req.body.length_seconds)
  console.log(req.body.mySource)
  console.log(req.body.newName)
  
  
  res.render("generate")

  // app.use(express.static(__dirname + '/public'));



  // spotifyApi.getPlaylist(req.body.playlistID)
  // .then(function(data) {
  //   console.log('Some information about this playlist', data.body);
  // }, function(err) {
  //   console.log('Something went wrong!', err);
  // });
});

app.get('/load', (req, res) => {
  res.render("load")

});

// function openSourceSearch() {
//   document.getElementById("mySearch").style.display = "block";
// }

// function closeSourceSearch() {
//   document.getElementById("mySearch").style.display = "none";
// }




app.get('/login', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});



app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }

    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);

        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        // res.sendFile(path.join(__dirname, 'public/homePage.html'));

        res.render("homePage")

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];

          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });


  app.listen(8888, () =>
    console.log(
      'HTTP Server up. Now go to http://localhost:8888/loginLanding in your browser.'
    )
  );
