const apiUrl = 'https://www.zqdnstanley.cn';
const header = {
  'content-type': 'application/json',
  Authorization: 'Basic YWRtaW46YWRtaW4='
}

function getRequest(data,path,callback) {
  request('GET', data, path, callback);
}

function post(data,path,callback){
  request('POST',data,path,callback);
}

function request(method,data,path,callback){
  let url = apiUrl + path;
  console.log(url);
  wx.request({
    data: data,
    url: url,
    method: method,
    header: header,
    success: function (res) {
      callback(res);
    }
  })
}

module.exports = {
  post: post,
  getRequest: getRequest
}