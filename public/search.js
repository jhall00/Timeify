var test = document.getElementById("searchSubmit");
var album_button = document.getElementById("album_button");
var playlist_button = document.getElementById("playlist_button");
test.addEventListener('click', async _ => {
  let selected = "";
  if(isSelected(album_button)) {
    selected = "album";
  } else {
    selected = "playlist";
  }
  const response = fetch('/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"search", type: selected}) // to get search fields that user put in, pull from document.getElementById etc
  }).then(res => res.json())
    .then(res => console.log(res));
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