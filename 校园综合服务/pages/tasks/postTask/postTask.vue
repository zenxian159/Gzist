<template>
  <view class="post-task">
    <text class="title">
      {{ formData.isEditing ? '编辑任务' : '发布新任务' }}
    </text>

    <input
      v-model="formData.task_title"
      placeholder="任务标题"
      placeholder-style="color:#999"
    />
    <textarea
      v-model="formData.task_description"
      placeholder="任务详情"
      class="textarea"
      placeholder-style="color:#999"
    />

    <input
      v-model="formData.pickup_location"
      placeholder="取货地址"
      placeholder-style="color:#999"
      class="address"
    />
    <input
      v-model="formData.delivery_location"
      placeholder="送达地址"
      placeholder-style="color:#999"
      class="address"
    />

    <input
      v-model="formData.reward"
      placeholder="酬金 (元)"
      type="digit"
      placeholder-style="color:#999"
      class="reward-input"
    />

    <button class="btn" @tap="submitTask">
      {{ formData.isEditing ? '更新任务' : '📩 发布任务' }}
    </button>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import config from '@/utils/config'

const formData = reactive({
  task_title: '',
  task_description: '',
  pickup_location: '',
  delivery_location: '',
  reward: '',
  user_id: uni.getStorageSync('userInfo')?.openid || '',
  isEditing: false,
  task_id: null,
})

// 拦截小程序路由参数（如果带了 item 字符串，就进入编辑模式）
onLoad(options => {
  if (options.item) {
    const item = JSON.parse(decodeURIComponent(options.item))
    formData.isEditing = true
    formData.task_id = item.task_id
    formData.task_title = item.task_title
    formData.task_description = item.task_description
    formData.pickup_location = item.pickup_location
    formData.delivery_location = item.delivery_location
    formData.reward = item.reward
  }
})

function submitTask() {
  // 简单校验
  if (
    !formData.task_title.trim() ||
    !formData.pickup_location.trim() ||
    !formData.delivery_location.trim() ||
    !formData.reward.trim()
  ) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }

  const url = `${config.baseURL}/tasks${formData.isEditing ? '/' + formData.task_id : ''}`
  const method = formData.isEditing ? 'PUT' : 'POST'

  uni.request({
    url,
    method,
    data: {
      task_title: formData.task_title,
      task_description: formData.task_description,
      pickup_location: formData.pickup_location,
      delivery_location: formData.delivery_location,
      reward: formData.reward,
      user_id: formData.user_id,
    },
    success(res) {
      uni.showToast({
        title: formData.isEditing ? '任务更新成功' : '任务发布成功',
        icon: 'success',
      })
      setTimeout(() => uni.navigateBack(), 800)
    },
    fail() {
      uni.showToast({ title: '网络错误，请重试', icon: 'none' })
    },
  })
}
</script>

<style scoped>
.post-task {
  background: #fff;
  padding: 40rpx;
  margin: 20rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  color: #333;
}
/* 输入框通用样式 */
input,
textarea {
  width: 94%;
  padding: 24rpx;
  font-size: 32rpx;
  border: 1rpx solid #ddd;
  border-radius: 16rpx;
}
.textarea {
  height: 160rpx;
  resize: none;
}
/* 地址输入背景 */
.address {
  background: #eef5ff;
  border-left: 10rpx solid #024dad;
}
/* 酬金输入 */
.reward-input {
  background: #fff4e6;
  border-left: 10rpx solid #ff5722;
  font-weight: bold;
  color: #ff5722;
}
/* 发布/更新按钮 */
.btn {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  /* padding: 28rpx; */
  border-radius: 16rpx;
  text-align: center;
  background: #024dad;
  transition: all 0.2s ease-in-out;
}
.btn:active {
  background: #005ecb;
  transform: scale(0.98);
}
</style>
