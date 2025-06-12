"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const maxFiles = 3;
const _sfc_main = {
  __name: "addAid",
  setup(__props) {
    const id = common_vendor.ref("");
    const content = common_vendor.ref("");
    const fileList = common_vendor.ref([]);
    const openid = common_vendor.ref("");
    const isEditing = common_vendor.ref(false);
    common_vendor.onLoad((options) => {
      const user = common_vendor.index.getStorageSync("userInfo");
      if (!(user == null ? void 0 : user.openid)) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      openid.value = user.openid;
      if (options.id) {
        id.value = options.id;
        isEditing.value = true;
        common_vendor.index.request({
          url: `${utils_config.config.baseURL}/wx-mutualAid/${id.value}`,
          method: "GET",
          success(res) {
            if (res.statusCode === 200) {
              content.value = res.data.content;
              fileList.value = res.data.images.map((i) => ({
                type: i.type,
                url: i.url
              }));
            }
          }
        });
      }
    });
    function chooseMedia() {
      common_vendor.index.showActionSheet({
        itemList: ["选择图片", "选择视频"],
        success(res) {
          if (res.tapIndex === 0)
            chooseImage();
          else
            chooseVideo();
        }
      });
    }
    function chooseImage() {
      common_vendor.index.chooseImage({
        count: maxFiles - fileList.value.length,
        success(res) {
          const arr = res.tempFilePaths.map((p) => ({ type: "image", url: p }));
          fileList.value.push(...arr);
        }
      });
    }
    function chooseVideo() {
      common_vendor.index.chooseVideo({
        success(res) {
          fileList.value.push({ type: "video", url: res.tempFilePath });
        }
      });
    }
    function deleteFile(idx) {
      fileList.value.splice(idx, 1);
    }
    function previewFile(f) {
      if (f.type === "image") {
        const urls = fileList.value.filter((x) => x.type === "image").map((x) => x.url);
        common_vendor.index.previewImage({ current: f.url, urls });
      }
    }
    async function submitAid() {
      if (!content.value.trim()) {
        common_vendor.index.showToast({ title: "请输入内容", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "保存中...", mask: true });
      try {
        const newFiles = fileList.value.filter(
          (f) => f.url.startsWith("wxfile://") || f.url.startsWith("http://tmp")
        );
        const uploaded = await Promise.all(
          newFiles.map((f) => uploadOne(f.url, f.type))
        );
        const images = fileList.value.map((f) => {
          const hit = uploaded.find((u) => u.localPath === f.url);
          return hit ? { url: hit.url, type: hit.type } : { url: f.url, type: f.type };
        });
        const apiUrl = isEditing.value ? `${utils_config.config.baseURL}/mutualAid/${id.value}` : `${utils_config.config.baseURL}/mutualAid`;
        const method = isEditing.value ? "PUT" : "POST";
        common_vendor.index.request({
          url: apiUrl,
          method,
          header: { "content-type": "application/json" },
          data: {
            openid: openid.value,
            content: content.value,
            images
            // <— 这里所有都是服务器返回的地址了
          },
          success() {
            common_vendor.index.showToast({ title: isEditing.value ? "修改成功" : "发布成功" });
            common_vendor.index.navigateBack();
          },
          fail() {
            common_vendor.index.showToast({ title: "操作失败", icon: "none" });
          },
          complete() {
            common_vendor.index.hideLoading();
          }
        });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/MutualAid/addAid/addAid.vue:188", e);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "上传失败", icon: "none" });
      }
    }
    function uploadOne(localPath, type) {
      return new Promise((resolve, reject) => {
        common_vendor.index.uploadFile({
          url: `${utils_config.config.baseURL}/upload`,
          filePath: localPath,
          name: "file",
          formData: { type },
          success(res) {
            const data = JSON.parse(res.data);
            if (res.statusCode === 200 && data.url) {
              resolve({ localPath, url: data.url, type });
            } else {
              reject(data);
            }
          },
          fail: reject
        });
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: content.value,
        b: common_vendor.o(($event) => content.value = $event.detail.value),
        c: common_vendor.f(fileList.value, (f, idx, i0) => {
          return common_vendor.e({
            a: f.type === "image"
          }, f.type === "image" ? {
            b: f.url,
            c: common_vendor.o(($event) => previewFile(f), idx)
          } : {
            d: f.url
          }, {
            e: common_vendor.o(($event) => deleteFile(idx), idx),
            f: idx
          });
        }),
        d: fileList.value.length < maxFiles
      }, fileList.value.length < maxFiles ? {
        e: common_vendor.o(chooseMedia)
      } : {}, {
        f: common_vendor.t(isEditing.value ? "完成" : "发布"),
        g: common_vendor.o(submitAid)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f80793d9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/MutualAid/addAid/addAid.js.map
