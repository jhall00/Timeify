var test = document.getElementById("select-source");
var album_button = document.getElementById("album_button");
var playlist_button = document.getElementById("playlist_button");
var options;
test.addEventListener('click', async _ => {
  fetch('/load', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"select_source"}) //load all user playlists.
  }).then(function (res) {
    return res.json();
  }, function (err) {
    console.log(err);
  })
    .then(res => {
      console.log(res);
      res.forEach(function(element) {
        // list of playlists in the users Spotify account
        // TODO maybe add a background color or some distinguishing mark for playlists that were generated by Timeify?
        // maybe this can be accomplished by adding the word Timeify to the description. 
        options += "<option class='options' data-spotify-id=\"" + element.id + "\">" + element.name + "</option>";
        return options;
        }
      );

      document.getElementById("playlist-load").innerHTML = options;



    });

});

function isSelected(element) {
  return element.classList.contains('selected');
}


var yourSelect =document.getElementById("playlist-load")
var currentSelected = ""
yourSelect.addEventListener('change', (event) => {

  currentSelected = yourSelect.options[ yourSelect.selectedIndex ].dataset.spotifyId
});


document.getElementById("loadSubmit").onclick = function(){
  window.location.href = "/player/"+currentSelected;

};




//source hint
var sourceQ = document.getElementById("sourceQ")

var sourceInst = document.getElementById("sourceInstructions")
sourceQ.onmouseover = function(){
    sourceInst.style.visibility = "visible"

};
sourceQ.onmouseout = function(){
    sourceInst.style.removeProperty("visibility")
};
