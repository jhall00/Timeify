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
  }).then(res => res.json())
    .then((function (res) {
      console.log(res);
      res.forEach(element => 
        searchResultsHTML +=  
        "<div class='border-solid rounded-lg border-4 mx-2 w-1/5'>"+
        "<img src='"+ element.cover_art + "'<"+
        "<img>  </img>"+
        "<p>"+element.title+"</p>"+
        "<p>"+element.artists[0].name+"</p>"+
    "</div>"
      );

      document.getElementById("searchResults").innerHTML = searchResultsHTML
     
    }));

});

album_button.addEventListener('click', async _ => {
  if(isSelected(album_button)) {
    //If we are already selected, do nothing!
  } else {
    //If we are not selected, select us!
    album_button.classList.add('selected');
    playlist_button.classList.remove('selected');
  }
});

playlist_button.addEventListener('click', async _ => {
  if(isSelected(playlist_button)) {
    //If we are already selected, do nothing!
  } else {
    //If we are not selected, select us!
    playlist_button.classList.add('selected');
    album_button.classList.remove('selected');
  }
});

function isSelected(element) {
  return element.classList.contains('selected');
}

function name(params) {

}