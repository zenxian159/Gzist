"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const moduleName = "lostAndFound";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const item = common_vendor.ref({});
    const fileList = common_vendor.ref([]);
    const latitude = common_vendor.ref(23.25904);
    const longitude = common_vendor.ref(113.457244);
    const markers = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const isMoving = common_vendor.ref(false);
    const baseSpeed = common_vendor.ref(5);
    const minDuration = common_vendor.ref(2e3);
    const maxDuration = common_vendor.ref(4e3);
    const commentList = common_vendor.ref([]);
    const replyContent = common_vendor.ref("");
    const replyPlaceholder = common_vendor.ref("评论千万条，友善第一条…");
    const replyParentId = common_vendor.ref(0);
    const targetId = common_vendor.ref("");
    const authorId = common_vendor.ref("");
    const currentUserId = common_vendor.ref("");
    let mapCtx = null;
    function formatTime(ts) {
      const d = new Date(ts);
      d.setHours(d.getHours() + 8);
      return d.toISOString().slice(0, 10);
    }
    function formatReward(it) {
      if (it.reward === "无" || it.reward === "面议")
        return it.reward;
      if (it.reward === "输入")
        return it.rewardAmount ? it.rewardAmount + " 元" : "无";
      return "";
    }
    common_vendor.onLoad((options) => {
      mapCtx = common_vendor.index.createMapContext("myMap");
      mapCtx.setBoundary({
        southwest: {
          latitude: 23.255863,
          longitude: 113.453333
        },
        northeast: {
          latitude: 23.261935,
          longitude: 113.46152
        }
      });
      if (options.item) {
        const it = JSON.parse(decodeURIComponent(options.item));
        item.value = {
          ...it,
          time: formatTime(it.time)
        };
        fileList.value = it.fileList || [];
        targetId.value = it.id;
        authorId.value = it.openid;
        if (it.type === "丢失物品")
          renderLostPath(it);
        else
          renderPickupLocation(it);
        getComments();
      }
    });
    common_vendor.onShow(() => {
      const u = common_vendor.index.getStorageSync("userInfo");
      if (u == null ? void 0 : u.openid)
        currentUserId.value = u.openid;
    });
    function renderLostPath(it) {
      markers.value = [{
        id: it.markerId,
        latitude: it.latitude,
        longitude: it.longitude,
        iconPath: "/static/image/5.png",
        width: 30,
        height: 30
      }];
      polyline.value = [{
        points: it.location[0].points,
        color: "#204dad",
        width: 4,
        dottedLine: false
      }];
    }
    function renderPickupLocation(it) {
      markers.value = [it.location];
      polyline.value = [];
    }
    function calloutTap(e) {
      common_vendor.index.__f__("log", "at pages/lostAndFound/detail/detail.vue:207", "calloutTap", e);
    }
    function markerTap(e) {
      common_vendor.index.__f__("log", "at pages/lostAndFound/detail/detail.vue:211", "markerTap", e.detail.markerId);
    }
    function setMoveAlong() {
      var _a;
      const pts = ((_a = polyline.value[0]) == null ? void 0 : _a.points) || [];
      if (pts.length < 2) {
        common_vendor.index.showToast({
          title: "至少两点",
          icon: "none"
        });
        return;
      }
      const dist = pts.reduce((sum, p, i, arr) => {
        if (i === 0)
          return 0;
        return sum + calculateDistance(
          arr[i - 1].latitude,
          arr[i - 1].longitude,
          p.latitude,
          p.longitude
        );
      }, 0);
      let dur = dist * baseSpeed.value;
      dur = Math.min(maxDuration.value, Math.max(minDuration.value, dur));
      isMoving.value = true;
      mapCtx.moveAlong({
        markerId: item.value.markerId,
        path: pts,
        autoRotate: true,
        duration: dur,
        success: () => common_vendor.index.showToast({
          title: "回放完成",
          icon: "none"
        }),
        complete: () => isMoving.value = false
      });
    }
    function calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371e3, toRad = Math.PI / 180;
      const dLat = (lat2 - lat1) * toRad, dLon = (lon2 - lon1) * toRad;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
      return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    function flattenComments(list, level = 0) {
      let res = [];
      list.forEach((item2) => {
        item2.level = level;
        res.push(item2);
        if (item2.children && item2.children.length) {
          res = res.concat(flattenComments(item2.children, level + 1));
        }
      });
      return res;
    }
    function getComments() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/comments?module=${moduleName}&target_id=${targetId.value}`,
        success(res) {
          const flat = flattenComments(res.data);
          flat.forEach((item2) => {
            item2.create_time = formatTime(item2.create_time);
            item2.isAuthor = item2.user_id === authorId.value;
          });
          commentList.value = flat;
        }
      });
    }
    function showReplyInput(item2) {
      if (item2.user_id === currentUserId.value) {
        common_vendor.index.showToast({
          title: "不能回复自己",
          icon: "none"
        });
        return;
      }
      replyParentId.value = item2.id;
      replyPlaceholder.value = `回复 ${item2.user.nickname}：`;
    }
    function onCommentTap(item2) {
      if (item2.user_id !== currentUserId.value)
        return;
      common_vendor.index.showActionSheet({
        itemList: ["删除该评论"],
        success(res) {
          if (res.tapIndex === 0)
            deleteComment(item2.id);
        }
      });
    }
    function deleteComment(id) {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/comments/${id}`,
        method: "DELETE",
        success() {
          common_vendor.index.showToast({
            title: "删除成功"
          });
          getComments();
        }
      });
    }
    function submitComment() {
      if (!replyContent.value.trim())
        return;
      const user = common_vendor.index.getStorageSync("userInfo");
      if (!user || !user.openid) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/comments`,
        method: "POST",
        data: {
          module: moduleName,
          target_id: targetId.value,
          parent_id: replyParentId.value,
          content: replyContent.value,
          user_id: user.openid
        },
        success() {
          replyContent.value = "";
          replyParentId.value = 0;
          replyPlaceholder.value = "评论千万条，友善第一条…";
          getComments();
        }
      });
    }
    function copyPhone() {
      common_vendor.index.setClipboardData({
        data: item.value.contact,
        success: () => common_vendor.index.showToast({
          title: "已复制电话"
        })
      });
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: item.value.avatarUrl,
        b: common_vendor.t(item.value.nickName),
        c: common_vendor.t(item.value.createdAt),
        d: latitude.value,
        e: longitude.value,
        f: markers.value,
        g: polyline.value,
        h: common_vendor.o(calloutTap),
        i: common_vendor.o(markerTap),
        j: item.value.type === "丢失物品"
      }, item.value.type === "丢失物品" ? {
        k: common_vendor.t(isMoving.value ? "回放中…" : "启动路径模拟"),
        l: isMoving.value,
        m: common_vendor.o(setMoveAlong)
      } : {}, {
        n: common_vendor.t(item.value.itemName),
        o: common_vendor.t(item.value.contact),
        p: common_vendor.o(copyPhone),
        q: common_vendor.t(item.value.claimMethod || "暂无信息"),
        r: common_vendor.t(item.value.type === "丢失物品" ? "丢失时间" : "拾取时间"),
        s: common_vendor.t(item.value.time),
        t: item.value.type === "丢失物品"
      }, item.value.type === "丢失物品" ? {
        v: common_vendor.t(formatReward(item.value))
      } : {}, {
        w: common_vendor.t(item.value.remarks || "无"),
        x: fileList.value.length > 1
      }, fileList.value.length > 1 ? {
        y: common_vendor.f(fileList.value, (f, i, i0) => {
          return common_vendor.e({
            a: f.type === "image"
          }, f.type === "image" ? {
            b: f.url
          } : f.type === "video" ? {
            d: f.url
          } : {}, {
            c: f.type === "video",
            e: i
          });
        })
      } : ((_a = fileList.value[0]) == null ? void 0 : _a.type) === "image" ? {
        A: fileList.value[0].url
      } : ((_b = fileList.value[0]) == null ? void 0 : _b.type) === "video" ? {
        C: fileList.value[0].url
      } : {}, {
        z: ((_c = fileList.value[0]) == null ? void 0 : _c.type) === "image",
        B: ((_d = fileList.value[0]) == null ? void 0 : _d.type) === "video",
        D: common_vendor.t(commentList.value.length),
        E: common_vendor.f(commentList.value, (item2, idx, i0) => {
          return common_vendor.e({
            a: item2.user.avatarUrl,
            b: common_vendor.t(item2.user.nickname),
            c: item2.isAuthor
          }, item2.isAuthor ? {} : {}, {
            d: item2.level > 0
          }, item2.level > 0 ? {} : {}, {
            e: item2.level > 0
          }, item2.level > 0 ? {
            f: common_vendor.t(item2.replyToNickname)
          } : {}, {
            g: item2.parent_content
          }, item2.parent_content ? {
            h: common_vendor.t(item2.parent_content)
          } : {}, {
            i: common_vendor.t(item2.content),
            j: common_vendor.o(($event) => onCommentTap(item2), item2.id),
            k: common_vendor.t(item2.create_time),
            l: common_vendor.o(($event) => showReplyInput(item2), item2.id),
            m: item2.id,
            n: (item2.level > 0 ? item2.level * 40 : 0) + "rpx"
          });
        }),
        F: replyPlaceholder.value,
        G: replyContent.value,
        H: common_vendor.o(($event) => replyContent.value = $event.detail.value),
        I: common_vendor.o(submitComment)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9ae87660"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/lostAndFound/detail/detail.js.map
