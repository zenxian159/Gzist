<template>
  <div>
    <h2>校园二手交易管理</h2>

    <!-- 搜索栏 -->
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="请输入商品标题"
        clearable
        @keyup.enter="fetchTrades"
      />
      <el-select v-model="selectedCategory" placeholder="选择分类">
        <el-option label="所有分类" value="" />
        <el-option label="电子产品" value="电子产品" />
        <el-option label="学习用品" value="学习用品" />
        <el-option label="生活用品" value="生活用品" />
        <el-option label="运动用品" value="运动用品" />
        <el-option label="其他" value="其他" />
      </el-select>
      <el-select v-model="selectedStatus" placeholder="选择状态">
        <el-option label="全部" value="" />
        <el-option label="可交易" value="可交易" />
        <el-option label="交易中" value="交易中" />
        <el-option label="交易完成" value="交易完成" />
        <el-option label="已取消" value="已取消" />
        <el-option label="已下架" value="已下架" />
      </el-select>
      <el-button type="primary" @click="fetchTrades">搜索</el-button>
    </div>

    <!-- 商品列表 -->
    <el-table :data="trades" border>
      <el-table-column prop="trade_id" label="ID" width="80" />
      <el-table-column prop="title" label="商品标题" />
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="description" label="描述">
        <template #default="{ row }">
          <el-button link type="primary" @click="showDescription(row)">
            {{ row.description ? "点击查看描述" : "暂无描述" }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="图片/视频">
        <template #default="{ row }">
          <el-button link type="primary" @click="showMedia(row)">
            {{
              row.fileList?.length
                ? `点击查看(${row.fileList.length}个)`
                : "暂无内容"
            }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" @click="editTrade(row)">编辑</el-button>
          <el-button type="danger" @click="deleteTrade(row.trade_id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="prev, pager, next"
      @current-change="fetchTrades"
    />

    <!-- 描述查看弹窗 -->
    <el-dialog v-model="descriptionDialogVisible" title="商品描述" width="50%">
      <div class="description-content">
        {{ currentTrade.description || "暂无描述" }}
      </div>
    </el-dialog>

    <!-- 媒体查看弹窗 -->
    <el-dialog v-model="mediaDialogVisible" title="图片/视频" width="80%">
      <div class="media-container">
        <div v-if="!currentTrade.fileList?.length" class="no-media">
          暂无图片或视频
        </div>
        <el-carousel
          height="450px"
          style="width: 100%"
          :autoplay="false"
          v-else
        >
          <el-carousel-item
            v-for="(item, index) in currentTrade.fileList"
            :key="index"
          >
            <div class="media-item">
              <template v-if="item.type === 'image'">
                <el-image
                  style="width: auto; height: 450px"
                  :src="item.url"
                  :preview-src-list="[item.url]"
                  fit="contain"
                  class="media-image"
                  @error="() => console.error('图片加载失败:', item.url)"
                />
              </template>
              <video
                v-else-if="item.type === 'video'"
                :src="item.url"
                controls
                class="media-video"
                @error="() => console.error('视频加载失败:', item.url)"
              ></video>
              <div v-else class="error-message">不支持的媒体类型</div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>

    <!-- 编辑商品弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑商品信息" width="70%">
      <el-form :model="currentTrade" label-width="100px">
        <el-form-item label="商品标题">
          <el-input v-model="currentTrade.title" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="currentTrade.category">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="学习用品" value="学习用品" />
            <el-option label="生活用品" value="生活用品" />
            <el-option label="运动用品" value="运动用品" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="currentTrade.price" type="number" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="currentTrade.description"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="图片/视频">
          <el-upload
            action="http://127.0.0.1:3000/api/upload"
            :show-file-list="true"
            :on-success="handleUploadSuccess"
            :before-upload="beforeFileUpload"
            :limit="3"
            multiple
            style="width: 100%; text-align: left"
          >
            <el-button type="primary">点击上传（最多9张）</el-button>
          </el-upload>

          <!-- 预览区域 -->
          <div class="media-preview">
            <template v-for="(file, index) in editForm.images" :key="index">
              <div class="media-item-container">
                <el-image
                  v-if="file.type === 'image'"
                  :src="file.url"
                  fit="cover"
                  class="media-item"
                />
                <video v-else controls class="media-item">
                  <source :src="file.url" type="video/mp4" />
                </video>

                <!-- 删除按钮 -->
                <div class="delete-btn" @click="handleFileRemove(index)">
                  ❌
                </div>
              </div>
            </template>
          </div>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentTrade.status">
            <el-option label="可交易" value="可交易" />
            <el-option label="交易中" value="交易中" />
            <el-option label="交易完成" value="交易完成" />
            <el-option label="已取消" value="已取消" />
            <el-option label="已下架" value="已下架" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTrade">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Delete } from "@element-plus/icons-vue";

const trades = ref([]);
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedStatus = ref("");
const dialogVisible = ref(false);
const descriptionDialogVisible = ref(false);
const mediaDialogVisible = ref(false);
const currentTrade = ref({});
const editForm = ref({
  images: [],
});
const pagination = ref({
  page: 1,
  pageSize: 8,
  total: 0,
});

// 获取商品列表
const fetchTrades = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/backendTrades", {
      params: {
        search: searchQuery.value,
        category: selectedCategory.value,
        status: selectedStatus.value,
        page: pagination.value.page,
      },
    });
    // 确保 fileList 是数组
    trades.value = res.data.items.map((item) => ({
      ...item,
      fileList: Array.isArray(item.fileList) ? item.fileList : [],
    }));
    pagination.value.total = res.data.total;
    console.log("获取到的商品列表：", trades.value);
  } catch (error) {
    console.error("获取商品失败：", error);
    ElMessage.error("获取商品失败");
  }
};

// 编辑商品
const editTrade = (trade) => {
  currentTrade.value = { ...trade };
  // 初始化 editForm 的图片列表
  editForm.value.images = trade.fileList ? [...trade.fileList] : [];
  dialogVisible.value = true;
};

// 保存修改
const saveTrade = async () => {
  try {
    // 将 editForm 中的图片列表同步到 currentTrade
    currentTrade.value.fileList = [...editForm.value.images];
    console.log(currentTrade.value.fileList);

    await axios.put(
      `http://localhost:3000/api/backendTrades/${currentTrade.value.trade_id}`,
      currentTrade.value
    );
    ElMessage.success("更新成功");
    dialogVisible.value = false;
    fetchTrades();
  } catch (error) {
    ElMessage.error("更新失败");
  }
};

// 删除商品
const deleteTrade = async (trade_id) => {
  ElMessageBox.confirm("确定要删除这个商品吗？", "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await axios.delete(`http://localhost:3000/api/backendTrades/${trade_id}`);
      ElMessage.success("删除成功");
      fetchTrades();
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 显示描述
const showDescription = (trade) => {
  currentTrade.value = { ...trade };
  descriptionDialogVisible.value = true;
};

// 显示媒体内容
const showMedia = (trade) => {
  currentTrade.value = { ...trade };
  // 添加调试信息
  console.log("当前商品的媒体文件：", currentTrade.value.fileList);
  if (!currentTrade.value.fileList) {
    ElMessage.warning("该商品没有图片或视频");
    return;
  }
  mediaDialogVisible.value = true;
};

// 上传前验证
const beforeFileUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isLt10M = file.size / 1024 / 1024 < 10;

  if (!isImage && !isVideo) {
    ElMessage.error("只能上传图片或视频文件!");
    return false;
  }
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过 10MB!");
    return false;
  }

  if (editForm.value.images.length >= 9) {
    ElMessage.error("最多只能上传 9 个文件!");
    return false;
  }

  return true;
};

// 上传成功回调
const handleUploadSuccess = (response) => {
  if (!response.url) {
    ElMessage.error("上传失败：未获取到文件URL");
    return;
  }

  console.log("上传成功，返回数据：", response);

  // 确保 URL 是完整的
  const fileUrl = response.url.startsWith("http")
    ? response.url
    : `http://localhost:3000${response.url}`;

  // 判断文件类型
  const fileType = response.url.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image";

  // 添加到图片列表
  editForm.value.images.push({
    url: fileUrl,
    type: fileType,
  });

  console.log("当前图片列表：", editForm.value.images);
};

// 移除文件
const handleFileRemove = (index) => {
  editForm.value.images.splice(index, 1);
};

const getStatusType = (status) => {
  const statusMap = {
    可交易: "success",
    交易中: "warning",
    交易完成: "info",
    已取消: "danger",
    已下架: "info",
  };
  return statusMap[status] || "info";
};

onMounted(fetchTrades);
</script>

<style scoped>
.search-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.description-content {
  white-space: pre-wrap;
  line-height: 1.5;
}

.media-container {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.media-item {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.media-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.media-video {
  max-width: 100%;
  max-height: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 预览区域：网格布局 */
.media-preview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
  padding: 10px;
}

/* 预览项容器 */
.media-item-container {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
}

/* 预览图片和视频 */
.media-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* 删除按钮（默认隐藏，鼠标悬停时显示） */
.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  opacity: 0;
}

/* 悬停时显示删除按钮 */
.media-item-container:hover .delete-btn {
  opacity: 1;
}

.no-media {
  text-align: center;
  padding: 20px;
  color: #909399;
}

.error-message {
  text-align: center;
  color: #f56c6c;
  padding: 20px;
}
</style>
