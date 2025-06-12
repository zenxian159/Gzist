"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_config = require("../../utils/config.js");
const _sfc_main = {
  __name: "MutualAid",
  setup(__props) {
    var _a;
    const mutualAidList = common_vendor.ref([]);
    ((_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.openid) || "";
    const menuVisible = common_vendor.ref(false);
    let postAni = common_vendor.ref(null);
    let manageAni = common_vendor.ref(null);
    function fetchMutualAid() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/wx-mutualAid`,
        method: "GET",
        success(res) {
          if (res.statusCode === 200 && res.data.items) {
            mutualAidList.value = res.data.items;
          } else {
            common_vendor.index.showToast({
              title: "加载失败",
              icon: "none"
            });
          }
        },
        fail() {
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    }
    common_vendor.onShow(() => {
      fetchMutualAid();
    });
    function goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/MutualAid/aidDetail/aidDetail?id=${id}`
      });
    }
    function previewImage(url) {
      common_vendor.index.previewImage({
        urls: [url],
        current: url
      });
    }
    function navigateToPost() {
      common_vendor.index.navigateTo({
        url: "/pages/MutualAid/addAid/addAid"
      });
    }
    function navigateToManage() {
      common_vendor.index.navigateTo({
        url: "/pages/MutualAid/aidManage/aidManage"
      });
    }
    function toggleMenu() {
      const a1 = common_vendor.index.createAnimation({
        duration: 300,
        timingFunction: "ease-out"
      });
      const a2 = common_vendor.index.createAnimation({
        duration: 300,
        timingFunction: "ease-out"
      });
      if (!menuVisible.value) {
        menuVisible.value = true;
        setTimeout(() => {
          a1.opacity(1).translate(-20, -80).step();
          a2.opacity(1).translate(-80, -30).step();
          postAni.value = a1.export();
          manageAni.value = a2.export();
        }, 50);
      } else {
        a1.opacity(0).translate(0, 0).step();
        a2.opacity(0).translate(0, 0).step();
        postAni.value = a1.export();
        manageAni.value = a2.export();
        setTimeout(() => menuVisible.value = false, 300);
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(mutualAidList.value, (item, k0, i0) => {
          var _a2, _b;
          return common_vendor.e({
            a: item.avatarUrl,
            b: common_vendor.t(item.nickName),
            c: common_vendor.t(item.created_at),
            d: common_vendor.t(item.content),
            e: (_a2 = item.images) == null ? void 0 : _a2.length
          }, ((_b = item.images) == null ? void 0 : _b.length) ? {
            f: common_vendor.f(item.images, (media, idx, i1) => {
              return common_vendor.e({
                a: media.type === "image"
              }, media.type === "image" ? {
                b: media.url,
                c: common_vendor.o(($event) => previewImage(media.url), idx)
              } : {
                d: media.url
              }, {
                e: idx
              });
            })
          } : {}, {
            g: item.id,
            h: common_vendor.o(($event) => goToDetail(item.id), item.id)
          });
        }),
        b: common_assets._imports_0$1,
        c: common_vendor.o(toggleMenu),
        d: menuVisible.value
      }, menuVisible.value ? {
        e: common_assets._imports_1$1,
        f: common_vendor.unref(postAni),
        g: common_vendor.o(($event) => navigateToPost()),
        h: common_assets._imports_2,
        i: common_vendor.unref(manageAni),
        j: common_vendor.o(($event) => navigateToManage())
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b1488010"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/MutualAid/MutualAid.js.map
