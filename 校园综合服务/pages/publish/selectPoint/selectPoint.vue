<template>
	<view>
		<!-- 提示信息 -->
		<view style="margin:10px 0; text-align:center; color:#888; font-size:14px;">
			提示：点击地图即可设置标记点并自动获取地址
		</view>

		<!-- 地图 -->
		<map id="myMap" style="width:100%; height:400px" :latitude="centerLat" :longitude="centerLng" scale="16"
			:markers="markers" @tap="onMapTap" />

		<!-- 显示地址 -->
		<view style="margin:10px 0; text-align:center; font-size:18px;">
			当前标记地点：{{ locationName || '未设置标记点' }}
		</view>

		<!-- 完成按钮 -->
		<view style="text-align:center; margin-top:20px;">
			<button @tap="onComplete" style="width:90%; background:#204dad; color:#fff; border-radius:25rpx;">完成</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'

	let mapCtx = null

	// 地图中心
	const centerLat = ref(23.25904)
	const centerLng = ref(113.457244)

	// 标记点数组
	const markers = ref([])

	// 逆地址解析后得到的地址名
	const locationName = ref('')

	// 初始化 mapContext
	onMounted(() => {
		mapCtx = uni.createMapContext('myMap')
		// （可选）设置地图显示范围
		mapCtx.setBoundary({
			southwest: {
				latitude: 23.255863,
				longitude: 113.453333
			},
			northeast: {
				latitude: 23.261935,
				longitude: 113.461520
			}
		})

		uni.$on('sendData', payload => {
		    // payload.marker 是上个页面传过来的 { latitude, longitude, … }
		    const m = payload.marker
		    if (m && typeof m.latitude === 'number' && typeof m.longitude === 'number') {
		      // 把它当成唯一的 marker
		      markers.value = [
		        {
		          id: 0,
		          latitude: m.latitude,
		          longitude: m.longitude,
		          iconPath: '/static/image/7.png',
		          width: 32,
		          height: 32
		        }
		      ]
		      // 如果也带了 location 字符串，就直接用；否则走逆解析
		      if (payload.location) {
		        locationName.value = payload.location
		      } else {
		        getClosestLocationName(m.latitude, m.longitude)
		      }
		    }
		  })
	})

	// 点击地图打点并逆地址解析
	const onMapTap = e => {
		const {
			latitude,
			longitude
		} = e.detail
		// 新建手动标记
		const marker = {
			id: 0,
			latitude,
			longitude,
			iconPath: '/static/image/7.png',
			width: 32,
			height: 32
		}
		markers.value = [marker]
		// 逆地址解析
		getClosestLocationName(latitude, longitude)
	}

	// 调用腾讯逆地址解析
	function getClosestLocationName(lat, lng) {
		uni.request({
			url: 'https://apis.map.qq.com/ws/geocoder/v1/',
			data: {
				location: `${lat},${lng}`,
				key: 'YA2BZ-GNVWB-F4FUO-JGREH-NY5Q3-XLBG2',
				get_poi: 1,
				poi_options: 'radius=500;page_size=10'
			},
			success(res) {
				if (res.data.status === 0) {
					const pois = res.data.result.pois || []
					let best = res.data.result.address // 默认返回的地址
					if (pois.length) {
						// 找最近的 POI
						let minD = Infinity
						pois.forEach(poi => {
							const d = haversine(lat, lng, poi.location.lat, poi.location.lng)
							if (d < minD) {
								minD = d
								best = poi.title
							}
						})
					}
					locationName.value = best
				} else {
					console.error('逆地址解析失败', res.data)
					uni.showToast({
						title: '地址获取失败',
						icon: 'none'
					})
				}
			},
			fail(err) {
				console.error('请求逆地址解析出错', err)
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				})
			}
		})
	}

	// Haversine 公式
	function haversine(lat1, lng1, lat2, lng2) {
		const toRad = v => v * Math.PI / 180
		const R = 6371e3
		const dLat = toRad(lat2 - lat1)
		const dLng = toRad(lng2 - lng1)
		const a = Math.sin(dLat / 2) ** 2 +
			Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
			Math.sin(dLng / 2) ** 2
		return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
	}

	// 完成按钮：发全局事件回上页
	const onComplete = () => {
		if (!locationName.value) {
			uni.showToast({
				title: '请先设置标记点',
				icon: 'none'
			})
			return
		}
		const marker = markers.value[0]
		uni.$emit('sendLost', {
			currentMarker: marker,
			locationName: locationName.value
		})
		uni.navigateBack()
	}
</script>