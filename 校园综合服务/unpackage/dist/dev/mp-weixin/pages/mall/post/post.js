"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const utils_api = require("../../../utils/api.js");
const utils_logger = require("../../../utils/logger.js");
const _sfc_main = {
  __name: "post",
  setup(__props) {
    const title = common_vendor.ref("");
    const description = common_vendor.ref("");
    const fileList = common_vendor.ref([]);
    const maxFiles = common_vendor.ref(6);
    const category = common_vendor.ref(["电子产品", "学习用品", "生活用品", "运动用品", "其他"]);
    const currentCategory = common_vendor.ref("请选择分类");
    const price = common_vendor.ref("");
    const openid = common_vendor.ref("");
    const isEditing = common_vendor.ref(false);
    const trade_id = common_vendor.ref("");
    common_vendor.onMounted(() => {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo && userInfo.openid) {
        openid.value = userInfo.openid;
      }
      common_vendor.index.$on("sendProductData", (data) => {
        if (data) {
          const item = data.item;
          isEditing.value = true;
          title.value = item.title;
          description.value = item.description;
          currentCategory.value = item.category;
          price.value = item.price;
          fileList.value = item.fileList;
          trade_id.value = item.trade_id;
        }
      });
    });
    const chooseMedia = () => {
      common_vendor.index.showActionSheet({
        itemList: ["选择图片", "选择视频"],
        success: (res) => {
          if (res.tapIndex === 0)
            chooseImage();
          if (res.tapIndex === 1)
            chooseVideo();
        }
      });
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: maxFiles.value - fileList.value.length,
        success: (res) => {
          const newFiles = res.tempFilePaths.map((path) => ({ type: "image", url: path }));
          newFiles.forEach((file) => uploadFileToServer(file));
        }
      });
    };
    const chooseVideo = () => {
      common_vendor.index.chooseVideo({
        success: (res) => {
          const file = { type: "video", url: res.tempFilePath };
          uploadFileToServer(file);
        }
      });
    };
    const uploadFileToServer = (file) => {
      common_vendor.index.uploadFile({
        url: `${utils_config.config.baseURL}/upload`,
        filePath: file.url,
        name: "file",
        formData: { type: file.type },
        success: (res) => {
          const data = JSON.parse(res.data);
          if (res.statusCode === 200 && data.url) {
            fileList.value.push({ type: file.type, url: data.url });
          }
        },
        fail: (err) => {
          utils_logger.logError(err);
          common_vendor.index.showToast({ title: "上传失败", icon: "none" });
        }
      });
    };
    const deleteFile = (index) => {
      fileList.value.splice(index, 1);
    };
    const previewFile = (url, type) => {
      if (type === "image") {
        const urls = fileList.value.filter((item) => item.type === "image").map((item) => item.url);
        common_vendor.index.previewImage({ current: url, urls });
      }
    };
    const onCategoryChange = (e) => {
      currentCategory.value = category.value[e.detail.value];
    };
    const onInputChange = (field, e) => {
      const value = e.detail.value;
      if (field === "title")
        title.value = value;
      else if (field === "description")
        description.value = value;
      else if (field === "price")
        price.value = value;
    };
    const submitForm = () => {
      if (!title.value || !description.value || !fileList.value.length || currentCategory.value === "请选择分类" || !price.value || !openid.value) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      isEditing.value ? updateProduct() : createProduct();
    };
    const updateProduct = async () => {
      try {
        await utils_api.request({
          url: `${utils_config.config.baseURL}/trades/${trade_id.value}`,
          method: "PUT",
          data: {
            title: title.value,
            description: description.value,
            currentCategory: currentCategory.value,
            price: price.value,
            fileList: fileList.value
          }
        });
        common_vendor.index.$emit("product-updated", {
          item: {
            trade_id: trade_id.value,
            title: title.value,
            description: description.value,
            category: currentCategory.value,
            price: price.value,
            fileList: fileList.value,
            seller_id: openid.value,
            update_time: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
        common_vendor.index.navigateBack();
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "更新失败", icon: "none" });
      }
    };
    const createProduct = async () => {
      try {
        await utils_api.request({
          url: `${utils_config.config.baseURL}/trades`,
          method: "POST",
          data: {
            title: title.value,
            description: description.value,
            currentCategory: currentCategory.value,
            price: price.value,
            fileList: fileList.value,
            openid: openid.value
          }
        });
        common_vendor.index.showToast({ title: "发布成功" });
        resetForm();
        common_vendor.index.navigateBack();
      } catch (err) {
        utils_logger.logError(err);
        common_vendor.index.showToast({ title: "发布失败", icon: "none" });
      }
    };
    const resetForm = () => {
      title.value = "";
      description.value = "";
      fileList.value = [];
      currentCategory.value = "请选择分类";
      price.value = "";
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => onInputChange("title", $event)),
        b: title.value,
        c: description.value,
        d: common_vendor.o(($event) => onInputChange("description", $event)),
        e: common_vendor.f(fileList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "image"
          }, item.type === "image" ? {
            b: item.url
          } : item.type === "video" ? {
            d: item.url
          } : {}, {
            c: item.type === "video",
            e: common_vendor.o(($event) => deleteFile(index), index),
            f: index,
            g: common_vendor.o(($event) => previewFile(item.url, item.type), index)
          });
        }),
        f: fileList.value.length < maxFiles.value
      }, fileList.value.length < maxFiles.value ? {
        g: common_vendor.o(chooseMedia)
      } : {}, {
        h: common_vendor.t(currentCategory.value),
        i: category.value,
        j: common_vendor.o(onCategoryChange),
        k: common_vendor.o(($event) => onInputChange("price", $event)),
        l: price.value,
        m: common_vendor.t(isEditing.value ? "完成" : "发布"),
        n: common_vendor.o(submitForm)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mall/post/post.js.map
