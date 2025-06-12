"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
const _sfc_main = {
  __name: "applyRunner",
  setup(__props) {
    const name = common_vendor.ref("");
    const phone = common_vendor.ref("");
    const id_card = common_vendor.ref("");
    const openid = common_vendor.ref(common_vendor.index.getStorageSync("userInfo").openid);
    const application = common_vendor.ref(null);
    const getApplicationStatus = () => {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/runner-applications/${openid.value}`,
        method: "GET",
        success: (res) => {
          if (res.data && res.data.application_id) {
            common_vendor.index.__f__("log", "at pages/applyRunner/applyRunner.vue:48", res.data);
            application.value = res.data;
          } else {
            application.value = null;
          }
        }
      });
    };
    const submitApplication = () => {
      if (!name.value || !phone.value || !id_card.value) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/apply-runner`,
        method: "POST",
        data: {
          openid: openid.value,
          name: name.value,
          phone: phone.value,
          id_card: id_card.value
        },
        success: (res) => {
          common_vendor.index.showToast({ title: res.data.message, icon: "success" });
          getApplicationStatus();
        },
        fail: () => {
          common_vendor.index.showToast({ title: "申请提交失败", icon: "none" });
        }
      });
    };
    const resetApplication = () => {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/apply-runner/reset`,
        method: "POST",
        data: {
          openid: openid.value
        },
        success: () => {
          common_vendor.index.showToast({ title: "请重新提交申请", icon: "success" });
          application.value = null;
        },
        fail: () => {
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        }
      });
    };
    common_vendor.onMounted(() => {
      getApplicationStatus();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: application.value && application.value.application_id
      }, application.value && application.value.application_id ? common_vendor.e({
        b: common_vendor.t(application.value.status),
        c: application.value.status === "已拒绝"
      }, application.value.status === "已拒绝" ? {
        d: common_vendor.t(application.value.rejection_reason),
        e: common_vendor.o(resetApplication)
      } : {}, {
        f: application.value.status === "已通过"
      }, application.value.status === "已通过" ? {} : {}) : {
        g: name.value,
        h: common_vendor.o(($event) => name.value = $event.detail.value),
        i: phone.value,
        j: common_vendor.o(($event) => phone.value = $event.detail.value),
        k: id_card.value,
        l: common_vendor.o(($event) => id_card.value = $event.detail.value),
        m: common_vendor.o(submitApplication)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/applyRunner/applyRunner.js.map
