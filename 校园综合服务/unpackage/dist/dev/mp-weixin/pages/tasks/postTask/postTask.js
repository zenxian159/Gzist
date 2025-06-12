"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "postTask",
  setup(__props) {
    var _a;
    const formData = common_vendor.reactive({
      task_title: "",
      task_description: "",
      pickup_location: "",
      delivery_location: "",
      reward: "",
      user_id: ((_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.openid) || "",
      isEditing: false,
      task_id: null
    });
    common_vendor.onLoad((options) => {
      if (options.item) {
        const item = JSON.parse(decodeURIComponent(options.item));
        formData.isEditing = true;
        formData.task_id = item.task_id;
        formData.task_title = item.task_title;
        formData.task_description = item.task_description;
        formData.pickup_location = item.pickup_location;
        formData.delivery_location = item.delivery_location;
        formData.reward = item.reward;
      }
    });
    function submitTask() {
      if (!formData.task_title.trim() || !formData.pickup_location.trim() || !formData.delivery_location.trim() || !formData.reward.trim()) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      const url = `${utils_config.config.baseURL}/tasks${formData.isEditing ? "/" + formData.task_id : ""}`;
      const method = formData.isEditing ? "PUT" : "POST";
      common_vendor.index.request({
        url,
        method,
        data: {
          task_title: formData.task_title,
          task_description: formData.task_description,
          pickup_location: formData.pickup_location,
          delivery_location: formData.delivery_location,
          reward: formData.reward,
          user_id: formData.user_id
        },
        success(res) {
          common_vendor.index.showToast({
            title: formData.isEditing ? "任务更新成功" : "任务发布成功",
            icon: "success"
          });
          setTimeout(() => common_vendor.index.navigateBack(), 800);
        },
        fail() {
          common_vendor.index.showToast({ title: "网络错误，请重试", icon: "none" });
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(formData.isEditing ? "编辑任务" : "发布新任务"),
        b: formData.task_title,
        c: common_vendor.o(($event) => formData.task_title = $event.detail.value),
        d: formData.task_description,
        e: common_vendor.o(($event) => formData.task_description = $event.detail.value),
        f: formData.pickup_location,
        g: common_vendor.o(($event) => formData.pickup_location = $event.detail.value),
        h: formData.delivery_location,
        i: common_vendor.o(($event) => formData.delivery_location = $event.detail.value),
        j: formData.reward,
        k: common_vendor.o(($event) => formData.reward = $event.detail.value),
        l: common_vendor.t(formData.isEditing ? "更新任务" : "📩 发布任务"),
        m: common_vendor.o(submitTask)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6a124b14"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tasks/postTask/postTask.js.map
