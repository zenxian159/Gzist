<template>
    <div>
      <h2>用户管理</h2>
  
      <!-- 搜索框 -->
      <div class="search-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户昵称或手机号"
          clearable
          @keyup.enter="fetchUsers"
          style="width: 300px"
        />
        <el-button type="primary" @click="fetchUsers">搜索</el-button>
      </div>
  
      <!-- 用户表格 -->
      <el-table :data="users" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="openid" label="ID" />
  
        <el-table-column prop="avatarUrl" label="头像">
          <template v-slot="{ row }">
            <el-avatar :src="row.avatarUrl" />
          </template>
        </el-table-column>
  
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="phone" label="手机号" />
  
        <el-table-column label="操作" width="200">
          <template v-slot="{ row }">
            <el-button type="primary" @click="editUser(row)">编辑</el-button>
            <el-button type="danger" @click="deleteUser(row.openid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalUsers"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
  
      <!-- 编辑弹窗 -->
      <el-dialog v-model="dialogVisible" title="编辑用户">
        <el-form :model="currentUser">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:3000/api/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" class="avatar-preview" />
              <el-button v-else type="primary">上传头像</el-button>
            </el-upload>
          </el-form-item>
  
          <el-form-item label="昵称">
            <el-input v-model="currentUser.nickName" />
          </el-form-item>
  
          <el-form-item label="手机号">
            <el-input v-model="currentUser.phone" />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { ElMessage, ElMessageBox } from "element-plus";
  
  const users = ref([]);
  const totalUsers = ref(0);
  const currentPage = ref(1);
  const pageSize = ref(8);
  const searchQuery = ref("");
  const dialogVisible = ref(false);
  const currentUser = ref({});
  
  // 获取用户数据
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          search: searchQuery.value.trim() || null,
        },
      });
  
      users.value = res.data.users;
      totalUsers.value = res.data.total;
    } catch (error) {
      ElMessage.error("获取用户失败");
    }
  };
  
  // 处理分页
  const handlePageChange = (page) => {
    currentPage.value = page;
    fetchUsers();
  };
  
  // 编辑用户
  const editUser = (user) => {
    currentUser.value = { ...user };
    dialogVisible.value = true;
  };
  
  // 头像上传成功
  const handleAvatarSuccess = (response) => {
    currentUser.value.avatarUrl = response.url;
  };
  
  // 头像上传前检查
  const beforeAvatarUpload = (file) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJPG) {
      ElMessage.error("上传头像图片只能是 JPG/PNG 格式!");
      return false;
    }
    return true;
  };
  
  // 保存用户信息
  const saveUser = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/users/${currentUser.value.openid}`,
        currentUser.value
      );
      ElMessage.success("用户信息已更新");
      dialogVisible.value = false;
      fetchUsers();
    } catch (error) {
      ElMessage.error("更新失败");
    }
  };
  
  // 删除用户
  const deleteUser = async (openid) => {
    ElMessageBox.confirm("确定要删除这个用户吗？", "警告", {
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        await axios.delete(`http://localhost:3000/api/users/${openid}`);
        ElMessage.success("用户已删除");
        fetchUsers();
      })
      .catch(() => {
        ElMessage.info("已取消删除");
      });
  };
  
  onMounted(fetchUsers);
  </script>
  
  <style scoped>
  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  </style>
  