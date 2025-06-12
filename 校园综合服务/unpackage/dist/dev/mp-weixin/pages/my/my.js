"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const userInfo = common_vendor.reactive({});
    const hasUserInfo = common_vendor.ref(false);
    const canIUseGetUserProfile = common_vendor.ref(false);
    const openid = common_vendor.ref("");
    const phone = common_vendor.ref("");
    const navList = common_vendor.ref([
      {
        title: "申请接单",
        icon: "/static/image/icon/applyRunner.png",
        url: "/pages/applyRunner/applyRunner"
      },
      {
        title: "我的消息",
        icon: "/static/image/tab/chat.png",
        url: "/pages/message/message"
      }
    ]);
    common_vendor.onMounted(() => {
      getStorage();
      if (typeof common_vendor.wx$1.getUserProfile === "function") {
        canIUseGetUserProfile.value = true;
      }
    });
    const onNavTap = (url) => {
      common_vendor.index.navigateTo({
        url
      });
    };
    const getUserProfile = () => {
      common_vendor.index.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/my/my.vue:122", "用户信息:", res.userInfo);
          if (!res.userInfo) {
            common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
            return;
          }
          const tempUserInfo = res.userInfo;
          common_vendor.index.login({
            success: (loginRes) => {
              if (loginRes.code) {
                common_vendor.wx$1.request({
                  url: "http://127.0.0.1:3000/api/getOpenid",
                  method: "POST",
                  data: { code: loginRes.code },
                  success: (response) => {
                    common_vendor.index.__f__("log", "at pages/my/my.vue:137", "获取 openid:", response.data.openid);
                    openid.value = response.data.openid;
                    checkUserInDB(response.data.openid, tempUserInfo);
                  },
                  fail: () => {
                    common_vendor.index.showToast({ title: "获取 openid 失败", icon: "none" });
                  }
                });
              }
            }
          });
        },
        fail: () => {
          common_vendor.index.showToast({ title: "用户拒绝授权", icon: "none" });
        }
      });
    };
    const checkUserInDB = (openidVal, tempUserInfo) => {
      common_vendor.wx$1.request({
        url: "http://127.0.0.1:3000/api/checkUser",
        method: "POST",
        data: { openid: openidVal },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/my/my.vue:163", res.data, "服务器返回信息");
          if (res.data.exists) {
            common_vendor.index.__f__("log", "at pages/my/my.vue:165", "用户已存在，更新缓存");
            Object.assign(tempUserInfo, res.data.userInfo);
          } else {
            common_vendor.index.__f__("log", "at pages/my/my.vue:169", "用户不存在，存入数据库");
            tempUserInfo.openid = openidVal;
            tempUserInfo.phone = phone.value;
            saveUserToDB(tempUserInfo);
          }
          common_vendor.index.setStorage({
            key: "userInfo",
            data: tempUserInfo,
            success: () => {
              getStorage();
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/my/my.vue:183", "查询用户失败:", err);
          common_vendor.index.showToast({ title: "查询用户失败", icon: "none" });
        }
      });
    };
    const getStorage = () => {
      common_vendor.index.getStorage({
        key: "userInfo",
        success: (res) => {
          Object.assign(userInfo, res.data);
          hasUserInfo.value = true;
        }
      });
    };
    const previewImage = () => {
      const currentUrl = userInfo.avatarUrl;
      if (currentUrl) {
        common_vendor.index.previewImage({
          current: currentUrl,
          urls: [currentUrl]
        });
      } else {
        common_vendor.index.showToast({ title: "无头像可预览", icon: "none" });
      }
    };
    const saveUserToDB = (tempUserInfo) => {
      common_vendor.index.request({
        url: "http://127.0.0.1:3000/api/saveUser",
        method: "POST",
        data: {
          openid: tempUserInfo.openid,
          avatarUrl: tempUserInfo.avatarUrl,
          nickName: tempUserInfo.nickName,
          phone: tempUserInfo.phone
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/my/my.vue:225", "用户信息已存入数据库:", res.data);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/my/my.vue:228", "数据库存储失败:", err);
        }
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: !hasUserInfo.value
      }, !hasUserInfo.value ? {
        c: common_assets._imports_1,
        d: common_vendor.o(getUserProfile)
      } : {
        e: userInfo.avatarUrl,
        f: common_vendor.o(previewImage),
        g: common_vendor.t(userInfo.nickName)
      }, {
        h: common_vendor.f(navList.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.title),
            c: item.title,
            d: common_vendor.o(($event) => onNavTap(item.url), item.title)
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2f1ef635"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
