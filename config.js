let ipCodeType = 'production'; //production生产环境  development开发环境
let host_map={
  production: 'https://www.zjtaoke.cn',
  // production: 'https://caigua.zhongjianedu.com/ztk.php',
}

let host = host_map[ipCodeType];
let api=host;

let config = {
  appid: 'wx1f74ec95280b2c1d',
  api: api,
}

module.exports = config;