<template>
  <div v-if="role === 'superadmin'">
    <h2>管理员管理</h2>

    <!-- 添加管理员按钮 -->
    <el-button type="primary" @click="openAddAdminDialog">添加管理员</el-button>

    <el-table :data="paginatedAdmins" border style="margin-top: 20px">
      <el-table-column prop="admin_id" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="role" label="角色">
        <template v-slot="{ row }">
          <el-tag :type="row.role === 'superadmin' ? 'success' : 'warning'">
            {{ row.role === "superadmin" ? "超级管理员" : "管理员" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            @click="editAdmin(row)"
            v-if="row.role !== 'superadmin'"
            >编辑</el-button
          >
          <el-button
            type="danger"
            @click="deleteAdmin(row.admin_id)"
            v-if="row.role !== 'superadmin'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="admins.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
      style="margin-top: 20px; text-align: center"
    />

    <!-- 添加/编辑管理员弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editMode ? '编辑管理员' : '添加管理员'"
    >
      <el-form :model="currentAdmin">
        <el-form-item label="用户名" required>
          <el-input v-model="currentAdmin.username" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="昵称" required>
          <el-input v-model="currentAdmin.nickname" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="currentAdmin.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentAdmin.role">
            <el-option label="管理员" value="admin" />
            <el-option label="超级管理员" value="superadmin" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!editMode">
          <el-input
            v-model="currentAdmin.password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAdmin">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

const admins = ref([]);
const role = ref(
  localStorage.getItem("admin")
    ? JSON.parse(localStorage.getItem("admin")).role
    : "admin"
);

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(8); // 每页显示 8 条

// 计算当前页的管理员列表
const paginatedAdmins = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return admins.value.slice(start, start + pageSize.value);
});

const dialogVisible = ref(false);
const editMode = ref(false);
const currentAdmin = ref({
  username: "",
  nickname: "",
  phone: "",
  role: "admin",
  password: "",
});

onMounted(fetchAdmins);

// 获取管理员列表
async function fetchAdmins() {
  try {
    if (role.value === "superadmin") {
      const res = await axios.get("http://localhost:3000/api/admin");
      admins.value = res.data;
    }
  } catch (error) {
    ElMessage.error("获取管理员失败");
    console.error("❌ 获取管理员失败:", error);
  }
}

// 处理分页变更
const handlePageChange = (page) => {
  currentPage.value = page;
};

// 打开添加管理员弹窗
const openAddAdminDialog = () => {
  currentAdmin.value = {
    username: "",
    nickname: "",
    phone: "",
    role: "admin",
    password: "",
  };
  editMode.value = false;
  dialogVisible.value = true;
};

// 编辑管理员
const editAdmin = (admin) => {
  currentAdmin.value = { ...admin };
  editMode.value = true;
  dialogVisible.value = true;
};

// 保存管理员（新增/更新）
const saveAdmin = async () => {
  try {
    if (editMode.value) {
      await axios.put(
        `http://localhost:3000/api/admin/${currentAdmin.value.admin_id}`,
        currentAdmin.value
      );
    } else {
      await axios.post("http://localhost:3000/api/admin", currentAdmin.value);
    }
    fetchAdmins();
    dialogVisible.value = false;
    ElMessage.success(editMode.value ? "管理员信息已更新" : "管理员添加成功");
  } catch (error) {
    ElMessage.error("操作失败，请检查服务器");
    console.error("❌ 保存管理员失败:", error);
  }
};

// 删除管理员
const deleteAdmin = async (id) => {
  ElMessageBox.confirm("确定要删除这个管理员吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await axios.delete(`http://localhost:3000/api/admin/${id}`);
      fetchAdmins();
      ElMessage.success("管理员删除成功");
    })
    .catch(() => {
      ElMessage.info("删除已取消");
    });
};
</script>

<style scoped>
/* 让分页组件居中 */
.el-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 表格美化 */
.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-button {
  margin-right: 10px;
}
</style>
