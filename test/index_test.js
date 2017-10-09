const app = require('../src/app');
const fs = require('fs');
const { Observable } = require('rx');
const { create } = Observable;
const { expect } = require('chai');

describe('price parse', function() {
    it('basic parse', function(done) {
	let price;
	create(observer => {
	    let buffer = [];
	    let read = fs.createReadStream('./test.html');
	    read.on('data', data => buffer.push(data))
	    read.on('end',
		    _ =>{
			observer.onNext(buffer.join(''));
		    	observer.onCompleted();
		    })
	    read.on('error', err => {
		observer.onError(err);
	    })
	})
	    .subscribe(
		data => {
		    price = app.getprice(data);
		},
		_ => {
		},
		_ => {
		    expect(price).to.equal('437.50');
		    done();
		})
    })
})
       
