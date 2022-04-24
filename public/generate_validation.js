var hours_input = document.querySelector('select[name="length_hours"]');
var minutes_input = document.querySelector('select[name="length_minutes"]');
var seconds_input = document.querySelector('select[name="length_seconds"]');
var name_input = document.querySelector('input[name="newName"]');
var generate_form = document.getElementById("generate_form");



hours_input.addEventListener('invalid',  (event) => {
    if (event.target.validity.valueMisisng) {
        event.target.setCustomValidity('Please select the number of hours you want.');
    }
})

// hours_input.addEventListener('change', (event) => {
//     event.target.setCustomValidity('');
// })

name_input.addEventListener('invalid', (event) => {
    if (event.target.validity.valueMisisng) {
        event.target.setCustomValidity('Please enter a name for your timer.');
    }
})

generate_form.addEventListener('submit', (event) => {
    if (document.getElementById('selected').innerHTML == ''){
        event.preventDefault();
        console.log("No source selected.");
    }
})