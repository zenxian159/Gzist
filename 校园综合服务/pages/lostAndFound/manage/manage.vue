<template>
	<view class="manage-container">
		<!-- 筛选按钮 -->
		<view class="tab-bar">
			<text class="tab-item" :class="{ active: activeFilter === 'all' }" @tap="showAllItems">全部</text>
			<text class="tab-item" :class="{ active: activeFilter === 'lost' }" @tap="showLostItems">失物招领</text>
			<text class="tab-item" :class="{ active: activeFilter === 'found' }" @tap="showFoundItems">寻物启事</text>
		</view>

		<!-- 发布列表 -->
		<block v-for="(item, index) in filteredItems" :key="item.id">
			<view class="swipe-container">
				<movable-area class="movable-area">
					<movable-view class="movable-view" direction="horizontal" damping="30" friction="20" :x="item.x"
						out-of-bounds="false" :style="{ width: viewWidth + deleteBtnWidth + 'px' }" :data-index="index"
						@change="onMoveChange" @touchend="onTouchEnd">
						<!-- 内容容器：宽度固定为屏宽 -->
						<view class="content-wrapper" :style="{ width: viewWidth + 'px' }">
							<view class="item-card">
								<!-- 图片/视频 -->
								<view class="media-container">
									<image v-if="item.fileList[0]?.type === 'image'" class="media" mode="aspectFill"
										:src="item.fileList[0].url" />
									<video v-else-if="item.fileList[0]?.type === 'video'" class="media" :src="item.fileList[0].url"
										controls />
								</view>
								<!-- 文本信息 -->
								<view class="item-content">
									<view class="item-title">{{ item.itemName }}</view>
									<view class="item-remarks">{{ item.remarks }}</view>
									<view class="item-status">{{ item.type }}</view>
								</view>
								<!-- 编辑按钮 -->
								<view class="edit-icon" @tap.stop="() => editItem(item.id)">
									<image src="/static/image/edit-icon.png" class="edit-img" />
								</view>
							</view>
						</view>
						<!-- 删除按钮，宽度要和 deleteBtnWidth 一致 -->
						<view class="delete-btn" @tap.stop="deleteItem(item.id, index)" style="width: 100px;">
							删除
						</view>
					</movable-view>
				</movable-area>
			</view>
		</block>

		<!-- 无数据时 -->
		<view v-if="filteredItems.length === 0" class="empty-message">
			暂无数据
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		onShow
	} from '@dcloudio/uni-app'
	import config from '@/utils/config'

	// --- 响应式状态 ---
	const allItems = ref([])
	const filteredItems = ref([])
	const activeFilter = ref('all')
	const openid = ref('')
	const viewWidth = ref(0)
	const deleteBtnWidth = 100
	onShow(() => {
		const info = uni.getSystemInfoSync()
		viewWidth.value = info.windowWidth

		const user = uni.getStorageSync('userInfo') || {}
		if (user.openid) {
			openid.value = user.openid
			loadUserItems()
		} else {
			uni.showToast({
				title: '请先登录',
				icon: 'none'
			})
		}
	})

	// 从后端拉取当前用户发布的列表
	function loadUserItems() {
		uni.request({
			url: `${config.baseURL}/posts?openid=${openid.value}`,
			method: 'GET',
			success({
				data
			}) {
				// 为每条记录加一个 x=0 用于滑动
				const list = data.map(item => ({
					...item,
					x: 0
				}))
				allItems.value = list
				filteredItems.value = [...list]
			},
			fail() {
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		})
	}

	// 根据 activeFilter 筛选
	function filterItems() {
		if (activeFilter.value === 'all') {
			filteredItems.value = [...allItems.value]
		} else if (activeFilter.value === 'lost') {
			filteredItems.value = allItems.value.filter(i => i.type === '丢失物品')
		} else {
			filteredItems.value = allItems.value.filter(i => i.type === '拾取物品')
		}
	}

	function showAllItems() {
		activeFilter.value = 'all';
		filterItems()
	}

	function showLostItems() {
		activeFilter.value = 'lost';
		filterItems()
	}

	function showFoundItems() {
		activeFilter.value = 'found';
		filterItems()
	}

	function onMoveChange(e) {
		const idx = e.currentTarget.dataset.index
		const x = e.detail.x
		// clamp 到 [ -deleteBtnWidth, 0 ]
		filteredItems.value[idx].x = Math.min(0, Math.max(x, -deleteBtnWidth))
	}

	function onTouchEnd(e) {
		const idx = e.currentTarget.dataset.index
		const x = filteredItems.value[idx].x
		// 如果滑动超过一半，就露出整个删除，否则回弹
		filteredItems.value[idx].x = x < -deleteBtnWidth / 2 ? -deleteBtnWidth : 0
	}

	// 编辑
	function editItem(id) {
		const item = filteredItems.value.find(i => i.id === id)
		if (item) {
			uni.navigateTo({
				url: `/pages/publish/publish?item=${encodeURIComponent(JSON.stringify(item))}`
			})
		}
	}

	// 删除
	function deleteItem(id, index) {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这条信息吗？',
			success(res) {
				if (res.confirm) {
					uni.request({
						url: `${config.baseURL}/deleteLostFound`,
						method: 'POST',
						data: {
							id
						},
						success({
							data
						}) {
							if (data.success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
								// 复位再移除
								filteredItems.value[index].x = 0
								setTimeout(() => {
									filteredItems.value.splice(index, 1)
								}, 200)
							} else {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								})
							}
						},
						fail() {
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
</script>

<style scoped>
	.manage-container {
		padding: 10px;
	}

	.tab-bar {
		display: flex;
		justify-content: space-around;
		background: #fff;
		padding: 10px 0;
		margin-bottom: 10px;
	}

	.tab-item {
		font-size: 16px;
		padding: 6px 12px;
		border-radius: 8px;
	}

	.tab-item.active {
		background: #204dad;
		color: #fff;
	}

	.swipe-container {
		position: relative;
		margin-bottom: 10px;
	}

	.movable-area {
		width: 100%;
		height: 100px;
	}

	.movable-view {
		height: 100px; 
		display: flex;
		align-items: center;
		transition: transform .2s;
		background: #fff;
	}

	.content-wrapper {
		display: flex;
		align-items: center;
		height: 100px;
	}

	.delete-btn {
		width: 100px;
		height: 30px;
		background: #ff3b30;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
	}

	.item-card {
		display: flex;
		align-items: center;
		width: 100%;
		padding: 0 10px;
	}

	.media-container {
		margin-right: 10px;
	}

	.media {
		width: 90px;
		height: 90px;
		border-radius: 10px;
		object-fit: cover;
	}

	.item-content {
		flex: 1;
	}

	.item-title {
		font-weight: bold;
		margin-bottom: 4px;
	}

	.item-remarks {
		font-size: 14px;
		color: #666;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-status {
		margin-top: 6px;
		color: #204dad;
	}

	.edit-icon {
		padding: 4px;
		margin-right: 30px;
		
	}

	.edit-img {
		width: 30px;
		height: 30px;
	}

	

	.empty-message {
		text-align: center;
		color: #999;
		margin-top: 50px;
	}
</style>