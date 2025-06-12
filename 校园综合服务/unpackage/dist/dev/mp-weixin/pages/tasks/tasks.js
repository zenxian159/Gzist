"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_config = require("../../utils/config.js");
const _sfc_main = {
  __name: "tasks",
  setup(__props) {
    const tasks = common_vendor.ref([]);
    const menuVisible = common_vendor.ref(false);
    const postAnimation = common_vendor.ref({});
    const manageAnimation = common_vendor.ref({});
    const ordersAnimation = common_vendor.ref({});
    function getTasks() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/tasks`,
        method: "GET",
        success: (res) => {
          tasks.value = Array.isArray(res.data) ? res.data.filter((t) => t.status === "待接单") : [];
        },
        fail: () => common_vendor.index.showToast({
          title: "获取任务失败",
          icon: "none"
        })
      });
    }
    common_vendor.onShow(() => getTasks());
    function viewTaskDetail(taskId) {
      common_vendor.index.navigateTo({
        url: `/pages/tasks/taskDetail/taskDetail?id=${taskId}`
      });
    }
    const toggleMenu = () => {
      if (!menuVisible.value) {
        menuVisible.value = true;
        setTimeout(() => {
          postAnimation.value = {
            opacity: 1,
            transform: "translate(-60px, -60px)"
          };
          manageAnimation.value = {
            opacity: 1,
            transform: "translate(-100px, 0px)"
          };
          ordersAnimation.value = {
            opacity: 1,
            transform: "translate(0px, -100px)"
          };
        }, 50);
      } else {
        postAnimation.value = {
          opacity: 0,
          transform: "translate(0, 0)"
        };
        manageAnimation.value = {
          opacity: 0,
          transform: "translate(0, 0)"
        };
        ordersAnimation.value = {
          opacity: 0,
          transform: "translate(0, 0)"
        };
        setTimeout(() => {
          menuVisible.value = false;
        }, 300);
      }
    };
    const navigateToPost = () => {
      common_vendor.index.navigateTo({
        url: "/pages/tasks/postTask/postTask"
      });
    };
    const navigateToManage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/tasks/myTasks/myTasks"
      });
    };
    const navigateToOrders = () => {
      common_vendor.index.navigateTo({
        url: "/pages/tasks/myOrders/myOrders"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: tasks.value.length === 0
      }, tasks.value.length === 0 ? {} : {}, {
        b: common_vendor.f(tasks.value, (task, k0, i0) => {
          return {
            a: task.avatarUrl,
            b: common_vendor.t(task.nickName),
            c: common_vendor.t(task.created_at),
            d: common_vendor.t(task.task_title),
            e: common_vendor.t(task.task_description),
            f: common_vendor.t(task.pickup_location),
            g: common_vendor.t(task.delivery_location),
            h: common_vendor.t(task.reward),
            i: common_vendor.t(task.status),
            j: task.status,
            k: task.task_id,
            l: common_vendor.o(($event) => viewTaskDetail(task.task_id), task.task_id)
          };
        }),
        c: common_assets._imports_0$1,
        d: common_vendor.o(toggleMenu),
        e: common_assets._imports_1$1,
        f: common_vendor.s(postAnimation.value),
        g: common_vendor.o(navigateToPost),
        h: common_assets._imports_2,
        i: common_vendor.s(manageAnimation.value),
        j: common_vendor.o(navigateToManage),
        k: common_assets._imports_3,
        l: common_vendor.s(ordersAnimation.value),
        m: common_vendor.o(navigateToOrders)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-027feebf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/tasks/tasks.js.map
