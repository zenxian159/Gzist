"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const openid = common_vendor.ref("");
    const chatList = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo && userInfo.openid) {
        openid.value = userInfo.openid;
        getChatList();
      }
    });
    const getChatList = () => {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/conversations/${openid.value}`,
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/message/message.vue:44", res.data);
          chatList.value = res.data.chatList;
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "加载失败",
            icon: "none"
          });
        }
      });
    };
    const goToChat = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/mall/chat/chat?trade_id=${item.trade_id}&buyer_id=${item.buyer_id}&seller_id=${item.seller_id}`
      });
    };
    const onLongPress = (index) => {
      const trade_id = chatList.value[index].trade_id;
      common_vendor.index.showActionSheet({
        itemList: ["删除该聊天"],
        success: (res) => {
          if (res.tapIndex === 0) {
            deleteChat(trade_id, index);
          }
        }
      });
    };
    const deleteChat = (trade_id, index) => {
      const userId = common_vendor.index.getStorageSync("userInfo").openid;
      common_vendor.index.showModal({
        title: "确认删除",
        content: "是否确认删除该聊天记录？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: `${utils_config.config.baseURL}/chat/${trade_id}/${userId}`,
              method: "DELETE",
              success: () => {
                chatList.value.splice(index, 1);
                common_vendor.index.showToast({
                  title: "已删除"
                });
              },
              fail: () => {
                common_vendor.index.showToast({
                  title: "删除失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(chatList.value, (item, index, i0) => {
          return {
            a: item.other_avatar,
            b: common_vendor.t(item.other_nickname),
            c: common_vendor.t(item.last_message),
            d: common_vendor.t(item.timestamp),
            e: item.trade_id,
            f: common_vendor.o(($event) => goToChat(item), item.trade_id),
            g: common_vendor.o(($event) => onLongPress(index), item.trade_id)
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
