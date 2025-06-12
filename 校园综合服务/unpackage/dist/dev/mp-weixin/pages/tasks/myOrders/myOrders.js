"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "myOrders",
  setup(__props) {
    var _a;
    const orders = common_vendor.ref([]);
    const filteredOrders = common_vendor.ref([]);
    const statuses = ["全部", "进行中", "已完成"];
    const activeFilter = common_vendor.ref("全部");
    const openid = ((_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.openid) || "";
    function loadMyOrders() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/runner/tasks?openid=${openid}`,
        method: "GET",
        success(res) {
          if (res.statusCode === 200 && Array.isArray(res.data)) {
            orders.value = res.data;
            filterTasks(activeFilter.value);
          } else {
            common_vendor.index.showToast({ title: res.data.error || "加载失败", icon: "none" });
          }
        },
        fail() {
          common_vendor.index.showToast({ title: "网络错误，请重试", icon: "none" });
        }
      });
    }
    common_vendor.onShow(() => {
      loadMyOrders();
    });
    function filterTasks(status) {
      activeFilter.value = status;
      filteredOrders.value = status === "全部" ? orders.value : orders.value.filter((item) => item.status === status);
    }
    function viewTaskDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/tasks/taskDetail/taskDetail?id=${id}`
      });
    }
    function markAsComplete(id) {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/tasks/${id}/complete`,
        method: "PUT",
        success() {
          common_vendor.index.showToast({ title: "任务已完成" });
          loadMyOrders();
        },
        fail() {
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        }
      });
    }
    function cancelTask(id) {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "确定取消该任务吗？",
        success(res) {
          if (res.confirm) {
            common_vendor.index.request({
              url: `${utils_config.config.baseURL}/tasks/${id}/cancel`,
              method: "PUT",
              success() {
                common_vendor.index.showToast({ title: "任务已取消" });
                loadMyOrders();
              },
              fail() {
                common_vendor.index.showToast({ title: "取消失败", icon: "none" });
              }
            });
          }
        }
      });
    }
    function getStatusClass(status) {
      if (status === "进行中")
        return "status-in-progress";
      if (status === "已完成")
        return "status-complete";
      return "status-cancelled";
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(statuses, (status, k0, i0) => {
          return {
            a: common_vendor.t(status),
            b: status,
            c: activeFilter.value === status ? 1 : "",
            d: common_vendor.o(($event) => filterTasks(status), status)
          };
        }),
        b: common_vendor.f(filteredOrders.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.task_title),
            b: common_vendor.t(item.status),
            c: common_vendor.n(getStatusClass(item.status)),
            d: common_vendor.t(item.reward),
            e: common_vendor.t(item.pickup_location),
            f: common_vendor.t(item.delivery_location),
            g: common_vendor.o(($event) => viewTaskDetail(item.task_id), item.task_id),
            h: item.status === "进行中"
          }, item.status === "进行中" ? {
            i: common_vendor.o(($event) => markAsComplete(item.task_id), item.task_id)
          } : {}, {
            j: item.status === "进行中"
          }, item.status === "进行中" ? {
            k: common_vendor.o(($event) => cancelTask(item.task_id), item.task_id)
          } : {}, {
            l: item.task_id
          });
        }),
        c: filteredOrders.value.length === 0
      }, filteredOrders.value.length === 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ae6064fd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tasks/myOrders/myOrders.js.map
