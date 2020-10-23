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
    fileList: [
      {
        path: "http://tmp/wx1f74ec95280b2c1d.o6zAJsyv-htUc4lUAs1zAmI4SfKw.AuQ03qB0ZjoV3f0b3de3ef806e151bad3b9d51ef2163.png",
        size: 2679,
        url: "https://vod.zhongjianedu.com/image/default/89F055FDCEB64137AE4A885A8816ECBE-6-2.png"
      },
      {
        path: "http://tmp/wx1f74ec95280b2c1d.o6zAJsyv-htUc4lUAs1zAmI4SfKw.AuQ03qB0ZjoV3f0b3de3ef806e151bad3b9d51ef2163.png",
        size: 2679,
        url: "https://vod.zhongjianedu.com/image/default/7DD2FA10E5D548A3B17E5C50E4C2E9A1-6-2.png"
      },
      {
        path: "http://tmp/wx1f74ec95280b2c1d.o6zAJsyv-htUc4lUAs1zAmI4SfKw.AuQ03qB0ZjoV3f0b3de3ef806e151bad3b9d51ef2163.png",
        size: 2679,
        url: "https://vod.zhongjianedu.com/image/default/BCFDB8CC989D45309A73BA3B70101089-6-2.png"
      }
    ], //上传图片数组
    cacheKey: '',
  },

  //输入框内容
  onChange(event) {
    console.log(event.detail);
  },

  //上传图片
  afterRead(event) {
    let that = this
    const file = event.detail.file;

    let jiamiData = {
      cache_key: that.data.cacheKey,
    }

    const suffix = "zhongjianedu";
    let timestamp = new Date().getTime();
    // 签名串
    var obj = {};
    obj["timestamp"] = timestamp;

    for (var key in jiamiData) {
      var reg = /\[(.+?)\]/;
      if (key.match(reg)) {
        obj[RegExp.$1] = jiamiData[key];
      } else {
        obj[key] = jiamiData[key];
      }
    }
    const reverse_key = Object.keys(obj).sort();
    let resource_code =
      reverse_key
        .reduce((rst, v) => (rst += `${v}=${obj[v]}&`), "")
        .slice(0, -1) + suffix;
    let sign = MD5.hexMD5(resource_code);

    wx.uploadFile({
      url: 'https://caigua.zhongjianedu.com/ztk.php/TkWeChatLogin/UpHeardImage',
      filePath: file.path,
      name: 'uploadfile',
      formData: {
        'cache_key': that.data.cacheKey,
        'timestamp': timestamp,
        'sign': sign,
      },
      success(res) {
        // 上传完成需要更新 fileList
        let data = JSON.parse(res.data)
        console.log(data)
        const { fileList = [] } = that.data;
        fileList.push({ ...file, url: data.user_pic });
        that.setData({ fileList });
        console.log(that.data.fileList)
      },
      fail(error) {
      }
    });

  },

  //删除图片
  deleteImg(event){
    console.log(event.detail.index)
    let index = event.detail.index
    let zongList = this.data.fileList
    zongList.splice(index, 1)
    console.log(zongList)
    this.setData({ fileList:zongList });
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
      key: 'cache_key',
      success(res) {
        that.setData({
          cacheKey: res.data
        })
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