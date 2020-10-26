// pages/myQuestionsReply/myQuestionsReply.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textAutosize: {
      minHeight: 90
    },
    message: "",
    fileList: [], //上传图片数组
  },

  //输入框内容
  onChange(event) {
    this.setData({
      message: event.detail
    })
  },

  //上传图片
  afterRead(event) {
    let that = this
    const file = event.detail.file;
    console.log(file)

    wx.uploadFile({
      url: 'https://www.zjtaoke.cn/Trains2/uploadFile',
      filePath: file.path,
      name: 'file',
      formData: {},
      success(res) {
        console.log(res)
        // 上传完成需要更新 fileList
        let data = res.data
        console.log(data)
        const { fileList = [] } = that.data;
        fileList.push({ url: data });
        that.setData({ fileList });
        console.log(that.data.fileList)
      },
      fail(error) {
      }
    });

  },

  //删除图片
  deleteImg(event) {
    console.log(event.detail.index)
    let index = event.detail.index
    let zongList = this.data.fileList
    zongList.splice(index, 1)
    console.log(zongList)
    this.setData({ fileList: zongList });
  },

  //发表按钮事件
  publishBtn() {
    console.log("详情总数据", this.data.allLists)
    console.log("用户数据", this.data.userInfoData)
    console.log("评论数据", this.data.item)
    console.log("内容", this.data.message)
    console.log("图片", this.data.fileList)
    let item = this.data.item
    let fileList = this.data.fileList
    let imgLists = ""
    fileList.map(item => {
      console.log(item)
      imgLists += item.url + ","
    })
    if (imgLists.length > 0) {
      imgLists = imgLists.substr(0, imgLists.length - 1);
    }
    console.log(imgLists)
    if (this.data.message == '' && this.data.fileList == '') {
      wx.showToast({
        title: "请输入回复内容或者图片",
        icon: 'none',
        duration: 1000
      });
      return
    }
    let dataLists = {
      circle_id: this.data.allLists.id,
      p_id:item.id,
      wechat_id:this.data.userInfoData.id,
      yg_id:item.yg_id,
      wordse:this.data.message,
      img: imgLists,
    }
    let jiamiData = {
      circle_id: this.data.allLists.id,
      p_id:item.id,
      wechat_id:this.data.userInfoData.id,
      yg_id:item.yg_id,
      wordse:this.data.message,
      img: imgLists,
    }
    Service.reply(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        wx.navigateBack({
          delta: 1
        })
        wx.showToast({
          title: "回复成功",
          icon: 'none',
          duration: 1000
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let item = JSON.parse(decodeURIComponent(options.item))
    let userInfoData = JSON.parse(decodeURIComponent(options.userInfoData))
    let allLists = JSON.parse(decodeURIComponent(options.allLists))
    that.setData({
      item: item,
      userInfoData: userInfoData,
      allLists:allLists
    })
    console.log(that.data.item)
    console.log(that.data.userInfoData)
    console.log(that.data.allLists)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})