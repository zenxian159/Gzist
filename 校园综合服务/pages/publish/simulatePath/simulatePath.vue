<template>
	<view>
		<!-- 提示信息 -->
		<view style="margin-top:10px;margin-bottom: 10px; text-align: center; font-size: 14px; color: #888;">
			<text>提示：点击地图可设置标记点</text>
		</view>

		<map id="myMap" style="width: 100%; height: 400px;" :latitude="latitude" :longitude="longitude" scale="16"
			:markers="markers" :polyline="polyline" @tap="onTapMap">
		</map>

		<!-- 按钮区域 -->
		<view>
			<view class="handle-action">
				<button :disabled="isMoving" @tap="setMoveAlong" class="handle-action-btn">启动</button>
				<button @tap="cancelPoints" class="handle-action-btn" :disabled="isMoving">撤销</button>
				<button @tap="clearPoints" class="handle-action-btn" :disabled="isMoving">清空</button>
			</view>

			<!-- 完成按钮 -->
			<button @tap="onComplete"
				style="background-color: #204dad; color: #fff; border: none; border-radius: 25rpx;  font-size: 18px; width: 90%; margin: 30px auto;">
				完成
			</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'

	let mapCtx = null

	const longitude = ref(113.457244)
	const latitude = ref(23.25904)
	const markers = ref([])
	const polyline = ref([{
		points: [],
		color: "#204dad9a",
		width: 2
	}])
	const isMoving = ref(false)
	const baseSpeed = ref(5)
	const minDuration = ref(2000)
	const maxDuration = ref(4000)
	const tempPoints = ref([])

	onMounted(() => {
		mapCtx = uni.createMapContext("myMap", this)

		// 锁定地图范围
		mapCtx.setBoundary({
			southwest: {
				longitude: 113.453333,
				latitude: 23.255863
			},
			northeast: {
				longitude: 113.46152,
				latitude: 23.261935
			},
			complete(res) {
				console.log("setBoundary ", res)
			}
		})

		uni.$on('sendData2', (res) => {
			console.log("接收到的数据222：", res.markers, res.polyline)
			if (res.markers == null && res.polyline == null) {
				console.log("kongkongkkkkk")
				return
			}
			markers.value = res.markers
			polyline.value = res.polyline
		})
	})

	// 轨迹回放事件
	const setMoveAlong = () => {
		const points = polyline.value[0].points
		if (points.length < 2) {
			uni.showToast({
				title: "请添加至少两个路径点",
				icon: "none"
			})
			return
		}

		// 计算路径总长度
		const totalDistance = calculateTotalDistance(points)
		console.log("路径总长度 (米):", totalDistance)
		// 根据路径长度动态计算时长，并限制最小值和最大值
		let duration = totalDistance * baseSpeed.value
		duration = Math.max(
			minDuration.value,
			Math.min(duration, maxDuration.value)
		)
		console.log("最终动画时长 (毫秒):", duration)

		isMoving.value = true

		// 使用 uni.createMapContext 的 moveAlong 方法
		mapCtx.moveAlong({
			markerId: 1,
			duration: duration,
			autoRotate: true,
			path: points,
			success: (res) => {
				console.log("移动成功：", res)
				uni.showToast({
					title: "轨迹完成",
					icon: "none"
				})
			},
			fail: (res) => {
				console.log("移动失败: ", res.errMsg)
			},
			complete: (res) => {
				console.log("接口已调用（调用成功、失败都会执行）: ", res.errMsg)
				isMoving.value = false
			}
		})
	}

	// 点击地图事件
	const onTapMap = (event) => {
		if (isMoving.value) return
		const {
			latitude,
			longitude
		} = event.detail
		const newPoint = {
			latitude,
			longitude
		}
		if (
			tempPoints.value.length === 0 &&
			polyline.value[0].points.length === 0
		) {
			tempPoints.value = [newPoint]
		} else {
			const updatedPoints = tempPoints.value.length ?
				[...tempPoints.value, newPoint] :
				[...polyline.value[0].points, newPoint]

			polyline.value = [{
				points: updatedPoints,
				color: "#204dad9a",
				width: 2
			}]

			tempPoints.value = []
		}
		markers.value = [{
			id: 1,
			iconPath: `/static/image/5.png`,
			latitude: newPoint.latitude,
			longitude: newPoint.longitude,
			width: 25,
			height: 25
		}]
	}

	// 撤销点
	const cancelPoints = () => {
		if (isMoving.value) return

		const points = [...polyline.value[0].points]
		if (points.length === 0) {
			polyline.value = [{
				points: []
			}]
			markers.value = []
			tempPoints.value = []
			return
		}

		points.pop()

		if (points.length < 2) {
			tempPoints.value = [...points]
			polyline.value = [{
				points: [],
				color: "#204dad9a",
				width: 2
			}]
			markers.value = points.length ?
				[{
					id: 1,
					iconPath: `/static/image/5.png`,
					latitude: points[0].latitude,
					longitude: points[0].longitude,
					width: 25,
					height: 25
				}] :
				[]
		} else {
			polyline.value = [{
				points,
				color: "#204dad9a",
				width: 2
			}]
			markers.value = [{
				id: 1,
				iconPath: `/static/image/5.png`,
				latitude: points[points.length - 1].latitude,
				longitude: points[points.length - 1].longitude,
				width: 25,
				height: 25
			}]
		}
	}

	// 清空点
	const clearPoints = () => {
		if (isMoving.value) return

		polyline.value = [{
			points: []
		}]
		markers.value = []
		tempPoints.value = []
	}

	// 计算路径总长度
	const calculateTotalDistance = (points) => {
		let totalDistance = 0

		for (let i = 0; i < points.length - 1; i++) {
			const start = points[i]
			const end = points[i + 1]
			totalDistance += calculateDistance(
				start.latitude,
				start.longitude,
				end.latitude,
				end.longitude
			)
		}
		return totalDistance
	}

	// 计算两点之间的距离
	const calculateDistance = (lat1, lon1, lat2, lon2) => {
		const R = 6371000
		const rad = Math.PI / 180

		const deltaLat = (lat2 - lat1) * rad
		const deltaLon = (lon2 - lon1) * rad

		const a =
			Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
			Math.cos(lat1 * rad) *
			Math.cos(lat2 * rad) *
			Math.sin(deltaLon / 2) *
			Math.sin(deltaLon / 2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		return R * c
	}

	const onComplete = () => {
		const {
			markers: currentMarkers,
			polyline: currentPolyline
		} = {
			markers: markers.value,
			polyline: polyline.value
		}

		if (currentMarkers.length === 0 || currentPolyline[0].points.length === 0) {
			uni.showToast({
				title: "请先设置标记点和轨迹",
				icon: "none"
			})
			return
		}
		console.log(currentMarkers, currentPolyline)

		// 使用 uni.$emit 发送数据
		uni.$emit('sendPick', {
			markers: currentMarkers,
			polyline: currentPolyline
		})

		// 返回上一页
		uni.navigateBack({
			delta: 1
		})
	}
</script>

<style>
	.handle-action {
		display: flex;
		gap: 10px;
		margin: 20px;
	}

	.handle-action-btn {
		background-color: #204dadbb;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 16px;
	}
</style>