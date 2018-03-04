const user = {
  "code" : "code",
  "nickname": "咸鱼",
  "gender": "M",
  "city": "Shanghai",
  "province": "Shanghai",
  "country": "China",
  "avatarUrl": "dfdfd",
  "unionId": "dfdfdfdfd",
  "gameId": 1,//1-华容道 2-一眼识人
  "channel": 1,//1-Recommend 2-Other
  "rcmndOpenId": "openId02",
  "authUserInfo": 1,//1-enable 0-disable
  "authUserLocation": 0,
  "authAddress": 0,
  "authInvoiceTitle": 0,
  "authWeRun": 0,
  "authRecord": 0,
  "authWritePhotosAlbum": 0,
  "authCamera":0
}

function createUserInfo(user){
  return {
    "code": user.code || '123',
    "nickname": user.nickName,
    "gender": user.gender,
    "city": user.city,
    "province": user.province,
    "country": user.country,
    "avatarUrl": user.avatarUrl,
    "unionId": "dfdfdfdfd",
    "gameId": 1,//1-华容道 2-一眼识人
    "channel": 2,//1-Recommend 2-Other
    "rcmndOpenId": "",
    "authUserInfo": 1,//1-enable 0-disable
    "authUserLocation": 0,
    "authAddress": 0,
    "authInvoiceTitle": 0,
    "authWeRun": 0,
    "authRecord": 0,
    "authWritePhotosAlbum": 0,
    "authCamera": 0
  }
}

module.exports = {
  createUserInfo: createUserInfo
}