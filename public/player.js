// get access token from ejs file
var access = document.getElementById("access")
var accessStr = access.innerHTML
accessStr = accessStr.substring(1);
var ppButtonIcon = document.getElementById("ppButtonPic")
var ppButton = document.getElementById("ppButton")


// creates a new player in browser to play to
window.onSpotifyWebPlaybackSDKReady = () => {

  const player = new Spotify.Player({
      name: 'Timeify Web Player',
      getOAuthToken: cb => { cb(accessStr); },
      volume: 0.5
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      sendDeviceID(device_id)

  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
  });

  player.addListener('initialization_error', ({ message }) => {
      console.error(message);
  });

  player.addListener('authentication_error', ({ message }) => {
      console.error(message);
  });

  player.addListener('account_error', ({ message }) => {
      console.error(message);
  });


  // listener for when song changes or anything in player changes
  player.addListener('player_state_changed', ({

    track_window: { current_track }
  }) => {

    
    var currentSongName = current_track.name

    var songTitles = document.getElementsByClassName("songTitle");

    // loop through presented list of songs
    // change text color of current song player to black
    // when song changes, new current one changes to black to indicate listening
    for(var i = 0; i < songTitles.length; i++)
    {
      var songName = songTitles[i].getAttribute('data-songTitle')
      if(songName == currentSongName){
        var songDiv = document.getElementById(songName);
        var arr = songDiv.querySelectorAll("p")
        arr.forEach(element => 
          element.classList.add('text-black')
          );


        // songTitles[i].classList.add('text-black')
        // songTitles[i].nextElementSibling.classList.add('text-black')

      }
      else{
        songTitles[i].classList.remove('text-black')
        songTitles[i].nextElementSibling.classList.remove('text-black')
        // var t= songTitles[i].nextElementSibling.nextElementSibling
        // var r = 0

        var songDiv = document.getElementById(songName);
        var timeDiv = songDiv.lastElementChild
        var timeP = timeDiv.firstChild.nextElementSibling.classList.remove('text-black')


      }

    }

  });

  ppButton.addEventListener('click', async _ => {
    if(ppButton.classList.contains("unStarted")){
        ppButton.classList.remove("unStarted");
        ppButton.classList.remove("paused");
        ppButton.classList.add("playing");

        ppButtonIcon.src="./pauseButton.svg";


        //send status of what action/ api call we want to make to index.js with post
        const response = await fetch('/player', {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:"start"})
          }).then(res => res.json())
            .then(res => console.log(res));




    }
    if (ppButton.classList.contains("paused")){
      
     
        ppButton.classList.remove("paused");
        ppButton.classList.add("playing");
        ppButtonIcon.src="./pauseButton.svg";
        player.togglePlay();

    }

    else if (ppButton.classList.contains("playing")){
      ppButton.classList.remove("playing");
      ppButton.classList.add("paused");
      ppButtonIcon.src="./playButton.svg";
      player.togglePlay();


  }

  })

  player.connect();
};


async function sendDeviceID(device_id){
  const response = await fetch('/player', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({device_id:device_id, action:"connect_player"})
  }).then(res => res.json())
    // wait for device to attach then allow play button to be clicked
    .then(res =>     {if(res.msg == "transferred" ){
      document.getElementById("ppButton").classList.remove("opacity-50")
      document.getElementById("ppButton").classList.remove("cursor-not-allowed")
    }
    });

}


window.onload = function(){
  var ppButton = document.getElementById("ppButton")
  var ppButtonIcon = document.getElementById("ppButtonPic")



var counter = 0
var timeleft = 300
var interval = -1

var countDown = document.getElementById("countDown")

countDown.innerHTML = convertSeconds(timeleft - counter);


  ppButton.addEventListener("click", function() {
    if(interval == -1){
      interval = setInterval(function(){
        counter ++
        countDown.innerHTML= convertSeconds(timeleft - counter);
      }, 1000)
    }
    else{
      clearInterval(interval)
      interval = -1
  
    }
  });
    






function convertSeconds(s) {
  var min = Math.floor(s / 60).toString();
  var sec = (s % 60).toString();
  return min.padStart(2, '0') + ':' + sec.padStart(2, '0');
  

}




  
};

