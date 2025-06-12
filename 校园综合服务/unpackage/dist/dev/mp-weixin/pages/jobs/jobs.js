"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api = require("../../utils/api.js");
const utils_logger = require("../../utils/logger.js");
const utils_config = require("../../utils/config.js");
const _sfc_main = {
  __name: "jobs",
  setup(__props) {
    const jobs = common_vendor.ref([]);
    const pageNum = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const hasMore = common_vendor.ref(true);
    const loadingMore = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      refreshJobs();
    });
    const refreshJobs = () => {
      pageNum.value = 1;
      hasMore.value = true;
      jobs.value = [];
      loadJobs();
    };
    const loadJobs = async () => {
      if (!hasMore.value || loadingMore.value)
        return;
      loadingMore.value = true;
      try {
        const res = await utils_api.request({
          url: `${utils_config.config.baseURL}/wx-jobs?pageNum=${pageNum.value}&pageSize=${pageSize.value}`
        });
        const openJobs = res.filter((job) => job.status === "open");
        if (openJobs.length < pageSize.value)
          hasMore.value = false;
        jobs.value.push(...openJobs);
        pageNum.value++;
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loadingMore.value = false;
      }
    };
    const loadMore = () => {
      loadJobs();
    };
    const viewJobDetail = (jobId) => {
      common_vendor.index.navigateTo({
        url: `/pages/jobs/jobDetail/jobDetail?id=${jobId}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(jobs.value, (job, k0, i0) => {
          return {
            a: common_vendor.t(job.title),
            b: common_vendor.t(job.description),
            c: common_vendor.t(job.salary),
            d: common_vendor.t(job.location),
            e: common_vendor.t(job.contact_info),
            f: job.job_id,
            g: common_vendor.o(($event) => viewJobDetail(job.job_id), job.job_id)
          };
        }),
        b: loadingMore.value
      }, loadingMore.value ? {} : {}, {
        c: !hasMore.value && jobs.value.length > 0
      }, !hasMore.value && jobs.value.length > 0 ? {} : {}, {
        d: jobs.value.length === 0 && !loadingMore.value
      }, jobs.value.length === 0 && !loadingMore.value ? {} : {}, {
        e: common_vendor.o(loadMore)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/jobs/jobs.js.map
