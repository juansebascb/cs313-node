const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const TYPE_LETTERS_STAMPED = 'letters_stamped';
const TYPE_LETTERS_METERED = 'letters_metered';
const TYPE_LARGE_ENVELOPES = 'large_envelopes';
const TYPE_PACKAGE_SERVICE = 'package_service';
var lettersStampedPrices = {
    description: 'Letters (Stamped)',
    prices: [
        {weight: 1, price: 0.55},
        {weight: 2, price: 0.7},
        {weight: 3, price: 0.85},
        {weight: 3.5, price: 1.0}
    ]
};
var lettersMeteredPrices = {
    description: 'Letters (Metered)',
    prices: [
        {weight: 1, price: 0.5},
        {weight: 2, price: 0.65},
        {weight: 3, price: 0.80},
        {weight: 3.5, price: 0.95}
    ]
};
var largeEnvelopesPrices = {
    description: 'Large Envelopes (Flats)',
    prices: [
        {weight: 1, price: 1.00},
        {weight: 2, price: 1.15},
        {weight: 3, price: 1.3},
        {weight: 4, price: 1.45},
        {weight: 5, price: 1.6},
        {weight: 6, price: 1.75},
        {weight: 7, price: 1.9},
        {weight: 8, price: 2.05},
        {weight: 9, price: 2.2},
        {weight: 10, price: 2.35},
        {weight: 11, price: 2.5},
        {weight: 12, price: 2.65},
        {weight: 13, price: 2.80}
    ]
};
var packageServicePrices = {
    description: 'First-Class Package Service—Retail',
    prices: [
        {weight: 1, price: 3.6},
        {weight: 2, price: 3.6},
        {weight: 3, price: 3.6},
        {weight: 4, price: 3.6},
        {weight: 5, price: 3.78},
        {weight: 6, price: 3.96},
        {weight: 7, price: 4.14},
        {weight: 8, price: 4.32},
        {weight: 9, price: 4.5},
        {weight: 10, price: 4.68},
        {weight: 11, price: 4.86},
        {weight: 12, price: 5.04},
        {weight: 13, price: 5.22}
    ]
};

// This function returns the prices of the mail based on the type provided
function getTypePrices(type) {
    switch (type) {
        case TYPE_LETTERS_STAMPED: 
            return lettersStampedPrices;
        case TYPE_LETTERS_METERED: 
            return lettersMeteredPrices;
        case TYPE_LARGE_ENVELOPES: 
            return largeEnvelopesPrices;
        case TYPE_PACKAGE_SERVICE: 
            return packageServicePrices;
        default: throw new Error('Type not found.');
    }
}

// This function returns the price based on the given weight
function calculatePrice(prices, weight) {
    for(i = 0; i < prices.length; i++) {
        var r = prices[i];
        if (weight <= r.weight) {
            return r.price;
        }
    }
    return prices[prices.length - 1].price;
}

// This function processes the request and returns the appropriate description and price based on the given type
function processRequest(p) {
    var data = getTypePrices(p.type);
    p.description = data.description;
    p.price = calculatePrice(data.prices, p.weight);
}

app.get('/getPrice', function (req, res) {
    res.redirect('/');
});
app.post('/getPrice', function (req, res) {
    var params = {
        type: req.body.type || '',
        weight: parseFloat(req.body.weight) || 0
    };
    processRequest(params);
    res.render('results.ejs', params);
});
app.post('/api/getPrice', function (req, res) {
    var params = {
        type: req.body.type || '',
        weight: parseFloat(req.body.weight) || 0
    };
    processRequest(params);
    res.json(params);
});
app.get('/api/getPrices', function (req, res) {
    var data = getTypePrices(req.query.type);
    res.json(data);
});

module.exports = { app: app };