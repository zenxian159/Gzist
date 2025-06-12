"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const trade_id = common_vendor.ref("");
    common_vendor.ref("");
    common_vendor.ref("");
    const user_type = common_vendor.ref("");
    const message = common_vendor.ref("");
    const chatMessages = common_vendor.ref([]);
    const openid = common_vendor.ref("");
    const scrollToView = common_vendor.ref("");
    const product = common_vendor.ref({});
    const firstImage = common_vendor.ref("");
    const isSeller = common_vendor.ref(false);
    const buyerAvatar = common_vendor.ref("");
    const sellerAvatar = common_vendor.ref("");
    const buyer_id = common_vendor.ref("");
    const seller_id = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo && userInfo.openid) {
        openid.value = userInfo.openid;
      }
      if (options) {
        trade_id.value = options.trade_id;
        buyer_id.value = options.buyer_id;
        seller_id.value = options.seller_id;
        isSeller.value = openid.value === options.seller_id;
        user_type.value = options.buyer_id === openid.value ? "buyer" : "seller";
      }
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/userInfo`,
        method: "GET",
        data: {
          buyer_id: buyer_id.value,
          seller_id: seller_id.value
        },
        success: (res) => {
          buyerAvatar.value = res.data.buyerAvatar;
          sellerAvatar.value = res.data.sellerAvatar;
        }
      });
      getChatRecords();
      getProductInfo();
    });
    const getProductInfo = () => {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/trades/${trade_id.value}`,
        method: "GET",
        success: (res) => {
          const fileList = res.data.fileList || [];
          const firstImageFile = fileList.find((file) => file.type === "image");
          common_vendor.index.__f__("log", "at pages/mall/chat/chat.vue:116", res.data);
          product.value = res.data;
          firstImage.value = firstImageFile ? firstImageFile.url : "/static/video-placeholder.png";
        }
      });
    };
    const getChatRecords = () => {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/chat/${trade_id.value}`,
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/mall/chat/chat.vue:131", res);
          if (res.data.messages) {
            chatMessages.value = res.data.messages;
            setTimeout(() => {
              scrollToView.value = "bottomAnchor";
            }, 100);
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "获取失败",
            icon: "none"
          });
        }
      });
    };
    const sendMessage = () => {
      if (!message.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入消息",
          icon: "none"
        });
        return;
      }
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/chat`,
        method: "POST",
        data: {
          trade_id: trade_id.value,
          buyer_id: buyer_id.value,
          seller_id: seller_id.value,
          sender_id: openid.value,
          message: message.value,
          user_type: user_type.value
        },
        success: () => {
          message.value = "";
          getChatRecords();
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "发送失败",
            icon: "none"
          });
        }
      });
    };
    const editProduct = () => {
      common_vendor.index.navigateTo({
        url: "/pages/mall/post/post",
        success: function(res) {
          common_vendor.index.$emit("sendProductData", {
            item: product.value
          });
        }
      });
    };
    const buyProduct = () => {
      common_vendor.index.navigateTo({
        url: "/pages/mall/buy/buy",
        success: function(res) {
          common_vendor.index.$emit("sendProductData", {
            item: product.value
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: product.value
      }, product.value ? common_vendor.e({
        b: firstImage.value,
        c: common_vendor.t(product.value.title),
        d: common_vendor.t(product.value.price),
        e: product.value.status === "可交易"
      }, product.value.status === "可交易" ? common_vendor.e({
        f: isSeller.value
      }, isSeller.value ? {
        g: common_vendor.o(editProduct)
      } : {
        h: common_vendor.o(buyProduct)
      }) : {
        i: common_vendor.t(product.value.status)
      }) : {}, {
        j: common_vendor.f(chatMessages.value, (item, index, i0) => {
          return {
            a: item.sender_id === buyer_id.value ? buyerAvatar.value : sellerAvatar.value,
            b: common_vendor.t(item.message),
            c: index,
            d: common_vendor.n(item.sender_id === openid.value ? "me" : "other")
          };
        }),
        k: scrollToView.value,
        l: common_vendor.o(sendMessage),
        m: message.value,
        n: common_vendor.o(($event) => message.value = $event.detail.value),
        o: common_vendor.o(sendMessage)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mall/chat/chat.js.map
