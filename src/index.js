const express = require('express');

const { fetchprice } = require('./app');

const app = express();

app.get('/price/:id', function(req,res) {
    let priceFetcher = fetchprice(req.params.id);
    priceFetcher.subscribe(
	price => {
	    res.status(200).end(price);
	},
	_ => {
	    res.send(404).end();
	},
	_ => {
	})
})

app.listen(8080);

