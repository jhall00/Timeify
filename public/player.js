// get access token from ejs file
var access = document.getElementById("access")
var accessStr = access.innerHTML
accessStr = accessStr.substring(1);
var ppButtonIcon = document.getElementById("ppButtonPic")
var ppButton = document.getElementById("ppButton")

var counter = 0


var accumulatedSongTime = 0
var currentSongID = ""
var previousSongID = ""


// creates a new player in browser to play to
window.onSpotifyWebPlaybackSDKReady = () => {

  const player = new Spotify.Player({
      name: 'Timeify Web Player',
      getOAuthToken: cb => { cb(accessStr); },
      volume: 0.8
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

    player.getCurrentState().then(state => {
      currentSongID = current_track.id
      if(previousSongID ==""){
        previousSongID = currentSongID
      }
      if(state.paused == false){

        // if we have changed tp next song
        if(currentSongID != previousSongID){
          // we need to buffer the countdown by 1.8 seconds since there is a delay between songs and when 
          // the playlist is first played
          counter -= 1650
          previousSongID = currentSongID
          
        }
      }

    })

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

        ppButtonIcon.src="/pauseButton.svg";
        
        //send status of what action/ api call we want to make to index.js with post
        const response = await fetch('/player/:ID', {
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
        ppButtonIcon.src="/pauseButton.svg";
        player.togglePlay();

    }

    else if (ppButton.classList.contains("playing")){
      ppButton.classList.remove("playing");
      ppButton.classList.add("paused");
      ppButtonIcon.src="/playButton.svg";
      player.togglePlay();


  }

  })

  player.connect();
};


async function sendDeviceID(device_id){
  const response = await fetch('/player/:ID', {
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

  var playlistLength = document.getElementById("playlistLength")
  // in milliseconds
  var playlistLengthStr = playlistLength.innerHTML

  var playlistLengthLabel = document.getElementById("playerLengthLabel")
  playlistLengthLabel.innerHTML = convertMsToTime(parseInt(playlistLengthStr))

  var shuffleButton = document.getElementById("shuffle")


  shuffleButton.addEventListener("click", function(){

    if(shuffleButton.classList.contains("shuffle_off")){
      shuffleButton.src = "/shuffle_selected.png"
      shuffleButton.classList.remove('shuffle_off')
      shuffleButton.classList.add('shuffle_on')

      const response = fetch('/player/:ID', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action:"shuffle_on"})
      }).then(res => res.json())
        .then(res => console.log(res));

    }

    else{
      shuffleButton.src = "/shuffle_unselected.png"
      shuffleButton.classList.remove('shuffle_on')
      shuffleButton.classList.add('shuffle_off')

      const response =  fetch('/player/:ID', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({action:"shuffle_off"})
      }).then(res => res.json())
        .then(res => console.log(res));
    }

  })

var i = 0;

// var playlistSeconds =  convertMStoS(parseInt(playlistLengthStr))

var timeleft = parseInt(playlistLengthStr)

var interval = -1
var halftime = timeleft / 2
var close_popup = halftime - 5000
var countDown = document.getElementById("countDown")
var checkbox = document.getElementById("myCheck")

countDown.innerHTML = convertMsToTime(timeleft - counter);

///variables for load bar
var counterhtml = document.getElementById("counterhtml")
var timerhtml = document.getElementById("timerhtml")
var percentage = document.getElementById("percentage")

var bar1 = new ldBar("#help");
//bar1.set(percentage);

  ppButton.addEventListener("click", function() {
    if(interval == -1){
      interval = setInterval(function(){
        counter +=1000
        countDown.innerHTML= convertMsToTime(timeleft - counter);

        ///setting values for load bar
        counterhtml.innerHTML = counter
        timerhtml.innerHTML = timeleft
        percentage.innerHTML= (counter/timeleft)*100

        //changing data-value dynamically
        var dataAttribute = help.getAttribute('data-value');
        debug.innerHTML= dataAttribute
        
        // for the halfway popup
        if (countDown.innerHTML == convertMsToTime(halftime))
        {
          if (checkbox.checked == true)
          {
            document.getElementById("myHalfway").style.display = "block";
            play_halfway_notification();
          }
          
        }

        if (countDown.innerHTML == convertMsToTime(close_popup))
        {
          document.getElementById("myHalfway").style.display = "none";
        }

        // for the completion popup
        if (countDown.innerHTML == convertMsToTime(0))
        {
          document.getElementById("myComplete").style.display = "block";
          play_halfway_notification();
        }

        //load bar ////////////
        if (i == 0) {
          i = 1;
          var id = setInterval(frame, 10);
          function frame() {
            if (percentage.innerHTML >= 100) {
              clearInterval(id);
              i = 0;
            } else {
              bar1.set(percentage.innerHTML);
            }
          }
        }
        


        //if timer is 0 left
        if(timeleft - counter <= 0){
          const response = fetch('/player/:ID', {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({action:"stop"})
          }).then(res => res.json())
            .then(res => console.log(res));
          clearInterval(interval)
          interval = -1
          console.log("done") //temporary (replace with notification done alarm) 
          ppButton.classList.remove("playing");
          ppButton.classList.add("stopped");
          // For Mike: change to stop button so that user can click that to stop the alarm when it's playing
          ppButtonIcon.src="/stopButton.svg";

        }
      }, 1000)
      
    }
    else{
      clearInterval(interval)
      interval = -1
  
    }
  });
    

function play_halfway_notification(){
  let sound = new Audio("/halfway_notification.mp3");
  // console.log("sound should be playing")
  sound.play();
}

function convertSeconds(s) {
  var min = Math.floor(s / 60).toString();
  var sec = (s % 60).toString();
  return min.padStart(2, '0') + ':' + sec.padStart(2, '0');

}

function convertMStoS(ms){
  return (ms/1000)
}
function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
  )}`;
}
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}


};

