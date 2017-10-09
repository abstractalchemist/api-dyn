const { JSDOM } = require('jsdom');
const { Observable } = require('rx');
const https = require('https');
const { create,fromPromise } = Observable;

function getprice(data) {
    let dom = new JSDOM(data);
    let price = /[$]\s+(.+)/.exec(dom.window.document.querySelector('.price_color_thumb').textContent);
    return price[1];
}

function fetchprice(id) {
    let idimpl = encodeURIComponent(id);
    
    return fromPromise(new Promise( (resolve,reject) => {
	https.get('https://tcgrepublic.com/product/text_search.html?q=' + idimpl,
		  res => {
		      let buffer = [];
		      const { statusCode } = res;
		      if(statusCode === 200 || statusCode === 201) {
			  res.on('data', data => buffer.push(data))
			  res.on('end', _ => {
			      resolve(buffer.join(''));
			  })
			  
		      }
		      else
			  reject(statusCode);
		  })
    }))
	.map(getprice);
}

exports.getprice = getprice;
exports.fetchprice = fetchprice;
