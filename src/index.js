const express = require('express');
const cluster = require('cluster');
const { fetchprice } = require('./app');

const processes = 2;
const app = express();

if(cluster.isMaster) {
    console.log(`Master running on ${process.pid}`);
    for(let i = 0; i < processes; ++i) {
	cluster.fork();
    }

    cluster.on('exit', (worker,code,signal) => {
	console.log(`worker ${worker.process.pid} died`);
    })
}
else {

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
		err => {
		    console.log(err);
		    res.status(404).end();
		},
		_ => {
		})
	}
    })

    app.listen(8080);

    console.log(`Worker ${process.pid} started`);
}
