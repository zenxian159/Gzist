<template>
  <view class="container">
    <view class="thing-top">
      <view style="display: flex; align-items: center; gap: 20rpx;">
        <view class="logo"></view>
        <text>物品信息</text>
      </view>
      <input @input="onInputChange('title', $event)" type="text" placeholder="请输入物品名称" :value="title" />
      <textarea :value="description" placeholder="描述一下商品的详细信息" class="description"
        @input="onInputChange('description', $event)" />
    </view>

    <view class="thing-bottom">
      <view class="preview">
        <view v-for="(item, index) in fileList" :key="index" class="file-item" @click="previewFile(item.url, item.type)">
          <image v-if="item.type === 'image'" :src="item.url" mode="aspectFill" class="preview-file" lazy-load />
          <video v-else-if="item.type === 'video'" :src="item.url" controls class="preview-file" />
          <view class="delete-btn" @click.stop="deleteFile(index)">X</view>
        </view>
        <view v-if="fileList.length < maxFiles" class="upload-btn" @click="chooseMedia">+</view>
      </view>
      <text style="font-size: 32rpx; color: #ccc; font-weight: normal;">添加图片/视频</text>
    </view>

    <view class="category-container">
      <text class="label">分类：</text>
      <picker mode="selector" :range="category" @change="onCategoryChange">
        <view class="picker-btn">{{ currentCategory }}</view>
      </picker>
    </view>

    <view style="display: flex; justify-content: space-between; align-items: center;">
      <text>物品价格：</text>
      <input type="number" placeholder="请输入物品价格" class="price" @input="onInputChange('price', $event)" :value="price" />
    </view>

    <view class="submit-btn">
      <button @click="submitForm">{{ isEditing ? '完成' : '发布' }}</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import config from '@/utils/config'
import { request } from '@/utils/api'
import { logError } from '@/utils/logger'

const title = ref('')
const description = ref('')
const fileList = ref([])
const maxFiles = ref(6)
const category = ref(['电子产品', '学习用品', '生活用品', '运动用品', '其他'])
const currentCategory = ref('请选择分类')
const price = ref('')
const openid = ref('')
const isEditing = ref(false)
const trade_id = ref('')

onMounted(() => {
  const userInfo = uni.getStorageSync('userInfo')
  if (userInfo && userInfo.openid) {
    openid.value = userInfo.openid
  }
  uni.$on('sendProductData', (data) => {
    if (data) {
      const item = data.item
      isEditing.value = true
      title.value = item.title
      description.value = item.description
      currentCategory.value = item.category
      price.value = item.price
      fileList.value = item.fileList
      trade_id.value = item.trade_id
    }
  })
})

const chooseMedia = () => {
  uni.showActionSheet({
    itemList: ['选择图片', '选择视频'],
    success: (res) => {
      if (res.tapIndex === 0) chooseImage()
      if (res.tapIndex === 1) chooseVideo()
    }
  })
}

const chooseImage = () => {
  uni.chooseImage({
    count: maxFiles.value - fileList.value.length,
    success: (res) => {
      const newFiles = res.tempFilePaths.map(path => ({ type: 'image', url: path }))
      newFiles.forEach(file => uploadFileToServer(file))
    }
  })
}

const chooseVideo = () => {
  uni.chooseVideo({
    success: (res) => {
      const file = { type: 'video', url: res.tempFilePath }
      uploadFileToServer(file)
    }
  })
}

const uploadFileToServer = (file) => {
  uni.uploadFile({
    url: `${config.baseURL}/upload`,
    filePath: file.url,
    name: 'file',
    formData: { type: file.type },
    success: (res) => {
      const data = JSON.parse(res.data)
      if (res.statusCode === 200 && data.url) {
        fileList.value.push({ type: file.type, url: data.url })
      }
    },
    fail: (err) => {
      logError(err)
      uni.showToast({ title: '上传失败', icon: 'none' })
    }
  })
}

const deleteFile = (index) => {
  fileList.value.splice(index, 1)
}

const previewFile = (url, type) => {
  if (type === 'image') {
    const urls = fileList.value.filter(item => item.type === 'image').map(item => item.url)
    uni.previewImage({ current: url, urls })
  }
}

const onCategoryChange = (e) => {
  currentCategory.value = category.value[e.detail.value]
}

const onInputChange = (field, e) => {
  const value = e.detail.value
  if (field === 'title') title.value = value
  else if (field === 'description') description.value = value
  else if (field === 'price') price.value = value
}

const submitForm = () => {
  if (!title.value || !description.value || !fileList.value.length || currentCategory.value === '请选择分类' || !price.value || !openid.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  isEditing.value ? updateProduct() : createProduct()
}

const updateProduct = async () => {
  try {
    await request({
      url: `${config.baseURL}/trades/${trade_id.value}`,
      method: 'PUT',
      data: {
        title: title.value,
        description: description.value,
        currentCategory: currentCategory.value,
        price: price.value,
        fileList: fileList.value
      }
    })
    uni.$emit('product-updated', {
      item: {
        trade_id: trade_id.value,
        title: title.value,
        description: description.value,
        category: currentCategory.value,
        price: price.value,
        fileList: fileList.value,
        seller_id: openid.value,
        update_time: new Date().toISOString()
      }
    })
    uni.navigateBack()
  } catch (err) {
    logError(err)
    uni.showToast({ title: '更新失败', icon: 'none' })
  }
}

const createProduct = async () => {
  try {
    await request({
      url: `${config.baseURL}/trades`,
      method: 'POST',
      data: {
        title: title.value,
        description: description.value,
        currentCategory: currentCategory.value,
        price: price.value,
        fileList: fileList.value,
        openid: openid.value
      }
    })
    uni.showToast({ title: '发布成功' })
    resetForm()
    uni.navigateBack()
  } catch (err) {
    logError(err)
    uni.showToast({ title: '发布失败', icon: 'none' })
  }
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  fileList.value = []
  currentCategory.value = '请选择分类'
  price.value = ''
}
</script>

<style>
	page {
		background-color: #f7f7f7;
	}

	.container {
		margin: 0 30rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 20rpx;
	}

	.thing-top>input {
		font-size: 32rpx;
		padding: 50rpx 0;
		padding-left: 10rpx;
	}

	.thing-top .description {
		width: 95%;
		margin: auto;
		background-color: #f8f8f8;
		padding: 20rpx;
		border-radius: 20rpx;
	}

	/* logo样式 */
	.logo {
		position: relative;
		width: 40rpx;
		height: 40rpx;
		border: 4rpx solid #888;
		border-radius: 6rpx;
		box-sizing: border-box;
		margin-top: 4rpx;
	}

	.logo::before {
		content: "";
		position: absolute;
		top: 30%;
		left: 20%;
		width: 60%;
		height: 4rpx;
		background-color: #888;
		border-radius: 4rpx;
	}

	.logo::after {
		content: "";
		position: absolute;
		top: 65%;
		left: 20%;
		width: 40%;
		height: 4rpx;
		background-color: #888;
		border-radius: 4rpx;
	}

	/* 文件展示区样式 */
	.thing-bottom {
		margin-top: 30rpx;
		margin-bottom: 20rpx;
	}

	.preview {
		margin: 20rpx 0;
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}

	/* 单个文件/视频样式 */
	.file-item {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 200rpx;
		height: 200rpx;
		position: relative;
		border-radius: 20rpx;
		margin: 4rpx;
	}

	.preview-file {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 20rpx;
	}

	/* 删除按钮 */
	.delete-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 40rpx;
		height: 40rpx;
		background-color: #204dada2;
		color: white;
		text-align: center;
		line-height: 40rpx;
		border-radius: 50%;
		font-size: 24rpx;
		z-index: 1000;
	}

	/* 上传按钮样式 */
	.upload-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 200rpx;
		height: 200rpx;
		border: 4rpx dashed #ddd;
		border-radius: 20rpx;
		color: #204dad;
		font-size: 96rpx;
		font-weight: 100;
		background-color: #f9f9f9;
	}

	.category-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.label {
		font-size: 32rpx;
	}

	.picker-btn {
		flex: 1;
		padding: 16rpx 40rpx;
		font-size: 28rpx;
		border: 2rpx solid #ddd;
		border-radius: 10rpx;
		background-color: #f8f8f8;
		text-align: center;
	}

	.price {
		width: 50%;
		font-size: 32rpx;
		margin-top:10px;
		padding: 26rpx 10rpx;
		text-align: right;
	}

	.submit-btn {
		margin: 60rpx 100rpx;
	}

	.submit-btn button {
		width: 100%;
		background-color: #204dad;
		border-radius: 25rpx;
		font-size: 36rpx;
		color: #fff;
	}
</style>