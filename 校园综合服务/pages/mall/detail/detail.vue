<!-- detail.vue -->
<template>
	<view class="detail-container">
		<view class="user-info">
			<image class="avatar" :src="item.sellerAvatar" />
			<view class="user-details">
				<text class="nickname">{{ item.sellerName }}</text>
				<text class="time">{{ item.update_time }}</text>
			</view>
		</view>
		<view class="product-info">
			<text class="price">￥{{ item.price }}</text>
			<text class="category">{{ item.category }}</text>
		</view>

		<text class="label">📌 物品名称</text>
		<view class="value">{{ item.title }}</view>
		<text class="label">📝 描述：</text>
		<view class="value">{{ item.description || "暂无描述" }}</view>

		<!-- 图片 / 视频 -->
		<view class="media-container">
			<view v-for="(media, index) in mediaList" :key="index" class="media-item"
				:style="getMediaItemStyle(mediaList.length, index)">
				<image v-if="media.type === 'image'" class="media" mode="widthFix" @tap="previewFile(media.url)"
					:src="media.url" />
				<video v-else-if="media.type === 'video'" class="media" :src="media.url" controls />
			</view>
		</view>
	</view>

	<!-- 底部按钮 -->
	<view class="footer">
		<view class="footer-icon" @tap="toggleFavorite">
			<image :src="isFavorite ? '/static/image/collect-active.png' : '/static/image/collect.png'" class="icon" />
			<text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
		</view>
		<view v-if="!isOwner" class="footer-icon" @tap="goToChat">
			<image src="/static/image/chat.png" class="icon" />
			<text>联系卖家</text>
		</view>

		<view class="btn">
			<button class="buy-btn" @tap="isOwner ? editProduct() : buyProduct()">
				{{ isOwner ? "编辑我的商品" : "立即购买" }}
			</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onUnmounted
	} from 'vue'
	import config from '@/utils/config'

	// 响应式数据
	const item = ref({})
	const mediaList = ref([])
	const isFavorite = ref(false)
	const isOwner = ref(false)
	const openid = ref('')

	// 格式化时间
	const formatTime = (time) => {
		const date = new Date(time)
		const offset = 8 // 中国时区 +08:00
		date.setHours(date.getHours() + offset)
		return date.toISOString().replace('T', ' ').substring(0, 16)
	}

	// 获取媒体项样式
	const getMediaItemStyle = (length, index) => {
		if (length === 1) return 'width: 98%; height: auto;'
		if (length === 2) return 'width: 48%;'
		if (length === 3) return index === 0 ? 'width: 98%;' : 'width: 48%;'
		if (length === 4) return 'width: 48%;'
		if (length === 5) return index === 0 ? 'width: 98%;' : 'width: 48%;'
		if (length === 6) {
			if (index === 0) return 'width: 98%;'
			if (index === 1 || index === 2) return 'width: 48%;'
			return 'width: 32%;'
		}
		return ''
	}
	// —— onReceive 回调：处理所有收到的产品数据
	function onReceive(data) {
		// 兼容 uni.$emit('sendProductData', item) 或 { item }
		const raw = data && data.item ? data.item : data
		raw.update_time = formatTime(raw.update_time)
		mediaList.value = raw.fileList || []
		isOwner.value = raw.seller_id === openid.value
		item.value = {
			...raw
		}
		console.log('detail onReceive →', item.value)
	}
	// 生命周期钩子
	onMounted(() => {
		// 获取缓存中的用户信息，用于判断是否为商品发布者
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo && userInfo.openid) {
			openid.value = userInfo.openid;
		}

		// 1) 原先从 mall 页面跳转时的发送
		uni.$on('sendProductData', onReceive);
		// 2) 编辑完成后发过来的更新事件
		uni.$on('product-updated', onReceive);
	})
	onUnmounted(() => {
		uni.$off('sendProductData', onReceive);
		uni.$off('product-updated', onReceive);
	})
	// 预览图片
	const previewFile = (url) => {
		console.log('📷 预览图片:', url)
		uni.previewImage({
			current: url,
			urls: [url],
			success: () => console.log('✅ 图片预览成功'),
			fail: (err) => console.error('❌ 图片预览失败:', err)
		})
	}

	// 收藏商品
	const toggleFavorite = () => {
		isFavorite.value = !isFavorite.value
		uni.showToast({
			title: isFavorite.value ? '已收藏' : '取消收藏',
			icon: 'success'
		})
	}

	// 编辑商品
	const editProduct = () => {
		console.log(111);
		uni.navigateTo({
			url: '/pages/mall/post/post',
			success: function(res) {
				// 为确保 detail 页面已创建，可以适当延时后发送数据
				setTimeout(() => {
					uni.$emit("sendProductData", {
						item: item.value
					})
				}, 100)
			}
		})
	}

	// 购买商品
	const buyProduct = () => {
		console.log(222);
		uni.navigateTo({
			url: '/pages/mall/buy/buy',
			success: (res) => {
				// 为确保 detail 页面已创建，可以适当延时后发送数据
				setTimeout(() => {
					uni.$emit("sendProductData", {
						item: item.value
					})
				}, 100)
			}

		})
	}

	// 联系卖家
	const goToChat = () => {
		uni.navigateTo({
			url: `/pages/mall/chat/chat?trade_id=${item.value.trade_id}&buyer_id=${openid.value}&seller_id=${item.value.seller_id}`
		})
	}
</script>

<style>
	page {
		background-color: #f3f3f3;
	}

	.detail-container {
		padding: 32rpx;
		background-color: #fff;
		border-radius: 20rpx;
		margin: 20rpx;
	}

	/* 用户信息 */
	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.user-details {
		display: flex;
		flex-direction: column;
	}

	.nickname {
		font-size: 32rpx;
		font-weight: bold;
	}

	.time {
		font-size: 24rpx;
		color: #888;
	}

	.product-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 0;
	}

	.price {
		font-size: 52rpx;
		font-weight: bold;
		color: #204dad;
	}

	.category {
		font-size: 28rpx;
		color: #444;
		background-color: #f5f5f5;
		padding: 8rpx 20rpx;
		border-radius: 10rpx;
		white-space: nowrap;
	}

	.label {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-top: 10rpx;
		display: block;
	}

	.value {
		overflow-wrap: break-word;
		font-size: 36rpx;
		color: #444;
	}

	.media-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-bottom: 160rpx;
	}

	.media {
		width: 100%;
		height: 100%;
		border-radius: 16rpx;
	}

	video.media {
		aspect-ratio: 16 / 9;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
		padding: 20rpx 30rpx;
		height: 100rpx;
		z-index: 999;
	}

	.footer-icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #666;
		width: 100rpx;
	}

	.footer-icon .icon {
		width: 44rpx;
		height: 44rpx;
		margin-bottom: 6rpx;
	}

	.buy-btn {
		border-radius: 10rpx;
		font-size: 28rpx;
		text-align: center;
		color: #fff;
		background: linear-gradient(to right, #2a6ac4, #204dad);
	}
</style>