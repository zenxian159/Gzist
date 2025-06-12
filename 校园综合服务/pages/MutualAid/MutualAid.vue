<template>
	<view class="container">
		<!-- 列表 -->
		<view v-for="item in mutualAidList" :key="item.id" class="post-card" @tap="goToDetail(item.id)">
			<view class="user-info">
				<image class="avatar" :src="item.avatarUrl" mode="aspectFill" />
				<view class="user-details">
					<text class="username">{{ item.nickName }}</text>
					<text class="time">{{ item.created_at }}</text>
				</view>
			</view>

			<view class="content">
				<text>{{ item.content }}</text>
			</view>

			<view class="media-container" v-if="item.images?.length">
				<view v-for="(media, idx) in item.images" :key="idx" class="media-wrap">
					<image v-if="media.type === 'image'" class="media" :src="media.url" mode="aspectFill"
						@tap="previewImage(media.url)" />
					<video v-else class="media" :src="media.url" controls />
				</view>
			</view>
		</view>

		<!-- 菜单按钮 -->
		<view class="menu-button" @tap="toggleMenu">
			<image src="/static/image/menu-icon.png" class="menu-icon" />
		</view>

		<!-- 功能菜单 -->
		<view class="menu-container" v-if="menuVisible">
			<view class="menu-item" :animation="postAni" @tap="navigateToPost()">
				<image src="/static/image/post-icon.png" />
				<text>发布</text>
			</view>
			<view class="menu-item" :animation="manageAni" @tap="navigateToManage()">
				<image src="/static/image/manage-icon.png" />
				<text>管理</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		onShow
	} from "@dcloudio/uni-app";
	import config from "@/utils/config";

	const mutualAidList = ref([]);
	const openid = uni.getStorageSync("userInfo")?.openid || "";

	// 菜单动画状态
	const menuVisible = ref(false);
	let postAni = ref(null);
	let manageAni = ref(null);

	function fetchMutualAid() {
		uni.request({
			url: `${config.baseURL}/wx-mutualAid`,
			method: "GET",
			success(res) {
				if (res.statusCode === 200 && res.data.items) {
					mutualAidList.value = res.data.items;
				} else {
					uni.showToast({
						title: "加载失败",
						icon: "none"
					});
				}
			},
			fail() {
				uni.showToast({
					title: "网络错误",
					icon: "none"
				});
			},
		});
	}

	onShow(() => {
		fetchMutualAid();
	});

	function goToDetail(id) {
		uni.navigateTo({
			url: `/pages/MutualAid/aidDetail/aidDetail?id=${id}`,
		});
	}

	function previewImage(url) {
		uni.previewImage({
			urls: [url],
			current: url
		});
	}

	function navigateToPost() {
		uni.navigateTo({
			url: "/pages/MutualAid/addAid/addAid"
		});
	}

	function navigateToManage() {
		uni.navigateTo({
			url: "/pages/MutualAid/aidManage/aidManage"
		});
	}

	function toggleMenu() {
		const a1 = uni.createAnimation({
			duration: 300,
			timingFunction: "ease-out"
		});
		const a2 = uni.createAnimation({
			duration: 300,
			timingFunction: "ease-out"
		});
		if (!menuVisible.value) {
			menuVisible.value = true;
			setTimeout(() => {
				a1.opacity(1).translate(-20, -80).step();
				a2.opacity(1).translate(-80, -30).step();
				postAni.value = a1.export();
				manageAni.value = a2.export();
			}, 50);
		} else {
			a1.opacity(0).translate(0, 0).step();
			a2.opacity(0).translate(0, 0).step();
			postAni.value = a1.export();
			manageAni.value = a2.export();
			setTimeout(() => (menuVisible.value = false), 300);
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx;
		background: #f7f7f7;
	}

	/* 帖子卡片 */
	.post-card {
		background: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	/* 用户区 */
	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 40rpx;
		margin-right: 20rpx;
	}

	.user-details {
		display: flex;
		flex-direction: column;
	}

	.username {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.time {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	/* 内容 */
	.content {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #444;
		line-height: 1.6;
	}

	/* 媒体 */
	.media-container {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 20rpx;
	}

	.media-wrap {
		width: 210rpx;
		height: 210rpx;
	}

	.media {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
		object-fit: cover;
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