const express = require('express');

const { fetchprice } = require('./app');

const app = express();

app.get('/price/:set/:id', function(req,res) {

    console.log(`url => ${req.originalUrl}`);
    let value = req.get('if-none-match');
    console.log(`if-none-match => ${value}`);
    if('foo' === value) {
	return res.status(304).end()
    }
    else {
    
	res.append('cache-control','max-age=3600, must-revalidate, public');
	res.append('etag','foo');
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
    }
})

app.listen(8080);

