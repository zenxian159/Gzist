"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "myTasks",
  setup(__props) {
    var _a;
    const tasks = common_vendor.ref([]);
    const openid = ((_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.openid) || "";
    common_vendor.onShow(() => {
      loadMyTasks();
    });
    function loadMyTasks() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/user/tasks?openid=${openid}`,
        method: "GET",
        success: (res) => {
          if (Array.isArray(res.data)) {
            tasks.value = res.data;
          } else {
            tasks.value = [];
            common_vendor.index.showToast({
              title: "数据异常",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "加载失败",
            icon: "none"
          });
        }
      });
    }
    function cancelTask(taskId) {
      common_vendor.index.showModal({
        title: "确认取消任务？",
        content: "取消后任务不可恢复",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: `${utils_config.config.baseURL}/tasks/${taskId}/cancel`,
              method: "PUT",
              success: () => {
                common_vendor.index.showToast({
                  title: "任务已取消"
                });
                loadMyTasks();
              },
              fail: () => {
                common_vendor.index.showToast({
                  title: "操作失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
    function deleteTask(taskId) {
      common_vendor.index.showModal({
        title: "确认删除任务？",
        content: "删除后无法恢复",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: `${utils_config.config.baseURL}/tasks/${taskId}`,
              method: "DELETE",
              success: () => {
                common_vendor.index.showToast({
                  title: "任务已删除"
                });
                loadMyTasks();
              },
              fail: () => {
                common_vendor.index.showToast({
                  title: "删除失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
    function editTask(item) {
      if (item.status !== "待接单") {
        common_vendor.index.showToast({
          title: "只能修改待接单的任务",
          icon: "none"
        });
        return;
      }
      const serialized = encodeURIComponent(JSON.stringify(item));
      common_vendor.index.navigateTo({
        url: `/pages/tasks/postTask/postTask?item=${serialized}`
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: tasks.value.length === 0
      }, tasks.value.length === 0 ? {} : {}, {
        b: common_vendor.f(tasks.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.task_title),
            b: common_vendor.t(item.task_description),
            c: common_vendor.t(item.status),
            d: item.status,
            e: item.status !== "待接单" ? 1 : "",
            f: common_vendor.o(($event) => editTask(item), item.task_id),
            g: item.status === "待接单"
          }, item.status === "待接单" ? {
            h: common_vendor.o(($event) => cancelTask(item.task_id), item.task_id)
          } : item.status === "已取消" || item.status === "已完成" ? {
            j: common_vendor.o(($event) => deleteTask(item.task_id), item.task_id)
          } : {}, {
            i: item.status === "已取消" || item.status === "已完成",
            k: item.task_id
          });
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8bcf0511"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tasks/myTasks/myTasks.js.map
