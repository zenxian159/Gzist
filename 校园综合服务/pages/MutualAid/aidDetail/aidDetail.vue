<template>
	<view class="container">
		<!-- 帖子详情 -->
		<view class="post-card">
			<!-- 用户信息 -->
			<view class="user-info">
				<image class="avatar" :src="detail.avatarUrl" mode="aspectFill" />
				<view class="user-details">
					<text class="username">{{ detail.nickName }}</text>
					<text class="time">{{ detail.created_at }}</text>
				</view>
			</view>

			<!-- 内容 -->
			<view class="content">
				<text>{{ detail.content }}</text>
			</view>

			<!-- 图片/视频 -->
			<view class="media-container" v-if="detail.images && detail.images.length">
				<view v-for="(media, idx) in detail.images" :key="idx" class="media-wrap">
					<image v-if="media.type === 'image'" class="media" :src="media.url" mode="widthFix"
						@tap="previewImage(media.url)" />
					<video v-else class="media" :src="media.url" controls />
				</view>
			</view>
		</view>

		<!-- 评论区 -->
		<view class="comment-section">
			<view class="comment-count">评论 ({{ commentList.length }})</view>

			<view v-for="(item, idx) in commentList" :key="item.id" class="comment-item"
				:style="{ paddingLeft: (item.level > 0 ? item.level * 40 : 0) + 'rpx' }">
				<view class="comment-header">
					<image class="avatar" :src="item.user.avatarUrl" />
					<text class="nickname">{{ item.user.nickname }}</text>
					<text v-if="item.isAuthor" class="tag-author">楼主</text>
					<text v-if="item.level > 0" class="arrow">→</text>
					<text v-if="item.level > 0" class="target-nick">{{ item.replyToNickname }}</text>
				</view>

				<view v-if="item.parent_content" class="quote-box">{{ item.parent_content }}</view>

				<view class="reply-content" @tap="onCommentTap(item)">{{ item.content }}</view>
				<text class="reply-time">{{ item.create_time }}</text>
				<text class="reply-btn" @tap="showReplyInput(item)">回复</text>
			</view>
		</view>

		<!-- 底部输入 -->
		<view class="comment-input-box">
			<input v-model="replyContent" :placeholder="replyPlaceholder" class="comment-input" />
			<button class="send-btn" @tap="submitComment">发送</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import config from '@/utils/config'

	const detail = ref({})
	const commentList = ref([])
	const replyContent = ref('')
	const replyPlaceholder = ref('评论千万条，友善第一条…')
	const replyParentId = ref(0)
	const moduleName = 'mutualAid'
	const targetId = ref('')
	const authorId = ref('')
	const currentUserId = ref('')

	// 拉取互助详情
	function fetchDetail(id) {
		uni.request({
			url: `${config.baseURL}/wx-mutualAid/${id}`,
			method: 'GET',
			success(res) {
				detail.value = res.data
				authorId.value = res.data.openid
			},
			fail() {
				uni.showToast({
					title: '获取详情失败',
					icon: 'none'
				})
			}
		})
	}

	// 时间格式化
	function formatTime(time) {
		const d = new Date(time)
		d.setHours(d.getHours() + 8)
		return d.toISOString().replace('T', ' ').substr(0, 10)
	}

	// 将多级评论展平并标记层级
	function flattenComments(list, level = 0) {
		let res = []
		list.forEach(item => {
			item.level = level
			res.push(item)
			if (item.children && item.children.length) {
				res = res.concat(flattenComments(item.children, level + 1))
			}
		})
		return res
	}

	// 拉取评论列表
	function getComments() {
		uni.request({
			url: `${config.baseURL}/comments?module=${moduleName}&target_id=${targetId.value}`,
			success(res) {
				const flat = flattenComments(res.data)
				flat.forEach(item => {
					item.create_time = formatTime(item.create_time)
					item.isAuthor = item.user_id === authorId.value
				})
				commentList.value = flat
			}
		})
	}

	// 预览图片
	function previewImage(url) {
		uni.previewImage({
			current: url,
			urls: [url]
		})
	}

	// 点击评论本人时可删除
	function onCommentTap(item) {
		if (item.user_id !== currentUserId.value) return
		uni.showActionSheet({
			itemList: ['删除该评论'],
			success(res) {
				if (res.tapIndex === 0) deleteComment(item.id)
			}
		})
	}

	// 删除评论
	function deleteComment(id) {
		uni.request({
			url: `${config.baseURL}/comments/${id}`,
			method: 'DELETE',
			success() {
				uni.showToast({
					title: '删除成功'
				})
				getComments()
			}
		})
	}

	// 点击「回复」
	function showReplyInput(item) {
		if (item.user_id === currentUserId.value) {
			uni.showToast({
				title: '不能回复自己',
				icon: 'none'
			})
			return
		}
		replyParentId.value = item.id
		replyPlaceholder.value = `回复 ${item.user.nickname}：`
	}

	// 发送评论/回复
	function submitComment() {
		if (!replyContent.value.trim()) return
		const user = uni.getStorageSync('userInfo')
		if (!user || !user.openid) {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
			return
		}
		uni.request({
			url: `${config.baseURL}/comments`,
			method: 'POST',
			data: {
				module: moduleName,
				target_id: targetId.value,
				parent_id: replyParentId.value,
				content: replyContent.value,
				user_id: user.openid
			},
			success() {
				replyContent.value = ''
				replyParentId.value = 0
				replyPlaceholder.value = '评论千万条，友善第一条…'
				getComments()
			}
		})
	}

	// 页面加载时取参数并拉数据
	onLoad((options) => {
		targetId.value = options.id
		fetchDetail(options.id)
		getComments()
	})

	// 每次激活页面时取当前用户
	onShow(() => {
		const user = uni.getStorageSync('userInfo')
		if (user && user.openid) {
			currentUserId.value = user.openid
		}
	})
</script>

<style scoped>
	page{
		padding: 0;
		margin: 0;
	}
	.container {
		padding: 20rpx;
		background: #f5f5f5;
	}

	.post-card {
		background: #fff;
		padding: 30rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
	}

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

	.username {
		font-size: 32rpx;
		font-weight: bold;
	}

	.time {
		font-size: 24rpx;
		color: #999;
	}

	.content {
		font-size: 30rpx;
		color: #333;
		margin-bottom: 20rpx;
	}

	.media-container {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-bottom: 30rpx;
	}

	.media-wrap {
		width: 180rpx;
		height: 180rpx;
	}

	.media {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
		object-fit: cover;
	}

	/* 评论区 */
	.comment-section {
		margin-bottom: 120rpx;
		/* 给底部输入留空间 */
	}

	.comment-count {
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.comment-item {
		margin-bottom: 40rpx;
	}

	.comment-header {
		display: flex;
		align-items: center;
	}

	.comment-header .avatar {
		width: 60rpx;
		height: 60rpx;
		margin-right: 10rpx;
	}

	.nickname {
		font-weight: bold;
		margin-right: 10rpx;
	}

	.tag-author {
		background: #2a80ff;
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 8rpx;
		border-radius: 6rpx;
	}

	.arrow {
		margin: 0 6rpx;
		color: #aaa;
	}

	.quote-box {
		background: #f5f5f5;
		padding: 10rpx;
		border-radius: 6rpx;
		margin: 10rpx 0;
		color: #555;
	}

	.reply-content {
		font-size: 28rpx;
		margin-bottom: 8rpx;
	}

	.reply-time {
		font-size: 24rpx;
		color: #888;
		margin-bottom: 6rpx;
	}

	.reply-btn {
		color: #1aad19;
		font-size: 26rpx;
	}

	.comment-input-box {
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
		align-items: center;
		padding: 10rpx;
		background: #fff;
		border-top: 1px solid #eee;
	}

	.comment-input {
		flex: 1;
		border: 1px solid #ccc;
		border-radius: 8rpx;
		padding: 12rpx;
		font-size: 28rpx;
	}

	.send-btn {
		margin-left: 10rpx;
		margin-right: 50rpx;
		background: #1aad19;
		color: #fff;
		padding: 0 20rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
	}
</style>