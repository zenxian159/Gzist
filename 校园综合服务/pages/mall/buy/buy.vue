<!-- buy.vue -->
<template>
	<view class="container">
		<view class="product-card">
			<image class="product-img" :src="firstImage" mode="aspectFill" />
			<view class="product-info">
				<text class="title">{{ product.title }}</text>
				<view class="description">{{ product.description }}</view>
				<view class="price">￥{{ product.price }}</view>
			</view>
		</view>

		<button class="buy-button" @tap="confirmPurchase">确认购买</button>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import config from '@/utils/config'

	// 响应式数据
	const product = ref({})
	const firstImage = ref('')
	const openid = ref('')

	// 生命周期钩子
	onMounted(() => {
		// 获取用户信息
		const userInfo = uni.getStorageSync('userInfo')
		if (userInfo && userInfo.openid) {
			openid.value = userInfo.openid
		}
		uni.$on("sendProductData", (data) => {
			const fileList = data.item.fileList || []
			// 提取第一张图片
			const firstImageFile = fileList.find(file => file.type === 'image')
			console.log("接收到的数据!!!：", data.item)
			product.value = data.item
			firstImage.value = firstImageFile ?
				firstImageFile.url :
				'/static/image/video-placeholder.png'
		})
	})

	// 确认购买
	const confirmPurchase = () => {
		uni.showModal({
			title: '请核对价格',
			content: '确定价格无误后需进行线下支付',
			confirmText: '确认购买',
			cancelText: '取消',
			success: (res) => {
				if (res.confirm) {
					// 用户点击了确认按钮，发起支付请求
					uni.request({
						url: `${config.baseURL}/trades/${product.value.trade_id}/buyer`,
						method: 'PUT',
						data: {
							buyer_id: openid.value,
							status: '交易中'
						},
						success: () => {
							uni.showToast({
								title: '购买成功',
								icon: 'success'
							})
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/mall/mall'
								})
							}, 1000)
						},
						fail: () => {
							uni.showToast({
								title: '下单失败',
								icon: 'none'
							})
						}
					})
				} else {
					uni.showToast({
						title: '已取消',
						icon: 'none'
					})
				}
			}
		})
	}
</script>

<style>
	page{
		margin: 0;
		padding: 0;
	}
	.container {
		padding: 20rpx;
	}

	.product-card {
		background: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 40rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		display: flex;
	}

	.product-img {
		width: 140px;
		height: 140px;
	}

	.product-info {
		width: 230px;
		margin-top: 20rpx;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.title {
		width: 230px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.description {
		width: 230px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 32rpx;
	}

	.price {
		color: #204dad;
		font-size: 32rpx;
	}

	.buy-button {
		background-color: #204dad;
		color: white;
		font-size: 36rpx;
		border-radius: 24rpx;
	}
</style>