<template>
  <view class="container">
    <!-- 列表 -->
    <view
      v-for="item in mutualAidList"
      :key="item.id"
      class="post-card"
    >
      <!-- 头部：时间 + 编辑/删除 -->
      <view class="user-info">
        <text class="time">{{ item.created_at }}</text>
        <view class="action-buttons">
          <button
            class="edit-btn"
            @tap="editAid(item.id)"
          >
            编辑
          </button>
          <button
            class="delete-btn"
            @tap="deleteAid(item.id)"
          >
            删除
          </button>
        </view>
      </view>

      <!-- 内容 -->
      <view class="content">
        <text>{{ item.content }}</text>
      </view>

      <!-- 图片/视频 -->
      <view class="media-container" v-if="item.images.length">
        <view
          v-for="(media, idx) in item.images"
          :key="idx"
          class="media-wrap"
        >
          <image
            v-if="media.type === 'image'"
            class="media"
            :src="media.url"
            mode="aspectFill"
            @tap="previewImage(media.url)"
          />
          <video
            v-else
            class="media"
            :src="media.url"
            controls
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import config from '@/utils/config'

const mutualAidList = ref([])
const openid = ref('')

// 拉取当前用户的互助列表
function fetchMyMutualAid() {
  uni.request({
    url: `${config.baseURL}/myMutualAid?openid=${openid.value}`,
    method: 'GET',
    success(res) {
      if (res.statusCode === 200 && res.data.items) {
        mutualAidList.value = res.data.items.map(item => ({
          ...item,
          images: Array.isArray(item.images) ? item.images : []
        }))
      } else {
        uni.showToast({ title: '获取失败', icon: 'none' })
      }
    },
    fail() {
      uni.showToast({ title: '网络错误', icon: 'none' })
    }
  })
}

// 生命周期函数，每次页面显示时检查登录并拉列表
onShow(() => {
  const userInfo = uni.getStorageSync('userInfo')
  if (!userInfo || !userInfo.openid) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  openid.value = userInfo.openid
  fetchMyMutualAid()
})

// 预览大图
function previewImage(url) {
  uni.previewImage({ current: url, urls: [url] })
}

// 删除互助
function deleteAid(id) {
  uni.showModal({
    title: '提示',
    content: '确定删除该互助信息吗？',
    success(res) {
      if (res.confirm) {
        uni.request({
          url: `${config.baseURL}/mutualAid/${id}`,
          method: 'DELETE',
          success() {
            uni.showToast({ title: '删除成功', icon: 'success' })
            fetchMyMutualAid()
          },
          fail() {
            uni.showToast({ title: '删除失败', icon: 'none' })
          }
        })
      }
    }
  })
}

// 跳转到编辑页
function editAid(id) {
  uni.navigateTo({
    url: `/pages/MutualAid/addAid/addAid?id=${id}`
  })
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
}
.post-card {
  background: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 5rpx rgba(0,0,0,0.1);
  margin-bottom: 20rpx;
}
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}
.time {
  font-size: 24rpx;
  color: #888;
}
.action-buttons {
  display: flex;
  gap: 10rpx;
}
.edit-btn {
  background-color: #ffc107;
  color: #fff;
  padding:0 4rpx;
  border-radius: 4rpx;
  font-size: 26rpx;
}
.delete-btn {
  background-color: #e74c3c;
  color: #fff;
  padding:0 4rpx;
  border-radius: 4rpx;
  font-size: 26rpx;
}
.content {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}
.media-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.media-wrap {
  width: 200rpx;
  height: 200rpx;
}
.media {
  width: 100%;
  height: 100%;
  border-radius: 8rpx;
  object-fit: cover;
}
</style>
