const config = require('../config');
const request = require('../utils/request');

const Services = {
  //判断用户信息是否获取
  getOpenId(data, jiamiData) {
    return request._post(`${config.api}/Zkbxcx/userIf`, data, jiamiData, 2)
  },

  //存储微信用户信息
  userxx(data, jiamiData) {
    return request._post(`${config.api}/Zkbxcx/userxx`, data, jiamiData, 2)
  },

  //获取手机号
  number(data, jiamiData) {
    return request._post(`${config.api}/Zkbxcx/number`, data, jiamiData, 2)
  },
}

module.exports = Services