// utils/api.js

/**
 * 通用请求封装
 * @param {Object} options 请求参数（同uni.request）
 * @returns {Promise} 返回Promise对象
 */
export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      timeout: 10000, // 可选：统一设置超时时间
      ...options,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          uni.showToast({
            title: res.data?.message || '服务器错误',
            icon: 'none',
            duration: 2000
          })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none',
          duration: 2000
        })
        reject(err)
      }
    })
  })
}
