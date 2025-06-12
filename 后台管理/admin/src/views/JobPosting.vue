<template>
  <div>
    <h2>校园兼职管理</h2>

    <!-- 搜索框 -->
    <div class="search-container">
      <el-button type="primary" @click="openAddJobDialog">发布兼职</el-button>
      <el-input
        v-model="searchQuery"
        placeholder="请输入标题搜索"
        clearable
        @keyup.enter="fetchJobs"
        style="width: 300px"
      />
      <el-button type="primary" @click="fetchJobs">搜索</el-button>
    </div>

    <el-table :data="jobs" style="width: 100%" border>
      <el-table-column prop="job_id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="salary" label="薪资" />
      <el-table-column prop="location" label="地点" />
      <el-table-column prop="contact_info" label="联系方式" />
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <el-tag :type="row.status === 'open' ? 'success' : 'danger'">
            {{ row.status === "open" ? "开放" : "关闭" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template v-slot="{ row }">
          <div class="operation-buttons">
            <el-button class="edit-btn" @click="editJob(row)">编辑</el-button>
            <el-button class="close-btn" @click="toggleJobStatus(row)">
              {{ row.status === "open" ? "关闭" : "开放" }}
            </el-button>
            <el-button class="delete-btn" @click="deleteJob(row.job_id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalJobs"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
    />

    <!-- 兼职编辑/添加弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑兼职">
      <el-form :model="currentJob">
        <el-form-item label="标题"
          ><el-input v-model="currentJob.title"
        /></el-form-item>
        <el-form-item label="描述"
          ><el-input v-model="currentJob.description" type="textarea"
        /></el-form-item>
        <el-form-item label="薪资"
          ><el-input v-model="currentJob.salary" type="number"
        /></el-form-item>
        <el-form-item label="地点"
          ><el-input v-model="currentJob.location"
        /></el-form-item>
        <el-form-item label="联系方式"
          ><el-input
            v-model="currentJob.contact_info"
            placeholder="请输入联系方式"
        /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentJob.status">
            <el-option label="开放" value="open" />
            <el-option label="关闭" value="closed" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveJob">保存</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const jobs = ref([]);
const totalJobs = ref(0);
const currentPage = ref(1);
const pageSize = ref(8);
const searchQuery = ref(""); // 🔥 搜索关键词
const dialogVisible = ref(false);
const currentJob = ref({});
const admin_id = ref("");
const isSuperAdmin = ref(false);

onMounted(() => {
  const adminData = JSON.parse(localStorage.getItem("admin"));
  if (!adminData || !adminData.admin_id) {
    alert("未检测到管理员信息，请重新登录");
    window.location.href = "/login";
    return;
  }
  admin_id.value = adminData.admin_id;
  isSuperAdmin.value = adminData.role === "superadmin";
  fetchJobs();
});

// 获取兼职列表（支持分页 + 搜索）
const fetchJobs = async () => {
  try {
    let url = `http://localhost:3000/api/jobs?page=${currentPage.value}&pageSize=${pageSize.value}&search=${searchQuery.value}`;
    if (!isSuperAdmin.value) url += `&admin_id=${admin_id.value}`;

    const res = await axios.get(url);
    jobs.value = res.data.jobs;
    totalJobs.value = res.data.total;
  } catch (error) {
    console.error("❌ 获取兼职失败:", error);
    alert("无法获取兼职列表");
  }
};

// 处理分页
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchJobs();
};

// 打开添加兼职弹窗
const openAddJobDialog = () => {
  currentJob.value = { admin_id: admin_id.value };
  dialogVisible.value = true;
};

// 编辑兼职
const editJob = (job) => {
  currentJob.value = { ...job };
  dialogVisible.value = true;
};

// 保存兼职（新增或更新）
const saveJob = async () => {
  if (!currentJob.value.contact_info) {
    alert("请输入联系方式");
    return;
  }

  try {
    if (currentJob.value.job_id) {
      await axios.put(
        `http://localhost:3000/api/jobs/${currentJob.value.job_id}`,
        currentJob.value
      );
    } else {
      const adminData = JSON.parse(localStorage.getItem("admin"));
      if (!adminData || !adminData.admin_id) {
        alert("管理员信息缺失，请重新登录");
        return;
      }
      currentJob.value.admin_id = adminData.admin_id;
      await axios.post("http://localhost:3000/api/jobs", currentJob.value);
    }
    fetchJobs();
    dialogVisible.value = false;
  } catch (error) {
    console.error("❌ 发布兼职失败:", error);
    alert("服务器错误，无法发布兼职");
  }
};

// 切换兼职状态（开放/关闭）
const toggleJobStatus = async (job) => {
  try {
    const response = await axios.put(
      `http://localhost:3000/api/jobs/${job.job_id}/toggle-status`
    );
    job.status = response.data.status;
    fetchJobs();
  } catch (error) {
    console.error("❌ 切换兼职状态失败:", error);
    alert("服务器错误，无法更新状态");
  }
};

// 删除兼职
const deleteJob = async (job_id) => {
  if (!confirm("确定要删除这个兼职吗？")) return;
  try {
    await axios.delete(`http://localhost:3000/api/jobs/${job_id}`);
    fetchJobs();
  } catch (error) {
    console.error("❌ 删除兼职失败:", error);
    alert("服务器错误，无法删除兼职");
  }
};
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.operation-buttons {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.edit-btn {
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.edit-btn:hover {
  background-color: #66b1ff;
}

.close-btn {
  background-color: #e6a23c;
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.close-btn:hover {
  background-color: #ebb563;
}

.delete-btn {
  background-color: #f56c6c;
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.delete-btn:hover {
  background-color: #f78989;
}
</style>
