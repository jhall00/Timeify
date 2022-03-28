var test = document.getElementById("test");
test.addEventListener('click', async _ => {
  const response = fetch('/generate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action:"start"})
  }).then(res => res.json())
    .then(res => console.log(res));
});