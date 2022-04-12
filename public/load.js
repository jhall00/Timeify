var test = document.getElementById("searchSubmit");
var confirm_button = document.getElementById("confirm_button")

test.addEventListener('click', async _ => {
  var searchResultsHTML =""
  let selected = "";
  let input_term = document.getElementById("search_term").value;
  const response = await fetch('/load', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"search", type: selected, term:input_term}) // to get search fields that user put in, pull from document.getElementById etc
  }).then(function (res) {
      return res.json();
    }, function (err) {
      console.log(err);
    })
    .then((function (res) {
      console.log(res);

      for (let i = 0; i < res.length; i++){
        const element = res[i];

          // searchResultsHTML += "<div data-spotify-id=\"" + element.id + "\" class='border-solid rounded-lg border-4 mx-2'>" +
          //   "<img class='cover_art' src='" + element.cover_art + "'>" +
          //   "<p>" + element.title + "</p>";

          searchResultsHTML += "<div onclick = 'resultClick(\""+ String(element.id)+"\",\"playlist\")' data-spotify-id=\"" + element.id + "\" class=' playlist_select  mx-2'>" +
          "<img class='cover_art' src='" + element.cover_art + "'>" +
          "<p>" + element.title + "</p>";

          searchResultsHTML += "</div>";
          searchResultsHTML;
          document.getElementById("searchResults").innerHTML = searchResultsHTML

        }




    }));

});

function resultClick(id, pOra){


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


  var get_id= document.getElementById("ID")
  var get_pOra= document.getElementById("pOra")

  get_id.value= id;
  get_pOra.value=pOra;


  console.log(get_id.value)
  console.log(get_pOra.value)
  //get input id ="hidden" set value = id
  // input id = pOra set value = pOra


  // add highlight
  // get rid of class disabled
}