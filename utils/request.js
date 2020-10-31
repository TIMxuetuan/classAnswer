const MD5 = require('./md5');

// let _promise = function (api) {
//   return (options, ...params) => {
//     return new Promise((resolve, reject) => {
//       api(Object.assign({}, options, {
//         success: resolve,
//         fail: reject
//       }), ...params);
//     });
//   }
// }

let ajax = function (obj) {
  let _success = obj.success;
  delete obj.success;
  obj.complete = function (res) {
    console.log("res", res)
    if (res.data.event == 100) {
      // wx.showToast({
      //   title: res.data.msg,
      //   icon: 'none',
      //   duration: 2000
      // });
    }
  }
  return new Promise((resolve, reject) => {
    wx.request(Object.assign({}, {
      success: function (response) {
        _success(response)
        resolve(response.data, response)
      },
      fail: function (err) {
        reject(err.errMsg, err)
      }
    }, obj));
  });
}

//进行加密
const getConfig = (isjson, params, jiamiData, level) => {
  const suffix = "zhongjianedu";
  // console.log(isjson, params, level, jiamiData)
  // 时间戳
  if (level === 1) {
    params = {
      encrypt: MD5(JSON.stringify(params))
    }; // 加密
  } else if (level === 2) {
    //注意：登陆时用户信息需要加密，所以拼接在签名中；后续接口参数不需要加密，就不需要拼接如签名
    let timestamp = new Date().getTime();
    // console.log("时间戳", timestamp)
    // 获取token
    let token = wx.getStorageSync("communityToken") || "";
    // 签名串
    var obj = {};

    obj["timestamp"] = timestamp;
    if (token != "") {
      obj["token"] = token || "";
    }

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
    console.log(resource_code)
    let sign = MD5.hexMD5(resource_code);
    // console.log("resource_code", resource_code);

    params["timestamp"] = timestamp;
    params["sign"] = sign;
  }

  return params;
};

let _get = function (url, obj, message = '') {
  wx.showNavigationBarLoading()
  if (!message && typeof message === "string") {
    wx.showLoading({
      title: message,
    })
  }

  return ajax({
    method: 'GET',
    header: {
      'cache-control': 'no-cache'
    },
    url: url,
    data: obj,
    dataType: 'json',
    success: function (response) {
      let res = response.data;
      if (res.title && typeof res.title != 'undefined') {
        wx.setNavigationBarTitle({
          title: res.title
        });
      }

      wx.hideNavigationBarLoading()
      if (!message && typeof message === "string") {
        wx.hideLoading()
      }
    }
  })
}

let _post = function (url, params, jiamiData, level, message = '') {
  // wx.showNavigationBarLoading();
  if (!message && typeof message === "string") {
    // wx.showLoading({
    //   title: message,
    // })
  }
  // let dataParams = getConfig(params, jiamiData)
  let dataParams = getConfig("false", params, jiamiData, level)
  // console.log(jiamiData)
  return ajax({
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    },
    url: url,
    data: dataParams,
    // processData: false,//不去处理发送的数据
    dataType: 'json',
    success: function (response) {
      let res = response.data;
      console.log("post", res)
      // wx.hideNavigationBarLoading()
      if (!message && typeof message === "string") {
        // wx.hideLoading()
      }
    }
  })
}

module.exports = {
  ajax: ajax,
  _get: _get,
  _post: _post,
}