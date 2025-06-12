<template>
	<!-- 选项卡 -->
	<view class="tab">
		<view v-for="(tab, i) in currentTab" :key="i" @tap="clickTab(i)">
			<text :class="['text', { 'tab-active': currentIndex === i }]" :disabled="disableTab">{{ tab }}</text>
		</view>
	</view>

	<view class="content">
		<!-- 物品信息 -->
		<view class="thing">
			<view class="thing-top">
				<view class="logo-wrapper">
					<view class="logo"></view>
					<text>物品信息</text>
				</view>
				<input v-model="itemName" placeholder="请输入物品名称" class="input-field" />
			</view>

			<view class="thing-bottom">
				<!-- 文件预览 & 上传 -->
				<view class="preview">
					<view v-for="(f, idx) in fileList" :key="idx" class="file-item">
						<image v-if="f.type==='image'" :src="f.url" mode="aspectFill" class="preview-file"
							@tap="previewFile(f.url)" />
						<video v-else :src="f.url" controls class="preview-file" />
						<view class="delete-btn" @tap.stop="deleteFile(idx)">×</view>
					</view>
					<view v-if="fileList.length<maxFiles" class="upload-btn" @tap="chooseMedia">+</view>
				</view>
				<text class="hint">添加图片/视频</text>
			</view>
		</view>

		<!-- 其他表单项 -->
		<view class="content-bottom">
			<!-- 地点 -->
			<view class="row">
				<text>{{ currentIndex===0?'拾取地点':'丢失地点' }}</text>
				<view class="location-btn" @tap="handleLocationClick">
					<text>
						{{ currentIndex===0
                ? (pickMarker?'点击查看标记点':'请在地图上选点')
                : (polyline[0].points.length>0?'点击查看模拟路径':'请在地图上模拟路径')
            }}
					</text>
				</view>
			</view>

			<!-- 时间 -->
			<view class="row">
				<text>{{ currentIndex===0?'拾取时间':'丢失时间' }}</text>
				<picker mode="date" :end="today" @change="onDateChange">
					<text class="picker-input">
						{{ selectedTime|| (currentIndex===0?'请选择拾取时间':'请选择丢失时间') }}
					</text>
				</picker>
			</view>

			<!-- 认领方式 -->
			<view class="row">
				<text>认领方式</text>
				<input v-model="claimMethod" placeholder="可填写在哪里领取" class="input-field" />
			</view>

			<!-- 联系电话 -->
			<view class="row">
				<text>联系电话</text>
				<input v-model="contact" type="number" placeholder="请输入联系电话" class="input-field" />
			</view>

			<!-- 备注 -->
			<view class="row tips">
				<textarea v-model="remarks" placeholder="请输入备注" class="textarea-field" />
			</view>

			<!-- 酬金（仅丢失物品展示） -->
			<view v-if="currentIndex===1" class="reward-section">
				<view class="row reward-row">
					<text>酬金</text>
					<radio-group @change="onRewardChange" class="radio-group">
						<label class="radio-item">
							<radio value="无" :checked="reward=='无'" /> 无
						</label>
						<label class="radio-item">
							<radio value="面议" :checked="reward=='面议'" /> 面议
						</label>
						<label class="radio-item">
							<radio value="输入" :checked="reward=='输入'" /> 输入
						</label>
					</radio-group>
				</view>
				<view v-if="reward=='输入'" class="row reward-input-row">
					<input v-model="rewardAmount" type="number" placeholder="请输入酬金金额" class="input-field" />
				</view>
			</view>
		</view>
	</view>

	<!-- 提交按钮 -->
	<view class="submitBtn">
		<button @tap="submitForm">
			{{ isEditing ? '完成' : '发布' }}
		</button>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted,
		onUnmounted
	} from 'vue'
	import {
		onLoad,
		onShow,
	} from '@dcloudio/uni-app'
	import config from '@/utils/config'

	/** 状态 **/
	const currentTab = ref(['拾取物品', '丢失物品'])
	const currentIndex = ref(0)
	const itemName = ref('')
	const fileList = ref([]) // {type,url}
	const maxFiles = 3
	const pickLocation = ref('')
	const pickMarker = ref(null)
	const pickLocationName = ref('')
	const selectedTime = ref('')
	const today = ref('')
	const markers = ref([{
		id: 1,
		width: 25,
		height: 25,
		iconPath: '/static/image/5.png',
		latitude: 0,
		longitude: 0
	}])
	const polyline = ref([{
		points: []
	}])
	const claimMethod = ref('')
	const contact = ref('')
	const remarks = ref('')
	const reward = ref('无')
	const rewardAmount = ref('')
	const openid = ref('')
	const isEditing = ref(false)
	const id = ref('')
	const disableTab = ref(false)
	// 用户切换单选时触发
	function onRewardChange(e) {
		reward.value = e.detail.value
	}
	// onLoad
	onLoad((options) => {
		// 取 openid
		const u = uni.getStorageSync('userInfo') || {}
		if (u.openid) openid.value = u.openid

		function formatTime(time) {
			const date = new Date(time);
			const offset = 8; // 中国时区 +08:00
			date.setHours(date.getHours() + offset);
			return date.toISOString().replace("T", " ").substring(0, 10);
		}
		const d = new Date()
		today.value = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
			.map(n => String(n).padStart(2, '0')).join('-')

		// 尝试读取编辑项
		if (options.item) {
			disableTab.value = true
			isEditing.value = true
			const item = JSON.parse(decodeURIComponent(options.item))
			currentIndex.value = item.type === '丢失物品' ? 1 : 0
			itemName.value = item.itemName
			fileList.value = item.fileList
			claimMethod.value = item.claimMethod
			contact.value = item.contact
			remarks.value = item.remarks
			selectedTime.value = formatTime(item.time)
			id.value = item.id
			if (currentIndex.value === 0) {
				pickMarker.value = item.location
				pickLocation.value = item.location.name || ''
			} else {
				polyline.value = item.location
				const pts = item.location[0]?.points || []
				if (pts.length) {
					const last = pts[pts.length - 1]
					markers.value = [{
						...markers.value[0],
						latitude: last.latitude,
						longitude: last.longitude
					}]
				}
				reward.value = item.reward
				rewardAmount.value = item.rewardAmount || ''
			}
		}
	})

	// onShow（可选）
	onShow(() => {})

	function handlePickData(data) {
		// data.markers 和 data.polyline 就是发布端 emit 时传的
		markers.value = data.markers
		polyline.value = data.polyline
	}
	function handleLostData(data) {
	  // 收到事件，更新本页数据
	  pickMarker.value = data.currentMarker
	  pickLocationName.value = data.locationName
	}

	onMounted(() => {
		uni.$on('sendPick', handlePickData)
		uni.$on('sendLost', handleLostData)
	})
	onUnmounted(() => {
		uni.$off('sendPick', handlePickData)
		 uni.$off('sendLost', handleLostData)
	})
	/** 切 tab **/
	function clickTab(i) {
		if (disableTab.value) return
		currentIndex.value = i
		reward.value = '无'
		rewardAmount.value = ''
	}

	/** 选图或视频 **/
	function chooseMedia() {
		uni.showActionSheet({
			itemList: ['选择图片', '选择视频'],
			success(res) {
				if (res.tapIndex === 0) chooseImage()
				else chooseVideo()
			}
		})
	}

	function chooseImage() {
		uni.chooseImage({
			count: maxFiles - fileList.value.length,
			success(res) {
				const arr = res.tempFilePaths.map(p => ({
					type: 'image',
					url: p
				}))
				arr.forEach(f => uploadFileToServer(f.url, f.type))
				fileList.value.push(...arr)
			}
		})
	}

	function chooseVideo() {
		uni.chooseVideo({
			success(res) {
				const f = {
					type: 'video',
					url: res.tempFilePath
				}
				uploadFileToServer(f.url, f.type)
				fileList.value.push(f)
			}
		})
	}

	// 上传单个文件
	function uploadFileToServer(path, type) {
		uni.uploadFile({
			url: `${config.baseURL}/upload`,
			filePath: path,
			name: 'file',
			formData: {
				type
			},
			success({
				data,
				statusCode
			}) {
				const d = JSON.parse(data)
				if (statusCode === 200 && d.url) {
					fileList.value = fileList.value.map(f => {
						return f.url === path ? {
							...f,
							url: d.url
						} : f
					})
				}
			}
		})
	}

	// 删除
	function deleteFile(idx) {
		fileList.value.splice(idx, 1)
	}

	// 预览
	function previewFile(url) {
		uni.previewImage({
			urls: fileList.value.filter(f => f.type === 'image').map(f => f.url),
			current: url
		})
	}

	// 选日期
	function onDateChange(e) {
		selectedTime.value = e.detail.value
	}

	// 跳到选点/模拟路径页
	function handleLocationClick() {
		if (currentIndex.value === 0) {
			uni.navigateTo({
				url: '/pages/publish/selectPoint/selectPoint',
				success(res) {
					uni.$emit('sendData', {
						marker: pickMarker.value,
						location: pickLocation.value
					})
				}
			})
		} else {
			uni.navigateTo({
				url: '/pages/publish/simulatePath/simulatePath',
				success(res) {
					uni.$emit('sendData2', {
						markers: markers.value,
						polyline: polyline.value
					})
				}
			})
		}
	}

	/** 提交或更新 **/
	function submitForm() {
		// 基本验证
		if (!itemName.value ||
			(!fileList.value.length) ||
			(!openid.value) ||
			(!claimMethod.value) ||
			(!contact.value) ||
			(!selectedTime.value) ||
			(currentIndex.value === 0 && !pickMarker.value) ||
			(currentIndex.value === 1 && !polyline.value[0].points.length)
		) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}

		// 组装 payload
		const base = {
			openid: openid.value,
			itemName: itemName.value,
			fileList: fileList.value,
			time: selectedTime.value,
			claimMethod: claimMethod.value,
			contact: contact.value,
			remarks: remarks.value
		}
		let url, payload
		if (currentIndex.value === 0) {
			url = isEditing.value ?
				`${config.baseURL}/updateLostFound` :
				`${config.baseURL}/pickRecord`
			payload = {
				...base,
				pickLocation: pickMarker.value
			}
		} else {
			url = isEditing.value ?
				`${config.baseURL}/updateLostFound` :
				`${config.baseURL}/lostRecord`
			payload = {
				...base,
				lostPath: polyline.value,
				reward: reward.value,
				rewardAmount: reward.value === '输入' ?
					Number(rewardAmount.value) || 0 : '',
			}
		}
		if (isEditing.value) payload.id = id.value

		uni.request({
			url,
			method: 'POST',
			data: payload,
			header: {
				'content-type': 'application/json'
			},
			success({
				statusCode,
				data
			}) {
				if (statusCode === 200) {
					uni.showToast({
						title: isEditing.value ? '更新成功' : '发布成功'
					})
					uni.navigateBack()
				} else {
					uni.showToast({
						title: '操作失败',
						icon: 'none'
					})
				}
			}
		})
	}
</script>

<style scoped>
	.tab {
		flex-direction: row;
		display: flex;
		justify-content: center;
		gap: 10px;
		margin: 20rpx 0;
	}

	.text {
		padding: 20rpx 40rpx;
		background: #ddd;
		color: #fff;
		border-radius: 10px;
	}

	.tab-active {
		background: #204dad;
	}

	.content {
		background: #fff;
		border-radius: 20rpx;
		margin: 0 30rpx;
		padding: 30rpx;
	}

	.thing-top {
		flex-direction: row;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #f1f1f1;
		padding-bottom: 20rpx;
	}

	.logo-wrapper {
		flex-direction: row;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logo {
		position: relative;
		width: 20px;
		height: 20px;
		border: 2px solid #888;
		border-radius: 3px;
	}

	.logo::before,
	.logo::after {
		content: '';
		position: absolute;
		background: #888;
		height: 2px;
		border-radius: 2px;
	}

	.logo::before {
		width: 60%;
		top: 30%;
		left: 20%;
	}

	.logo::after {
		width: 40%;
		top: 65%;
		left: 20%;
	}

	.input-field {
		flex: 1;
		text-align: right;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.thing-bottom {
		margin-top: 30rpx;
	}

	.preview {
		flex-direction: row;
		display: flex;
		gap: 10px;
		margin-bottom: 20rpx;
	}

	.file-item {
		position: relative;
		width: 110px;
		height: 110px;
		border-radius: 10px;
		overflow: hidden;
	}

	.preview-file {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.delete-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 20px;
		height: 20px;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		text-align: center;
		line-height: 20px;
		border-radius: 50%;
	}

	.upload-btn {
		width: 110px;
		height: 110px;
		border: 2px dashed #ddd;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		color: #204dad;
	}

	.hint {
		font-size: 16px;
		color: #ccc;
		text-align: center;
	}

	.content-bottom .row {
		flex-direction: row;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #eee;
		padding: 20rpx 0;
	}

	.picker-input {
		color: #204dad;
	}

	.tips {
		padding: 20rpx 0;
	}

	.textarea-field {
		width: 100%;
		background: #f1f1f1;
		border-radius: 30rpx;
		padding: 20rpx;
	}

	.reward-section {
		margin-top: 30rpx;
	}

	.reward-row {
		flex-direction: row;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.radio-group {
		flex-direction: row;
		display: flex;
		gap: 10px;
	}

	.radio-item {
		flex-direction: row;
		display: flex;
		align-items: center;
	}

	.reward-input-row input {
		width: 60%;
		text-align: right;
		padding: 20rpx;
		border-bottom: 1px solid #f1f1f1;
	}

	.submitBtn {
		margin: 30rpx 50rpx;
	}

	.submitBtn button {
		width: 100%;
		background: #204dad;
		color: #fff;
		font-size: 32rpx;
		border-radius: 40rpx;
		padding: 20rpx;
	}
</style>