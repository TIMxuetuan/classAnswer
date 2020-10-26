// pages/answerRecord/answerRecord.js
const Service = require("../../Services/services")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 10,
    allLists: [],
    oldlists:[], //老数据
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
    wx.showLoading({
      title: '加载中...',
    })
    Service.circleHistory(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        //获取上次加载的数据
        var oldlists = this.data.oldlists;
        var newlists = oldlists.concat(res.list) //合并数据 res.data 你的数组数据
        this.setData({
          allLists: newlists,
          total: res.num,
        })
        console.log(this.data.allLists)
        wx.hideLoading();
      } else {
        wx.hideLoading();
      }
    })
  },

  //跳转我的问题页面 -- 详情页
  goToMyQuestion(e) {
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
    //console.log("加载更多")
    if (this.data.allLists.length < this.data.total) {
      var page = this.data.page
      page++
      this.setData({
        oldlists: this.data.allLists,
        page: page
      })
      this.getAnswerRecordList()
    } else {
      wx.showToast({
        title: '到底了',
        icon: 'none',
        duration: 2000
      });

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})