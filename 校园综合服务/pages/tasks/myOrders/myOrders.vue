<template>
  <view class="container">
    <!-- 筛选栏 -->
    <scroll-view class="filter-bar" scroll-x>
      <text
        v-for="status in statuses"
        :key="status"
        :class="{ active: activeFilter === status }"
        @tap="filterTasks(status)"
      >
        {{ status }}
      </text>
    </scroll-view>

    <!-- 任务列表 -->
    <view
      v-for="item in filteredOrders"
      :key="item.task_id"
      class="task-card"
    >
      <!-- 标题 + 状态 -->
      <view class="task-header">
        <text class="task-title">{{ item.task_title }}</text>
        <text
          class="task-status"
          :class="getStatusClass(item.status)"
        >
          {{ item.status }}
        </text>
      </view>

      <!-- 详情 -->
      <view class="task-info">
        <view>酬金：￥{{ item.reward }}</view>
        <view>取货点：{{ item.pickup_location }}</view>
        <view>送达点：{{ item.delivery_location }}</view>
      </view>

      <!-- 操作按钮 -->
      <view class="task-actions">
        <button @tap="viewTaskDetail(item.task_id)">查看</button>
        <button
          v-if="item.status === '进行中'"
          @tap="markAsComplete(item.task_id)"
        >
          完成
        </button>
        <button
          v-if="item.status === '进行中'"
          class="cancel-btn"
          @tap="cancelTask(item.task_id)"
        >
          取消
        </button>
      </view>
    </view>

    <!-- 无数据提示 -->
    <view v-if="filteredOrders.length === 0" class="empty-message">
      暂无任务
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import config from '@/utils/config'

const orders = ref([])
const filteredOrders = ref([])
const statuses = ['全部', '进行中', '已完成']
const activeFilter = ref('全部')
const openid = uni.getStorageSync('userInfo')?.openid || ''

function loadMyOrders() {
  uni.request({
    url: `${config.baseURL}/runner/tasks?openid=${openid}`,
    method: 'GET',
    success(res) {
      if (res.statusCode === 200 && Array.isArray(res.data)) {
        orders.value = res.data
        filterTasks(activeFilter.value)
      } else {
        uni.showToast({ title: res.data.error || '加载失败', icon: 'none' })
      }
    },
    fail() {
      uni.showToast({ title: '网络错误，请重试', icon: 'none' })
    }
  })
}

onShow(() => {
  loadMyOrders()
})

function filterTasks(status) {
  activeFilter.value = status
  filteredOrders.value =
    status === '全部'
      ? orders.value
      : orders.value.filter(item => item.status === status)
}

function viewTaskDetail(id) {
  uni.navigateTo({
    url: `/pages/tasks/taskDetail/taskDetail?id=${id}`
  })
}

function markAsComplete(id) {
  uni.request({
    url: `${config.baseURL}/tasks/${id}/complete`,
    method: 'PUT',
    success() {
      uni.showToast({ title: '任务已完成' })
      loadMyOrders()
    },
    fail() {
      uni.showToast({ title: '操作失败', icon: 'none' })
    }
  })
}

function cancelTask(id) {
  uni.showModal({
    title: '确认取消',
    content: '确定取消该任务吗？',
    success(res) {
      if (res.confirm) {
        uni.request({
          url: `${config.baseURL}/tasks/${id}/cancel`,
          method: 'PUT',
          success() {
            uni.showToast({ title: '任务已取消' })
            loadMyOrders()
          },
          fail() {
            uni.showToast({ title: '取消失败', icon: 'none' })
          }
        })
      }
    }
  })
}

function getStatusClass(status) {
  if (status === '进行中') return 'status-in-progress'
  if (status === '已完成') return 'status-complete'
  return 'status-cancelled'
}
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.filter-bar {
  display: flex;
  white-space: nowrap;
  border-bottom: 2rpx solid #eee;
  padding-bottom: 10rpx;
}
.filter-bar text {
  font-size: 28rpx;
  padding: 10rpx 20rpx;
  margin-right: 10rpx;
  color: #666;
}
.filter-bar .active {
  color: #007aff;
  font-weight: bold;
}
.task-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.task-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.task-status {
  font-size: 26rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  color: #fff;
}
.status-in-progress {
  background-color: #ffcc00;
}
.status-complete {
  background-color: #4caf50;
}
.status-cancelled {
  background-color: #f44336;
}
.task-info {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #444;
  line-height: 1.6;
}
.task-actions {
  margin-top: 30rpx;
  display: flex;
  gap: 20rpx;
}
button {
  font-size: 28rpx;
  border-radius: 12rpx;
  color: #fff;
  background: #204dad;
}
.cancel-btn {
  background: #f44336;
}
.empty-message {
  text-align: center;
  margin-top: 100rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
