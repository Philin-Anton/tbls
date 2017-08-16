'use strict';


function serialize( obj ) {
  return decodeURIComponent(
    '?'+Object.keys(obj)
    .reduce((a,k)=>{a.push(k+'='+encodeURIComponent(obj[k]));return a},[])
    .join('&')
  )
}

function onReadyStateChange(respons, reject) {
  return (e) => {
    if(e.target.readyState === XMLHttpRequest.DONE && e.target.status >= 200 && e.target.status <= 300 ) {
        return respons(JSON.parse(e.target.response));
    }
    if(e.target.readyState === XMLHttpRequest.DONE && e.target.status >= 400 && e.target.status < 600 ) {
        return reject(JSON.parse(e.target.response));
    }
  }
}

const ajax = {};
function request(method){
  return (url, params, callback) => {
    typeof params == 'function' && (callback = params);
    return new Promise ((respons, reject)=>{
      const xhr = new XMLHttpRequest();
      if(params && typeof params.query == 'object'){
        xhr.open(method, `${url}${serialize(params.query)}`, true);
      }else{
        xhr.open(method, url, true);
      }
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.onreadystatechange = callback || onReadyStateChange(respons, reject);
      if(params && typeof params.data == 'object'){
        const data = JSON.stringify(params.data);
        xhr.send(data);
      }else{
        xhr.send(null);
      }
    });
  }
}

['get', 'post', 'put', 'delete'].forEach((method)=>(
  ajax[method] = request(method)
))

export default ajax;