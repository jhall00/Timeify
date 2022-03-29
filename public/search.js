var test = document.getElementById("test");
test.addEventListener('click', async _ => {
  const response = fetch('/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"search"})
  }).then(res => res.json())
    .then(res => console.log(res));
});

var searchSubmit = document.getElementById("searchSubmit");
searchSubmit.addEventListener('click', async _ => {
  const response = fetch('/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"search"})
  }).then(res => res.json())
    .then(res => console.log(res));
});

var generateSubmit = document.getElementById("generateSubmit");
generateSubmit.addEventListener('click', async _ => {
  const response = fetch('/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"generate"})
  }).then(res => res.json())
    .then(res => console.log(res));
});

