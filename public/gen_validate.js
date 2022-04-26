var hours = document.querySelector('select[name="length_hours"]');
var minutes = document.querySelector('select[name="length_minutes"]');
var seconds = document.querySelector('select[name="length_seconds"]');
var hoursVal;
var minsVal;
var secsVal;
var timerName = document.querySelector('input[name="newName"]');
var generate_form = document.getElementById("generate_form");



hours.addEventListener('invalid',  (e) => {
    if (e.target.validity.valueMissing) {
        e.target.setCustomValidity('Please select the number of hour(s) for your timer.');
    }
})

minutes.addEventListener('invalid', (e) => {
    if (e.target.validity.valueMissing) {
        e.target.setCustomValidity('Please select the number of minute(s) for your timer.');
    }
})

seconds.addEventListener('invalid', (e) => {
    if (e.target.validity.valueMissing) {
        e.target.setCustomValidity('Please select the number of second(s) for your timer.');
    }
})

timerName.addEventListener('invalid', (e) => {
    if (e.target.validity.valueMissing) {
        e.target.setCustomValidity('Please enter a name for your timer.');
    }
})


hours.addEventListener('change', (e) => {
    e.target.setCustomValidity('');
    hoursVal = hours.options[hours.selectedIndex].value;
})

minutes.addEventListener('change', (e) => {
    e.target.setCustomValidity('');
    minsVal = minutes.options[minutes.selectedIndex].value;
})

seconds.addEventListener('change', (e) => {
    e.target.setCustomValidity('');
    secsVal = seconds.options[seconds.selectedIndex].value;
})

timerName.addEventListener('change', (e) => {
    e.target.setCustomValidity('');
})


generate_form.addEventListener('submit', (e) => {
    if (document.getElementById('selected').innerHTML == ''){
        e.preventDefault();
        alert("Please select a playlist source using the Select Source button.");
        console.log("No source selected.");
    }
    if(hoursVal == 0 && minsVal == 0 && secsVal == 0){
        e.preventDefault();
        alert("Please specify a timer length that is above zero hours, zero minutes, and zero seconds.");
        console.log("Length of timer is 0:00:00.");
    }
})