"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const utils_api = require("../../../utils/api.js");
const utils_logger = require("../../../utils/logger.js");
const _sfc_main = {
  __name: "orders",
  setup(__props) {
    const activeTab = common_vendor.ref("purchased");
    const orders = common_vendor.ref([]);
    const pageNum = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const hasMore = common_vendor.ref(true);
    const loading = common_vendor.ref(false);
    const initialLoading = common_vendor.ref(true);
    let openid = "";
    common_vendor.onMounted(async () => {
      const userInfo = common_vendor.index.getStorageSync("userInfo") || {};
      if (!userInfo.openid) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        initialLoading.value = false;
        return;
      }
      openid = userInfo.openid;
      await refresh();
    });
    common_vendor.onPullDownRefresh(async () => {
      await refresh();
      common_vendor.index.stopPullDownRefresh();
    });
    async function switchTab(tab) {
      if (activeTab.value === tab)
        return;
      activeTab.value = tab;
      await refresh();
    }
    async function refresh() {
      orders.value = [];
      pageNum.value = 1;
      hasMore.value = true;
      initialLoading.value = true;
      await loadMore();
    }
    async function loadMore() {
      if (!hasMore.value || loading.value)
        return;
      loading.value = true;
      try {
        const path = activeTab.value === "purchased" ? "userPurchasedTrades" : "userSoldTrades";
        const url = `${utils_config.config.baseURL}/${path}?openid=${encodeURIComponent(openid)}&pageNum=${pageNum.value}&pageSize=${pageSize.value}`;
        const res = await utils_api.request({
          url,
          method: "GET"
        });
        if (Array.isArray(res)) {
          if (res.length < pageSize.value)
            hasMore.value = false;
          orders.value.push(...res);
          pageNum.value++;
        } else {
          hasMore.value = false;
        }
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
        hasMore.value = false;
      } finally {
        loading.value = false;
        initialLoading.value = false;
      }
    }
    async function confirmTrade(id) {
      try {
        await utils_api.request({
          url: `${utils_config.config.baseURL}/trades/${id}/confirm?openid=${encodeURIComponent(openid)}`,
          method: "PUT"
        });
        common_vendor.index.showToast({ title: "操作成功" });
        await refresh();
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "确认失败", icon: "none" });
      }
    }
    function cancelTrade(id) {
      common_vendor.index.showModal({
        title: "取消订单",
        content: "取消后无法恢复，确认吗？",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await utils_api.request({
              url: `${utils_config.config.baseURL}/trades/${id}/status?status=已取消`,
              method: "PUT"
            });
            common_vendor.index.showToast({ title: "已取消" });
            await refresh();
          } catch (err) {
            utils_logger.logError(err);
            common_vendor.index.showToast({ title: "取消失败", icon: "none" });
          }
        }
      });
    }
    async function relistTrade(id) {
      try {
        await utils_api.request({
          url: `${utils_config.config.baseURL}/trades/${id}/status?status=可交易`,
          method: "PUT"
        });
        common_vendor.index.showToast({ title: "已上架" });
        await refresh();
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "上架失败", icon: "none" });
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => switchTab("purchased")),
        b: activeTab.value === "purchased" ? 1 : "",
        c: common_vendor.o(($event) => switchTab("sold")),
        d: activeTab.value === "sold" ? 1 : "",
        e: initialLoading.value
      }, initialLoading.value ? {} : {}, {
        f: common_vendor.f(orders.value, (item, k0, i0) => {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          return common_vendor.e({
            a: ((_b = (_a = item.fileList) == null ? void 0 : _a[0]) == null ? void 0 : _b.type) === "image"
          }, ((_d = (_c = item.fileList) == null ? void 0 : _c[0]) == null ? void 0 : _d.type) === "image" ? {
            b: item.fileList[0].url
          } : ((_f = (_e = item.fileList) == null ? void 0 : _e[0]) == null ? void 0 : _f.type) === "video" ? {
            d: item.fileList[0].url
          } : {}, {
            c: ((_h = (_g = item.fileList) == null ? void 0 : _g[0]) == null ? void 0 : _h.type) === "video",
            e: common_vendor.t(item.title),
            f: common_vendor.t(item.price),
            g: common_vendor.t(item.status === "交易完成" ? "交易完成" : item.buyer_confirm && !item.seller_confirm ? "待卖家确认" : !item.buyer_confirm && item.seller_confirm ? "待买家确认" : item.status),
            h: item.status === "交易中" && (!item.buyer_confirm || !item.seller_confirm)
          }, item.status === "交易中" && (!item.buyer_confirm || !item.seller_confirm) ? {
            i: common_vendor.o(($event) => confirmTrade(item.trade_id), item.trade_id)
          } : {}, {
            j: item.status === "交易中"
          }, item.status === "交易中" ? {
            k: common_vendor.o(($event) => cancelTrade(item.trade_id), item.trade_id)
          } : {}, {
            l: activeTab.value === "sold" && item.status === "已取消"
          }, activeTab.value === "sold" && item.status === "已取消" ? {
            m: common_vendor.o(($event) => relistTrade(item.trade_id), item.trade_id)
          } : {}, {
            n: item.trade_id
          });
        }),
        g: loading.value && orders.value.length
      }, loading.value && orders.value.length ? {} : !hasMore.value && orders.value.length ? {} : !loading.value && !initialLoading.value && !orders.value.length ? {} : {}, {
        h: !hasMore.value && orders.value.length,
        i: !loading.value && !initialLoading.value && !orders.value.length,
        j: common_vendor.o(loadMore)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mall/orders/orders.js.map
