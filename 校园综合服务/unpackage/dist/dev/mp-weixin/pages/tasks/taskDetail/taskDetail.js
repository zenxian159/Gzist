"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "taskDetail",
  setup(__props) {
    const task = common_vendor.ref({});
    const openid = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      var _a;
      openid.value = ((_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.openid) || "";
      const id = options.id;
      if (!id) {
        common_vendor.index.showToast({ title: "未传入任务ID", icon: "none" });
        return common_vendor.index.navigateBack();
      }
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/tasks/${id}`,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            task.value = res.data;
          } else {
            common_vendor.index.showToast({ title: "获取详情失败", icon: "none" });
            common_vendor.index.navigateBack();
          }
        },
        fail: () => {
          common_vendor.index.showToast({ title: "网络错误", icon: "none" });
          common_vendor.index.navigateBack();
        }
      });
    });
    function acceptTask() {
      if (!openid.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (task.value.user_id === openid.value) {
        common_vendor.index.showToast({ title: "不能接自己发布的任务", icon: "none" });
        return;
      }
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/tasks/${task.value.task_id}/accept`,
        method: "PUT",
        data: { runner_id: openid.value },
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.showToast({ title: "接单成功" });
            common_vendor.index.navigateBack();
          } else {
            common_vendor.index.showToast({ title: res.data.error || "接单失败", icon: "none" });
          }
        },
        fail: () => {
          common_vendor.index.showToast({ title: "网络错误，请重试", icon: "none" });
        }
      });
    }
    function completeTask() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/tasks/${task.value.task_id}/complete`,
        method: "PUT",
        success: () => {
          common_vendor.index.showToast({ title: "任务已完成" });
          common_vendor.index.navigateBack();
        },
        fail: () => {
          common_vendor.index.showToast({ title: "提交失败", icon: "none" });
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: task.value.avatarUrl,
        b: common_vendor.t(task.value.nickName),
        c: common_vendor.t(task.value.created_at),
        d: common_vendor.t(task.value.task_title),
        e: common_vendor.t(task.value.task_description),
        f: common_vendor.t(task.value.pickup_location),
        g: common_vendor.t(task.value.delivery_location),
        h: common_vendor.t(task.value.reward),
        i: task.value.status === "待接单"
      }, task.value.status === "待接单" ? {
        j: common_vendor.o(acceptTask)
      } : task.value.status === "进行中" && task.value.runner_id === openid.value ? {
        l: common_vendor.o(completeTask)
      } : {}, {
        k: task.value.status === "进行中" && task.value.runner_id === openid.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-24580492"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tasks/taskDetail/taskDetail.js.map
