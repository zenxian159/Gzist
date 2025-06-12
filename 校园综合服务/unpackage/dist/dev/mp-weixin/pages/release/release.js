"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "release",
  setup(__props) {
    const navList = common_vendor.ref([
      {
        title: "校园互助",
        icon: "/static/image/icon/mutual.png",
        url: "/pages/MutualAid/addAid/addAid"
      },
      {
        title: "失物招领",
        icon: "/static/image/icon/lostAndFound.png",
        url: "/pages/publish/publish"
      },
      {
        title: "校园二手",
        icon: "/static/image/icon/trades.png",
        url: "/pages/mall/post/post"
      },
      {
        title: "校园跑腿",
        icon: "/static/image/icon/tasks.png",
        url: "/pages/tasks/postTask/postTask"
      }
    ]);
    common_vendor.onMounted(() => {
    });
    const onNavTap = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$4,
        b: common_vendor.f(navList.value, (item, k0, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.title),
            c: item.title,
            d: common_vendor.o(($event) => onNavTap(item.url), item.title)
          };
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/release/release.js.map
