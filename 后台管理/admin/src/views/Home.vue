<template>
  <el-container class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="home-header">
      <div class="header-left">校园综合服务</div>
      <div class="header-right">
        <span>Hello: {{ adminData.nickname }}</span>
        <el-button type="info" size="small" @click="openProfileDialog"
          >修改信息</el-button
        >
        <el-button type="danger" size="small" @click="handleLogout"
          >退出</el-button
        >
      </div>
    </el-header>

    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside width="220px" class="home-aside">
        <el-menu :default-active="activeMenu" class="el-menu-vertical" router>
          <el-menu-item index="/home/campus-market">
            <el-icon><Grid /></el-icon>
            <span>校园二手</span>
          </el-menu-item>
          <el-sub-menu index="/home/lost-found">
            <template #title>
              <el-icon><Search /></el-icon>
              <span>失物招领</span>
            </template>
            <el-menu-item index="/home/lost-found/lost"
              >丢失物品管理</el-menu-item
            >
            <el-menu-item index="/home/lost-found/found"
              >寻找物品管理</el-menu-item
            >
          </el-sub-menu>
          <el-sub-menu index="/home/campus-runner">
            <template #title>
              <el-icon><Bicycle /></el-icon>
              <span>校园跑腿</span>
            </template>
            <el-menu-item index="/home/campus-runner/data-management"
              >数据管理</el-menu-item
            >
            <el-menu-item index="/home/campus-runner/audit-runners"
              >配送员审核</el-menu-item
            >
          </el-sub-menu>
          <el-menu-item index="/home/job-posting">
            <el-icon><Briefcase /></el-icon>
            <span>校园兼职</span>
          </el-menu-item>
          <el-menu-item index="/home/mutual-aid">
            <el-icon><Help /></el-icon>
            <span>校园互助</span>
          </el-menu-item>
          <el-menu-item index="/home/user-management">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>

          <!-- 仅超级管理员可见 -->
          <el-menu-item
            v-if="role === 'superadmin'"
            index="/home/admin-management"
          >
            <el-icon><User /></el-icon>
            <span>管理员管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区域 -->
      <el-main class="home-main">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 修改个人信息弹窗 -->
    <el-dialog v-model="profileDialogVisible" title="修改个人信息">
      <el-form :model="profileForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="profileForm.nickname" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="profileForm.phone" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            v-model="profileForm.newPassword"
            type="password"
            placeholder="留空则不修改"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="profileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";
import {
  Grid,
  Search,
  Bicycle,
  Briefcase,
  User,
  Help,
} from "@element-plus/icons-vue";

const router = useRouter();
const adminData = ref({});
const role = ref(""); // 存储角色信息
const profileDialogVisible = ref(false);
const profileForm = ref({
  admin_id: "",
  username: "",
  nickname: "",
  phone: "",
  newPassword: "",
});
onMounted(() => {
  const storedAdmin = JSON.parse(localStorage.getItem("admin"));

  adminData.value = storedAdmin ? storedAdmin : { nickname: "管理员" };

  role.value = storedAdmin.role; // 🔥 获取管理员角色
});

const openProfileDialog = () => {
  profileForm.value = {
    admin_id: adminData.value.admin_id,
    username: adminData.value.username,
    nickname: adminData.value.nickname,
    phone: adminData.value.phone,
    newPassword: "",
  };
  profileDialogVisible.value = true;
};

const saveProfile = async () => {
  try {
    await axios.put(
      `http://localhost:3000/api/my/${profileForm.value.admin_id}`,
      {
        nickname: profileForm.value.nickname,
        phone: profileForm.value.phone,
        password: profileForm.value.newPassword
          ? profileForm.value.newPassword
          : undefined,
      }
    );

    adminData.value.nickname = profileForm.value.nickname;
    adminData.value.phone = profileForm.value.phone;
    localStorage.setItem("admin", JSON.stringify(adminData.value));

    ElMessage.success("个人信息更新成功");
    profileDialogVisible.value = false;
  } catch (error) {
    console.error("❌ 更新个人信息失败:", error);
    ElMessage.error("更新失败，请检查网络或服务器");
  }
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");

  ElMessage.success("已退出登录");
  router.push("/login");
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}
.home-container {
  height: 100vh;
  overflow: hidden; /* 防止页面滚动 */
  display: flex;
  flex-direction: column;
}

.home-header {
  background: linear-gradient(to right, #4a90e2, #87ceeb);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding: 10px 20px; */
  font-size: 18px;
}

.header-left {
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.home-aside {
  background-color: #d3dce6;
  text-align: left;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.el-menu-vertical {
  border-right: none;
  height: 100%;
}

.home-main {
  background-color: #e9eef3;
  padding: 20px;
  text-align: center;
  flex-grow: 1;
  height: calc(100vh - 60px);
}
</style>
