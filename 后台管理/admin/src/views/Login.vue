<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">校园综合服务后台管理系统</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";

const router = useRouter();
const loading = ref(false);

const loginForm = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  try {
    console.log("📤 发送登录请求:", loginForm.value.username, loginForm.value.password);

    const response = await axios.post("http://localhost:3000/api/login", loginForm.value);

    console.log("📥 服务器返回:", response.data);

    if (response.data.token) {
      // ✅ 存储 token
      localStorage.setItem("token", response.data.token);
      
      // ✅ 存储完整 `admin` 数据
      localStorage.setItem("admin", JSON.stringify(response.data.adminData));

      ElMessage.success(`欢迎, ${response.data.adminData.nickname}`);
      router.push("/home");
    } else {
      ElMessage.error("用户名或密码错误");
    }
  } catch (error) {
    console.error("❌ 请求出错:", error);

    if (error.response && error.response.status === 500) {
      ElMessage.error("服务器内部错误，请稍后再试");
    } else {
      ElMessage.error("登录失败，请检查服务器连接");
    }
  }
};


</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f0f2f5;
  position: fixed;
  top: 0;
  left: 0;
}

.login-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
