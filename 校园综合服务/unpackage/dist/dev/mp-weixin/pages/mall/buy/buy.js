"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "buy",
  setup(__props) {
    const product = common_vendor.ref({});
    const firstImage = common_vendor.ref("");
    const openid = common_vendor.ref("");
    common_vendor.onMounted(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo && userInfo.openid) {
        openid.value = userInfo.openid;
      }
      common_vendor.index.$on("sendProductData", (data) => {
        const fileList = data.item.fileList || [];
        const firstImageFile = fileList.find((file) => file.type === "image");
        common_vendor.index.__f__("log", "at pages/mall/buy/buy.vue:40", "接收到的数据!!!：", data.item);
        product.value = data.item;
        firstImage.value = firstImageFile ? firstImageFile.url : "/static/image/video-placeholder.png";
      });
    });
    const confirmPurchase = () => {
      common_vendor.index.showModal({
        title: "请核对价格",
        content: "确定价格无误后需进行线下支付",
        confirmText: "确认购买",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: `${utils_config.config.baseURL}/trades/${product.value.trade_id}/buyer`,
              method: "PUT",
              data: {
                buyer_id: openid.value,
                status: "交易中"
              },
              success: () => {
                common_vendor.index.showToast({
                  title: "购买成功",
                  icon: "success"
                });
                setTimeout(() => {
                  common_vendor.index.reLaunch({
                    url: "/pages/mall/mall"
                  });
                }, 1e3);
              },
              fail: () => {
                common_vendor.index.showToast({
                  title: "下单失败",
                  icon: "none"
                });
              }
            });
          } else {
            common_vendor.index.showToast({
              title: "已取消",
              icon: "none"
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: firstImage.value,
        b: common_vendor.t(product.value.title),
        c: common_vendor.t(product.value.description),
        d: common_vendor.t(product.value.price),
        e: common_vendor.o(confirmPurchase)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mall/buy/buy.js.map
