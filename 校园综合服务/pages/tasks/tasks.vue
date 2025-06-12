<template>
	<view class="task-list">
		<view v-if="tasks.length === 0" class="empty-tip">暂无跑腿任务，请发布吧~~</view>
		<view v-for="task in tasks" :key="task.task_id" class="task-card" @tap="viewTaskDetail(task.task_id)">
			<view class="user-info">
				<image class="avatar" :src="task.avatarUrl" lazy-load />
				<text class="nickname">{{ task.nickName }}</text>
				<text class="time">{{ task.created_at }}</text>
			</view>
			<text class="title">{{ task.task_title }}</text>
			<text class="desc">{{ task.task_description }}</text>
			<text class="location">
				📍 {{ task.pickup_location }} → {{ task.delivery_location }}
			</text>
			<text class="reward">💰 酬金: ￥{{ task.reward }}</text>
			<text class="status" :data-status="task.status">{{ task.status }}</text>
		</view>

		<!-- 发布/管理/订单 菜单按钮 -->
		<view class="menu-button" @tap="toggleMenu">
			<image src="/static/image/menu-icon.png" class="menu-icon" />
		</view>
		<view class="menu-container">
			<view class="menu-item" :style="postAnimation" @tap="navigateToPost">
				<image src="/static/image/post-icon.png" />
				<text>发布</text>
			</view>
			<view class="menu-item" :style="manageAnimation" @tap="navigateToManage">
				<image src="/static/image/manage-icon.png" />
				<text>管理</text>
			</view>
			<view class="menu-item" :style="ordersAnimation" @tap="navigateToOrders">
				<image src="/static/image/order-icon.png" />
				<text>订单</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import config from '@/utils/config'
	// 跑腿任务列表
	const tasks = ref([])

	// 菜单状态与动画样式
	const menuVisible = ref(false)
	const postAnimation = ref({})
	const manageAnimation = ref({})
	const ordersAnimation = ref({})

	// 加载待接单任务
	function getTasks() {
		uni.request({
			url: `${config.baseURL}/tasks`,
			method: 'GET',
			success: (res) => {
				tasks.value = Array.isArray(res.data) ?
					res.data.filter(t => t.status === '待接单') : []
			},
			fail: () => uni.showToast({
				title: '获取任务失败',
				icon: 'none'
			})
		})
	}

	// 页面每次显示时重新拉取
	onShow(() => getTasks())

	// 查看任务详情
	function viewTaskDetail(taskId) {
		uni.navigateTo({
			url: `/pages/tasks/taskDetail/taskDetail?id=${taskId}`
		})
	}

	// 切换菜单动画
	const toggleMenu = () => {
		if (!menuVisible.value) {
			menuVisible.value = true
			setTimeout(() => {
				postAnimation.value = {
					opacity: 1,
					transform: 'translate(-60px, -60px)'
				}
				manageAnimation.value = {
					opacity: 1,
					transform: 'translate(-100px, 0px)'
				}
				ordersAnimation.value = {
					opacity: 1,
					transform: 'translate(0px, -100px)'
				}
			}, 50)
		} else {
			postAnimation.value = {
				opacity: 0,
				transform: 'translate(0, 0)'
			}
			manageAnimation.value = {
				opacity: 0,
				transform: 'translate(0, 0)'
			}
			ordersAnimation.value = {
				opacity: 0,
				transform: 'translate(0, 0)'
			}
			setTimeout(() => {
				menuVisible.value = false
			}, 300)
		}
	}

	const navigateToPost = () => {
		uni.navigateTo({
			url: '/pages/tasks/postTask/postTask'
		})
	}

	const navigateToManage = () => {
		uni.navigateTo({
			url: '/pages/tasks/myTasks/myTasks'
		})
	}

	const navigateToOrders = () => {
		uni.navigateTo({
			url: '/pages/tasks/myOrders/myOrders'
		})
	}
</script>

<style scoped>
	.task-list {
		display: flex;
		flex-direction: column;
		padding: 20rpx;
		gap: 20rpx;
	}

	.empty-tip {
		text-align: center;
		margin-top: 60rpx;
		color: #999;
	}

	.task-card {
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 24rpx;
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}

	.nickname {
		font-weight: bold;
		color: #333;
		flex: 1;
	}

	.time {
		font-size: 24rpx;
		color: #999;
	}

	.title {
		font-size: 32rpx;
		color: #222;
		font-weight: bold;
	}

	.desc {
		font-size: 28rpx;
		color: #555;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.location,
	.reward,
	.status {
		font-size: 28rpx;
		color: #444;
	}

	.status[data-status="待接单"] {
		background: #f0ad4e;
		color: #fff;
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
	}

	.status[data-status="进行中"] {
		background: #5bc0de;
		color: #fff;
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		z-index: 999;
	}

	/* 菜单按钮 */
	.menu-button {
		position: fixed;
		bottom: 160rpx;
		right: 40rpx;
		width: 120rpx;
		height: 120rpx;
		background-color: rgba(32, 77, 173, 0.73);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}

	.menu-icon {
		width: 80rpx;
		height: 80rpx;
	}

	/* 菜单容器 */
	.menu-container {
		position: fixed;
		bottom: 160rpx;
		right: 40rpx;
		width: 120rpx;
		height: 120rpx;
	}

	/* 菜单项 */
	.menu-item {
		position: absolute;
		width: 140rpx;
		height: 140rpx;
		background-color: rgba(32, 77, 173, 0.73);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		opacity: 0;
		transform: translate(0, 0);
		transition: all 0.3s ease;
	}

	.menu-item image {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}

	.menu-item text {
		font-size: 24rpx;
		color: white;
	}
</style>