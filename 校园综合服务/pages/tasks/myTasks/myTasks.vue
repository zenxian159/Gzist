<template>
	<view class="my-tasks">
		<view v-if="tasks.length === 0" class="empty">
			暂无任务，快去发布吧～
		</view>
		<view v-for="item in tasks" :key="item.task_id" class="task-card">
			<!-- 任务信息区，点击可编辑（仅“待接单”状态） -->
			<view class="task-info" :class="{ disabled: item.status !== '待接单' }" @tap="editTask(item)">
				<text class="title">{{ item.task_title }}</text>
				<text class="description">{{ item.task_description }}</text>
				<text class="status" :data-status="item.status">{{ item.status }}</text>
			</view>

			<!-- 操作按钮组 -->
			<view class="button-group">
				<button v-if="item.status === '待接单'" class="cancel-btn" @tap.stop="cancelTask(item.task_id)">❌
					取消</button>
				<button v-else-if="item.status === '已取消' || item.status === '已完成'" class="delete-btn"
					@tap.stop="deleteTask(item.task_id)">🗑 删除</button>
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

	const tasks = ref([])
	const openid = uni.getStorageSync('userInfo')?.openid || ''

	// 每次页面显示时刷新列表
	onShow(() => {
		loadMyTasks()
	})

	function loadMyTasks() {
		uni.request({
			url: `${config.baseURL}/user/tasks?openid=${openid}`,
			method: 'GET',
			success: res => {
				if (Array.isArray(res.data)) {
					tasks.value = res.data
				} else {
					tasks.value = []
					uni.showToast({
						title: '数据异常',
						icon: 'none'
					})
				}
			},
			fail: () => {
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		})
	}

	function cancelTask(taskId) {
		uni.showModal({
			title: '确认取消任务？',
			content: '取消后任务不可恢复',
			success: res => {
				if (res.confirm) {
					uni.request({
						url: `${config.baseURL}/tasks/${taskId}/cancel`,
						method: 'PUT',
						success: () => {
							uni.showToast({
								title: '任务已取消'
							})
							loadMyTasks()
						},
						fail: () => {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							})
						}
					})
				}
			}
		})
	}

	function deleteTask(taskId) {
		uni.showModal({
			title: '确认删除任务？',
			content: '删除后无法恢复',
			success: res => {
				if (res.confirm) {
					uni.request({
						url: `${config.baseURL}/tasks/${taskId}`,
						method: 'DELETE',
						success: () => {
							uni.showToast({
								title: '任务已删除'
							})
							loadMyTasks()
						},
						fail: () => {
							uni.showToast({
								title: '删除失败',
								icon: 'none'
							})
						}
					})
				}
			}
		})
	}

	function editTask(item) {
		if (item.status !== '待接单') {
			uni.showToast({
				title: '只能修改待接单的任务',
				icon: 'none'
			})
			return
		}
		// 将整个 item 序列化后传给发布/编辑页
		const serialized = encodeURIComponent(JSON.stringify(item))
		uni.navigateTo({
			url: `/pages/tasks/postTask/postTask?item=${serialized}`
		})
	}
</script>

<style scoped>
	.my-tasks {
		padding: 20rpx;
	}

	.empty {
		text-align: center;
		color: #999;
		margin-top: 100rpx;
	}

	/* 卡片 */
	.task-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	/* 信息区 */
	.task-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.task-info.disabled {
		opacity: 0.5;
	}

	.title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.description {
		font-size: 28rpx;
		color: #666;
		margin: 10rpx 0;
	}

	.status {
		width: 50px;
		font-size: 26rpx;
		padding: 4rpx 10rpx;
		border-radius: 8rpx;
	}

	/* 不同状态色 */
	.status[data-status="待接单"] {
		background: #fff4e6;
		color: #ff9800;
	}

	.status[data-status="进行中"] {
		background: #e3f2fd;
		color: #007aff;
	}

	.status[data-status="已完成"] {
		background: #e8f5e9;
		color: #4caf50;
	}

	.status[data-status="已取消"] {
		background: #f6f6f6;
		color: #bbb;
	}

	/* 按钮组 */
	.button-group {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	button {
		width: 90px;
		font-size: 28rpx;
		border-radius: 8rpx;
		color: #fff;
	}

	.cancel-btn {
		background: #ff4d4f;
	}

	.delete-btn {
		background: #999;
	}
</style>