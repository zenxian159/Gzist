"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const formData = common_vendor.reactive({
      userInfo: {},
      tempFilePaths: "",
      name: "",
      phone: "",
      openid: ""
      // 存储 openid 以便更新数据库
    });
    common_vendor.onMounted(() => {
      common_vendor.index.getStorage({
        key: "userInfo",
        success: (res) => {
          formData.userInfo = res.data;
          formData.tempFilePaths = res.data.avatarUrl;
          formData.name = res.data.nickName;
          formData.openid = res.data.openid;
          formData.phone = res.data.phone;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/my/edit/edit.vue:64", "获取缓存失败：", err);
        }
      });
    });
    function inputChange(e) {
      const field = e.currentTarget.dataset.field;
      const value = e.detail.value;
      formData[field] = value;
    }
    function handleChooseImg() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          let tempFilePath = res.tempFilePaths[0];
          uploadFileToServer(tempFilePath);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/my/edit/edit.vue:88", "选择图片失败：", err);
        }
      });
    }
    function uploadFileToServer(filePath) {
      common_vendor.index.uploadFile({
        url: "http://127.0.0.1:3000/api/upload",
        // 服务器地址
        filePath,
        name: "file",
        formData: {
          // 可添加额外参数
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if (res.statusCode === 200) {
              formData.tempFilePaths = data.url;
            } else {
              common_vendor.index.__f__("error", "at pages/my/edit/edit.vue:109", "上传失败，状态码：", res.statusCode);
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/my/edit/edit.vue:112", "解析返回数据失败：", error);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/my/edit/edit.vue:116", "上传失败", err);
        }
      });
    }
    function submitForm() {
      if (!formData.name.trim()) {
        common_vendor.index.showToast({
          title: "昵称不能为空",
          icon: "none"
        });
        return;
      }
      formData.userInfo.avatarUrl = formData.tempFilePaths;
      formData.userInfo.nickName = formData.name;
      formData.userInfo.phone = formData.phone;
      common_vendor.index.setStorage({
        key: "userInfo",
        data: formData.userInfo,
        success: () => {
          common_vendor.index.__f__("log", "at pages/my/edit/edit.vue:140", "数据存储到缓存成功");
        }
      });
      common_vendor.index.request({
        url: "http://127.0.0.1:3000/api/updateUser",
        // 服务器接口地址
        method: "POST",
        data: {
          openid: formData.openid,
          nickName: formData.name,
          avatarUrl: formData.tempFilePaths,
          phone: formData.phone
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/my/edit/edit.vue:155", "用户信息存入数据库:", res.data);
          common_vendor.index.showToast({
            title: "保存成功",
            icon: "success"
          });
          common_vendor.index.reLaunch({
            url: "/pages/my/my"
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/my/edit/edit.vue:165", "数据库存储失败:", err);
          common_vendor.index.showToast({
            title: "保存失败，请重试",
            icon: "none"
          });
        }
      });
    }
    function logOut() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success(res) {
          if (res.confirm) {
            common_vendor.index.removeStorage({
              key: "userInfo"
            });
            common_vendor.index.reLaunch({ url: "/pages/my/my" });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return {
        a: formData.tempFilePaths || "/static/image/avatar.png",
        b: common_vendor.o(handleChooseImg),
        c: formData.name,
        d: common_vendor.o(inputChange),
        e: formData.phone,
        f: common_vendor.o(inputChange),
        g: common_vendor.o(submitForm),
        h: common_vendor.o(logOut)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-08e64464"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/my/edit/edit.js.map
