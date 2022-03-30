// get access token from ejs file
var access = document.getElementById("access")
var accessStr = access.innerHTML
accessStr = accessStr.substring(1);
var playlistOver = document.getElementById("playlistOver");
var playlistUnder = document.getElementById("playlistUnder");

// source : https://algorithms.tutorialhorizon.com/given-an-array-print-all-unique-subsets-with-a-given-sum/
// all times are in miliseconds

// pull song times into array
var arrA = [180000,240000,360000,90000,390000,60000,330000,240000,450000];

// timer set by user (15 mins in this example)
var realGoal = 900000;
var n = realGoal+60000;

var possibilitiesLower = new Map();
var possibilitiesHigher = new Map();

findSets(arrA, n);
findFinal()

function findSets(arrA, sum){
  console.log("Given Array: " + arrA.toString() + ", required sum: " + sum);
  arrA.sort();
  var combinationList = []
  combinationUtil(arrA, sum, 0, 0, combinationList);
}

function findFinal(){
    // set to infinity

    //   console.log("low")
    //   console.log(possibilitiesLower)

    //   console.log("high")
    //   console.log(possibilitiesHigher)

  var finalLower = Math.max(...possibilitiesLower.keys());
  var finalHigher = Math.min(...possibilitiesHigher.keys());
  var lowerSum = 0;
  var higherSum = 0;

    //   console.log("finals")
    // these will give us the playlists we want
    console.log(possibilitiesHigher.get(finalLower))
    console.log(possibilitiesHigher.get(finalHigher))

//   for (var i = start; i < possibilitiesLower.get(finalLower).length; i++) {
//     lowerSum += possibilitiesLower.get(finalLower)[i];
//   }
//   playlistUnder.textContent = lowerSum;


//   for (var i = start; i < possibilitiesLower.get(finalHigher).length; i++) {
//     higherSum += possibilitiesHigher.get(finalHigher)[i];
//   }
//   playlistOver.textContent = higherSum;

}

function combinationUtil(arrA, sum, currSum, start, combinationList){

  // find subsets within a minute range
  if((currSum <= realGoal && currSum >= realGoal-60000)){
    // console.log(combinationList);
    //Map : (Sum, subset)
    possibilitiesLower.set(currSum, combinationList.slice())
    // possibilitiesLower.push({subset: combinationList.slice(), sum: currSum})
    return;
  }
  else if(((currSum > realGoal) && (currSum <= realGoal+60000))){
    // console.log(combinationList);
    possibilitiesHigher.set(currSum, combinationList.slice())

    // possibilitiesHigher.push({subset: combinationList.slice(), sum: currSum})
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

function convertSeconds(s) {
    var min = Math.floor(s / 60).toString();
    var sec = (s % 60).toString();
    return min.padStart(2, '0') + ':' + sec.padStart(2, '0');
  
}

function convertMStoS(ms){
    return (ms/1000)
}