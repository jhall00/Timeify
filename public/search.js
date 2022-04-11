var test = document.getElementById("searchSubmit");
var album_button = document.getElementById("album_button");
var playlist_button = document.getElementById("playlist_button");
var confirm_button = document.getElementById("confirm_button")

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
            searchResultsHTML += "<div onclick = 'resultClick(\""+ String(element.id) +"\",\"album\")' data-spotify-id=\"" + element.id + "\" class=' album_select mx-16'>" +
            "<img id='temp' class='cover_art' src='" + element.cover_art + "'>" +
            "<p>" + element.title + "</p>";
            searchResultsHTML += "<p>" + element.artists[0].name + "</p>";
            document.getElementById("searchResults").innerHTML = searchResultsHTML
            // var album_selected = document.getElementById("temp")
            // console.log(album_selected)
            
          } else {


            searchResultsHTML += "<div onclick = 'resultClick(\""+ String(element.id)+"\",\"playlist\")' data-spotify-id=\"" + element.id + "\" class=' playlist_select  mx-2'>" +
            "<img class='cover_art' src='" + element.cover_art + "'>" +
            "<p>" + element.title + "</p>";
            searchResultsHTML += "<p>" + element.owner + "</p>";
            
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

function resultClick(id, pOra){

  var design=document.getElementById("confirm_button")
  design.classList.remove("cursor-not-allowed","opacity-50")
  //console.log("clicked "+id+ pOra)

  
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