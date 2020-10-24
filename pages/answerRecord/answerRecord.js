// pages/answerRecord/answerRecord.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 10,
    allLists:[]
  },

  //获得答疑历史记录
  getAnswerRecordList() {
    let dataLists = {
      wechat_id: this.data.userInfoData.id,
      page: this.data.page,
      size: this.data.size,
    }
    let jiamiData = {
      wechat_id: this.data.userInfoData.id,
      page: this.data.page,
      size: this.data.size,
    }
    Service.circleHistory(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.setData({
          allLists: res.list
        })
      }
    })
  },

  //跳转我的问题页面 -- 详情页
  goToMyQuestion(e){
    console.log(e.currentTarget.dataset.item)
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url: '/pages/myQuestions/myQuestions?id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    wx.getStorage({
      key: 'userInfoData',
      success(res) {
        that.setData({
          userInfoData: res.data
        })
        that.getAnswerRecordList() //获得答疑历史记录
      }
    })
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