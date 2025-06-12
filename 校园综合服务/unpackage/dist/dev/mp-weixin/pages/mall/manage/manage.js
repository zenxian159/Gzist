"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_api = require("../../../utils/api.js");
const utils_logger = require("../../../utils/logger.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "manage",
  setup(__props) {
    const products = common_vendor.ref([]);
    const pageNum = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const hasMore = common_vendor.ref(true);
    const loading = common_vendor.ref(false);
    const initialLoading = common_vendor.ref(true);
    const openid = common_vendor.ref("");
    common_vendor.onMounted(async () => {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (!userInfo || !userInfo.openid) {
          common_vendor.index.showToast({ title: "未找到用户信息，请先登录", icon: "none" });
          initialLoading.value = false;
          return;
        }
        openid.value = userInfo.openid;
        await loadProducts();
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/mall/manage/manage.vue:98", "获取 openid 失败:", e);
        initialLoading.value = false;
      }
    });
    common_vendor.onPullDownRefresh(async () => {
      resetAndReload();
      common_vendor.index.stopPullDownRefresh();
    });
    async function loadProducts() {
      if (!hasMore.value || loading.value)
        return;
      loading.value = true;
      try {
        const res = await utils_api.request({
          url: `${utils_config.config.baseURL}/userTrades?openid=${openid.value}&pageNum=${pageNum.value}&pageSize=${pageSize.value}`,
          method: "GET"
        });
        if (Array.isArray(res)) {
          if (res.length < pageSize.value) {
            hasMore.value = false;
          }
          products.value.push(...res);
          pageNum.value++;
        } else {
          hasMore.value = false;
        }
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "商品列表加载失败", icon: "none" });
        hasMore.value = false;
      } finally {
        loading.value = false;
        initialLoading.value = false;
      }
    }
    function loadMore() {
      loadProducts();
    }
    function deleteProduct(tradeId) {
      common_vendor.index.showModal({
        title: "删除确认",
        content: "删除后不可恢复，确认要删除这件商品吗？",
        success: async (res) => {
          if (!res.confirm)
            return;
          try {
            await utils_api.request({
              url: `${utils_config.config.baseURL}/trades/${tradeId}`,
              method: "DELETE"
            });
            common_vendor.index.showToast({ title: "删除成功", icon: "success" });
            resetAndReload();
          } catch (err) {
            utils_logger.logError(err);
            common_vendor.index.showToast({ title: "删除失败，请稍后重试", icon: "none" });
          }
        }
      });
    }
    async function toggleStatus(tradeId, currentStatus) {
      let newStatus = "";
      if (currentStatus === "可交易") {
        newStatus = "已下架";
      } else if (currentStatus === "已下架") {
        newStatus = "可交易";
      } else {
        common_vendor.index.showToast({ title: `当前【${currentStatus}】不可切换`, icon: "none" });
        return;
      }
      try {
        await utils_api.request({
          url: `${utils_config.config.baseURL}/trades/${tradeId}/status`,
          method: "PUT",
          data: { status: newStatus }
        });
        common_vendor.index.showToast({ title: "操作成功", icon: "success" });
        resetAndReload();
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "操作失败，请稍后重试", icon: "none" });
      }
    }
    function editProduct(tradeId) {
      const item = products.value.find((p) => p.trade_id === tradeId);
      common_vendor.index.__f__("log", "at pages/mall/manage/manage.vue:193", item, "asdasoijdas");
      if (!item) {
        common_vendor.index.showToast({ title: "商品不存在", icon: "none" });
        return;
      }
      if (item.status !== "可交易") {
        common_vendor.index.showToast({ title: `该商品为【${item.status}】，无法编辑`, icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/mall/post/post",
        success: (res) => {
          common_vendor.index.$emit("sendProductData", { item });
        }
      });
    }
    function resetAndReload() {
      products.value = [];
      pageNum.value = 1;
      hasMore.value = true;
      loading.value = false;
      initialLoading.value = true;
      loadProducts();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: initialLoading.value
      }, initialLoading.value ? {} : {}, {
        b: common_vendor.f(products.value, (item, k0, i0) => {
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
            g: common_vendor.t(item.status),
            h: common_vendor.o(($event) => toggleStatus(item.trade_id, item.status), item.trade_id),
            i: common_vendor.o(($event) => editProduct(item.trade_id), item.trade_id),
            j: item.status !== "可交易",
            k: common_vendor.o(($event) => deleteProduct(item.trade_id), item.trade_id),
            l: item.trade_id
          });
        }),
        c: loading.value && products.value.length
      }, loading.value && products.value.length ? {} : !hasMore.value && products.value.length ? {} : !loading.value && !products.value.length && !initialLoading.value ? {} : {}, {
        d: !hasMore.value && products.value.length,
        e: !loading.value && !products.value.length && !initialLoading.value,
        f: common_vendor.o(loadMore)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mall/manage/manage.js.map
