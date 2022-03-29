var test = document.getElementById("test");
test.addEventListener('click', async _ => {
  const response = fetch('/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"search"}) // to get search fields that user put in, pull from document.getElementById etc
  }).then(res => res.json())
    .then(res => console.log(res));
});