"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "aidManage",
  setup(__props) {
    const mutualAidList = common_vendor.ref([]);
    const openid = common_vendor.ref("");
    function fetchMyMutualAid() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/myMutualAid?openid=${openid.value}`,
        method: "GET",
        success(res) {
          if (res.statusCode === 200 && res.data.items) {
            mutualAidList.value = res.data.items.map((item) => ({
              ...item,
              images: Array.isArray(item.images) ? item.images : []
            }));
          } else {
            common_vendor.index.showToast({ title: "获取失败", icon: "none" });
          }
        },
        fail() {
          common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        }
      });
    }
    common_vendor.onShow(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo || !userInfo.openid) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      openid.value = userInfo.openid;
      fetchMyMutualAid();
    });
    function previewImage(url) {
      common_vendor.index.previewImage({ current: url, urls: [url] });
    }
    function deleteAid(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除该互助信息吗？",
        success(res) {
          if (res.confirm) {
            common_vendor.index.request({
              url: `${utils_config.config.baseURL}/mutualAid/${id}`,
              method: "DELETE",
              success() {
                common_vendor.index.showToast({ title: "删除成功", icon: "success" });
                fetchMyMutualAid();
              },
              fail() {
                common_vendor.index.showToast({ title: "删除失败", icon: "none" });
              }
            });
          }
        }
      });
    }
    function editAid(id) {
      common_vendor.index.navigateTo({
        url: `/pages/MutualAid/addAid/addAid?id=${id}`
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(mutualAidList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.created_at),
            b: common_vendor.o(($event) => editAid(item.id), item.id),
            c: common_vendor.o(($event) => deleteAid(item.id), item.id),
            d: common_vendor.t(item.content),
            e: item.images.length
          }, item.images.length ? {
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
            g: item.id
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1b486d36"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/MutualAid/aidManage/aidManage.js.map
