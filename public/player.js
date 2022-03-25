// get access token from ejs file
var access = document.getElementById("access")
var accessStr = access.innerHTML
accessStr = accessStr.substring(1);


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

  ppButton.addEventListener('click', async _ => {
    if(ppButton.classList.contains("unStarted")){
        ppButton.classList.remove("unStarted");
        ppButton.classList.remove("paused");
        ppButton.classList.add("playing");

        ppButtonIcon.src="./pauseButton.svg";


        //send status of what action/ api call we want to make to index.js iwth post
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

    ppButton = document.getElementById("ppButton")
    ppButtonIcon = document.getElementById("ppButtonPic")

 
    // ppButton.addEventListener('click', async _ => {
    //     if(ppButton.classList.contains("unStarted")){
    //         ppButton.classList.remove("unStarted");
    //         ppButton.classList.add("playing");

    //         ppButtonIcon.src="./pauseButton.svg";



    //         //send status of what action/ api call we want to make to index.js iwth post
    //         const response = await fetch('/player', {
    //             method: 'POST',
    //             headers: {
    //               'Accept': 'application/json, text/plain, */*',
    //               'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({action:"start"})
    //           }).then(res => res.json())
    //             .then(res => console.log(res));


    //     }
    //     if (ppButton.classList.contains("paused")){
      
     
    //         ppButton.classList.remove("paused");
    //         ppButton.classList.add("playing");
    //         ppButtonIcon.src="./pauseButton.svg";


    //         const response = await fetch('/player', {
    //             method: 'POST',
    //             headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({action:"resume"})
    //         }).then(res => res.json())
    //             .then(res => console.log(res));
            

    //     }
    //     else if (ppButton.classList.contains("playing")){
    //         ppButton.classList.remove("playing");
    //         ppButton.classList.add("paused");
    //         ppButtonIcon.src="./playButton.svg";

    //         const response = await fetch('/player', {
    //             method: 'POST',
    //             headers: {
    //               'Accept': 'application/json, text/plain, */*',
    //               'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({action:"pause"})
    //           }).then(res => res.json())
    //             .then(res => console.log(res));
    //     }
    // });


    // ppButton.addEventListener("click", async _ => {
    //     console("first reaches")
    //     if(ppButton.classList.contains("first")){
    //         ppButton.classList.remove("first");
    //         const response2 = await fetch('/player', {
    //             method: 'POST',
    //             headers: {
    //             'Accept': 'application/json, text/plain, */*',
    //             'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({action:"pause"})
    //         }).then(res => res.json())
    //             .then(res => console.log(res));
    //     }
    // })


};

