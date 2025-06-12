"use strict";
const common_vendor = require("../common/vendor.js");
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      timeout: 1e4,
      // 可选：统一设置超时时间
      ...options,
      success: (res) => {
        var _a;
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          common_vendor.index.showToast({
            title: ((_a = res.data) == null ? void 0 : _a.message) || "服务器错误",
            icon: "none",
            duration: 2e3
          });
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "网络异常，请稍后重试",
          icon: "none",
          duration: 2e3
        });
        reject(err);
      }
    });
  });
};
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/api.js.map
