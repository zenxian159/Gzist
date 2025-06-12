<template>
  <view>
    <!-- 顶部显示区域 -->
    <view class="top-show">
      <image
        mode="widthFix"
        class="top-show-img"
        src="/static/image/myBanner.jpg"
        show-menu-by-longpress="true"
      ></image>
    </view>

    <!-- 底部显示区域 -->
    <view class="bottom-show">
      <!-- 未登录面板 -->
      <view v-if="!hasUserInfo" class="user-container" @click="getUserProfile">
        <view class="avatar-container">
          <image src="/static/image/avatar.png"></image>
          <view class="no-login">
            <text class="ellipsis">未登录</text>
            <text>点击授权登录</text>
          </view>
        </view>
      </view>

      <!-- 登录以后得面板 -->
      <view v-else class="user-container">
        <view class="avatar-container">
          <image :src="userInfo.avatarUrl" @click="previewImage"></image>
          <view class="no-login">
            <text class="ellipsis" style="color:#000;">
              {{ userInfo.nickName }}
            </text>
          </view>
        </view>
        <view class="edit">
          <navigator url="/pages/my/edit/edit"> 编辑 </navigator>
        </view>
      </view>
    </view>

    <!-- 统计信息 -->
    <view class="stats">
      <view class="stat-item">
        <text class="stat-num">0</text>
        <text class="stat-label">我发布的</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">0</text>
        <text class="stat-label">我收藏的</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">0</text>
        <text class="stat-label">我评论的</text>
      </view>
    </view>

    <!-- 服务区域 -->
    <view class="section">
      <view class="section-title">我的服务</view>
      <view class="grid-nav">
        <view
          class="nav-item"
          v-for="(item, index) in navList"
          :key="item.title"
          @click="onNavTap(item.url)"
        >
          <view>
            <image :src="item.icon"></image>
          </view>
          <text>{{ item.title }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// 定义响应式数据
const userInfo = reactive({});
const hasUserInfo = ref(false);
const canIUseGetUserProfile = ref(false);
const openid = ref("");
const phone = ref("");

const navList = ref([
  {
    title: "申请接单",
    icon: "/static/image/icon/applyRunner.png",
    url: "/pages/applyRunner/applyRunner",
  },
  {
    title: "我的消息",
    icon: "/static/image/tab/chat.png",
    url: "/pages/message/message",
  },
]);

// 页面加载时
onMounted(() => {
  getStorage();
  // 检查是否支持 wx.getUserProfile
  if (typeof wx.getUserProfile === "function") {
    canIUseGetUserProfile.value = true;
  }
});

// 跳转页面
const onNavTap = (url) => {
  uni.navigateTo({
    url: url,
  });
};

// 获取用户信息（需用户授权）
const getUserProfile = () => {
  uni.getUserProfile({
    desc: "用于完善会员资料",
    success: (res) => {
      console.log("用户信息:", res.userInfo);
      if (!res.userInfo) {
        uni.showToast({ title: "获取用户信息失败", icon: "none" });
        return;
      }
      const tempUserInfo = res.userInfo;
      // 调用 uni.login 获取 code
      uni.login({
        success: (loginRes) => {
          if (loginRes.code) {
            wx.request({
              url: "http://127.0.0.1:3000/api/getOpenid",
              method: "POST",
              data: { code: loginRes.code },
              success: (response) => {
                console.log("获取 openid:", response.data.openid);
                openid.value = response.data.openid;
                // 检查数据库中是否已存在该用户
                checkUserInDB(response.data.openid, tempUserInfo);
              },
              fail: () => {
                uni.showToast({ title: "获取 openid 失败", icon: "none" });
              },
            });
          }
        },
      });
    },
    fail: () => {
      uni.showToast({ title: "用户拒绝授权", icon: "none" });
    },
  });
};

// 检查数据库中是否存在用户
const checkUserInDB = (openidVal, tempUserInfo) => {
  wx.request({
    url: "http://127.0.0.1:3000/api/checkUser",
    method: "POST",
    data: { openid: openidVal },
    success: (res) => {
      console.log(res.data, "服务器返回信息");
      if (res.data.exists) {
        console.log("用户已存在，更新缓存");
        // 从数据库返回完整用户信息并更新
        Object.assign(tempUserInfo, res.data.userInfo);
      } else {
        console.log("用户不存在，存入数据库");
        tempUserInfo.openid = openidVal;
        tempUserInfo.phone = phone.value;
        saveUserToDB(tempUserInfo);
      }
      uni.setStorage({
        key: "userInfo",
        data: tempUserInfo,
        success: () => {
          getStorage();
        },
      });
    },
    fail: (err) => {
      console.error("查询用户失败:", err);
      uni.showToast({ title: "查询用户失败", icon: "none" });
    },
  });
};

// 获取缓存中的用户信息
const getStorage = () => {
  uni.getStorage({
    key: "userInfo",
    success: (res) => {
      Object.assign(userInfo, res.data);
      hasUserInfo.value = true;
    },
  });
};

// 预览头像图片
const previewImage = () => {
  const currentUrl = userInfo.avatarUrl;
  if (currentUrl) {
    uni.previewImage({
      current: currentUrl,
      urls: [currentUrl],
    });
  } else {
    uni.showToast({ title: "无头像可预览", icon: "none" });
  }
};

// 存储用户信息到数据库
const saveUserToDB = (tempUserInfo) => {
  uni.request({
    url: "http://127.0.0.1:3000/api/saveUser",
    method: "POST",
    data: {
      openid: tempUserInfo.openid,
      avatarUrl: tempUserInfo.avatarUrl,
      nickName: tempUserInfo.nickName,
      phone: tempUserInfo.phone,
    },
    success: (res) => {
      console.log("用户信息已存入数据库:", res.data);
    },
    fail: (err) => {
      console.error("数据库存储失败:", err);
    },
  });
};
</script>

<style scoped>
.top-show {
  width: 100%;
  height: 360rpx;
  overflow: hidden;
}

.top-show .top-show-img {
  width: 100%;
}

.bottom-show {
  position: relative;
  margin: 0 16rpx;
  /* height: 180px; */
  /* border:1px solid red; */
}

.bottom-show .user-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -86rpx;
  margin-left: 10px;
  margin-right: 10px;
  color: #999;
}

.edit {
  margin-right: 10px;
}

.bottom-show .user-container .avatar-container {
  display: flex;
  align-items: center;
}

.bottom-show .user-container .avatar-container image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 20px;
}

.bottom-show .user-container .avatar-container .no-login {
  display: flex;
  flex-direction: column;
  font-size: 24rpx;
}

.bottom-show .user-container .avatar-container text:first-child {
  font-size: 28rpx;
}

.bottom-show .user-container .avatar-container .ellipsis {
  width: 400rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background: #ffffff;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 32rpx;
  font-weight: bold;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.section {
  margin: 30rpx 20rpx;
  background: white;
  padding: 20rpx;
  border-radius: 10rpx;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  border-left: 5px solid #204dad;
  padding-left: 10px;
  margin-bottom: 10px;
}

.grid-nav {
  background-color: #fff;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.nav-item {
  text-align: center;
  padding: 10rpx;
  background-color: #fff;
  border-radius: 12rpx;
  transition: transform 0.2s ease;
}

.nav-item image {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

.nav-item text {
  font-size: 24rpx;
  color: #333;
}

.nav-item:active {
  transform: scale(0.96);
}

</style>
