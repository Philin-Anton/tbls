function onProgress(e) {
  var percentComplete = (e.position / e.totalSize)*100;
}

function onReadyStateChange(respons, reject) {
  return (e) => {
    if(e.target.readyState === XMLHttpRequest.DONE && ee.target.status >= 200 && e.target.status <= 300 ) {
        return respons();
    };
    if(e.target.readyState === XMLHttpRequest.DONE && e.target.status >= 400 && e.target.status < 600 ) {
        return reject();
    };
  }
}

const ajax = {};
function request(method){
  return (url, patams, callback) => {
    if(typeof params == 'function'){
      callback = params;
    }
    return new Promise ((respons, reject)=>{
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = callback || onReadyStateChange(respons, reject);
      xhr.open(method, url, true);
      if(patams && typeof patams.data == 'object'){
        xhr.send(patams.data);
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