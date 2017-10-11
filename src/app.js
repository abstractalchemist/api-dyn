const { JSDOM } = require('jsdom');
const { Observable } = require('rx');
const https = require('https');
const { create,fromPromise,just } = Observable;
const { URL } = require('url');

function getprice(data) {
    let dom = new JSDOM(data);
    let price = /[$]\s+(.+)/.exec(dom.window.document.querySelector('.price_color_thumb').textContent);
    return price[1];
}

let validateRe = /must-validate/;
let publicRe = /public/;
let ageRe = /max-age=([0-9])+/;
let cache = [];

function fetchprice(id) {
    let idimpl = encodeURIComponent(id);
    
    let obj = cache.find( ({ id:i }) => i === id);
    if(obj)
	return just(obj.data);
    return fromPromise(new Promise( (resolve,reject) => {
	let url = new URL('https://tcgrepublic.com/product/text_search.html?q=' + idimpl);
	console.log(url.toString());
	https.get(url,
		  res => {
		      let buffer = [];
		      const { statusCode } = res;
		      if(statusCode === 200 || statusCode === 201) {
			  res.on('data', data => buffer.push(data))
			  res.on('end', _ => {

			      // cache control
			      let control = res.headers['cache-control'];
			      console.log('cache control headers: ' + control);
			      let etag = res.headers['etag'];

			      cacheObj = {id};

			      // check if public cache
			      if(publicRe.test(control)) {
				  console.log("cache control found for public");

				  // schedule an expiry
				  let age = ageRe.exec(control);
				  if(age.length > 0) {
				      console.log("age found, " + age[1]);
				      age = age[1];
				      cache.push({id,etag});
				      setTimeout( (_ => {
					  return i => {
					      cache = cache.filter( ({id}) => ! (i == id) );
					  }
				      })(), parseInt(age) * 1000)
				  }
			      }
			      if(validateRe.test(control)) {

				  
				  if(etag) {
				      // only implement etag;  must implement if match
				      console.log("revalidate and etag found");
				      cacheObj.etag = etag;
				      
				  }
			      }
			      if(control) {
				  cacheObj.data = buffer.join('');
				  cache.push(cacheObj);
			      }
			      resolve(buffer.join(''));
			  })
			  
		      }
		      else if(statusCode == 304) {
		      }
		      else
			  reject(statusCode);
		  })
    }))
	.map(getprice);
}

exports.getprice = getprice;
exports.fetchprice = fetchprice;
