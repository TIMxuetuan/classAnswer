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
    switchShow: false,
    textAutosize: {
      minHeight: 90
    },
    message: "",
    fileList: [], //上传图片数组
    isModuleShow: false,
  },

  //轮播图点击预览
  imgYu: function (event) {
    var that = this;
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    console.log(src)
    console.log(imgList)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
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
    if (this.data.allLists.state == 2) {
      wx.showToast({
        title: "问题已解决",
        icon: 'none',
        duration: 1000
      });
      return
    }
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
        wx.showToast({
          title: "反馈成功",
          icon: 'none',
          duration: 1000
        });
      }
    })
  },

  //点击回复事件
  replyClick(e) {
    if (this.data.allLists.state == 2) {
      wx.showToast({
        title: "问题已解决",
        icon: 'none',
        duration: 1000
      });
      return
    }
    console.log(e.currentTarget.dataset.item)
    let item = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.item))
    let userInfoData = encodeURIComponent(JSON.stringify(this.data.userInfoData))
    let allLists = encodeURIComponent(JSON.stringify(this.data.allLists))
    wx.navigateTo({
      url: '/pages/myQuestionsReply/myQuestionsReply?item=' + item + '&userInfoData=' + userInfoData + '&allLists=' + allLists,
    })
  },

  //关闭选择科目弹窗
  onClose() {
    this.setData({ switchShow: false });
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

  //投诉事件
  complaintClick(e) {
    if (this.data.allLists.state == 2) {
      wx.showToast({
        title: "问题已解决",
        icon: 'none',
        duration: 1000
      });
      return
    }
    let item = e.currentTarget.dataset.item
    console.log(item)
    let dataLists = {
      p_id: item.id,
      complain: 1
    }
    let jiamiData = {
      p_id: item.id,
      complain: 1
    }
    Service.complain(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        this.getDetailsList() //获取详情页数据
        wx.showToast({
          title: "投诉成功",
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    console.log(options.id)
    var that = this
    that.setData({
      answerId: options.id
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
    var that = this
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