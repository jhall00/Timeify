require('dotenv').config();
const path = require('path');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const port = process.env.PORT || 8888;


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
  res.setHeader('Cache-Control', 'max-age=31536000');
  res.render("login", {exStr});
});

app.get('/generate', (req, res) => {
  var results =[];
  // res.sendFile(path.join(__dirname, 'public/login.html'));
  res.render("generate", {results})
});

app.post('/generate', (req, res) => {
  // req.body object has your form values


  // receive data from when search button is clicked

  if(req.body.action == "search" ){
    console.log(req.body.type);
    console.log(req.body.term);
    // res.render("generate")
    //take a search term from the user and search for playlists
    let results = [];
    let returned;
    if (req.body.type == "album") {
      returned = spotifyApi.searchAlbums(req.body.term, { limit: 5 }).then(function (data) {
        data.body.albums.items.forEach(function (item) {
          console.log(item);
          results.push({ title: item.name, artists: item.artists, cover_art : item.images[0].url, id: item.id });
        });
      });
    } else {
      returned = spotifyApi.searchPlaylists(req.body.term, { limit: 5 }).then(function (data) {
        data.body.playlists.items.forEach(function (item) {
          console.log(item);
          let img = null;
          if (item.images.length > 0) {
            img = item.images[0].url;
          }
          results.push({ title: item.name, owner: item.owner.display_name, cover_art : img, id: item.id});
        });
        // res.send(results);
      });
    }
    Promise.all([returned]).then((val) => {
      res.send(results)
    });
  }

  else{
      //receive data from when generate button is clicked
      console.log(req.body.length_minutes)
      console.log(req.body.length_seconds)
      console.log(req.body.mySource)
      console.log(req.body.newName)


  }


  // spotifyApi.getPlaylist(req.body.playlistID)
  // .then(function(data) {
  //   console.log('Some information about this playlist', data.body);
  // }, function(err) {
  //   console.log('Something went wrong!', err);
  // });
});

app.get('/load', (req, res) => {
  let results = []

  res.render("load", {results})
});

app.post('/load', (req, res) => {
  // req.body object has your form values


  // receive data from when search button is clicked
  if(req.body.action == "search" ){
    console.log(req.body.type);
    console.log(req.body.term);
    // res.render("generate")
    //take a search term from the user and search for playlists
    let results = [];
    let returned = spotifyApi.getUserPlaylists().then(function (data) {
        data.body.items.forEach(function (item) {
          if (item.name.toLowerCase().includes(req.body.term.toLowerCase())) {
            console.log(item);
            let image_url;
            if (item.images.length > 0) {
              image_url = item.images[0].url;
            }
            let isTimeify = false;
            if (item.description.includes("Timeify")) {
              isTimeify = true;
            }
            results.push({ title: item.name, cover_art : image_url, id: item.id, owner: item.owner.display_name, isTimeify: isTimeify});
          } else {
            console.log("excluding " + item.name + " from search results");
          }
        });
      });
    Promise.all([returned]).then((val) => {
      res.send(results)
    });
  }
});

app.get('/playlists', (req, res) => {
  // var pID = "37i9dQZF1DZ06evO0ENBD2"
  var pID = (req.params.ID)
  var songs = []
  var playlistTitle = ""
  // var playlistLength = 0
  var type ="playlist"
  // const p1 = spotifyApi.getPlaylist(pID)
  // .then(function(data) {
  //   data.body.tracks.items.forEach(track=> {

  //     // playlistLength += track.track.duration_ms
  //     songs.push({title: track.track.name, artist: track.track.artists[0].name,
  //       time: track.track.duration_ms})

  //   })

  //   playlistTitle = data.body.name
  //   cover_art = data.body.images[0].url

  // }, function(err) {
  //   console.log('Something went wrong!', err);

  // });

  access_token = spotifyApi.getAccessToken()

  // wait for all promises to be available
  // Promise.all([p1]).then(() => {
    res.render("playlists", {songs, playlistTitle})

  // })
});


app.post('/playlists', (req, res) => {

  var songList =[]
  var newID = []
  // var songListDict = {}


  // data.body.albums.items.forEach(function (item) {
  //   console.log(item);
  //   results.push({ title: item.name, artists: item.artists, cover_art : item.images[0].url, id: item.id });
  // });


  console.log("___________________________")
  if(req.body.action == 'getSongs'){
    if(req.body.pOra == "album"){

      var pAlbum =spotifyApi.getAlbum(req.body.ID)
      .then(function(data) {
        songList = data.body.tracks.items
        console.log('Album information', data.body);
      }, function(err) {
        console.error(err);
      });

      Promise.all([pAlbum]).then((val) => {
        res.send(songList)
      });
    }

    else{


  //  spotifyApi.getPlaylist(req.body.ID)
  //     .then(function(data) {
  //       songList = data.body.tracks.items

  //       // console.log('Some information about this playlist', data.body);
  //     }, function(err) {
  //       console.log('Something went wrong!', err);
  //     });

      var pPlaylist = getAllSongsDetails(req.body.ID);

      Promise.all([pPlaylist]).then(() => {
        pPlaylist.then(songList => {
          res.send(songList)
  
        }).catch(err => {
          console.log(err);
        });
    
      })


    }
    // Promise.all([p1]).then((val) => {
    //   res.send(songList)
    // });



  }

  else if(req.body.action == 'createPlaylist'){

      var p2 = spotifyApi.createPlaylist(req.body.newPlaylistName, { 'description': 'Timeify generated playlist', 'public': true })
    .then(function(data) {
      newID = [data.body.id]
      // res.send(newID)
      return data.body.id
    })
    .then(function(id) {
      var numBatches = Math.floor(req.body.songList.length/100) + 1;

      var chunk = 100
      for (let batchNum = 0; batchNum < numBatches ; batchNum++) {
        var last =  batchNum * 100
        spotifyApi.addTracksToPlaylist(id, req.body.songList.slice(last, chunk))
        chunk = chunk + 100
      }

      // for(var i = 0; i<= 99; i++){
      //   return spotifyApi.addTracksToPlaylist(id, req.body.songList)
      // }

    })


    Promise.all([p2]).then((val) => {
      res.send(newID)
    });


  }




})



app.get('/player/:ID', (req, res) => {
  // var pID = "37i9dQZF1DZ06evO0ENBD2"
  var pID = String(req.params.ID)
  // var songs = []
  var playlistTitle =""
  var cover_art =""
  var playlistLength =0
  var type ="playlist"
  var total = 0
  const p1 = spotifyApi.getPlaylist(pID)
  .then(function(data) {
    // console.log('Some information about this playlist', data.body);
    // console.log("/n/n all the songs", data.body.tracks.items);
    total = data.body.tracks.total
    data.body.tracks.items.forEach(track=> {

      // playlistLength += track.track.duration_ms
      // var length = millisToMinutesAndSeconds(track.track.duration_ms)
      // songs.push({title: track.track.name, artist: track.track.artists[0].name, length: length})


    })
    playlistTitle = data.body.name
    cover_art = data.body.images[0].url
  }, function(err) {
    console.log('Something went wrong!', err);

  });


  // const p2 = spotifyApi.getPlaylistTracks(pID, {
  //   offset: 0,
  //   limit: 100,
  //   fields: 'items'
  // })
  // .then(
  //   function(data) {

  //     // data.body.items.forEach(track=> {
  //     //   var length = millisToMinutesAndSeconds(track.track.duration_ms)

  //     //   songs.push({title: track.track.name, artist: track.track.artists[0].name, length: length})

  //     // })
  //   },
  //   function(err) {
  //     console.log('Something went wrong!', err);
  //   }
  // );




    // var limit = 100;
    // var numBatches = Math.floor(data.body.total / limit) + 1;
    // for (var batchNum = 0; batchNum <= numBatches ; batchNum++) {
    //     const p2 = spotifyApi.getPlaylistTracks(pID, {offset: batchNum * limit})
    //     .then(function(newData) {
    //       // console.log('The playlist contains these tracks', newData.body);
    //       newData.body.items.forEach(track=> {

    //           var length = millisToMinutesAndSeconds(track.track.duration_ms)

    //           songs.push({title: track.track.name, artist: track.track.artists[0].name, length: length})
    //         })

    //       // console.log(`Retrieved tracks ${batchNum * limit} through ${batchNum * limit + limit}`);
    //     }, function(err) {
    //         console.error(`Error retreiving sourcePlaylist data.`);
    //     });
    // };




    
    // var songsP = getAllSongs(pID);


  access_token = spotifyApi.getAccessToken()

  // wait for all promises to be available
  Promise.all([p1]).then(() => {
    var songsP = getAllSongs(pID);

    songsP.then(obj => {
      songs = obj.s
      playlistLength = obj.l
      res.render("player", {songs, playlistTitle, access_token, cover_art, playlistLength})
    }).catch(err => {
      console.log(err);
    });

  })


});


async function getAllSongs(id) {
  var data = await spotifyApi.getPlaylistTracks(id);
  var numBatches = Math.floor(data.body.total/100) + 1;
  var promises = [];
  for (let batchNum = 0; batchNum < numBatches ; batchNum++) {
    var promise = getSongs(id, batchNum * 100);
    promises.push(promise);
  }
  var rawSongData = await Promise.all(promises);
  var songs = [];
  var playlistLength = 0
  for (let i = 0; i < rawSongData.length; i++) {
    rawSongData[i].body.items.forEach(track=> {
        var length = millisToMinutesAndSeconds(track.track.duration_ms)
        playlistLength += track.track.duration_ms

        songs.push({title: track.track.name, artist: track.track.artists[0].name, length: length})
      })
  }
  return {s:songs, l:playlistLength};
}

async function getAllSongsDetails(id) {
  var data = await spotifyApi.getPlaylistTracks(id);
  var numBatches = Math.floor(data.body.total/100) + 1;
  var promises = [];
  for (let batchNum = 0; batchNum < numBatches ; batchNum++) {
    var promise = getSongs(id, batchNum * 100);
    promises.push(promise);
  }
  var rawSongData = await Promise.all(promises);
  var songList = [];

  for (let i = 0; i < rawSongData.length; i++) {
        songList =songList.concat(rawSongData[i].body.items)
  }
  return songList;
}

async function getSongs(id, offset) {
  var songs = await spotifyApi.getPlaylistTracks(id, {offset: offset});
  return songs;
}


app.post('/player/:ID', (req, res) => {

  var url = req.headers.referer
  var pID = url.substring(url.lastIndexOf('/') + 1);

  var type ="playlist"

  if(req.body.action == "connect_player" ){
    // transfer playing to our web device
    spotifyApi.transferMyPlayback([req.body.device_id])
    .then(function() {
      console.log('Transferring playback to ' + req.body.device_id);
      res.json({msg:"transferred"})
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });



  }


  if(req.body.action == "start"){

  // first time user clicks play

  spotifyApi.setShuffle(false)
  .then(function() {
    console.log('Shuffle is off.');
  }, function  (err) {
    //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    console.log('Something went wrong!', err);
  });

    playerURI = {context_uri:"spotify:"+type+":"+pID};
    spotifyApi.play(playerURI)
    .then(function() {
      console.log('Playback started');
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });
  }

  else if(req.body.action == "shuffle_on"){
    spotifyApi.setShuffle(true)
    .then(function() {
      console.log('Shuffle is on.');
    }, function  (err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });
  }

  else if(req.body.action == "shuffle_off"){
    spotifyApi.setShuffle(false)
    .then(function() {
      console.log('Shuffle is off.');
    }, function  (err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });
  }

  else if(req.body.action == "stop"){
    spotifyApi.pause()
    .then(function() {
      console.log('Playback paused');
    }, function(err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });

  }



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
          `Successfully retrieved access token. Expires in ${expires_in} s.`
        );
        // res.sendFile(path.join(__dirname, 'public/homePage.html'));

        // res.render("homePage")

        res.redirect("/home")


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


  app.get('/home', (req, res) => {

    var userID = ""

    var p1 =spotifyApi.getMe()
    .then(function(data) {
      userID = data.body.display_name
    }, function(err) {
      console.log('Something went wrong!', err);
    });

    Promise.all([p1]).then(() => {
      res.render("homePage",{userID})
    });

  })



  app.listen(port, () =>
    console.log(
      'HTTP Server up. Now go to http://localhost:8888/ in your browser.'
    )
  );


  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = Number.parseInt(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
