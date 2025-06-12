<template>
  <view class="task-detail">
    <view class="user-info">
      <image class="avatar" :src="task.avatarUrl" mode="aspectFill" />
      <view class="user-text">
        <text class="nickname">{{ task.nickName }}</text>
        <text class="time">{{ task.created_at }}</text>
      </view>
    </view>

    <text class="title">{{ task.task_title }}</text>
    <text class="desc">{{ task.task_description }}</text>
    <text class="location">📍 {{ task.pickup_location }} → {{ task.delivery_location }}</text>
    <text class="reward">💰 酬金: ￥{{ task.reward }}</text>

    <!-- 接单 -->
    <button
      v-if="task.status === '待接单'"
      class="btn accept"
      @tap="acceptTask"
    >
      🚀 接单
    </button>

    <!-- 完成任务 -->
    <button
      v-else-if="task.status === '进行中' && task.runner_id === openid"
      class="btn complete"
      @tap="completeTask"
    >
      ✅ 完成任务
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import config from '@/utils/config'

const task = ref({})
const openid = ref('')

// 页面初始化，接收路由参数 id
onLoad((options) => {
  openid.value = uni.getStorageSync('userInfo')?.openid || ''
  const id = options.id
  if (!id) {
    uni.showToast({ title: '未传入任务ID', icon: 'none' })
    return uni.navigateBack()
  }
  // 拉取任务详情
  uni.request({
    url: `${config.baseURL}/tasks/${id}`,
    method: 'GET',
    success: (res) => {
      if (res.statusCode === 200) {
        task.value = res.data
      } else {
        uni.showToast({ title: '获取详情失败', icon: 'none' })
        uni.navigateBack()
      }
    },
    fail: () => {
      uni.showToast({ title: '网络错误', icon: 'none' })
      uni.navigateBack()
    }
  })
})

function acceptTask() {
  if (!openid.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  if (task.value.user_id === openid.value) {
    uni.showToast({ title: '不能接自己发布的任务', icon: 'none' })
    return
  }
  uni.request({
    url: `${config.baseURL}/tasks/${task.value.task_id}/accept`,
    method: 'PUT',
    data: { runner_id: openid.value },
    success: (res) => {
      if (res.statusCode === 200) {
        uni.showToast({ title: '接单成功' })
        uni.navigateBack()
      } else {
        uni.showToast({ title: res.data.error || '接单失败', icon: 'none' })
      }
    },
    fail: () => {
      uni.showToast({ title: '网络错误，请重试', icon: 'none' })
    }
  })
}

function completeTask() {
  uni.request({
    url: `${config.baseURL}/tasks/${task.value.task_id}/complete`,
    method: 'PUT',
    success: () => {
      uni.showToast({ title: '任务已完成' })
      uni.navigateBack()
    },
    fail: () => {
      uni.showToast({ title: '提交失败', icon: 'none' })
    }
  })
}
</script>

<style scoped>
.task-detail {
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  margin: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.user-info {
  flex-direction: row;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.nickname {
  font-weight: bold;
  font-size: 32rpx;
  color: #333;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.title {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
}

.desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.location {
  font-size: 28rpx;
  color: #444;
  background: #eef5ff;
  padding: 16rpx;
  border-radius: 8rpx;
}

.reward {
  font-size: 30rpx;
  font-weight: bold;
  color: #ff5722;
  background: #fff4e6;
  padding: 16rpx;
  border-radius: 8rpx;
}

.btn {
  font-size: 30rpx;
  font-weight: bold;
  color: #fff;
  border-radius: 12rpx;
  text-align: center;
  margin-top: 20rpx;
}

.accept {
  background: #007aff;
}

.accept:active {
  background: #005ecb;
  transform: scale(0.98);
}

.complete {
  background: #28a745;
}

.complete:active {
  background: #1e7e34;
  transform: scale(0.98);
}
</style>
