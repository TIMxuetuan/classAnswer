//index.js
//获取应用实例
const app = getApp()
const Service = require("../../Services/services")
Page({
  data: {
    isThreeType: 2,//1：代表用户进行手机号授权， 2：代表用户信息授权， 0：代表已登录
    isSelectSubject: true, //true代表未选择项目， false代表选择过项目
    switchShow: false, //控制科目弹出层
    //科目选择属性
    mainActiveIndex: 0,
    activeId: null,
    items: [
      {
        text: '一级建造师',
        children: [
          {
            text: '管理',
            id: 1,
          },
          {
            text: '建造',
            id: 2,
          },
        ],
      },
      {
        text: '二级建造师',
        children: [
          {
            text: '造价',
            id: 1,
          },
          {
            text: '管理',
            id: 2,
          },
        ],
      },
      {
        text: '二级建造师',
        children: [
          {
            text: '造价',
            id: 1,
          },
          {
            text: '管理',
            id: 2,
          },
        ],
      },
    ],

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    fileList: [],
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

  //点击注册按钮
  getPhoneNumber() {
    console.log("注册")
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
  },

  afterRead(event) {
    const { file } = event.detail;

    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.path,
      name: 'file',
      // capture: "['album', 'camera']",
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  },

  //上传图片
  choice: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        var tempFilePaths = res.tempFilePaths
        that.setData({
          textHidden: true,
          image_photo: tempFilePaths,
          photoHidden: false
        })
      }
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },


  //跳转答疑解惑页面
  goToQuestion() {
    console.log("跳转答疑解惑页面")
    wx.navigateTo({
      url: "/pages/questionAnswer/questionAnswer",
    })
  },

  //如果用户绑定了，初次登录需要授权
  userInfoGetOpen() {
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        let dataLists = {
          code: code,
        }
        let jiamiData = {
          code: code,
        }
        Service.getOpenId(dataLists, jiamiData).then(res => {
          console.log(res)
          if (res.event == 100) {
            this.setData({
              isShowSelect: true,
              isTypeThree: 2,
              user_phone: res.data.userInfo.mobile
            })
          } else if (res.event == 106) {
            this.setData({
              isShowSelect: true,
              isTypeThree: 1
            })
          }
        })
      }
    })
  },

  onLoad: function () {
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
  },

  userLogin() {
    wx.login({
      success: res => {
        console.log(res)
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
            Service.getOpenId(dataLists, jiamiData).then(res => {
              if (res.event == 100) {
                console.log("aaa", res)
                this.setData({
                  userInfoData: res.data,
                  isThreeType: 0
                })
                this.reserveUserInfo(res.data, userInfo)
                if(res.mobile == ''){
                  
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

  //获取手机号信息
  getNumberList(){

  }
})
