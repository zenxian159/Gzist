<template>
  <view class="job-detail-card">
    <view class="job-title">{{ job.title }}</view>
    <view class="job-info">📄 描述: {{ job.description }}</view>
    <view class="job-info">📍 位置: {{ job.location }}</view>
    <view class="job-info">💰 薪资: ￥{{ job.salary }}</view>
    <view class="job-info">📞 联系方式: {{ job.contact_info }}</view>

    <button class="contact-btn" @click="copyContact">📋 复制联系方式</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { request } from '@/utils/api'
import { logError } from '@/utils/logger'
import config from '@/utils/config'

const job = ref({})

// 页面加载
onLoad(async (options) => {
  const jobId = options.id
  if (!jobId) {
    uni.showToast({ title: '未传入 jobId', icon: 'none' })
    uni.navigateBack()
    return
  }
  await getJobDetail(jobId)
})

// 获取兼职详情（状态关闭则不展示）
const getJobDetail = async (jobId) => {
  try {
    const res = await request({
      url: `${config.baseURL}/jobs/${jobId}`,
      method: 'GET'
    })
    if (res.status === 'closed') {
      uni.showToast({ title: '该兼职已关闭', icon: 'none' })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      job.value = res
    }
  } catch (err) {
    logError(err)
    uni.showToast({ title: '获取详情失败', icon: 'none' })
  }
}

// 复制联系方式
const copyContact = () => {
  uni.setClipboardData({
    data: job.value.contact_info,
    success: () => {
      uni.showToast({ title: '已复制联系方式', icon: 'success' })
    }
  })
}
</script>

<style>
page {
  background-color: #f4f5f7;
}

.job-detail-card {
  background: #fff;
  margin: 30rpx;
  padding: 40rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.05);
}

.job-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20rpx;
}

.job-info {
  font-size: 32rpx;
  color: #444;
  margin-top: 10rpx;
  padding: 16rpx 0;
  border-bottom: 2rpx solid #eee;
}

.contact-btn {
  background: #ff5722;
  color: white;
  text-align: center;
  padding: 20rpx;
  border-radius: 16rpx;
  margin-top: 40rpx;
  transition: background 0.3s;
}

.contact-btn:active {
  background: #ff784e;
}
</style>
