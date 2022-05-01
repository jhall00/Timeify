var load = document.getElementById("loadSubmit");

load.addEventListener('click', (e) => {
    if (document.getElementById('selected').innerHTML == ''){
        alert("Please load a playlist source using the Select Source button.")
        console.log("Error: No source selected.");
    }
})