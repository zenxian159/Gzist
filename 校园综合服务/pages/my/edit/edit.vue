<template>
  <view class="avatar">
    <!-- 点击头像可选择图片 -->
    <view @click="handleChooseImg">
      <!-- 如果 formData.tempFilePaths 为空，则显示默认头像 -->
      <image :src="formData.tempFilePaths || '/static/image/avatar.png'" mode="aspectFill" />
    </view>
  </view>

  <view class="form">
    <view class="form-item">
      <text>昵称</text>
      <input
        type="text"
        :value="formData.name"
        @input="inputChange"
        data-field="name"
      />
    </view>
    <view class="form-item">
      <text>手机</text>
      <input
        type="text"
        :value="formData.phone"
        placeholder="请输入您的手机号"
        @input="inputChange"
        data-field="phone"
      />
    </view>
  </view>

  <view class="submitBtn">
    <button @click="submitForm">保存</button>
  </view>

  <view class="logout-btn" @click="logOut">退出登录</view>
</template>

<script setup>
import { reactive, onMounted } from 'vue';

// 定义响应式数据
const formData = reactive({
  userInfo: {},
  tempFilePaths: "",
  name: "",
  phone: "",
  openid: "" // 存储 openid 以便更新数据库
});

// 页面加载时，从缓存中读取用户信息
onMounted(() => {
  uni.getStorage({
    key: "userInfo",
    success: (res) => {
      // 更新响应式数据
      formData.userInfo = res.data;
      formData.tempFilePaths = res.data.avatarUrl;
      formData.name = res.data.nickName;
      formData.openid = res.data.openid;
      formData.phone = res.data.phone;
    },
    fail: (err) => {
      console.error("获取缓存失败：", err);
    }
  });
});

// 输入框改变时，根据 data-field 更新对应字段
function inputChange(e) {
  const field = e.currentTarget.dataset.field;
  const value = e.detail.value;
  formData[field] = value;
}

// 选择图片
function handleChooseImg() {
  uni.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      let tempFilePath = res.tempFilePaths[0];
      // 上传选择的图片到服务器
      uploadFileToServer(tempFilePath);
    },
    fail: (err) => {
      console.error("选择图片失败：", err);
    }
  });
}

// 上传文件到服务器
function uploadFileToServer(filePath) {
  uni.uploadFile({
    url: "http://127.0.0.1:3000/api/upload", // 服务器地址
    filePath: filePath,
    name: "file",
    formData: {
      // 可添加额外参数
    },
    success: (res) => {
      try {
        const data = JSON.parse(res.data);
        if (res.statusCode === 200) {
          // 更新图片地址
          formData.tempFilePaths = data.url;
        } else {
          console.error("上传失败，状态码：", res.statusCode);
        }
      } catch (error) {
        console.error("解析返回数据失败：", error);
      }
    },
    fail: (err) => {
      console.error("上传失败", err);
    }
  });
}

// 提交表单，更新本地缓存并同步数据库
function submitForm() {
  if (!formData.name.trim()) {
    uni.showToast({
      title: "昵称不能为空",
      icon: "none"
    });
    return;
  }

  // 更新本地缓存中的用户信息
  formData.userInfo.avatarUrl = formData.tempFilePaths;
  formData.userInfo.nickName = formData.name;
  formData.userInfo.phone = formData.phone;

  uni.setStorage({
    key: "userInfo",
    data: formData.userInfo,
    success: () => {
      console.log("数据存储到缓存成功");
    }
  });

  // 同步更新数据库
  uni.request({
    url: "http://127.0.0.1:3000/api/updateUser", // 服务器接口地址
    method: "POST",
    data: {
      openid: formData.openid,
      nickName: formData.name,
      avatarUrl: formData.tempFilePaths,
      phone: formData.phone
    },
    success: (res) => {
      console.log("用户信息存入数据库:", res.data);
      uni.showToast({
        title: "保存成功",
        icon: "success"
      });
      uni.reLaunch({
        url: "/pages/my/my"
      });
    },
    fail: (err) => {
      console.error("数据库存储失败:", err);
      uni.showToast({
        title: "保存失败，请重试",
        icon: "none"
      });
    }
  });
}

// 退出登录
function logOut() {
  uni.showModal({
    title: "提示",
    content: "确定要退出登录吗？",
    success(res) {
      if (res.confirm) {
        uni.removeStorage({
          key: "userInfo"
        });
        uni.reLaunch({ url: "/pages/my/my" });
      }
    }
  });
}
</script>

<style scoped>
.avatar {
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.form .form-item {
  font-size: 18px;
  height: 60px;
  padding: 0 20px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #dedede;
}
.form .form-item input {
  text-align: end;
}
.submitBtn {
  margin: 40px 25px;
}
.submitBtn button {
  width: 100%;
  background-color: #204dad;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  /* padding: 15px; */
  color: #fff;
  font-weight: normal;
}
.logout-btn {
  text-align: center;
  color: #bbb;
  font-size: 16px;
  margin-top: 100px;
  padding: 10px 0;
  cursor: pointer;
}
</style>
