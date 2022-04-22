// source : https://algorithms.tutorialhorizon.com/given-an-array-print-all-unique-subsets-with-a-given-sum/


// pull form data from url
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}

// holds all the form input objects
var inputs = getUrlVars()
inputs.newName = inputs.newName.replace("+", " ");

var hr = parseInt(inputs.length_hours)
var min = parseInt(inputs.length_minutes)
var sec = parseInt(inputs.length_seconds)

// source : https://algorithms.tutorialhorizon.com/given-an-array-print-all-unique-subsets-with-a-given-sum/
// all times are in milliseconds

// Create new map (song title, song length)
// Is this how I can grab the values from my get request?
// var playlist = new Map();
// for(var i = start; i < songs.length; i++){
//   playlist.set(songs.title[i], songs.time[i]);
// }
var realGoal = convertHMSToMS(hr,min,sec)

var timeHTML = convertMsToTime(realGoal)
document.getElementById("header").innerHTML += timeHTML +"?"

// make dictionary of {songLength, ID} to use for lookup
// make array of songLengths
var songDict = new Map();
var songLengths =[]

// make post call to get list of playlist/album songs and lengths


var arrA =[]
// var realGoal = 600000
// 30 secs offset
var offset = 30000
var n = realGoal+offset;

var possibilitiesLower = new Map();

var possibilitiesHigher = new Map();

const response = fetch('/playlists', {
  method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({action:"getSongs",ID:inputs.ID, pOra: inputs.pOra})
}).then(res => res.json())
  .then((function (res) {
    res.forEach(element => {
      if(inputs.pOra == 'album'){
        songDict.set(element.duration_ms, {id: element.id, title:element.name, artist: element.artists[0].name})
        songLengths.push(element.duration_ms)
      }
      else{
        songDict.set(element.track.duration_ms, {id: element.track.id, title:element.track.name, artist: element.track.artists[0].name})
        songLengths.push(element.track.duration_ms)
      }

    });
    arrA = songLengths

    findSets(arrA, n);
    findFinal()

  }))





// Alg for generating



function findSets(arrA, sum){
  console.log("Given Array: " + arrA.toString() + ", required sum: " + sum);
  arrA.sort();
  var combinationList =[]
  combinationUtil(arrA, sum, 0, 0, combinationList);
}

function findFinal(){
  // set to infinity

  console.log("low")

  console.log(possibilitiesLower)

  console.log("high")

  console.log(possibilitiesHigher)


  var finalLower = Math.max(...possibilitiesLower.keys());

  var finalHigher = Math.min(...possibilitiesHigher.keys());

  console.log("finals")

//loop through possibilitiesLower.get(finalLower) array

var lowerTotalTime= convertMsToTime(finalLower)
var titleHTML = "        <p class='inline text-lg'>"+
"Playlist Option 1 Length: "+
"</p>"+
"<p class=' inline text-lg font-bold'>"+
lowerTotalTime+
"</p>"

var songHTML =""
var shorterIDArr = []
possibilitiesLower.get(finalLower).forEach(element =>  {
  console.log(songDict.get(element).title)
  shorterIDArr.push("spotify:track:"+songDict.get(element).id)

  songHTML +="<div class='flex p-1 rounded-md justify-between '>"+
  "<div class='w-5/6'>"+
      "<p class='font-bold text-white'>"+
      songDict.get(element).title +
      "</p>"+
      "<p class='text-white text-sm'>"+
      songDict.get(element).artist+
      "</p>"+
  "</div>"+
"</div>"

  }  );

  document.getElementById("optionLowerList").insertAdjacentHTML("afterbegin", titleHTML + songHTML);

  var higherTotalTime = convertMsToTime(finalHigher)


titleHTML = "        <p class='inline text-lg'>"+
"Playlist Option 2 Length: "+
"</p>"+"<p class=' inline text-lg font-bold'>"+
higherTotalTime+
"</p>"

songHTML =""
var longerIDArr = []

possibilitiesHigher.get(finalHigher).forEach(element =>  {
  console.log(songDict.get(element).title)
  longerIDArr.push("spotify:track:"+songDict.get(element).id)


  songHTML +="<div class='flex p-1 rounded-md justify-between '>"+
  "<div class='w-5/6'>"+
      "<p class='font-bold text-white'>"+
      songDict.get(element).title +
      "</p>"+
      "<p class='text-white text-sm'>"+
      songDict.get(element).artist+
      "</p>"+
  "</div>"+
"</div>"

  }  );

  document.getElementById("optionHigherList").insertAdjacentHTML("afterbegin", titleHTML + songHTML);





  // buttons

  document.getElementById("option1Btn").addEventListener("click", function(){
    option1(shorterIDArr)
  });

  document.getElementById("option2Btn").addEventListener("click", function(){
    option2(longerIDArr)
  });


  // // these will give us the playlists we want
  // console.log(possibilitiesLower.get(finalLower))
  // console.log(possibilitiesHigher.get(finalHigher))


}

function combinationUtil(arrA, sum, currSum, start, combinationList){

  // find subsets within a minute range
  if((currSum <= realGoal && currSum >= realGoal-offset)){
    // console.log(combinationList);
    //Map : (Sum, subset)

    possibilitiesLower.set(currSum, combinationList.slice())

      // console.log("L  "+combinationList);

    // possibilitiesLower.push({subset: combinationList.slice(), sum: currSum})
    // return;
  }

  if(currSum==realGoal) {
    //  console.log(combinationList);
      return;
  }


  else if(((currSum > realGoal) && (currSum <= realGoal+offset))){
    // console.log(combinationList);
    possibilitiesHigher.set(currSum, combinationList.slice())
      // console.log("H "+combinationList);

    // possibilitiesHigher.push({subset: combinationList.slice(), sum: currSum})
    return;
  }


  if(currSum==n) {
    //  console.log(combinationList);
      return;
  }

  var prevElement = -1;
  for (var i = start; i <arrA.length ; i++) {
      if(prevElement!=arrA[i]) {
          if(currSum+arrA[i]>sum) //array is sorted, no need to check further
              break;
          combinationList.push(arrA[i]);
          combinationUtil(arrA, sum, currSum + arrA[i], i + 1, combinationList);
          combinationList.splice(combinationList.length - 1, 1);
          prevElement = arrA[i];
      }
  }
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  if(hours == 0){
      return `${padTo2Digits(minutes)}:${padTo2Digits(seconds,)}`;

  }
  else{
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds,)}`;
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function option1(idArr){

  const response = fetch('/playlists', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"createPlaylist", newPlaylistName: inputs.newName, songList:idArr})
  }).then(res => res.json())
  .then((function (res) {
    window.location.href = "/player/"+res[0];
  }));
  console.log("o1")
}

function option2(idArr){
  const response =  fetch('/playlists', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"createPlaylist", newPlaylistName: inputs.newName, songList:idArr})
  }).then(res => res.json())
  .then((function (res) {
    window.location.href = "/player/"+res[0];
  }));
  console.log("o2")

}
function convertHMSToMS(hr,min,sec){
  var ms = 0
  ms += hr*3600000
  ms += min * 60000
  ms += sec * 1000
  console.log( ms)
  return ms

}
