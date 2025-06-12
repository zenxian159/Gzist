"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const item = common_vendor.ref({});
    const mediaList = common_vendor.ref([]);
    const isFavorite = common_vendor.ref(false);
    const isOwner = common_vendor.ref(false);
    const openid = common_vendor.ref("");
    const formatTime = (time) => {
      const date = new Date(time);
      const offset = 8;
      date.setHours(date.getHours() + offset);
      return date.toISOString().replace("T", " ").substring(0, 16);
    };
    const getMediaItemStyle = (length, index) => {
      if (length === 1)
        return "width: 98%; height: auto;";
      if (length === 2)
        return "width: 48%;";
      if (length === 3)
        return index === 0 ? "width: 98%;" : "width: 48%;";
      if (length === 4)
        return "width: 48%;";
      if (length === 5)
        return index === 0 ? "width: 98%;" : "width: 48%;";
      if (length === 6) {
        if (index === 0)
          return "width: 98%;";
        if (index === 1 || index === 2)
          return "width: 48%;";
        return "width: 32%;";
      }
      return "";
    };
    function onReceive(data) {
      const raw = data && data.item ? data.item : data;
      raw.update_time = formatTime(raw.update_time);
      mediaList.value = raw.fileList || [];
      isOwner.value = raw.seller_id === openid.value;
      item.value = {
        ...raw
      };
      common_vendor.index.__f__("log", "at pages/mall/detail/detail.vue:98", "detail onReceive →", item.value);
    }
    common_vendor.onMounted(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo && userInfo.openid) {
        openid.value = userInfo.openid;
      }
      common_vendor.index.$on("sendProductData", onReceive);
      common_vendor.index.$on("product-updated", onReceive);
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("sendProductData", onReceive);
      common_vendor.index.$off("product-updated", onReceive);
    });
    const previewFile = (url) => {
      common_vendor.index.__f__("log", "at pages/mall/detail/detail.vue:119", "📷 预览图片:", url);
      common_vendor.index.previewImage({
        current: url,
        urls: [url],
        success: () => common_vendor.index.__f__("log", "at pages/mall/detail/detail.vue:123", "✅ 图片预览成功"),
        fail: (err) => common_vendor.index.__f__("error", "at pages/mall/detail/detail.vue:124", "❌ 图片预览失败:", err)
      });
    };
    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
      common_vendor.index.showToast({
        title: isFavorite.value ? "已收藏" : "取消收藏",
        icon: "success"
      });
    };
    const editProduct = () => {
      common_vendor.index.__f__("log", "at pages/mall/detail/detail.vue:139", 111);
      common_vendor.index.navigateTo({
        url: "/pages/mall/post/post",
        success: function(res) {
          setTimeout(() => {
            common_vendor.index.$emit("sendProductData", {
              item: item.value
            });
          }, 100);
        }
      });
    };
    const buyProduct = () => {
      common_vendor.index.__f__("log", "at pages/mall/detail/detail.vue:155", 222);
      common_vendor.index.navigateTo({
        url: "/pages/mall/buy/buy",
        success: (res) => {
          setTimeout(() => {
            common_vendor.index.$emit("sendProductData", {
              item: item.value
            });
          }, 100);
        }
      });
    };
    const goToChat = () => {
      common_vendor.index.navigateTo({
        url: `/pages/mall/chat/chat?trade_id=${item.value.trade_id}&buyer_id=${openid.value}&seller_id=${item.value.seller_id}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: item.value.sellerAvatar,
        b: common_vendor.t(item.value.sellerName),
        c: common_vendor.t(item.value.update_time),
        d: common_vendor.t(item.value.price),
        e: common_vendor.t(item.value.category),
        f: common_vendor.t(item.value.title),
        g: common_vendor.t(item.value.description || "暂无描述"),
        h: common_vendor.f(mediaList.value, (media, index, i0) => {
          return common_vendor.e({
            a: media.type === "image"
          }, media.type === "image" ? {
            b: common_vendor.o(($event) => previewFile(media.url), index),
            c: media.url
          } : media.type === "video" ? {
            e: media.url
          } : {}, {
            d: media.type === "video",
            f: index,
            g: common_vendor.s(getMediaItemStyle(mediaList.value.length, index))
          });
        }),
        i: isFavorite.value ? "/static/image/collect-active.png" : "/static/image/collect.png",
        j: common_vendor.t(isFavorite.value ? "已收藏" : "收藏"),
        k: common_vendor.o(toggleFavorite),
        l: !isOwner.value
      }, !isOwner.value ? {
        m: common_assets._imports_0$2,
        n: common_vendor.o(goToChat)
      } : {}, {
        o: common_vendor.t(isOwner.value ? "编辑我的商品" : "立即购买"),
        p: common_vendor.o(($event) => isOwner.value ? editProduct() : buyProduct())
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mall/detail/detail.js.map
