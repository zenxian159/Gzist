<template>
	<view class="box">
		<!-- 地图 -->
		<map id="myMap" class="map" :latitude="latitude" :longitude="longitude" scale="16" :markers="markers"
			@markertap="onMarkerTap" @callouttap="onCalloutTap" />

		<!-- 筛选 -->
		<view class="filter-bar">
			<view v-for="opt in filters" :key="opt.key" class="filter-item" :class="{ active: activeFilter === opt.key }"
				@tap="filterBy(opt.key)">{{ opt.label }}</view>
		</view>

		<!-- 列表 -->
		<view v-for="item in copyItem" :key="item.id" class="card" @tap="goDetail(item)">
			<view class="user-info">
				<image class="avatar" :src="item.avatarUrl" />
				<view class="user-details">
					<text class="nickname">{{ item.nickName }}</text>
					<text class="time-views">{{ item.createdAt }}</text>
				</view>
			</view>
			<view class="content">
				<view class="itemName">#物品：{{ item.itemName }}</view>
				<view class="remarks">#备注：{{ item.remarks || '无' }}</view>
				<image v-if="item.firstMediaType === 'image'" class="media" :src="item.firstMediaUrl" mode="aspectFill"
					@tap.stop />
				<video v-else class="media" :src="item.firstMediaUrl" controls @tap.stop />
			</view>
			<view class="footer">
				<text class="tag"># {{ item.type }}</text>
			</view>
		</view>

		<!-- 底部菜单 -->
		<view class="menu-button" @tap="toggleMenu">
			<image src="/static/image/menu-icon.png" class="menu-icon" />
		</view>
		<view class="menu-container" v-if="menuVisible">
			<view class="menu-item" :style="postStyle" @tap="navigateToPost">
				<image src="/static/image/post-icon.png" /><text>发布</text>
			</view>
			<view class="menu-item" :style="manageStyle" @tap="navigateToManage">
				<image src="/static/image/manage-icon.png" /><text>管理</text>
			</view>
		</view>
		
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import config from '@/utils/config'

	// --- 状态 ---
	const allItem = ref([])
	const copyItem = ref([])
	const activeFilter = ref('all')
	const latitude = ref(23.25904)
	const longitude = ref(113.457244)

	// 菜单
	const menuVisible = ref(false)
	const postStyle = ref({})
	const manageStyle = ref({})

	// 筛选选项
	const filters = [{
			key: 'all',
			label: '全部'
		},
		{
			key: 'lost',
			label: '失物招领'
		},
		{
			key: 'found',
			label: '寻物启事'
		}
	]

	// 根据 copyItem 自动计算 markers
	const markers = computed(() =>
		copyItem.value
		.filter(i => !isNaN(i.latitude) && !isNaN(i.longitude))
		.map(i => ({
			id: i.markerId,
			latitude: i.latitude,
			longitude: i.longitude,
			iconPath: i.firstMediaType === 'image' ?
				i.firstMediaUrl :
				'/static/image/video-icon.png',
			width: 30,
			height: 30,
			callout: {
				content: i.type === '丢失物品' ?
					`丢失：${i.itemName}` :
					`拾取：${i.itemName}`,
				color: '#204dad',
				fontSize: 12,
				borderRadius: 6,
				bgColor: '#fff',
				padding: 6,
				display: 'BYCLICK',
				textAlign: 'center'
			}
		}))
	)

	// 时间格式化
	function formatTime(time) {
		const d = new Date(time)
		d.setHours(d.getHours() + 8)
		return d.toISOString().replace('T', ' ').slice(0, 16)
	}

	// 加载并预处理数据
	function loadData() {
		uni.request({
			url: `${config.baseURL}/lostAndFound`,
			method: 'GET',
			success({
				data
			}) {
				const list = data.map((item, idx) => {
					const files = item.fileList || []
					const first = files[0] || {}
					let lat = 0,
						lng = 0
					if (item.type === '丢失物品' && item.location?.[0]?.points?.length) {
						lat = +item.location[0].points[0].latitude
						lng = +item.location[0].points[0].longitude
					} else if (item.type === '拾取物品' && item.location?.latitude) {
						lat = +item.location.latitude
						lng = +item.location.longitude
					}
					return {
						...item,
						createdAt: formatTime(item.createdAt),
						firstMediaUrl: first.url || '',
						firstMediaType: first.type?.includes('video') ? 'video' : 'image',
						markerId: idx + 1,
						latitude: lat,
						longitude: lng
					}
				})
				allItem.value = list
				copyItem.value = list
			},
			fail(err) {
				console.error(err)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		})
	}

	// 生命周期
	onMounted(loadData)

	// 筛选
	function filterBy(key) {
		activeFilter.value = key
		copyItem.value = key === 'all' ?
			allItem.value :
			allItem.value.filter(i =>
				key === 'lost' ? i.type === '丢失物品' :
				i.type === '拾取物品'
			)
	}

	// Marker 点击
	function onMarkerTap(e) {
		const id = e.detail.markerId
		filterBy('all') // 先恢复全量
		const sel = allItem.value.find(i => i.markerId === id)
		if (sel) copyItem.value = [sel]
	}
	// Callout 点击
	function onCalloutTap(e) {
		console.log('callouttap', e)
	}

	// 跳详情
	function goDetail(item) {
		uni.navigateTo({
			url: `/pages/lostAndFound/detail/detail?item=${encodeURIComponent(JSON.stringify(item))}`
		})
	}

	// 底部菜单动画
	function toggleMenu() {
		menuVisible.value = !menuVisible.value
		if (menuVisible.value) {
			setTimeout(() => {
				postStyle.value = {
					opacity: 1,
					transform: 'translate(-20px,-80px)'
				}
				manageStyle.value = {
					opacity: 1,
					transform: 'translate(-80px,-30px)'
				}
			}, 50)
		} else {
			postStyle.value = {
				opacity: 0,
				transform: 'translate(0,0)'
			}
			manageStyle.value = {
				opacity: 0,
				transform: 'translate(0,0)'
			}
		}
	}

	// 导航
	const navigateToPost = () => uni.navigateTo({
		url: '/pages/publish/publish'
	})
	const navigateToManage = () => uni.navigateTo({
		url: '/pages/lostAndFound/manage/manage'
	})
</script>

<style scoped>
	.box {
		width: 100%;
		min-height: 100vh;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.map {
		width: 100%;
		height: 320px;
		border-radius: 8px;
		margin-bottom: 10px;
	}

	.filter-bar {
		width: 90%;
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
	}

	.filter-item {
		flex: 1;
		text-align: center;
		padding: 10px;
		color: #666;
		border-radius: 8px;
	}

	.filter-item.active {
		background: #204dad;
		color: #fff;
		font-weight: bold;
	}

	.card {
		width: 90%;
		background: #fff;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.user-details {
		display: flex;
		flex-direction: column;
	}

	.nickname {
		font-size: 16px;
		font-weight: bold;
	}

	.time-views {
		font-size: 12px;
		color: #888;
	}

	.content {
		margin-top: 10px;
	}

	.itemName {
		font-size: 18px;
		color: #204dad;
		margin-bottom: 5px;
	}

	.remarks {
		font-size: 16px;
		color: #333;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.media {
		width: 40%;
		height: 150px;
		border-radius: 6px;
		margin-top: 8px;
		object-fit: cover;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	.tag {
		font-size: 12px;
		color: #666;
		padding: 4px 8px;
		background: #eee;
		border-radius: 4px;
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