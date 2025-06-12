"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_config = require("../../utils/config.js");
const _sfc_main = {
  __name: "lostAndFound",
  setup(__props) {
    const allItem = common_vendor.ref([]);
    const copyItem = common_vendor.ref([]);
    const activeFilter = common_vendor.ref("all");
    const latitude = common_vendor.ref(23.25904);
    const longitude = common_vendor.ref(113.457244);
    const menuVisible = common_vendor.ref(false);
    const postStyle = common_vendor.ref({});
    const manageStyle = common_vendor.ref({});
    const filters = [
      {
        key: "all",
        label: "全部"
      },
      {
        key: "lost",
        label: "失物招领"
      },
      {
        key: "found",
        label: "寻物启事"
      }
    ];
    const markers = common_vendor.computed(
      () => copyItem.value.filter((i) => !isNaN(i.latitude) && !isNaN(i.longitude)).map((i) => ({
        id: i.markerId,
        latitude: i.latitude,
        longitude: i.longitude,
        iconPath: i.firstMediaType === "image" ? i.firstMediaUrl : "/static/image/video-icon.png",
        width: 30,
        height: 30,
        callout: {
          content: i.type === "丢失物品" ? `丢失：${i.itemName}` : `拾取：${i.itemName}`,
          color: "#204dad",
          fontSize: 12,
          borderRadius: 6,
          bgColor: "#fff",
          padding: 6,
          display: "BYCLICK",
          textAlign: "center"
        }
      }))
    );
    function formatTime(time) {
      const d = new Date(time);
      d.setHours(d.getHours() + 8);
      return d.toISOString().replace("T", " ").slice(0, 16);
    }
    function loadData() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/lostAndFound`,
        method: "GET",
        success({
          data
        }) {
          const list = data.map((item, idx) => {
            var _a, _b, _c, _d, _e;
            const files = item.fileList || [];
            const first = files[0] || {};
            let lat = 0, lng = 0;
            if (item.type === "丢失物品" && ((_c = (_b = (_a = item.location) == null ? void 0 : _a[0]) == null ? void 0 : _b.points) == null ? void 0 : _c.length)) {
              lat = +item.location[0].points[0].latitude;
              lng = +item.location[0].points[0].longitude;
            } else if (item.type === "拾取物品" && ((_d = item.location) == null ? void 0 : _d.latitude)) {
              lat = +item.location.latitude;
              lng = +item.location.longitude;
            }
            return {
              ...item,
              createdAt: formatTime(item.createdAt),
              firstMediaUrl: first.url || "",
              firstMediaType: ((_e = first.type) == null ? void 0 : _e.includes("video")) ? "video" : "image",
              markerId: idx + 1,
              latitude: lat,
              longitude: lng
            };
          });
          allItem.value = list;
          copyItem.value = list;
        },
        fail(err) {
          common_vendor.index.__f__("error", "at pages/lostAndFound/lostAndFound.vue:154", err);
          common_vendor.index.showToast({
            title: "加载失败",
            icon: "none"
          });
        }
      });
    }
    common_vendor.onMounted(loadData);
    function filterBy(key) {
      activeFilter.value = key;
      copyItem.value = key === "all" ? allItem.value : allItem.value.filter(
        (i) => key === "lost" ? i.type === "丢失物品" : i.type === "拾取物品"
      );
    }
    function onMarkerTap(e) {
      const id = e.detail.markerId;
      filterBy("all");
      const sel = allItem.value.find((i) => i.markerId === id);
      if (sel)
        copyItem.value = [sel];
    }
    function onCalloutTap(e) {
      common_vendor.index.__f__("log", "at pages/lostAndFound/lostAndFound.vue:186", "callouttap", e);
    }
    function goDetail(item) {
      common_vendor.index.navigateTo({
        url: `/pages/lostAndFound/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
      });
    }
    function toggleMenu() {
      menuVisible.value = !menuVisible.value;
      if (menuVisible.value) {
        setTimeout(() => {
          postStyle.value = {
            opacity: 1,
            transform: "translate(-20px,-80px)"
          };
          manageStyle.value = {
            opacity: 1,
            transform: "translate(-80px,-30px)"
          };
        }, 50);
      } else {
        postStyle.value = {
          opacity: 0,
          transform: "translate(0,0)"
        };
        manageStyle.value = {
          opacity: 0,
          transform: "translate(0,0)"
        };
      }
    }
    const navigateToPost = () => common_vendor.index.navigateTo({
      url: "/pages/publish/publish"
    });
    const navigateToManage = () => common_vendor.index.navigateTo({
      url: "/pages/lostAndFound/manage/manage"
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: latitude.value,
        b: longitude.value,
        c: markers.value,
        d: common_vendor.o(onMarkerTap),
        e: common_vendor.o(onCalloutTap),
        f: common_vendor.f(filters, (opt, k0, i0) => {
          return {
            a: common_vendor.t(opt.label),
            b: opt.key,
            c: activeFilter.value === opt.key ? 1 : "",
            d: common_vendor.o(($event) => filterBy(opt.key), opt.key)
          };
        }),
        g: common_vendor.f(copyItem.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.avatarUrl,
            b: common_vendor.t(item.nickName),
            c: common_vendor.t(item.createdAt),
            d: common_vendor.t(item.itemName),
            e: common_vendor.t(item.remarks || "无"),
            f: item.firstMediaType === "image"
          }, item.firstMediaType === "image" ? {
            g: item.firstMediaUrl,
            h: common_vendor.o(() => {
            }, item.id)
          } : {
            i: item.firstMediaUrl,
            j: common_vendor.o(() => {
            }, item.id)
          }, {
            k: common_vendor.t(item.type),
            l: item.id,
            m: common_vendor.o(($event) => goDetail(item), item.id)
          });
        }),
        h: common_assets._imports_0$1,
        i: common_vendor.o(toggleMenu),
        j: menuVisible.value
      }, menuVisible.value ? {
        k: common_assets._imports_1$1,
        l: common_vendor.s(postStyle.value),
        m: common_vendor.o(navigateToPost),
        n: common_assets._imports_2,
        o: common_vendor.s(manageStyle.value),
        p: common_vendor.o(navigateToManage)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-39c746c7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/lostAndFound/lostAndFound.js.map
