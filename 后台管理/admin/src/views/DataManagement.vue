<template>
  <div>
    <h2>校园跑腿 - 任务数据管理</h2>

    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="请输入任务标题搜索"
        clearable
        @clear="fetchTasks"
        @keyup.enter="fetchTasks"
        style="width: 300px"
      />
      <el-button type="primary" @click="fetchItems">搜索</el-button>
    </div>
    <!-- 任务表格 -->
    <el-table :data="tasks" border style="margin-top: 20px">
      <el-table-column prop="task_id" label="ID" width="80" />
      <el-table-column prop="task_title" label="任务标题" />
      <el-table-column prop="task_description" label="任务详情" />
      <el-table-column prop="reward" label="酬金" />
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <el-tag :type="row.status === '进行中' ? 'success' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="pickup_location" label="取货地址" />
      <el-table-column prop="delivery_location" label="送达地址" />
      <el-table-column label="操作" width="240">
        <template v-slot="{ row }">
          <el-button type="primary" @click="editTask(row)">编辑</el-button>
          <el-button type="danger" @click="deleteTask(row.task_id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="totalTasks"
      :page-size="pageSize"
      @current-change="handlePageChange"
    />

    <!-- 添加/编辑任务弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? '编辑任务' : '新增任务'"
    >
      <el-form :model="currentTask">
        <el-form-item label="任务标题"
          ><el-input v-model="currentTask.task_title"
        /></el-form-item>
        <el-form-item label="任务详情"
          ><el-input v-model="currentTask.task_description" type="textarea"
        /></el-form-item>
        <el-form-item label="酬金"
          ><el-input v-model="currentTask.reward" type="number"
        /></el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentTask.status">
            <el-option label="待接单" value="待接单" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </el-form-item>
        <el-form-item label="取货地址"
          ><el-input v-model="currentTask.pickup_location"
        /></el-form-item>
        <el-form-item label="送达地址"
          ><el-input v-model="currentTask.delivery_location"
        /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTask">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

const tasks = ref([]);
const totalTasks = ref(0);
const pageSize = 8;
const currentPage = ref(1);
const searchQuery = ref("");
const dialogVisible = ref(false);
const isEditMode = ref(false);
const currentTask = ref({
  task_title: "",
  task_description: "",
  reward: 0,
  status: "待接单",
  pickup_location: "",
  delivery_location: "",
});

onMounted(fetchTasks);

// 获取任务列表
async function fetchTasks() {
  try {
    const res = await axios.get("http://localhost:3000/api/backendTasks", {
      params: { page: currentPage.value, pageSize, search: searchQuery.value },
    });
    tasks.value = res.data.tasks;
    totalTasks.value = res.data.total;
  } catch (error) {
    ElMessage.error("获取任务失败");
  }
}

// 添加任务
const openAddDialog = () => {
  currentTask.value = {
    task_title: "",
    task_description: "",
    reward: 0,
    status: "待接单",
    pickup_location: "",
    delivery_location: "",
  };
  isEditMode.value = false;
  dialogVisible.value = true;
};

// 编辑任务
const editTask = (task) => {
  currentTask.value = { ...task };
  isEditMode.value = true;
  dialogVisible.value = true;
};

// 保存任务
async function saveTask() {
  try {
    if (isEditMode.value) {
      await axios.put(
        `http://localhost:3000/api/backendTasks/${currentTask.value.task_id}`,
        currentTask.value
      );
    } else {
      await axios.post(
        "http://localhost:3000/api/backendTasks",
        currentTask.value
      );
    }
    fetchTasks();
    dialogVisible.value = false;
    ElMessage.success("操作成功");
  } catch (error) {
    ElMessage.error("操作失败");
  }
}

// 删除任务
const deleteTask = async (task_id) => {
  ElMessageBox.confirm("确定删除任务吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    await axios.delete(`http://localhost:3000/api/backendTasks/${task_id}`);
    fetchTasks();
    ElMessage.success("删除成功");
  });
};

// 分页
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchTasks();
};
</script>

<style>
.search-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}
</style>
