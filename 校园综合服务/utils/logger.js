// utils/logger.js

/**
 * 记录错误日志
 * @param {Object} err 错误对象
 */
export const logError = (err) => {
  try {
    console.error('❌ 错误日志:', err)

    const logs = uni.getStorageSync('logs') || []

    logs.unshift({
      time: new Date().toISOString(),
      error: formatError(err)
    })

    // 最多保留最近50条
    if (logs.length > 50) {
      logs.pop()
    }

    uni.setStorageSync('logs', logs)

    // TODO: 后续可以加上错误上报服务器（如 Sentry）
  } catch (e) {
    console.error('日志记录失败:', e)
  }
}

/**
 * 简单格式化错误信息
 * @param {any} err
 * @returns {Object}
 */
const formatError = (err) => {
  if (typeof err === 'string') {
    return { message: err }
  }
  if (typeof err === 'object') {
    return {
      message: err.message || '未知错误',
      code: err.code || '',
      stack: err.stack || '',
      status: err.statusCode || '',
    }
  }
  return { message: '未知错误类型' }
}
