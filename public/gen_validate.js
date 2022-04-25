var hours_input = document.querySelector('select[name="length_hours"]');
var minutes_input = document.querySelector('select[name="length_minutes"]');
var seconds_input = document.querySelector('select[name="length_seconds"]');
var name_input = document.querySelector('input[name="newName"]');
var generate_form = document.getElementById("generate_form");


hours_input.addEventListener('invalid',  (event) => {
    if (event.target.validity.valueMissing) {
        event.target.setCustomValidity('Please select the number of hour(s) for your timer.');
    }
})

minutes_input.addEventListener('invalid', (event) => {
    if (event.target.validity.valueMissing) {
        event.target.setCustomValidity('Please select the number of minute(s) for your timer.');
    }
})

seconds_input.addEventListener('invalid', (event) => {
    if (event.target.validity.valueMissing) {
        event.target.setCustomValidity('Please select the number of second(s) for your timer.');
    }
})

name_input.addEventListener('invalid', (event) => {
    if (event.target.validity.valueMissing) {
        event.target.setCustomValidity('Please enter a name for your timer.');
    }
})


hours_input.addEventListener('change', (event) => {
    event.target.setCustomValidity('');
})

minutes_input.addEventListener('change', (event) => {
    event.target.setCustomValidity('');
})

seconds_input.addEventListener('change', (event) => {
    event.target.setCustomValidity('');
})

name_input.addEventListener('change', (event) => {
    event.target.setCustomValidity('');
})


generate_form.addEventListener('submit', (event) => {
    if (document.getElementById('selected').innerHTML == ''){
        event.preventDefault();
        alert("Please select a playlist source using the Select Source button.")
        console.log("No source selected.");
    }
})