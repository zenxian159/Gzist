<template>
  <div>
    <h2>寻物管理</h2>

    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="请输入物品名称"
        clearable
        @keyup.enter="fetchItems"
        style="width: 300px"
      />
      <el-button type="primary" @click="fetchItems">搜索</el-button>
    </div>

    <!-- 寻物表格 -->
    <el-table :data="foundItems" border style="width: 100%; margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="itemName" label="物品名称" />
      <el-table-column prop="time" label="拾取时间" />
      <el-table-column prop="claimMethod" label="认领方式" />
      <el-table-column prop="contact" label="联系电话" />
      <el-table-column prop="remarks" label="备注信息" />

      <el-table-column label="操作" width="200">
        <template v-slot="{ row }">
          <el-button type="primary" @click="editItem(row)">编辑</el-button>
          <el-button type="danger" @click="deleteItem(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      v-model:currentPage="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="prev, pager, next"
      @current-change="fetchItems"
    />

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑寻物信息">
      <el-form :model="currentItem">
        <el-form-item label="物品昵称">
          <el-input v-model="currentItem.itemName" />
        </el-form-item>
        <el-form-item label="拾取时间">
          <el-date-picker
            v-model="currentItem.time"
            type="datetime"
            placeholder="选择拾取时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :shortcuts="dateShortcuts"
          />
        </el-form-item>
        <el-form-item label="认领方式">
          <el-input v-model="currentItem.claimMethod" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="currentItem.contact" />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="currentItem.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveItem">保存</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

const foundItems = ref([]);
const searchQuery = ref("");
const dialogVisible = ref(false);
const currentItem = ref({});
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
});

// 添加日期快捷选项
const dateShortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];

// 获取寻物数据
const fetchItems = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/foundItems", {
      params: { search: searchQuery.value, page: pagination.value.page },
    });
    foundItems.value = res.data.items;
    pagination.value.total = res.data.total;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 修改编辑函数
const editItem = (item) => {
  currentItem.value = { 
    ...item,
    time: item.time || new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  dialogVisible.value = true;
};

// 保存修改
const saveItem = async () => {
  try {
    console.log(currentItem.value);
    
    await axios.put(
      `http://localhost:3000/api/foundItems/${currentItem.value.id}`,
      currentItem.value
    );
    ElMessage.success("更新成功");
    dialogVisible.value = false;
    fetchItems();
  } catch (error) {
    ElMessage.error("更新失败");
  }
};

// 删除寻物
const deleteItem = async (id) => {
  ElMessageBox.confirm("确定要删除吗？", "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await axios.delete(`http://localhost:3000/api/foundItems/${id}`);
      ElMessage.success("删除成功");
      fetchItems();
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

onMounted(fetchItems);
</script>
<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
