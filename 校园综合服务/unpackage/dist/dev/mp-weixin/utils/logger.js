"use strict";
const common_vendor = require("../common/vendor.js");
const logError = (err) => {
  try {
    common_vendor.index.__f__("error", "at utils/logger.js:9", "❌ 错误日志:", err);
    const logs = common_vendor.index.getStorageSync("logs") || [];
    logs.unshift({
      time: (/* @__PURE__ */ new Date()).toISOString(),
      error: formatError(err)
    });
    if (logs.length > 50) {
      logs.pop();
    }
    common_vendor.index.setStorageSync("logs", logs);
  } catch (e) {
    common_vendor.index.__f__("error", "at utils/logger.js:27", "日志记录失败:", e);
  }
};
const formatError = (err) => {
  if (typeof err === "string") {
    return { message: err };
  }
  if (typeof err === "object") {
    return {
      message: err.message || "未知错误",
      code: err.code || "",
      stack: err.stack || "",
      status: err.statusCode || ""
    };
  }
  return { message: "未知错误类型" };
};
exports.logError = logError;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/logger.js.map
