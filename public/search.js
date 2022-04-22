var test = document.getElementById("searchSubmit");
var album_button = document.getElementById("album_button");
var playlist_button = document.getElementById("playlist_button");
test.addEventListener('click', async _ => {
  var searchResultsHTML =""
  let selected = "";
  let input_term = document.getElementById("search_term").value;
  if(isSelected(album_button)) {
    selected = "album";
  } else {
    selected = "playlist";
  }
  const response = await fetch('/generate', {
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


        if (isSelected(album_button)) {
          searchResultsHTML += "<div onclick = 'resultClick(this)' data-title='"+ element.title.replace(/'/,"&#39") + "' data-pOra=\"album\" data-spotify-id='" + element.id + "' class='album_select overall'>";
          if(element.cover_art != null) {
            searchResultsHTML += `<div class="art_box"><img id='temp' class='cover_art' src='${element.cover_art}'>`;
          } else {
            //TODO add placeholder image for missing album art.
          }
          searchResultsHTML += `<p class="aTitle">${element.title}</p>`;
          if (element.artists.length > 1) {
            //iterate through artists
            searchResultsHTML += `<p class="aArtist">`;
            for (let j = 0; j < element.artists.length; j++) {
              searchResultsHTML += `${element.artists[j].name}`;
              if (j !== element.artists.length - 1) {
                searchResultsHTML += `, `;
              }
            }
            searchResultsHTML += `</p>`;
          } else {
            searchResultsHTML += `<p class="aArtist">${element.artists[0].name}</p>`;
          }
          searchResultsHTML += `</div>`;
          document.getElementById("searchResults").innerHTML = searchResultsHTML
          // var album_selected = document.getElementById("temp")
          // console.log(album_selected)

        } else {
          searchResultsHTML += "<div onclick = 'resultClick(this)' data-title='"+ element.title.replace(/'/,"&#39") + "'data-pOra=\"playlist\" data-spotify-id='" + element.id + "' class='album_select overall'>";
          searchResultsHTML += "<div class='art_box'>";
          if(element.cover_art != null) {
            searchResultsHTML += `<img id='temp' class='cover_art' src='${element.cover_art}'>`;
          } else {
            //TODO add placeholder image for missing album art.
            searchResultsHTML += `<img id='temp' class='cover_art' src='${element.cover_art}'>`;
          }
          searchResultsHTML += `<p class="pTitle" >${element.title}</p>`;
          searchResultsHTML += `<p class="pOwner">${element.owner}</p>`;
          searchResultsHTML += "</div>";

        }

        searchResultsHTML += "</div>";
        searchResultsHTML;
        document.getElementById("searchResults").innerHTML = searchResultsHTML

      }


    }));

});




album_button.addEventListener('click', async _ => {
  if(isSelected(album_button)) {
    //If we are already selected, do nothing!
  } else {
    //If we are not selected, select us!
    album_button.classList.add('selected');
    playlist_button.classList.remove('selected');
    document.getElementById("searchResults").innerHTML = "";
  }
});

playlist_button.addEventListener('click', async _ => {
  if(isSelected(playlist_button)) {
    //If we are already selected, do nothing!
  } else {
    //If we are not selected, select us!
    playlist_button.classList.add('selected');
    album_button.classList.remove('selected');
    document.getElementById("searchResults").innerHTML = "";
  }
});

function isSelected(element) {
  return element.classList.contains('selected');
}

function resultClick(element) {

  //confirm button css
  let design = document.getElementById("confirm_button");
  design.classList.remove("cursor-not-allowed","opacity-50")

  //clear previous highlight formatting
  let check = document.getElementsByClassName("overall");
  for (const checkElement of check) {
    checkElement.classList.remove("highlight");
  }

  // add highlight formatting
  element.classList.add("highlight")

  ///shows selected title
  let selected= document.getElementById("selected");
  selected.innerHTML = element.dataset.title;

  // id pora vals
  let get_id = document.getElementById("ID");
  let get_pOra = document.getElementById("pOra");

  get_id.value = element.dataset.spotifyId;
  get_pOra.value = element.dataset.pora;


  console.log(get_id.value)
  console.log(get_pOra.value)
  console.log(high.dataset.title)
  //console.log(high)


  //get input id ="hidden" set value = id
  // input id = pOra set value = pOra


  // add highlight
  // get rid of class disabled
}
