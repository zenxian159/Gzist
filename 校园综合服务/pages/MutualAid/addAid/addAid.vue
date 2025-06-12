<template>
  <view class="container">
    <!-- 内容输入 -->
    <textarea
      v-model="content"
      class="input-box"
      placeholder="请输入互助内容..."
      maxlength="200"
    />

    <!-- 文件预览 & 上传 -->
    <view class="preview">
      <view
        v-for="(f, idx) in fileList"
        :key="idx"
        class="file-item"
      >
        <image
          v-if="f.type === 'image'"
          :src="f.url"
          mode="aspectFill"
          class="preview-file"
          @tap="previewFile(f)"
        />
        <video
          v-else
          :src="f.url"
          controls
          class="preview-file"
        />
        <view
          class="delete-btn"
          @tap.stop="deleteFile(idx)"
        >×</view>
      </view>
      <view
        v-if="fileList.length < maxFiles"
        class="upload-btn"
        @tap="chooseMedia"
      >+</view>
    </view>

    <!-- 提交按钮 -->
    <view class="submitBtn">
      <button @tap="submitAid">
        {{ isEditing ? '完成' : '发布' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import config from '@/utils/config'

// --- 数据状态 ---
const id = ref('')
const content = ref('')
const fileList = ref([])      // { type: 'image'|'video', url: string }
const maxFiles = 3
const openid = ref('')
const isEditing = ref(false)

// --- 生命周期函数 ---
onLoad((options) => {
  // 取登录用户
  const user = uni.getStorageSync('userInfo')
  if (!user?.openid) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  openid.value = user.openid

  // 如果带 id 参数，则进入编辑模式，加载详情
  if (options.id) {
      id.value        = options.id
      isEditing.value = true
      uni.request({
        url: `${config.baseURL}/wx-mutualAid/${id.value}`,
        method: 'GET',
        success(res) {
          if (res.statusCode === 200) {
            content.value  = res.data.content
            fileList.value = res.data.images.map(i => ({
              type: i.type,
              url:  i.url
            }))
          }
        }
      })
    }
})

// --- 选择图片/视频 ---
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
      const arr = res.tempFilePaths.map(p => ({ type: 'image', url: p }))
      fileList.value.push(...arr)
    }
  })
}

function chooseVideo() {
  uni.chooseVideo({
    success(res) {
      fileList.value.push({ type: 'video', url: res.tempFilePath })
    }
  })
}

// --- 删除本地文件 ---
function deleteFile(idx) {
  fileList.value.splice(idx, 1)
}

// --- 预览图片 ---
function previewFile(f) {
  if (f.type === 'image') {
    const urls = fileList.value
      .filter(x => x.type === 'image')
      .map(x => x.url)
    uni.previewImage({ current: f.url, urls })
  }
}

// —— 上传 & 发布 —— 
async function submitAid() {
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }
  uni.showLoading({ title: '保存中...', mask: true })

  try {
    const newFiles = fileList.value.filter(f =>
      f.url.startsWith('wxfile://') ||
      f.url.startsWith('http://tmp')
    )
    const uploaded = await Promise.all(
      newFiles.map(f => uploadOne(f.url, f.type))
    )
    const images = fileList.value.map(f => {
      const hit = uploaded.find(u => u.localPath === f.url)
      return hit
        ? { url: hit.url,    type: hit.type }
        : { url: f.url,      type: f.type }
    })

    const apiUrl = isEditing.value
      ? `${config.baseURL}/mutualAid/${id.value}`
      : `${config.baseURL}/mutualAid`
    const method = isEditing.value ? 'PUT' : 'POST'

    uni.request({
      url: apiUrl,
      method,
      header: { 'content-type': 'application/json' },
      data: {
        openid: openid.value,
        content: content.value,
        images // <— 这里所有都是服务器返回的地址了
      },
      success() {
        uni.showToast({ title: isEditing.value ? '修改成功' : '发布成功' })
        uni.navigateBack()
      },
      fail() {
        uni.showToast({ title: '操作失败', icon: 'none' })
      },
      complete() {
        uni.hideLoading()
      }
    })
  } catch (e) {
    console.error(e)
    uni.hideLoading()
    uni.showToast({ title: '上传失败', icon: 'none' })
  }
}

// 单文件上传，返回 { localPath, url, type }
function uploadOne(localPath, type) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${config.baseURL}/upload`,
      filePath: localPath,
      name: 'file',
      formData: { type },
      success(res) {
        const data = JSON.parse(res.data)
        if (res.statusCode === 200 && data.url) {
          resolve({ localPath, url: data.url, type })
        } else {
          reject(data)
        }
      },
      fail: reject
    })
  })
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  background: #f7f7f7;
}
.input-box {
  width: 100%;
  min-height: 200rpx;
  border: 1px solid #e5e5e5;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  background: #fff;
  margin-bottom: 30rpx;
}
.preview {
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  margin-bottom: 40rpx;
}
.file-item {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
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
  width: 30rpx;
  height: 30rpx;
  line-height: 30rpx;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 24rpx;
}
.upload-btn {
  width: 110px;
  height: 110px;
  border: 2rpx dashed #ddd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 48rpx;
  background: #fafafa;
}
.submitBtn {
  padding: 0 20rpx;
}
.submitBtn button {
  width: 100%;
  height: 80rpx;
  background: #204dad;
  color: #fff;
  font-size: 32rpx;
  border-radius: 20rpx;
}
</style>
