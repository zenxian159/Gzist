"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_config = require("../../utils/config.js");
const utils_api = require("../../utils/api.js");
const utils_logger = require("../../utils/logger.js");
const _sfc_main = {
  __name: "mall",
  setup(__props) {
    const products = common_vendor.ref([]);
    const filteredProducts = common_vendor.ref([]);
    const categories = common_vendor.ref(["全部", "电子产品", "学习用品", "生活用品", "运动用品", "其他"]);
    const selectedCategory = common_vendor.ref("全部");
    const searchKeyword = common_vendor.ref("");
    const hasSearched = common_vendor.ref(false);
    const loadingMore = common_vendor.ref(false);
    const pageNum = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const hasMore = common_vendor.ref(true);
    const menuVisible = common_vendor.ref(false);
    const postAnimation = common_vendor.ref({});
    const manageAnimation = common_vendor.ref({});
    const ordersAnimation = common_vendor.ref({});
    common_vendor.onShow(() => {
      refreshProducts();
    });
    const refreshProducts = async () => {
      pageNum.value = 1;
      hasMore.value = true;
      products.value = [];
      filteredProducts.value = [];
      hasSearched.value = false;
      await getProducts();
    };
    const getProducts = async () => {
      try {
        if (!hasMore.value)
          return;
        const res = await utils_api.request({
          url: `${utils_config.config.baseURL}/trades?pageNum=${pageNum.value}&pageSize=${pageSize.value}`
        });
        if (Array.isArray(res)) {
          if (res.length < pageSize.value)
            hasMore.value = false;
          products.value.push(...res);
          applyFilter();
          pageNum.value++;
        } else {
          hasMore.value = false;
        }
      } catch (err) {
        utils_logger.logError(err);
        hasMore.value = false;
      }
    };
    const onSearchInput = (e) => {
      searchKeyword.value = e.detail.value.trim();
    };
    const onSearch = () => {
      if (!searchKeyword.value) {
        filteredProducts.value = products.value;
        hasSearched.value = false;
        return;
      }
      const kw = searchKeyword.value.toLowerCase();
      const results = products.value.filter(
        (item) => item.title.toLowerCase().includes(kw)
      );
      filteredProducts.value = results;
      hasSearched.value = true;
      selectedCategory.value = "全部";
      if (results.length === 0) {
        common_vendor.index.showToast({ title: "没有找到相关商品", icon: "none" });
      }
    };
    const onCategorySelect = (category) => {
      selectedCategory.value = category;
      applyFilter();
    };
    const applyFilter = () => {
      let base = products.value;
      if (hasSearched.value) {
        const kw = searchKeyword.value.toLowerCase();
        base = base.filter(
          (item) => item.title.toLowerCase().includes(kw)
        );
      }
      if (selectedCategory.value !== "全部") {
        base = base.filter(
          (item) => item.category === selectedCategory.value
        );
      }
      filteredProducts.value = base;
    };
    const toDetail = (id) => {
      const item = filteredProducts.value.find((i) => i.trade_id === id);
      common_vendor.index.navigateTo({
        url: "/pages/mall/detail/detail",
        success: () => {
          setTimeout(() => {
            common_vendor.index.$emit("sendProductData", { item });
          }, 100);
        }
      });
    };
    const toggleMenu = () => {
      if (!menuVisible.value) {
        menuVisible.value = true;
        setTimeout(() => {
          postAnimation.value = { opacity: 1, transform: "translate(-60px, -60px)" };
          manageAnimation.value = { opacity: 1, transform: "translate(-100px, 0px)" };
          ordersAnimation.value = { opacity: 1, transform: "translate(0px, -100px)" };
        }, 50);
      } else {
        postAnimation.value = manageAnimation.value = ordersAnimation.value = {
          opacity: 0,
          transform: "translate(0, 0)"
        };
        setTimeout(() => {
          menuVisible.value = false;
        }, 300);
      }
    };
    const loadMore = async () => {
      if (loadingMore.value || !hasMore.value)
        return;
      loadingMore.value = true;
      try {
        await getProducts();
      } catch (e) {
        utils_logger.logError(e);
      } finally {
        loadingMore.value = false;
      }
    };
    const navigateToPost = () => {
      common_vendor.index.navigateTo({ url: "/pages/mall/post/post" });
    };
    const navigateToManage = () => {
      common_vendor.index.navigateTo({ url: "/pages/mall/manage/manage" });
    };
    const navigateToOrders = () => {
      common_vendor.index.navigateTo({ url: "/pages/mall/orders/orders" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o([($event) => searchKeyword.value = $event.detail.value, onSearchInput]),
        b: common_vendor.o(onSearch),
        c: searchKeyword.value,
        d: common_vendor.o(onSearch),
        e: common_vendor.f(categories.value, (category, index, i0) => {
          return {
            a: common_vendor.t(category),
            b: index,
            c: common_vendor.o(($event) => onCategorySelect(category), index),
            d: common_vendor.n(selectedCategory.value === category ? "selected" : "")
          };
        }),
        f: filteredProducts.value.length > 0
      }, filteredProducts.value.length > 0 ? {
        g: common_vendor.f(filteredProducts.value, (item, k0, i0) => {
          return {
            a: item.fileList[0].type === "video" ? "/static/image/video-placeholder.png" : item.fileList[0].url,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.price),
            d: item.sellerAvatar,
            e: common_vendor.t(item.sellerName),
            f: item.trade_id,
            g: common_vendor.o(($event) => toDetail(item.trade_id), item.trade_id)
          };
        })
      } : {}, {
        h: loadingMore.value
      }, loadingMore.value ? {} : {}, {
        i: !hasMore.value && filteredProducts.value.length > 0
      }, !hasMore.value && filteredProducts.value.length > 0 ? {} : {}, {
        j: common_vendor.o(loadMore),
        k: common_assets._imports_0$1,
        l: common_vendor.o(toggleMenu),
        m: common_assets._imports_1$1,
        n: common_vendor.s(postAnimation.value),
        o: common_vendor.o(navigateToPost),
        p: common_assets._imports_2,
        q: common_vendor.s(manageAnimation.value),
        r: common_vendor.o(navigateToManage),
        s: common_assets._imports_3,
        t: common_vendor.s(ordersAnimation.value),
        v: common_vendor.o(navigateToOrders)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mall/mall.js.map
