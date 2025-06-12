"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const navList = common_vendor.ref([
      { title: "校园互助", icon: "/static/image/icon/mutual.png", url: "/pages/MutualAid/MutualAid" },
      { title: "失物招领", icon: "/static/image/icon/lostAndFound.png", url: "/pages/lostAndFound/lostAndFound" },
      { title: "校园二手", icon: "/static/image/icon/trades.png", url: "/pages/mall/mall" },
      { title: "校园兼职", icon: "/static/image/icon/job.png", url: "/pages/jobs/jobs" },
      { title: "校园跑腿", icon: "/static/image/icon/tasks.png", url: "/pages/tasks/tasks" }
    ]);
    common_vendor.ref([]);
    common_vendor.onMounted(() => {
    });
    const onNavTap = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.f(navList.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.title),
            c: index,
            d: common_vendor.o(($event) => onNavTap(item.url), index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
