<template>
  <view class="container">
    <block v-if="application && application.application_id">
      <view class="status-container">
        <view class="status-title">跑腿员申请状态</view>
        <view class="status">状态: {{ application.status }}</view>

        <!-- 如果申请被拒绝，显示拒绝理由 + 重新申请按钮 -->
        <block v-if="application.status === '已拒绝'">
          <view class="reject-reason">拒绝理由: {{ application.rejection_reason }}</view>
          <button @tap="resetApplication" style="margin-top: 10px;">重新申请</button>
        </block>
      </view>
      <!-- 如果申请通过，则显示信息 -->
      <block v-if="application.status === '已通过'">
        <view class="success-message">🎉 恭喜！您已成为配送员</view>
      </block>
    </block>

    <block v-else>
      <!-- 申请表单 -->
      <view class="form-container">
        <text class="form-title">申请成为跑腿员</text>
        <input placeholder="姓名" v-model="name" />
        <input placeholder="手机号" v-model="phone" />
        <input placeholder="身份证号/学号" v-model="id_card" />
        <button @tap="submitApplication">提交申请</button>
      </view>
    </block>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import config from '../../utils/config'
const name = ref('')
const phone = ref('')
const id_card = ref('')
const openid = ref(uni.getStorageSync('userInfo').openid)
const application = ref(null)

const getApplicationStatus = () => {
  uni.request({
    url: `${config.baseURL}/runner-applications/${openid.value}`,
    method: 'GET',
    success: (res) => {
      if (res.data && res.data.application_id) {
        console.log(res.data)
        application.value = res.data
      } else {
        application.value = null
      }
    }
  })
}

const submitApplication = () => {
  if (!name.value || !phone.value || !id_card.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  uni.request({
    url: `${config.baseURL}/apply-runner`,
    method: 'POST',
    data: {
      openid: openid.value,
      name: name.value,
      phone: phone.value,
      id_card: id_card.value
    },
    success: (res) => {
      uni.showToast({ title: res.data.message, icon: 'success' })
      getApplicationStatus()
    },
    fail: () => {
      uni.showToast({ title: '申请提交失败', icon: 'none' })
    }
  })
}

const resetApplication = () => {
  uni.request({
    url: `${config.baseURL}/apply-runner/reset`,
    method: 'POST',
    data: {
      openid: openid.value
    },
    success: () => {
      uni.showToast({ title: '请重新提交申请', icon: 'success' })
      application.value = null
    },
    fail: () => {
      uni.showToast({ title: '操作失败', icon: 'none' })
    }
  })
}

onMounted(() => {
  getApplicationStatus()
})
</script>

<style>
.container {
  background-color: #f6f6f6;
  min-height: 100vh;
  padding: 20rpx;
}

.status-container,
.form-container {
  background: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
  margin: 20rpx;
}

.status-title,
.form-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.status {
  color: #202dad;
  font-size: 32rpx;
}

.reject-reason {
  color: red;
  margin-top: 20rpx;
}

.success-message {
  color: #202dad;
  margin-top: 20rpx;
  text-align: center;
  font-size: 40rpx;
}

input {
  padding: 20rpx;
  margin: 20rpx 0;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  width: 100%;
  box-sizing: border-box;
}

button {
  background: #202dad;
  color: white;
  padding: 20rpx;
  border-radius: 10rpx;
  width: 100%;
  margin-top: 20rpx;
}
</style> 