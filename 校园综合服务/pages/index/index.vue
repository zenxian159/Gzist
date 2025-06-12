<template>
  <view class="home">
    <view style="width:100%;">
      <image style="width:100%;" src="/static/image/myBanner.jpg" mode="widthFix" />
    </view>

    <!-- 快捷导航区（网格） -->
    <view class="grid-nav">
      <view
        class="nav-item"
        v-for="(item, index) in navList"
        :key="index"
        @click="onNavTap(item.url)"
      >
        <view>
          <image :src="item.icon" mode="aspectFit" />
        </view>
        <text>{{ item.title }}</text>
      </view>
    </view>

    <!-- 动态推荐区（卡片流 + 动画） -->
    <!--
    <view class="section-title">🔥 推荐动态</view>
    <view v-for="(item, index) in recommendList" :key="index">
      <view class="card animated fadeInUp">
        <text class="type">
          [{{ item.module === 'mutualAid' ? '互助' : item.module === 'lostAndFound' ? '失物' : '二手' }}]
        </text>
        <view class="content">{{ item.content }}</view>
        <view class="meta">{{ item.create_time }}</view>
      </view>
    </view>
    -->
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const navList = ref([
  { title: '校园互助', icon: '/static/image/icon/mutual.png', url: '/pages/MutualAid/MutualAid' },
  { title: '失物招领', icon: '/static/image/icon/lostAndFound.png', url: '/pages/lostAndFound/lostAndFound' },
  { title: '校园二手', icon: '/static/image/icon/trades.png', url: '/pages/mall/mall' },
  { title: '校园兼职', icon: '/static/image/icon/job.png', url: '/pages/jobs/jobs' },
  { title: '校园跑腿', icon: '/static/image/icon/tasks.png', url: '/pages/tasks/tasks' }
]);

const recommendList = ref([]);

// 页面加载时执行相关操作（如数据请求）
onMounted(() => {
  // 可在此处加载推荐数据等
});

const onNavTap = (url) => {
  uni.navigateTo({
    url: url
  });
};
</script>

<style scoped>
.home {
  margin: 15px;
  background: #f9f9f9;
}

.grid-nav {
  margin-top: 15px;
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

.section-title {
  font-weight: bold;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.card {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  padding: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card .type {
  color: #007aff;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.card .content {
  font-size: 28rpx;
  color: #222;
  margin-bottom: 10rpx;
}

.card .meta {
  font-size: 22rpx;
  color: #888;
}

/* 简单动画 */
.animated {
  animation-duration: 0.6s;
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  from {
    transform: translate3d(0, 30rpx, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

.fadeInUp {
  animation-name: fadeInUp;
}
</style>
