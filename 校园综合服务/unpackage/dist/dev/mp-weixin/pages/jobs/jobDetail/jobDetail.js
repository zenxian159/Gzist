"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_api = require("../../../utils/api.js");
const utils_logger = require("../../../utils/logger.js");
const utils_config = require("../../../utils/config.js");
const _sfc_main = {
  __name: "jobDetail",
  setup(__props) {
    const job = common_vendor.ref({});
    common_vendor.onLoad(async (options) => {
      const jobId = options.id;
      if (!jobId) {
        common_vendor.index.showToast({ title: "未传入 jobId", icon: "none" });
        common_vendor.index.navigateBack();
        return;
      }
      await getJobDetail(jobId);
    });
    const getJobDetail = async (jobId) => {
      try {
        const res = await utils_api.request({
          url: `${utils_config.config.baseURL}/jobs/${jobId}`,
          method: "GET"
        });
        if (res.status === "closed") {
          common_vendor.index.showToast({ title: "该兼职已关闭", icon: "none" });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          job.value = res;
        }
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "获取详情失败", icon: "none" });
      }
    };
    const copyContact = () => {
      common_vendor.index.setClipboardData({
        data: job.value.contact_info,
        success: () => {
          common_vendor.index.showToast({ title: "已复制联系方式", icon: "success" });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(job.value.title),
        b: common_vendor.t(job.value.description),
        c: common_vendor.t(job.value.location),
        d: common_vendor.t(job.value.salary),
        e: common_vendor.t(job.value.contact_info),
        f: common_vendor.o(copyContact)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/jobs/jobDetail/jobDetail.js.map
