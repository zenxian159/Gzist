<!-- message.vue -->
<template>
  <view class="chat-list">
    <view 
      v-for="(item, index) in chatList" 
      :key="item.trade_id" 
      class="chat-item" 
      @tap="goToChat(item)"
      @longpress="onLongPress(index)"
    >
      <image class="avatar" :src="item.other_avatar" />
      <view class="info">
        <text class="nickname">{{ item.other_nickname }}</text>
        <text class="last-msg">{{ item.last_message }}</text>
      </view>
      <text class="time">{{ item.timestamp }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import config from '@/utils/config'

// 响应式数据
const openid = ref('')
const chatList = ref([])

// 生命周期钩子
onMounted(() => {
  const userInfo = uni.getStorageSync('userInfo')
  if (userInfo && userInfo.openid) {
    openid.value = userInfo.openid
    getChatList()
  }
})

// 获取聊天列表
const getChatList = () => {
  uni.request({
    url: `${config.baseURL}/conversations/${openid.value}`,
    method: 'GET',
    success: (res) => {
      console.log(res.data)
      chatList.value = res.data.chatList
    },
    fail: () => {
      uni.showToast({ 
        title: '加载失败', 
        icon: 'none' 
      })
    }
  })
}

// 跳转到聊天页面
const goToChat = (item) => {
  uni.navigateTo({
    url: `/pages/mall/chat/chat?trade_id=${item.trade_id}&buyer_id=${item.buyer_id}&seller_id=${item.seller_id}`
  })
}

// 长按处理
const onLongPress = (index) => {
  const trade_id = chatList.value[index].trade_id

  uni.showActionSheet({
    itemList: ['删除该聊天'],
    success: (res) => {
      if (res.tapIndex === 0) {
        deleteChat(trade_id, index)
      }
    }
  })
}

// 删除聊天
const deleteChat = (trade_id, index) => {
  const userId = uni.getStorageSync('userInfo').openid

  uni.showModal({
    title: '确认删除',
    content: '是否确认删除该聊天记录？',
    success: (res) => {
      if (res.confirm) {
        uni.request({
          url: `${config.baseURL}/chat/${trade_id}/${userId}`,
          method: 'DELETE',
          success: () => {
            chatList.value.splice(index, 1)
            uni.showToast({ 
              title: '已删除' 
            })
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
</script>

<style>
.chat-list {
  padding: 30rpx;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 2rpx solid #ddd;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}

.info {
  flex: 1;
  width:200px;
  display: flex;
  flex-direction: column;
}

.nickname {
  font-weight: bold;
  margin-bottom: 10rpx;
}

.last-msg {
  color: #666;
  font-size: 30rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
}

.time {
  font-size: 24rpx;
  color: #999;
  margin-left: 20rpx;
}
</style>