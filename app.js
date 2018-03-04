//app.js
const user = require('module/user.js')
const remoteService = require('service/service.js')

App({
  config: {
    host: 'https://www.zqdnstanley.cn'
  },
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        console.log('check the new:' + res.code);
        this.globalData.code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log('userInfo' + JSON.stringify(res));
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.registerUser();
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              this.registerUser();
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  registerUser: function () {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        this.globalData.userInfo.code = this.globalData.code;
        let userInfo = user.createUserInfo(this.globalData.userInfo);
        let globalDataUser = this.globalData.userInfo;
        console.log('userInfo' + JSON.stringify(this.globalData.userInfo));
        remoteService.post(userInfo, '/user/register', function (ret) {
          if (ret && ret.data && ret.data.data) {
            globalDataUser.userId = ret.data.data.userId;
          }
        });

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  }
})