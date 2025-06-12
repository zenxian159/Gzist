<!-- chat.vue -->
<template>
	<view class="chat-container">
		<!-- 顶部商品信息 -->
		<view class="product-info">
			<block v-if="product">
				<image class="product-image" :src="firstImage" mode="aspectFill" />
				<view class="product-detail">
					<view class="product-title">{{ product.title }}</view>
					<view class="product-price">￥{{ product.price }}</view>
				</view>

				<block v-if="product.status === '可交易'">
					<button v-if="isSeller" class="action-btn" @tap="editProduct">修改商品</button>
					<button v-else class="action-btn primary" @tap="buyProduct">立即购买</button>
				</block>
				<block v-else>
					<view style="margin-right: 40rpx; color: #204dad;">
						{{ product.status }}
					</view>
				</block>
			</block>
			<block v-else>
				<view>该商品不存在</view>
			</block>
		</view>

		<!-- 聊天内容 -->
		<scroll-view class="chat-messages" scroll-y scroll-with-animation :scroll-into-view="scrollToView">
			<view v-for="(item, index) in chatMessages" :key="index"
				:class="['chat-item', item.sender_id === openid ? 'me' : 'other']">
				<image class="avatar" :src="item.sender_id === buyer_id ? buyerAvatar : sellerAvatar" />
				<view class="chat-bubble">
					<text>{{ item.message }}</text>
				</view>
			</view>
			<!-- 锚点 -->
			<view id="bottomAnchor" style="height: 2rpx;"></view>
		</scroll-view>

		<!-- 底部输入框 -->
		<view class="input-area">
			<input class="input-box" v-model="message" placeholder="输入消息..." @confirm="sendMessage" />
			<button class="send-button" @tap="sendMessage">发送</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import config from '@/utils/config'
	import {
		onShow,
		onLoad
	} from '@dcloudio/uni-app';
	// 响应式数据
	const trade_id = ref('')
	const sender_id = ref('')
	const receiver_id = ref('')
	const user_type = ref('')
	const message = ref('')
	const chatMessages = ref([])
	const openid = ref('')
	const scrollToView = ref('')
	const product = ref({})
	const firstImage = ref('')
	const isSeller = ref(false)
	const buyerAvatar = ref('')
	const sellerAvatar = ref('')
	const buyer_id = ref('')
	const seller_id = ref('')

	onLoad((options) => {
		// 获取用户信息
		const userInfo = uni.getStorageSync('userInfo')
		if (userInfo && userInfo.openid) {
			openid.value = userInfo.openid
		}
		if (options) {
			trade_id.value = options.trade_id
			buyer_id.value = options.buyer_id
			seller_id.value = options.seller_id
			isSeller.value = openid.value === options.seller_id
			user_type.value = options.buyer_id === openid.value ? 'buyer' : 'seller'
		}

		// 获取用户信息
		uni.request({
			url: `${config.baseURL}/userInfo`,
			method: 'GET',
			data: {
				buyer_id: buyer_id.value,
				seller_id: seller_id.value
			},
			success: (res) => {
				buyerAvatar.value = res.data.buyerAvatar
				sellerAvatar.value = res.data.sellerAvatar
			}
		})

		getChatRecords()
		getProductInfo()
	})

	// 获取商品信息
	const getProductInfo = () => {
		uni.request({
			url: `${config.baseURL}/trades/${trade_id.value}`,
			method: 'GET',
			success: (res) => {
				const fileList = res.data.fileList || []
				const firstImageFile = fileList.find(file => file.type === 'image')
				console.log(res.data)
				product.value = res.data
				firstImage.value = firstImageFile ?
					firstImageFile.url :
					'/static/video-placeholder.png'
			}
		})
	}

	// 获取聊天记录
	const getChatRecords = () => {
		uni.request({
			url: `${config.baseURL}/chat/${trade_id.value}`,
			method: 'GET',
			success: (res) => {
				console.log(res)
				if (res.data.messages) {
					chatMessages.value = res.data.messages
					// 等消息渲染后再设置滚动
					setTimeout(() => {
						scrollToView.value = 'bottomAnchor'
					}, 100)
				}
			},
			fail: () => {
				uni.showToast({
					title: '获取失败',
					icon: 'none'
				})
			}
		})
	}

	// 输入消息
	const onMessageInput = (e) => {
		message.value = e.detail.value
	}

	// 发送消息
	const sendMessage = () => {
		if (!message.value.trim()) {
			uni.showToast({
				title: '请输入消息',
				icon: 'none'
			})
			return
		}

		uni.request({
			url: `${config.baseURL}/chat`,
			method: 'POST',
			data: {
				trade_id: trade_id.value,
				buyer_id: buyer_id.value,
				seller_id: seller_id.value,
				sender_id: openid.value,
				message: message.value,
				user_type: user_type.value
			},
			success: () => {
				message.value = ''
				getChatRecords()
			},
			fail: () => {
				uni.showToast({
					title: '发送失败',
					icon: 'none'
				})
			}
		})
	}

	// 编辑商品
	const editProduct = () => {
		uni.navigateTo({
			url: '/pages/mall/post/post',
			success: function(res) {
				uni.$emit('sendProductData', {
					item: product.value
				})
			}
		})
	}

	// 购买商品
	const buyProduct = () => {
		uni.navigateTo({
			url: '/pages/mall/buy/buy',
			success: function(res) {
				uni.$emit('sendProductData', {
					item: product.value
				})
			}
		})
	}
</script>

<style>
	page {
		margin: 0;
		padding: 0;
	}

	/* 主容器 */
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.product-info {
		height: 140rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid #ddd;
		background: #fff;
	}

	.product-image {
		width: 70px;
		height: 70px;
		border-radius: 10rpx;
	}

	.product-detail {
		flex: 1;
		width: 200px;
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.product-title {
		width: 180px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 16rpx;
	}

	.product-price {
		font-size: 32rpx;
		color: #e64340;
	}

	.action-btn {
		border-radius: 20rpx;
		font-size: 32rpx;
		padding: 0;
		width: 200rpx !important;
		background-color: #204dad;
		color: #fff;
	}

	.action-btn.primary {
		background-color: #204dad;
		color: #fff;
	}

	.chat-messages {
		box-sizing: border-box;
		padding: 20rpx 0;
		height: calc(100vh - 320rpx);
	}

	.chat-item {
		display: flex;
		align-items: center;
		margin: 0 20rpx 30rpx;
	}

	.chat-item.me {
		justify-content: flex-start;
		flex-direction: row-reverse;
	}

	.chat-item.other {
		justify-content: flex-start;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin: 0 16rpx;
	}

	.chat-bubble {
		max-width: 60%;
		padding: 20rpx;
		background-color: #eee;
		border-radius: 16rpx;
		word-wrap: break-word;
		font-size: 28rpx;
	}

	.chat-item.me .chat-bubble {
		color: #fff;
		background-color: #204dad;
	}

	/* 输入框区域 */
	.input-area {
		display: flex;
		align-items: center;
		background: white;
		padding: 20rpx;
		border-top: 2rpx solid #ddd;
		position: fixed;
		bottom: 0;
		width: 100%;
	}

	/* 输入框 */
	.input-box {
		flex: 1;
		height: 60rpx;
		padding: 10rpx;
		border-radius: 20rpx;
		border: 2rpx solid #ccc;
		margin-right: 10rpx;
	}

	/* 发送按钮 */
	.send-button {
		width: 160rpx !important;
		background-color: #204dad;
		color: white;
		padding: 5rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		margin-right: 40rpx !important;
	}
</style>