const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// ✅ 获取任务（分页 & 搜索）
router.get("/backendTasks", async (req, res) => {
  try {
    const { page = 1, pageSize = 8, search = "" } = req.query;
    const offset = (page - 1) * pageSize;
    const searchQuery = `%${search}%`;

    const [totalRows] = await promisePool.query("SELECT COUNT(*) AS total FROM tasks WHERE task_title LIKE ?", [searchQuery]);
    const total = totalRows[0].total;

    const [tasks] = await promisePool.query("SELECT * FROM tasks WHERE task_title LIKE ? LIMIT ? OFFSET ?", [searchQuery, parseInt(pageSize), parseInt(offset)]);
    res.json({ tasks, total });
  } catch (error) {
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 获取单个任务
router.get("/backendTasks/:id", async (req, res) => {
  const [rows] = await promisePool.query("SELECT * FROM tasks WHERE task_id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: "任务未找到" });
  res.json(rows[0]);
});

// ✅ 新增任务
router.post("/backendTasks", async (req, res) => {
  const { task_title, task_description, reward, status, pickup_location, delivery_location } = req.body;
  await promisePool.query("INSERT INTO tasks (task_title, task_description, reward, status, pickup_location, delivery_location) VALUES (?, ?, ?, ?, ?, ?)", [task_title, task_description, reward, status, pickup_location, delivery_location]);
  res.json({ message: "任务已创建" });
});

// ✅ 更新任务
router.put("/backendTasks/:id", async (req, res) => {
  const { task_title, task_description, reward, status, pickup_location, delivery_location } = req.body;
  await promisePool.query("UPDATE tasks SET task_title=?, task_description=?, reward=?, status=?, pickup_location=?, delivery_location=? WHERE task_id=?", [task_title, task_description, reward, status, pickup_location, delivery_location, req.params.id]);
  res.json({ message: "任务已更新" });
});

// ✅ 删除任务
router.delete("/backendTasks/:id", async (req, res) => {
  await promisePool.query("DELETE FROM tasks WHERE task_id=?", [req.params.id]);
  res.json({ message: "任务已删除" });
});

module.exports = router;
