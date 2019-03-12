function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function loadEstimatedPrice() {
    var weight = $('#weight').val();
    if (!isNumeric(weight) || weight <= 0) {
        $('#estimated').empty();
        return;
    }
    var formData = new FormData(document.querySelector("form"));
    var params = {};
    formData.forEach(function (value, key) {
        params[key] = value;
    });
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var estimated = $('#estimated');
            estimated.text('Estimated Postage: $' + data.price.toFixed(2));
        }
    };
    xmlhttp.open("POST", "./api/getPrice");
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(params));
}

function validateForm() {
    $('#errors').empty();
    var weight = $('#weight').val();
    var errorMessage = '';
    if (!isNumeric(weight) || weight <= 0) errorMessage = 'Weight must be a number and greater than 0.';
    if (errorMessage === '') return true;
    $('#errors').append('<div class="alert alert-warning">' + errorMessage + '</div>');
    return false;
}