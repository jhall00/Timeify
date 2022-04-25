var load_form = document.getElementById("load_form");

load_form.addEventListener('submit', (event) => {
    if (document.getElementById('selected').innerHTML == ''){
        event.preventDefault();
        alert("Please load a playlist source using the Select Source button.")
        console.log("No source selected.");
    }
})