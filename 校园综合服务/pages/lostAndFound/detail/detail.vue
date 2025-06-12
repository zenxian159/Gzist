<template>
	<view class="detail-container">
		<!-- 用户信息 -->
		<view class="user-info">
			<image class="avatar" :src="item.avatarUrl" mode="aspectFill" />
			<view class="user-details">
				<text class="nickname">{{ item.nickName }}</text>
				<text class="time">{{ item.createdAt }}</text>
			</view>
		</view>

		<!-- 地图 + 路径/标记 -->
		<view class="map-wrapper">
			<map id="myMap" class="map" :latitude="latitude" :longitude="longitude" scale="16" :markers="markers"
				:polyline="polyline" @callouttap="calloutTap" @markertap="markerTap" />
			<button v-if="item.type === '丢失物品'" :disabled="isMoving" @tap="setMoveAlong" class="btn-move">
				{{ isMoving ? '回放中…' : '启动路径模拟' }}
			</button>
		</view>

		<!-- 物品详情 -->
		<view class="item-info">
			<text class="label">📌 物品名称</text>
			<text class="value">{{ item.itemName }}</text>

			<text class="label">📞 联系电话</text>
			<text class="value phone" @tap="copyPhone">{{ item.contact }}</text>

			<text class="label">🔑 认领方式</text>
			<text class="value">{{ item.claimMethod || '暂无信息' }}</text>

			<text class="label">
				📅 {{ item.type==='丢失物品' ? '丢失时间' : '拾取时间' }}
			</text>
			<text class="value">{{ item.time }}</text>

			<view v-if="item.type === '丢失物品'">
				<text class="label">💰 酬金选择</text>
				<text class="value">
					{{ formatReward(item) }}
				</text>
			</view>

			<text class="label">📝 备注</text>
			<text class="value">{{ item.remarks || '无' }}</text>
		</view>

		<!-- 图片/视频展示 -->
		<view class="media-container">
			<swiper v-if="fileList.length>1" :indicator-dots="true" indicator-color="rgba(255,255,255,0.5)"
				indicator-active-color="#fff">
				<swiper-item v-for="(f, i) in fileList" :key="i">
					<image v-if="f.type==='image'" class="media" mode="widthFix" :src="f.url" />
					<video v-else-if="f.type==='video'" class="media" :src="f.url" controls />
				</swiper-item>
			</swiper>
			<image v-else-if="fileList[0]?.type==='image'" class="media" mode="widthFix" :src="fileList[0].url" />
			<video v-else-if="fileList[0]?.type==='video'" class="media" :src="fileList[0].url" controls />
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
		ref,
		onMounted
	} from 'vue'
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import config from '@/utils/config'

	// 地图与物品数据
	const item = ref({})
	const fileList = ref([])
	const latitude = ref(23.25904)
	const longitude = ref(113.457244)
	const markers = ref([])
	const polyline = ref([])

	// 回放控制
	const isMoving = ref(false)
	const baseSpeed = ref(5) // ms/米
	const minDuration = ref(2000)
	const maxDuration = ref(4000)

	// 评论相关
	const commentList = ref([])
	const replyContent = ref('')
	const replyPlaceholder = ref('评论千万条，友善第一条…')
	const replyParentId = ref(0)
	const moduleName = 'lostAndFound'
	const targetId = ref('')
	const authorId = ref('')
	const currentUserId = ref('')

	// 地图上下文
	let mapCtx = null

	// 格式化时间（YYYY-MM-DD）
	function formatTime(ts) {
		const d = new Date(ts)
		d.setHours(d.getHours() + 8)
		return d.toISOString().slice(0, 10)
	}
	// 格式化酬金显示逻辑
	function formatReward(it) {
		if (it.reward === '无' || it.reward === '面议') return it.reward
		if (it.reward === '输入') return it.rewardAmount ? it.rewardAmount + ' 元' : '无'
		return ''
	}

	// onLoad 拿到页面参数
	onLoad((options) => {
		mapCtx = uni.createMapContext('myMap')
		// 锁范围
		mapCtx.setBoundary({
			southwest: {
				latitude: 23.255863,
				longitude: 113.453333
			},
			northeast: {
				latitude: 23.261935,
				longitude: 113.46152
			}
		})

		if (options.item) {
			const it = JSON.parse(decodeURIComponent(options.item))
			item.value = {
				...it,
				time: formatTime(it.time)
			}
			fileList.value = it.fileList || []
			targetId.value = it.id
			authorId.value = it.openid

			// 视类型绘制标记/折线
			if (it.type === '丢失物品') renderLostPath(it)
			else renderPickupLocation(it)

			getComments()
		}
	})

	// onShow 拿到当前用户
	onShow(() => {
		const u = uni.getStorageSync('userInfo')
		if (u?.openid) currentUserId.value = u.openid
	})

	// 渲染丢失路径
	function renderLostPath(it) {
		markers.value = [{
			id: it.markerId,
			latitude: it.latitude,
			longitude: it.longitude,
			iconPath: '/static/image/5.png',
			width: 30,
			height: 30
		}]
		polyline.value = [{
			points: it.location[0].points,
			color: '#204dad',
			width: 4,
			dottedLine: false
		}]
	}

	// 渲染拾取地点
	function renderPickupLocation(it) {
		markers.value = [it.location]
		polyline.value = []
	}

	// 点击地图 callout/marker（可选）
	function calloutTap(e) {
		console.log('calloutTap', e)
	}

	function markerTap(e) {
		console.log('markerTap', e.detail.markerId)
	}

	// 轨迹回放
	function setMoveAlong() {
		const pts = polyline.value[0]?.points || []
		if (pts.length < 2) {
			uni.showToast({
				title: '至少两点',
				icon: 'none'
			})
			return
		}
		const dist = pts.reduce((sum, p, i, arr) => {
			if (i === 0) return 0
			return sum + calculateDistance(
				arr[i - 1].latitude, arr[i - 1].longitude,
				p.latitude, p.longitude
			)
		}, 0)
		let dur = dist * baseSpeed.value
		dur = Math.min(maxDuration.value, Math.max(minDuration.value, dur))

		isMoving.value = true
		mapCtx.moveAlong({
			markerId: item.value.markerId,
			path: pts,
			autoRotate: true,
			duration: dur,
			success: () => uni.showToast({
				title: '回放完成',
				icon: 'none'
			}),
			complete: () => isMoving.value = false
		})
	}

	// Haversine 公式
	function calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371000,
			toRad = Math.PI / 180
		const dLat = (lat2 - lat1) * toRad,
			dLon = (lon2 - lon1) * toRad
		const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2
		return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
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

	// 复制电话
	function copyPhone() {
		uni.setClipboardData({
			data: item.value.contact,
			success: () => uni.showToast({
				title: '已复制电话'
			})
		})
	}
</script>

<style scoped>
	.detail-container {
		padding: 16px;
		background: #fff;
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

	.map-wrapper {
		position: relative;
		margin-bottom: 10px;
	}

	.map {
		width: 100%;
		height: 300px;
	}

	.btn-move {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background: #204dad;
		color: #fff;
		padding: 6px 12px;
		border-radius: 4px;
	}

	.item-info {
		margin-bottom: 10px;
	}

	.label {
		display: block;
		font-weight: bold;
		margin-top: 6px;
	}

	.value {
		margin-left: 6px;
		display: block;
	}

	.phone {
		color: #204dad;
		text-decoration: underline;
	}

	.media-container {
		margin-bottom: 10px;
	}

	.media {
		width: 100%;
		border-radius: 6px;
		margin-bottom: 6px;
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