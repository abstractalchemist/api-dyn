const express = require('express');

const { fetchprice } = require('./app');

const app = express();

app.get('/price/:set/:id', function(req,res) {
    let priceFetcher = fetchprice(req.params.set + "/" + req.params.id);
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

