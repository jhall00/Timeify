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

          searchResultsHTML += "<div onclick = 'resultClick(this)' data-title='"+ element.title.replace(/'/,"&#39") + "' data-pOra=\"playlist\" data-spotify-id='" + element.id + "' class='playlist_select overall'>";
          if (element.cover_art != null) {
            searchResultsHTML += `<div class="art_box"><img id="temp" class="cover_art" src="${element.cover_art}">`;
          } else {
            //TODO add placeholder image for missing album art.
          }
          searchResultsHTML += `<p class="aTitle">${element.title}</p>`;
          searchResultsHTML += `<p class="pOwner">${element.owner}</p>`;
          searchResultsHTML += "</div>";
          searchResultsHTML += "</div>";

          document.getElementById("searchResults").innerHTML = searchResultsHTML

        }
    }));

});

function resultClick(element) {

  //confirm button css
  let design = document.getElementById("confirm_button");
  design.classList.remove("cursor-not-allowed","opacity-50")

  //clear previous highlight formatting
  let check= document.getElementsByClassName("overall")
  for (let i=0; i<check.length; i++){
    check[i].classList.remove("highlight")
  }
  // add highlight formatting
  element.classList.add("highlight")

  ///shows selected title //TODO ELEMENT NOT YET ADDED
   let selected= document.getElementById("selected");
   selected.innerHTML = element.dataset.title;
  // window.location.href = "/player/" + element.dataset.spotifyId;

  document.getElementById("loadSubmit").onclick = function() {
    window.location.href = "/player/" + element.dataset.spotifyId;
  };

  //source hint
  let get_id = document.getElementById("ID");
  let get_pOra = document.getElementById("pOra");

  get_id.value = element.dataset.spotifyId;
  get_pOra.value = "playlist";


  console.log(get_id.value);
  console.log(get_pOra.value);
}


//source hint
var sourceQ = document.getElementById("sourceQ")

var sourceInst = document.getElementById("sourceInstructions")
sourceQ.onmouseover = function(){
    sourceInst.style.visibility = "visible"

};
sourceQ.onmouseout = function(){
    sourceInst.style.removeProperty("visibility")
};