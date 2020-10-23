//app.js
const Service = require("./Services/services")

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          //跳首页
          // wx.switchTab({
          //   url: '/pages/index/index'
          // })
          // 已经授权，可以直接调用 登录
          wx.login({
            success: res => {
              console.log(res)
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              let code = res.code
              this.globalData.code = res.code
              wx.getUserInfo({
                success: res => {
                  let dataLists = {
                    code: code,
                  }
                  let jiamiData = {
                    code: code,
                  }
                  Service.getOpenId(dataLists, jiamiData).then(res => {
                    console.log("aaa",res)
                    wx.setStorage({
                      key: "cache_key",
                      data: res.data.cache_key
                    })
                  })
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo
                 
                }
              })
            }
          })

        } else {
          //跳选择项目
          console.log("跳选择项目")
          // wx.reLaunch({
          //   url: '/pages/selectStudyItem/selectStudyItem'
          // })
        }
      },
      fail: error => {
        console.log(error)
       }
    })

  },
  globalData: {
    userInfo: null
  }
})