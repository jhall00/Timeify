require('dotenv').config();
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
var bodyParser = require('body-parser');
// const { ModifierFlags } = require('typescript');



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


app.get('/', (req, res) => {
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



  // receive data from when search button is clicked

  if(req.body.action == "search" ){

    // res.render("generate")
    //take a search term from the user and search for playlists
    console.log("searching for playlists");
    let dummy_text = "rock";
    spotifyApi.searchPlaylists(dummy_text, { limit: 5 }).then(function (data) {
      console.log(data.body.playlists);
    }
    ).catch(function (err) {
      console.log(err);
    });
  }

  else{
      //receive data from when generate button is clicked
      console.log(req.body.length_minutes)
      console.log(req.body.length_seconds)
      console.log(req.body.mySource)
      console.log(req.body.newName)
    //
  
  
  }


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

app.post('/load', (req, res) => {
  // req.body object has your form values


  // receive data from when search button is clicked

  if(req.body.action == "search" ){

    // res.render("generate")
    //take a search term from the user and search for playlists
    console.log("searching for playlists");
    let dummy_text = "rock";
    spotifyApi.searchPlaylists(dummy_text, { limit: 5 }).then(function (data) {
      console.log(data.body.playlists);
    }
    ).catch(function (err) {
      console.log(err);
    });
  }

  else{
    
  //receive data from when load button is clicked
  }



});


app.get('/player', (req, res) => {
  var pID = "37i9dQZF1DZ06evO0ENBD2"
  var songs = []
  var playlistTitle =""
  var cover_art =""
  var playlistLength =0
  var type ="playlist"
  const p1 = spotifyApi.getPlaylist(pID)
  .then(function(data) {
    // console.log('Some information about this playlist', data.body);
    // console.log("/n/n all the songs", data.body.tracks.items);
    data.body.tracks.items.forEach(track=> {

      playlistLength += track.track.duration_ms
      var length = millisToMinutesAndSeconds(track.track.duration_ms)
      songs.push({title: track.track.name, artist: track.track.artists[0].name, length: length})


    })
    playlistTitle = data.body.name
    cover_art = data.body.images[0].url
  }, function(err) {
    console.log('Something went wrong!', err);

  });



  access_token = spotifyApi.getAccessToken()

  // wait for all promises to be available
  Promise.all([p1]).then(() => {
    res.render("player", {songs, playlistTitle, access_token, cover_art, playlistLength})

  })


});


app.post('/player', (req, res) => {

  var pID = "37i9dQZF1DZ06evO0ENBD2"
  var type ="playlist"

  if(req.body.action == "connect_player" ){
    // transfer playing to our web device
    spotifyApi.transferMyPlayback([req.body.device_id])
    .then(function() {
      console.log('Transfering playback to ' + req.body.device_id);
      res.json({msg:"transferred"})
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });
  }


  else if(req.body.action == "start"){

  // first time user clicks play

    playerURI = {context_uri:"spotify:"+type+":"+pID};
    spotifyApi.play(playerURI)
    .then(function() {
      console.log('Playback started');
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });
  }

  // else if(req.body.action == "resume"){
  //   spotifyApi.play()
  //   .then(function() {
  //     console.log('Playback started');
  //   }, function(err) {
  //     //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
  //     console.log('Something went wrong!', err);
  //   });
  // }

  // else if(req.body.action == "pause"){
  //   spotifyApi.pause()
  //   .then(function() {
  //     console.log('Playback paused');
  //   }, function(err) {
  //     //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
  //     console.log('Something went wrong!', err);
  //   });
  // }



})

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
      'HTTP Server up. Now go to http://localhost:8888 in your browser.'
    )
  );


  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = Number.parseInt(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
