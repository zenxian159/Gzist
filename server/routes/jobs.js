const express = require("express");
const router = express.Router();
const promisePool = require("../db"); // 引入数据库连接

// ✅ 微信小程序获取所有兼职
router.get("/wx-jobs", async (req, res) => {
  try {
    const pageNum = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (pageNum - 1) * pageSize;

    const query = `
      SELECT *
      FROM job_posts
      WHERE status = 'open'
      ORDER BY create_time DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await promisePool.query(query, [pageSize, offset]);

    res.json(rows);
  } catch (error) {
    console.error("❌ 获取兼职失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
// 后台管理获取兼职
router.get("/jobs", async (req, res) => {
  try {
    let { page = 1, pageSize = 8, search = "", admin_id, role } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    search = search.trim();

    let query = "SELECT * FROM job_posts";
    let countQuery = "SELECT COUNT(*) AS total FROM job_posts";
    const values = [];

    let conditions = [];

    // 🔍 如果是普通管理员，只返回自己发布的兼职
    if (role !== "superadmin" && admin_id) {
      conditions.push("admin_id = ?");
      values.push(admin_id);
    }

    // 🔍 仅对标题进行搜索
    if (search) {
      conditions.push("title LIKE ?");
      values.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
      countQuery += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY create_time DESC LIMIT ?, ?";
    values.push((page - 1) * pageSize, pageSize);

    // 🔍 输出 SQL 语句和参数用于调试
    console.log("🔍 SQL 查询:", query);
    console.log("🔍 SQL 参数:", values);

    const [rows] = await promisePool.query(query, values);
    const [totalRows] = await promisePool.query(
      countQuery,
      values.slice(0, conditions.length)
    );

    res.json({ jobs: rows, total: totalRows[0].total });
  } catch (error) {
    console.error("❌ 获取兼职失败:", error);
    res.status(500).json({ error: "服务器错误", details: error.message });
  }
});

// ✅ 获取单个兼职详情
router.get("/jobs/:id", async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM job_posts WHERE job_id = ?",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "兼职未找到" });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ 获取兼职详情失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 发布新兼职
router.post("/jobs", async (req, res) => {
  const {
    admin_id,
    title,
    description,
    salary,
    location,
    contact_info,
    status,
  } = req.body;

  if (!admin_id) {
    return res.status(400).json({ error: "管理员ID不能为空" });
  }

  try {
    await promisePool.query(
      "INSERT INTO job_posts (admin_id, title, description, salary, location, contact_info, status, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [admin_id, title, description, salary, location, contact_info, status]
    );
    res.json({ message: "兼职已发布" });
  } catch (error) {
    console.error("❌ 发布兼职失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 编辑兼职
router.put("/jobs/:id", async (req, res) => {
  const { title, description, salary, location, contact_info, status } =
    req.body;

  try {
    await promisePool.query(
      "UPDATE job_posts SET title=?, description=?, salary=?, location=?, contact_info=?, status=?, update_time=NOW() WHERE job_id=?",
      [
        title,
        description,
        salary,
        location,
        contact_info,
        status,
        req.params.id,
      ]
    );
    res.json({ message: "兼职已更新" });
  } catch (error) {
    console.error("❌ 更新兼职失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 切换兼职状态（开放/关闭）
router.put("/jobs/:id/toggle-status", async (req, res) => {
  try {
    // 获取当前状态
    const [job] = await promisePool.query(
      "SELECT status FROM job_posts WHERE job_id = ?",
      [req.params.id]
    );
    if (job.length === 0) return res.status(404).json({ error: "兼职未找到" });

    // 切换状态
    const newStatus = job[0].status === "open" ? "closed" : "open";
    await promisePool.query(
      "UPDATE job_posts SET status=?, update_time=NOW() WHERE job_id=?",
      [newStatus, req.params.id]
    );

    res.json({ message: "兼职状态已更新", status: newStatus });
  } catch (error) {
    console.error("❌ 切换兼职状态失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 删除兼职
router.delete("/jobs/:id", async (req, res) => {
  try {
    await promisePool.query("DELETE FROM job_posts WHERE job_id=?", [
      req.params.id,
    ]);
    res.json({ message: "兼职已删除" });
  } catch (error) {
    console.error("❌ 删除兼职失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
