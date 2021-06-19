// pages/questionAnswer/questionAnswer.js
const Service = require("../../Services/services")
const MD5 = require('../../utils/md5');

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
    cacheKey: '',
    switchShow: false, //控制科目弹出层
    //科目选择属性
    mainActiveIndex: 0,
    activeId: null,
    items: [],

    //双十一活动，
    isHuodong: false, //控制是否进行获取得分，每日次数够了，不在进行
    fenShow: false, //控制得分弹窗
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
    console.log("用户数据", this.data.userInfoData)
    console.log("科目数据", this.data.newproject)
    console.log("内容", this.data.message)
    console.log("图片", this.data.fileList)
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
        title: "请输入答疑内容或者上传图片",
        icon: 'none',
        duration: 1000
      });
      return
    }
    let dataLists = {
      wechat_id: this.data.userInfoData.id,
      lb_id: this.data.newproject.fuData.id,
      kmlb: this.data.newproject.fuData.children.id,
      wordse: this.data.message,
      img: imgLists,
    }
    let jiamiData = {
      wechat_id: this.data.userInfoData.id,
      lb_id: this.data.newproject.fuData.id,
      kmlb: this.data.newproject.fuData.children.id,
      wordse: this.data.message,
      img: imgLists,
    }
    Service.circle(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        wx.showToast({
          title: "发表成功",
          icon: 'none',
          duration: 1000,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.navigateBack({
                delta: 1
              })
            }, 1000) //延迟时间
          },
        });


        //双十一活动，以后走这里
        // if (!this.data.isHuodong) {
        //   this.getIntegral()
        // }
      } else {
       
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        });
      }
    })
  },

  //双十一活动，中课帮）答疑获取积分
  getIntegral() {
    console.log(this.data.userInfoData)
    let dataLists = {
      mobile: this.data.userInfoData.mobile
    }
    let jiamiData = {
      mobile: this.data.userInfoData.mobile
    }
    Service.answerIntegral(dataLists, jiamiData).then(res => {
      console.log(res)
      if (res.event == 100) {
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none',
        //   duration: 1000
        // });
        this.setData({ fenShow: true });
      } else {

        // wx.setStorage({
        //   key: "isHuodong",
        //   data: true
        // })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  //关闭得分弹窗
  fenShowClose() {
    this.setData({ fenShow: false });
    wx.navigateBack({
      delta: 1
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getParentAjax()  //获取项目列表
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
    wx.getStorage({
      key: 'userInfoData',
      success(res) {
        that.setData({
          userInfoData: res.data
        })
      }
    })
    // wx.getStorage({
    //   key: 'isHuodong',
    //   success(res) {
    //     that.setData({
    //       isHuodong: res.data
    //     })
    //   }
    // })
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