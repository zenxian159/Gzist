"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_config = require("../../../utils/config.js");
const moduleName = "mutualAid";
const _sfc_main = {
  __name: "aidDetail",
  setup(__props) {
    const detail = common_vendor.ref({});
    const commentList = common_vendor.ref([]);
    const replyContent = common_vendor.ref("");
    const replyPlaceholder = common_vendor.ref("评论千万条，友善第一条…");
    const replyParentId = common_vendor.ref(0);
    const targetId = common_vendor.ref("");
    const authorId = common_vendor.ref("");
    const currentUserId = common_vendor.ref("");
    function fetchDetail(id) {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/wx-mutualAid/${id}`,
        method: "GET",
        success(res) {
          detail.value = res.data;
          authorId.value = res.data.openid;
        },
        fail() {
          common_vendor.index.showToast({
            title: "获取详情失败",
            icon: "none"
          });
        }
      });
    }
    function formatTime(time) {
      const d = new Date(time);
      d.setHours(d.getHours() + 8);
      return d.toISOString().replace("T", " ").substr(0, 10);
    }
    function flattenComments(list, level = 0) {
      let res = [];
      list.forEach((item) => {
        item.level = level;
        res.push(item);
        if (item.children && item.children.length) {
          res = res.concat(flattenComments(item.children, level + 1));
        }
      });
      return res;
    }
    function getComments() {
      common_vendor.index.request({
        url: `${utils_config.config.baseURL}/comments?module=${moduleName}&target_id=${targetId.value}`,
        success(res) {
          const flat = flattenComments(res.data);
          flat.forEach((item) => {
            item.create_time = formatTime(item.create_time);
            item.isAuthor = item.user_id === authorId.value;
          });
          commentList.value = flat;
        }
      });
    }
    function previewImage(url) {
      common_vendor.index.previewImage({
        current: url,
        urls: [url]
      });
    }
    function onCommentTap(item) {
      if (item.user_id !== currentUserId.value)
        return;
      common_vendor.index.showActionSheet({
        itemList: ["删除该评论"],
        success(res) {
          if (res.tapIndex === 0)
            deleteComment(item.id);
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
    function showReplyInput(item) {
      if (item.user_id === currentUserId.value) {
        common_vendor.index.showToast({
          title: "不能回复自己",
          icon: "none"
        });
        return;
      }
      replyParentId.value = item.id;
      replyPlaceholder.value = `回复 ${item.user.nickname}：`;
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
    common_vendor.onLoad((options) => {
      targetId.value = options.id;
      fetchDetail(options.id);
      getComments();
    });
    common_vendor.onShow(() => {
      const user = common_vendor.index.getStorageSync("userInfo");
      if (user && user.openid) {
        currentUserId.value = user.openid;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: detail.value.avatarUrl,
        b: common_vendor.t(detail.value.nickName),
        c: common_vendor.t(detail.value.created_at),
        d: common_vendor.t(detail.value.content),
        e: detail.value.images && detail.value.images.length
      }, detail.value.images && detail.value.images.length ? {
        f: common_vendor.f(detail.value.images, (media, idx, i0) => {
          return common_vendor.e({
            a: media.type === "image"
          }, media.type === "image" ? {
            b: media.url,
            c: common_vendor.o(($event) => previewImage(media.url), idx)
          } : {
            d: media.url
          }, {
            e: idx
          });
        })
      } : {}, {
        g: common_vendor.t(commentList.value.length),
        h: common_vendor.f(commentList.value, (item, idx, i0) => {
          return common_vendor.e({
            a: item.user.avatarUrl,
            b: common_vendor.t(item.user.nickname),
            c: item.isAuthor
          }, item.isAuthor ? {} : {}, {
            d: item.level > 0
          }, item.level > 0 ? {} : {}, {
            e: item.level > 0
          }, item.level > 0 ? {
            f: common_vendor.t(item.replyToNickname)
          } : {}, {
            g: item.parent_content
          }, item.parent_content ? {
            h: common_vendor.t(item.parent_content)
          } : {}, {
            i: common_vendor.t(item.content),
            j: common_vendor.o(($event) => onCommentTap(item), item.id),
            k: common_vendor.t(item.create_time),
            l: common_vendor.o(($event) => showReplyInput(item), item.id),
            m: item.id,
            n: (item.level > 0 ? item.level * 40 : 0) + "rpx"
          });
        }),
        i: replyPlaceholder.value,
        j: replyContent.value,
        k: common_vendor.o(($event) => replyContent.value = $event.detail.value),
        l: common_vendor.o(submitComment)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ddfc318c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/MutualAid/aidDetail/aidDetail.js.map
