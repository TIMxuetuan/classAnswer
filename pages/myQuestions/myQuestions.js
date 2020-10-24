// pages/myQuestions/myQuestions.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerId: '', //答疑id
    userInfoData: '', //用户数据
    allLists: [],
  },

  //获取详情页数据
  getDetailsList() {
    let dataLists = {
      wechat_id: this.data.userInfoData.id,
      id: this.data.answerId
    }
    let jiamiData = {
      wechat_id: this.data.userInfoData.id,
      id: this.data.answerId
    }
    Service.circleDetails(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.setData({
          allLists: res.list
        })
      }
    })
  },

  //去解决--页脚两个
  solveQuestion(e) {
    console.log(this.data.allLists)
    let type = e.currentTarget.dataset.type
    let dataLists = {
      circle_id: this.data.allLists.id,
      solve: type
    }
    let jiamiData = {
      circle_id: this.data.allLists.id,
      solve: type
    }
    Service.solve(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.getDetailsList()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    var that = this
    that.setData({
      answerId: options.id
    })
    wx.getStorage({
      key: 'userInfoData',
      success(res) {
        that.setData({
          userInfoData: res.data
        })
        that.getDetailsList() //获取详情页数据
      }
    })
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