"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_config = require("../../utils/config.js");
const maxFiles = 3;
const _sfc_main = {
  __name: "publish",
  setup(__props) {
    const currentTab = common_vendor.ref(["拾取物品", "丢失物品"]);
    const currentIndex = common_vendor.ref(0);
    const itemName = common_vendor.ref("");
    const fileList = common_vendor.ref([]);
    const pickLocation = common_vendor.ref("");
    const pickMarker = common_vendor.ref(null);
    const pickLocationName = common_vendor.ref("");
    const selectedTime = common_vendor.ref("");
    const today = common_vendor.ref("");
    const markers = common_vendor.ref([{
      id: 1,
      width: 25,
      height: 25,
      iconPath: "/static/image/5.png",
      latitude: 0,
      longitude: 0
    }]);
    const polyline = common_vendor.ref([{
      points: []
    }]);
    const claimMethod = common_vendor.ref("");
    const contact = common_vendor.ref("");
    const remarks = common_vendor.ref("");
    const reward = common_vendor.ref("无");
    const rewardAmount = common_vendor.ref("");
    const openid = common_vendor.ref("");
    const isEditing = common_vendor.ref(false);
    const id = common_vendor.ref("");
    const disableTab = common_vendor.ref(false);
    function onRewardChange(e) {
      reward.value = e.detail.value;
    }
    common_vendor.onLoad((options) => {
      var _a;
      const u = common_vendor.index.getStorageSync("userInfo") || {};
      if (u.openid)
        openid.value = u.openid;
      function formatTime(time) {
        const date = new Date(time);
        const offset = 8;
        date.setHours(date.getHours() + offset);
        return date.toISOString().replace("T", " ").substring(0, 10);
      }
      const d = /* @__PURE__ */ new Date();
      today.value = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, "0")).join("-");
      if (options.item) {
        disableTab.value = true;
        isEditing.value = true;
        const item = JSON.parse(decodeURIComponent(options.item));
        currentIndex.value = item.type === "丢失物品" ? 1 : 0;
        itemName.value = item.itemName;
        fileList.value = item.fileList;
        claimMethod.value = item.claimMethod;
        contact.value = item.contact;
        remarks.value = item.remarks;
        selectedTime.value = formatTime(item.time);
        id.value = item.id;
        if (currentIndex.value === 0) {
          pickMarker.value = item.location;
          pickLocation.value = item.location.name || "";
        } else {
          polyline.value = item.location;
          const pts = ((_a = item.location[0]) == null ? void 0 : _a.points) || [];
          if (pts.length) {
            const last = pts[pts.length - 1];
            markers.value = [{
              ...markers.value[0],
              latitude: last.latitude,
              longitude: last.longitude
            }];
          }
          reward.value = item.reward;
          rewardAmount.value = item.rewardAmount || "";
        }
      }
    });
    common_vendor.onShow(() => {
    });
    function handlePickData(data) {
      markers.value = data.markers;
      polyline.value = data.polyline;
    }
    function handleLostData(data) {
      pickMarker.value = data.currentMarker;
      pickLocationName.value = data.locationName;
    }
    common_vendor.onMounted(() => {
      common_vendor.index.$on("sendPick", handlePickData);
      common_vendor.index.$on("sendLost", handleLostData);
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("sendPick", handlePickData);
      common_vendor.index.$off("sendLost", handleLostData);
    });
    function clickTab(i) {
      if (disableTab.value)
        return;
      currentIndex.value = i;
      reward.value = "无";
      rewardAmount.value = "";
    }
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
          const arr = res.tempFilePaths.map((p) => ({
            type: "image",
            url: p
          }));
          arr.forEach((f) => uploadFileToServer(f.url, f.type));
          fileList.value.push(...arr);
        }
      });
    }
    function chooseVideo() {
      common_vendor.index.chooseVideo({
        success(res) {
          const f = {
            type: "video",
            url: res.tempFilePath
          };
          uploadFileToServer(f.url, f.type);
          fileList.value.push(f);
        }
      });
    }
    function uploadFileToServer(path, type) {
      common_vendor.index.uploadFile({
        url: `${utils_config.config.baseURL}/upload`,
        filePath: path,
        name: "file",
        formData: {
          type
        },
        success({
          data,
          statusCode
        }) {
          const d = JSON.parse(data);
          if (statusCode === 200 && d.url) {
            fileList.value = fileList.value.map((f) => {
              return f.url === path ? {
                ...f,
                url: d.url
              } : f;
            });
          }
        }
      });
    }
    function deleteFile(idx) {
      fileList.value.splice(idx, 1);
    }
    function previewFile(url) {
      common_vendor.index.previewImage({
        urls: fileList.value.filter((f) => f.type === "image").map((f) => f.url),
        current: url
      });
    }
    function onDateChange(e) {
      selectedTime.value = e.detail.value;
    }
    function handleLocationClick() {
      if (currentIndex.value === 0) {
        common_vendor.index.navigateTo({
          url: "/pages/publish/selectPoint/selectPoint",
          success(res) {
            common_vendor.index.$emit("sendData", {
              marker: pickMarker.value,
              location: pickLocation.value
            });
          }
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/publish/simulatePath/simulatePath",
          success(res) {
            common_vendor.index.$emit("sendData2", {
              markers: markers.value,
              polyline: polyline.value
            });
          }
        });
      }
    }
    function submitForm() {
      if (!itemName.value || !fileList.value.length || !openid.value || !claimMethod.value || !contact.value || !selectedTime.value || currentIndex.value === 0 && !pickMarker.value || currentIndex.value === 1 && !polyline.value[0].points.length) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      const base = {
        openid: openid.value,
        itemName: itemName.value,
        fileList: fileList.value,
        time: selectedTime.value,
        claimMethod: claimMethod.value,
        contact: contact.value,
        remarks: remarks.value
      };
      let url, payload;
      if (currentIndex.value === 0) {
        url = isEditing.value ? `${utils_config.config.baseURL}/updateLostFound` : `${utils_config.config.baseURL}/pickRecord`;
        payload = {
          ...base,
          pickLocation: pickMarker.value
        };
      } else {
        url = isEditing.value ? `${utils_config.config.baseURL}/updateLostFound` : `${utils_config.config.baseURL}/lostRecord`;
        payload = {
          ...base,
          lostPath: polyline.value,
          reward: reward.value,
          rewardAmount: reward.value === "输入" ? Number(rewardAmount.value) || 0 : ""
        };
      }
      if (isEditing.value)
        payload.id = id.value;
      common_vendor.index.request({
        url,
        method: "POST",
        data: payload,
        header: {
          "content-type": "application/json"
        },
        success({
          statusCode,
          data
        }) {
          if (statusCode === 200) {
            common_vendor.index.showToast({
              title: isEditing.value ? "更新成功" : "发布成功"
            });
            common_vendor.index.navigateBack();
          } else {
            common_vendor.index.showToast({
              title: "操作失败",
              icon: "none"
            });
          }
        }
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(currentTab.value, (tab, i, i0) => {
          return {
            a: common_vendor.t(tab),
            b: common_vendor.n({
              "tab-active": currentIndex.value === i
            }),
            c: i,
            d: common_vendor.o(($event) => clickTab(i), i)
          };
        }),
        b: disableTab.value,
        c: itemName.value,
        d: common_vendor.o(($event) => itemName.value = $event.detail.value),
        e: common_vendor.f(fileList.value, (f, idx, i0) => {
          return common_vendor.e({
            a: f.type === "image"
          }, f.type === "image" ? {
            b: f.url,
            c: common_vendor.o(($event) => previewFile(f.url), idx)
          } : {
            d: f.url
          }, {
            e: common_vendor.o(($event) => deleteFile(idx), idx),
            f: idx
          });
        }),
        f: fileList.value.length < maxFiles
      }, fileList.value.length < maxFiles ? {
        g: common_vendor.o(chooseMedia)
      } : {}, {
        h: common_vendor.t(currentIndex.value === 0 ? "拾取地点" : "丢失地点"),
        i: common_vendor.t(currentIndex.value === 0 ? pickMarker.value ? "点击查看标记点" : "请在地图上选点" : polyline.value[0].points.length > 0 ? "点击查看模拟路径" : "请在地图上模拟路径"),
        j: common_vendor.o(handleLocationClick),
        k: common_vendor.t(currentIndex.value === 0 ? "拾取时间" : "丢失时间"),
        l: common_vendor.t(selectedTime.value || (currentIndex.value === 0 ? "请选择拾取时间" : "请选择丢失时间")),
        m: today.value,
        n: common_vendor.o(onDateChange),
        o: claimMethod.value,
        p: common_vendor.o(($event) => claimMethod.value = $event.detail.value),
        q: contact.value,
        r: common_vendor.o(($event) => contact.value = $event.detail.value),
        s: remarks.value,
        t: common_vendor.o(($event) => remarks.value = $event.detail.value),
        v: currentIndex.value === 1
      }, currentIndex.value === 1 ? common_vendor.e({
        w: reward.value == "无",
        x: reward.value == "面议",
        y: reward.value == "输入",
        z: common_vendor.o(onRewardChange),
        A: reward.value == "输入"
      }, reward.value == "输入" ? {
        B: rewardAmount.value,
        C: common_vendor.o(($event) => rewardAmount.value = $event.detail.value)
      } : {}) : {}, {
        D: common_vendor.t(isEditing.value ? "完成" : "发布"),
        E: common_vendor.o(submitForm)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bfce3555"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
