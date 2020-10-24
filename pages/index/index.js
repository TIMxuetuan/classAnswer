//index.js
//获取应用实例
const app = getApp()
const Service = require("../../Services/services")
Page({
  data: {
    isThreeType: 2,//1：代表用户进行手机号授权， 2：代表用户信息授权， 0：代表已登录
    isSelectSubject: false, //true代表未选择项目， false代表选择过项目
    switchShow: false, //控制科目弹出层
    userInfoData: '', //用户数据
    //科目选择属性
    mainActiveIndex: 0,
    activeId: null,
    items: [],
    fileList: [],
    phoneModuleShow: false, //控制提示手机号授权弹窗
  },

  //点击选择科目--出来弹窗
  switchCourse() {
    this.setData({
      switchShow: true
    })
  },

  //关闭选择科目弹窗
  onClose() {
    this.setData({ switchShow: false });
  },

  //科目弹窗--点击一级菜单
  onClickNav(e) {
    console.log("一级菜单", e.detail)
    this.setData({
      mainActiveIndex: e.detail.index || 0,
    });
  },

  //科目弹窗--点击二级菜单
  onClickItem(e) {
    console.log("二级菜单", e.detail)
    const activeId = this.data.activeId === e.detail.id ? null : e.detail.id;
    this.setData({ activeId });
    let allLists = this.data.items
    let newproject = {}
    for (let index = 0; index < allLists.length; index++) {
      var item = allLists[index]
      if (e.detail.p_id == item.id) {
        console.log(item)
        newproject["fuData"] = item
        var fuData = newproject["fuData"]
        fuData["children"] = e.detail
        fuData["index"] = index
        this.setData({
          newproject: newproject,
          isSelectSubject: true,
          switchShow: false
        });
        wx.setStorage({
          key: "newproject",
          data: newproject
        })

      }

    }
  },

  //跳转答疑解惑页面
  goToQuestion() {
    var that = this
    console.log("跳转答疑解惑页面")
    wx.getStorage({
      key: 'userInfoData',
      success(res) {
        console.log(res)
        that.setData({
          userInfoData: res.data,
        })
      }
    })
    if (that.data.userInfoData == '') {
      wx.showToast({
        title: "请进行登录",
        icon: 'none',
        duration: 1000
      });
      return
    } else {
      wx.navigateTo({
        url: "/pages/questionAnswer/questionAnswer",
      })
    }

  },

  //点击注册按钮--手机号授权弹窗
  getPhoneNumber(e) {
    console.log("注册", e)
    console.log("用户id", this.data.wechat_id)
    let dataLists = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      wechat_id: this.data.wechat_id
    }
    let jiamiData = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      wechat_id: this.data.wechat_id
    }
    Service.number(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.setData({
          user_phone: res.data,
          phoneModuleShow: false,
        })
        // wx.setStorage({
        //   key: "user_phone",
        //   data: res.data
        // })
      }
    })
  },


  //取消手机号提示弹窗
  phoneModuleOff() {
    this.setData({
      phoneModuleShow: false
    })
  },

  onLoad: function () {
    // this.judgeUserInfo()

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'userInfoData',
      success(res) {
        that.setData({
          userInfoData: res.data,
          isThreeType: 0
        })
        console.log(that.data.userInfoData)
        that.getParentAjax()
        wx.getStorage({
          key: 'newproject',
          success(res) {
            that.setData({
              newproject: res.data,
              isSelectSubject: true,
              activeId: res.data.fuData.children.id,
              mainActiveIndex: res.data.fuData.index,
            })
          }
        })
      }
    })
  },


  //判断用户信息是否获取
  judgeUserInfo() {
    wx.login({
      success: res => {
        console.log(res)
        let code = res.code
        wx.getUserInfo({
          success: res => {
            console.log(res)
            let userInfo = res.userInfo
            let dataLists = {
              code: code,
            }
            let jiamiData = {
              code: code,
            }
            Service.userIf(dataLists, jiamiData).then(res => {
              if (res.event == 100) {
                console.log("aaa", res)
                this.setData({
                  userInfoData: res.data,
                  wechat_id: res.data.id,
                  isThreeType: 0
                })
                wx.setStorage({
                  key: "userInfoData",
                  data: res.data
                })
                this.reserveUserInfo(res.data, userInfo)
                if (res.data.mobile == '') {
                  this.setData({
                    phoneModuleShow: true
                  })
                }
              }
              // wx.setStorage({
              //   key: "cache_key",
              //   data: res.data.cache_key
              // })
            })
          }
        })
      }
    })
  },

  //存储微信用户信息
  reserveUserInfo(data, userInfo) {
    console.log(data, userInfo)
    let dataLists = {
      wechat_id: data.id,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
    }
    let jiamiData = {
      wechat_id: data.id,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
    }
    Service.userxx(dataLists, jiamiData).then(res => {
      console.log("userxx", res)
    })
  },

  //获取项目类别
  getParentAjax() {
    let dataLists = {
    }
    let jiamiData = {
    }
    Service.parentAjax(dataLists, jiamiData).then(res => {
      if (res.event == 100) {
        this.manageParent(res.data)
      }
    })
  },

  //对项目数据进行处理
  manageParent(list) {
    console.log(list)
    let obj = list.map(function (item) {
      let cities = item.cities
      let objChild = cities.map(function (items) {
        return {
          "id": items.id,
          "text": items.lb,
          "p_id": items.p_id,
        }
      })
      return {
        "id": item.id,
        "text": item.lb,
        "p_id": item.p_id,
        "children": objChild
      }
    })
    this.setData({
      items: obj
    })
  },

  //跳转历史记录页面
  goToHistory() {
    var that = this
    wx.getStorage({
      key: 'userInfoData',
      success(res) {
        console.log(res)
        that.setData({
          userInfoData: res.data,
        })
      }
    })
    if (that.data.userInfoData == '') {
      wx.showToast({
        title: "请进行登录",
        icon: 'none',
        duration: 1000
      });
      return
    } else {
      wx.navigateTo({
        url: "/pages/answerRecord/answerRecord",
      })
    }
  },
})
