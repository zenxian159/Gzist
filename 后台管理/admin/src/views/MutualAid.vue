<template>
  <div>
    <h2>校园互助管理</h2>

    <!-- 搜索框 -->
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="请输入互助内容"
        clearable
        @keyup.enter="fetchItems"
        style="width: 300px"
      />
      <el-button type="primary" @click="fetchItems">搜索</el-button>
    </div>

    <!-- 互助表格 -->
    <el-table
      :data="mutualAidList"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="openid" label="用户ID" />
      <el-table-column prop="content" label="互助内容" />

      <!-- 图片/视频展示 -->
      <el-table-column label="图片/视频" width="360">
        <template v-slot="{ row }">
          <div v-if="row.images.length">
            <template v-for="(media, index) in row.images" :key="index">
              <el-image
                v-if="media.type === 'image'"
                :src="media.url"
                style="width: 100px; height: 100px; margin-right: 5px"
                fit="cover"
                @error="handleImageError"
              />
              <video
                v-else
                controls
                style="width: 100px; height: 100px; margin-right: 5px"
              >
                <source :src="media.url" type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            </template>
          </div>
          <span v-else>无</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template v-slot="{ row }">
          <el-button type="primary" @click="editItem(row)">编辑</el-button>
          <el-button type="danger" @click="deleteItem(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑互助信息弹窗 -->
    <el-dialog v-model="editDialogVisible" title="编辑互助信息">
      <el-form label-width="80px">
        <el-form-item label="互助内容">
          <el-input v-model="editForm.content" type="textarea" />
        </el-form-item>

        <el-form-item label="图片/视频">
          <el-upload
            action="http://127.0.0.1:3000/api/upload"
            :show-file-list="true"
            :on-success="handleUploadSuccess"
            :before-upload="beforeFileUpload"
            :limit="3"
            multiple
            style="width: 100%; text-align: left;"
          >
            <el-button type="primary">点击上传（最多3张）</el-button>
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
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="pagination.page"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      layout="prev, pager, next"
      @current-change="fetchItems"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

const mutualAidList = ref([]);
const searchQuery = ref("");
const pagination = ref({ page: 1, pageSize: 5, total: 0 });
const editDialogVisible = ref(false);
// const editForm = ref({ id: null, content: "", images: [] });
const editForm = ref({ id: null, content: "", images: [] });

// 处理文件上传
const beforeFileUpload = (file) => {
  if (editForm.value.images.length >= 3) {
    ElMessage.error("最多只能上传 3 张图片或视频!");
    return false;
  }
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    ElMessage.error("文件大小不能超过 10MB!");
    return false;
  }
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    ElMessage.error("只能上传图片或视频文件!");
    return false;
  }

  return true;
};

// 处理文件添加
const handleFileChange = (file) => {
  if (editForm.value.images.length >= 3) {
    ElMessage.warning("最多只能上传 3 张图片或视频!");
    return;
  }

  const fileType = file.raw.type.startsWith("video/") ? "video" : "image";

  const reader = new FileReader();
  reader.onload = (e) => {
    editForm.value.images.push({
      name: file.name,
      url: e.target.result,
      type: fileType,
    });
  };
  reader.readAsDataURL(file.raw);
};

// 处理文件删除
const handleFileRemove = (index) => {
  editForm.value.images.splice(index, 1);
};

// 解析图片/视频 JSON 数据
const getImageList = (images) => {
  if (!images) return [];

  try {
    let parsedImages = typeof images === "string" ? JSON.parse(images) : images;

    // 统一格式：确保每个文件都有 `name` 和 `url`
    return parsedImages.map((item, index) => ({
      name: `file-${index}`,
      url: item.url,
      type:
        item.type ||
        (/\.(mp4|avi|mov|wmv)$/i.test(item.url) ? "video" : "image"),
    }));
  } catch (error) {
    console.error("❌ 图片/视频 JSON 解析失败:", error);
    return [];
  }
};

// 处理编辑按钮点击
const editItem = (row) => {
  editForm.value = {
    id: row.id,
    content: row.content,
    images: getImageList(row.images),
  };
  editDialogVisible.value = true;
};
const handleUploadSuccess = (response) => {
  if (response.url) {
    const fileType = /\.(mp4|avi|mov|wmv)$/i.test(response.url)
      ? "video"
      : "image";

    editForm.value.images.push({
      url: response.url,
      type: fileType,
    });
  }
};

// 处理提交修改
const submitEdit = async () => {
  try {
    // 确保 images 只存 URL
    const imagesData = editForm.value.images.map(file => ({
      url: file.url,
      type: file.type
    }));

    await axios.put(`http://127.0.0.1:3000/api/mutualAid/${editForm.value.id}`, {
      content: editForm.value.content,
      images: imagesData,
    });

    ElMessage.success("修改成功");
    editDialogVisible.value = false;
    fetchItems();
  } catch (error) {
    ElMessage.error("修改失败");
  }
};


// 获取互助数据
const fetchItems = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/mutualAid", {
      params: { search: searchQuery.value, page: pagination.value.page },
    });
    res.data.items.forEach((item) => {
      item.images = getImageList(item.images);
    });
    mutualAidList.value = res.data.items;
    pagination.value.total = res.data.total;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 删除互助信息
const deleteItem = async (id) => {
  ElMessageBox.confirm("确定要删除吗？", "警告", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await axios.delete(`http://localhost:3000/api/mutualAid/${id}`);
      ElMessage.success("删除成功");
      fetchItems();
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 处理图片加载失败
const handleImageError = (event) => {
  event.target.src = "/default-image.png";
};

onMounted(fetchItems);
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 预览区域：网格布局 */
.media-preview {
  display: flex;
  gap: 10px;
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
</style>
