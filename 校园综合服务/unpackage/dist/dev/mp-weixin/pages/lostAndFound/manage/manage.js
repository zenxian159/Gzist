"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const utils_config = require("../../../utils/config.js");
const deleteBtnWidth = 100;
const _sfc_main = {
  __name: "manage",
  setup(__props) {
    const allItems = common_vendor.ref([]);
    const filteredItems = common_vendor.ref([]);
    const activeFilter = common_vendor.ref("all");
    const openid = common_vendor.ref("");
    const viewWidth = common_vendor.ref(0);
    common_vendor.onShow(() => {
      const info = common_vendor.index.getSystemInfoSync();
      viewWidth.value = info.windowWidth;
      const user = common_vendor.index.getStorageSync("userInfo") || {};
      if (user.openid) {
        openid.value = user.openid;
        loadUserItems();
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
    });
    function loadUserItems() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/posts?openid=${openid.value}`,
        method: "GET",
        success({
          data
        }) {
          const list = data.map((item) => ({
            ...item,
            x: 0
          }));
          allItems.value = list;
          filteredItems.value = [...list];
        },
        fail() {
          common_vendor.index.showToast({
            title: "加载失败",
            icon: "none"
          });
        }
      });
    }
    function filterItems() {
      if (activeFilter.value === "all") {
        filteredItems.value = [...allItems.value];
      } else if (activeFilter.value === "lost") {
        filteredItems.value = allItems.value.filter((i) => i.type === "丢失物品");
      } else {
        filteredItems.value = allItems.value.filter((i) => i.type === "拾取物品");
      }
    }
    function showAllItems() {
      activeFilter.value = "all";
      filterItems();
    }
    function showLostItems() {
      activeFilter.value = "lost";
      filterItems();
    }
    function showFoundItems() {
      activeFilter.value = "found";
      filterItems();
    }
    function onMoveChange(e) {
      const idx = e.currentTarget.dataset.index;
      const x = e.detail.x;
      filteredItems.value[idx].x = Math.min(0, Math.max(x, -deleteBtnWidth));
    }
    function onTouchEnd(e) {
      const idx = e.currentTarget.dataset.index;
      const x = filteredItems.value[idx].x;
      filteredItems.value[idx].x = x < -deleteBtnWidth / 2 ? -deleteBtnWidth : 0;
    }
    function editItem(id) {
      const item = filteredItems.value.find((i) => i.id === id);
      if (item) {
        common_vendor.index.navigateTo({
          url: `/pages/publish/publish?item=${encodeURIComponent(JSON.stringify(item))}`
        });
      }
    }
    function deleteItem(id, index) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这条信息吗？",
        success(res) {
          if (res.confirm) {
            common_vendor.index.request({
              url: `${utils_config.config.baseURL}/deleteLostFound`,
              method: "POST",
              data: {
                id
              },
              success({
                data
              }) {
                if (data.success) {
                  common_vendor.index.showToast({
                    title: "删除成功",
                    icon: "success"
                  });
                  filteredItems.value[index].x = 0;
                  setTimeout(() => {
                    filteredItems.value.splice(index, 1);
                  }, 200);
                } else {
                  common_vendor.index.showToast({
                    title: "删除失败",
                    icon: "none"
                  });
                }
              },
              fail() {
                common_vendor.index.showToast({
                  title: "删除失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: activeFilter.value === "all" ? 1 : "",
        b: common_vendor.o(showAllItems),
        c: activeFilter.value === "lost" ? 1 : "",
        d: common_vendor.o(showLostItems),
        e: activeFilter.value === "found" ? 1 : "",
        f: common_vendor.o(showFoundItems),
        g: common_vendor.f(filteredItems.value, (item, index, i0) => {
          var _a, _b, _c, _d;
          return common_vendor.e({
            a: ((_a = item.fileList[0]) == null ? void 0 : _a.type) === "image"
          }, ((_b = item.fileList[0]) == null ? void 0 : _b.type) === "image" ? {
            b: item.fileList[0].url
          } : ((_c = item.fileList[0]) == null ? void 0 : _c.type) === "video" ? {
            d: item.fileList[0].url
          } : {}, {
            c: ((_d = item.fileList[0]) == null ? void 0 : _d.type) === "video",
            e: common_vendor.t(item.itemName),
            f: common_vendor.t(item.remarks),
            g: common_vendor.t(item.type),
            h: common_vendor.o(() => editItem(item.id), item.id),
            i: common_vendor.o(($event) => deleteItem(item.id, index), item.id),
            j: item.x,
            k: index,
            l: common_vendor.o(onMoveChange, item.id),
            m: common_vendor.o(onTouchEnd, item.id),
            n: item.id
          });
        }),
        h: common_assets._imports_0$3,
        i: viewWidth.value + "px",
        j: viewWidth.value + deleteBtnWidth + "px",
        k: filteredItems.value.length === 0
      }, filteredItems.value.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7577fd60"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/lostAndFound/manage/manage.js.map
