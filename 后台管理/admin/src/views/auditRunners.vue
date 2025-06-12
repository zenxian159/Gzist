<template>
  <div>
    <h2>校园跑腿 - 跑腿审核</h2>

    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="搜索申请人姓名"
        clearable
        @keyup.enter="fetchApplications" 
        style="width: 300px"
      />
      <el-button type="primary" @click="fetchApplications">搜索</el-button>
    </div>

    <!-- 申请列表 -->
    <el-table :data="applications" border style="margin-top: 20px">
      <el-table-column prop="application_id" label="申请ID" width="80" />
      <el-table-column prop="name" label="申请人姓名" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="id_card" label="身份证号" />
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template v-slot="{ row }">
          <el-button
            v-if="row.status === '待审核'"
            type="success"
            @click="approveApplication(row.application_id)"
          >
            通过
          </el-button>
          <el-button
            v-if="row.status === '待审核'"
            type="danger"
            @click="rejectApplication(row.application_id)"
          >
            拒绝
          </el-button>
          <el-button
            v-if="row.status !== '待审核'"
            type="danger"
            @click="deleteApplication(row.application_id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalApplications"
      @current-change="handlePageChange"
    />

    <!-- 拒绝理由输入框 -->
    <el-dialog v-model="rejectDialogVisible" title="拒绝申请">
      <el-input v-model="rejectReason" placeholder="请输入拒绝理由" />
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmRejection">确认拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  data() {
    return {
      applications: [],
      rejectDialogVisible: false,
      rejectReason: "",
      selectedApplicationId: null,
      currentPage: 1, // 🔥 当前页
      pageSize: 8, // 🔥 每页条数
      totalApplications: 0, // 🔥 总条数
      searchQuery: "", // 🔥 搜索关键词
    };
  },
  methods: {
    // 获取审核列表
    async fetchApplications() {
      try {
        const res = await axios.get("http://localhost:3000/api/runner-applications", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            search: this.searchQuery.trim() || null,
          },
        });
        this.applications = res.data.applications;
        this.totalApplications = res.data.total;
      } catch (error) {
        console.error("❌ 获取申请列表失败:", error);
        ElMessage.error("获取审核数据失败");
      }
    },

    // 通过申请
    async approveApplication(application_id) {
      try {
        await axios.put(`http://localhost:3000/api/runner-applications/${application_id}`, {
          status: "已通过",
          reviewer_id: 1,
          rejection_reason: null,
        });
        ElMessage.success("审核已通过");
        this.fetchApplications();
      } catch (error) {
        ElMessage.error("审核失败");
      }
    },

    // 触发拒绝审核弹窗
    rejectApplication(application_id) {
      this.selectedApplicationId = application_id;
      this.rejectDialogVisible = true;
    },

    // 确认拒绝申请
    async confirmRejection() {
      try {
        await axios.put(`http://localhost:3000/api/runner-applications/${this.selectedApplicationId}`, {
          status: "已拒绝",
          reviewer_id: 1,
          rejection_reason: this.rejectReason,
        });
        this.rejectDialogVisible = false;
        ElMessage.success("已拒绝该申请");
        this.fetchApplications();
      } catch (error) {
        ElMessage.error("拒绝申请失败");
      }
    },

    // 删除审核记录
    async deleteApplication(application_id) {
      ElMessageBox.confirm("确定要删除这条审核记录吗？", "警告", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await axios.delete(`http://localhost:3000/api/runner-applications/${application_id}`);
          ElMessage.success("已删除审核记录");
          this.fetchApplications();
        })
        .catch(() => {
          ElMessage.info("取消删除");
        });
    },

    // 处理分页
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchApplications();
    },

    // 获取状态颜色
    getStatusType(status) {
      return {
        待审核: "warning",
        已通过: "success",
        已拒绝: "danger",
      }[status] || "info";
    },
  },
  mounted() {
    this.fetchApplications();
  },
};
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}
</style>
