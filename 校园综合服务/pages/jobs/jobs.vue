<template>
  <scroll-view
    scroll-y
    style="height: 100vh;"
    @scrolltolower="loadMore"
  >
    <view class="job-list">
      <view v-for="job in jobs" :key="job.job_id" class="job-card" @click="viewJobDetail(job.job_id)">
        <view class="job-title">{{ job.title }}</view>
        <view class="job-desc">{{ job.description }}</view>
        <view class="job-salary">💰 薪资: ￥{{ job.salary }}</view>
        <view class="job-info">
          <text>📍 {{ job.location }}</text>
          <text>📞 {{ job.contact_info }}</text>
        </view>
        <view class="detail-btn">查看详情</view>
      </view>

      <!-- 加载中提示 -->
      <view v-if="loadingMore" class="loading-more">
        <text>加载中...</text>
      </view>

      <!-- 没有更多提示 -->
      <view v-if="!hasMore && jobs.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>

      <!-- 空状态提示 -->
      <view v-if="jobs.length === 0 && !loadingMore" class="empty-message">
        <text>暂无兼职，快去发布吧！</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/utils/api'
import { logError } from '@/utils/logger'
import config from '@/utils/config'

// 响应式数据
const jobs = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loadingMore = ref(false)

// 页面加载
onMounted(() => {
  refreshJobs()
})

// 刷新兼职列表
const refreshJobs = () => {
  pageNum.value = 1
  hasMore.value = true
  jobs.value = []
  loadJobs()
}

// 加载兼职数据（分页）
const loadJobs = async () => {
  if (!hasMore.value || loadingMore.value) return

  loadingMore.value = true
  try {
    const res = await request({
      url: `${config.baseURL}/wx-jobs?pageNum=${pageNum.value}&pageSize=${pageSize.value}`
    })
    const openJobs = res.filter(job => job.status === 'open')

    if (openJobs.length < pageSize.value) hasMore.value = false

    jobs.value.push(...openJobs)
    pageNum.value++
  } catch (err) {
    logError(err)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loadingMore.value = false
  }
}

// 上拉加载更多
const loadMore = () => {
  loadJobs()
}

// 查看详情
const viewJobDetail = (jobId) => {
  uni.navigateTo({
    url: `/pages/jobs/jobDetail/jobDetail?id=${jobId}`
  })
}
</script>

<style>
/* 整体背景 */
page {
  background-color: #f8f9fa;
}

/* 列表项样式 */
.job-card {
  background: #fff;
  margin: 24rpx;
  padding: 30rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}

.job-card:active {
  transform: scale(1.02);
}

.job-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.job-desc {
  font-size: 28rpx;
  color: #666;
  margin-top: 10rpx;
}

.job-salary {
  font-size: 32rpx;
  color: #ff5722;
  font-weight: bold;
  margin-top: 16rpx;
}

.job-info {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  color: #777;
  margin-top: 16rpx;
}

.detail-btn {
  background: #409eff;
  color: white;
  padding: 16rpx 24rpx;
  border-radius: 12rpx;
  text-align: center;
  display: block;
  margin: 20rpx auto 0;
  transition: background 0.3s;
}

.detail-btn:active {
  background: #66b1ff;
}

/* loading & 空状态提示 */
.loading-more,
.no-more,
.empty-message {
  text-align: center;
  color: #999;
  padding: 30rpx 0;
  font-size: 28rpx;
}
</style>