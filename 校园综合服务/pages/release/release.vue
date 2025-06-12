<!-- release.vue -->
<template>
	<view class="home">
		<view class="top">
			<image src="/static/image/icon/release.png" mode="aspectFill" />
			<text>发布信息</text>
		</view>
		<!-- 快捷导航区（网格） -->
		<view class="grid-nav">
			<view v-for="item in navList" :key="item.title" class="nav-item" @tap="onNavTap(item.url)">
				<view>
					<image :src="item.icon" />
				</view>
				<text>{{ item.title }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'

	// 响应式数据
	const navList = ref([{
			title: '校园互助',
			icon: '/static/image/icon/mutual.png',
			url: '/pages/MutualAid/addAid/addAid'
		},
		{
			title: '失物招领',
			icon: '/static/image/icon/lostAndFound.png',
			url: '/pages/publish/publish'
		},
		{
			title: '校园二手',
			icon: '/static/image/icon/trades.png',
			url: '/pages/mall/post/post'
		},
		{
			title: '校园跑腿',
			icon: '/static/image/icon/tasks.png',
			url: '/pages/tasks/postTask/postTask'
		}
	])

	// 生命周期钩子
	onMounted(() => {
		// 可以在这里加载推荐列表
		// loadRecommend()
	})

	// 导航点击处理
	const onNavTap = (url) => {
		uni.navigateTo({
			url
		})
	}
</script>

<style>
	page {
		background: #f9f9f9;
	}

	.home {
		margin: 30rpx;
	}

	.top {
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		gap: 20rpx;
		font-size: 36rpx;
	}

	.top>image {
		width: 60rpx;
		height: 60rpx;
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
</style>