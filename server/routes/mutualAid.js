const express = require("express");
const router = express.Router();
const promisePool = require("../db"); // MySQL 连接

// ✅ 获取所有互助信息，并关联用户信息
router.get("/wx-mutualAid", async (req, res) => {
  try {
    // ✅ 查询所有互助信息，并关联 users 表获取用户名和头像
    let query = `
      SELECT 
        m.id, 
        m.openid, 
        u.nickName, 
        u.avatarUrl, 
        m.content, 
        m.images, 
        DATE_FORMAT(m.created_at, '%Y-%m-%d %H:%i') AS created_at
      FROM mutual_aid m
      LEFT JOIN users u ON m.openid = u.openid
      ORDER BY m.created_at DESC
    `;

    const [rows] = await promisePool.query(query);

    res.json({ items: rows });
  } catch (error) {
    console.error("❌ 获取互助信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
// ✅ 获取单个互助信息详情
router.get("/wx-mutualAid/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let query = `
      SELECT 
        m.id, 
        m.openid, 
        u.nickName, 
        u.avatarUrl, 
        m.content, 
        IFNULL(m.images, '[]') AS images, 
        DATE_FORMAT(m.created_at, '%Y-%m-%d %H:%i') AS created_at
      FROM mutual_aid m
      LEFT JOIN users u ON m.openid = u.openid
      WHERE m.id = ?
    `;

    const [rows] = await promisePool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "未找到该互助信息" });
    }

    const detail = {
      ...rows[0],
      images: JSON.parse(rows[0].images || "[]"),
    };

    res.json(detail);
  } catch (error) {
    console.error("❌ 获取互助详情失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
// ✅ 获取我的互助
router.get("/myMutualAid", async (req, res) => {
  const { openid } = req.query;
  if (!openid) return res.status(400).json({ error: "openid 不能为空" });

  try {
    let query = `
      SELECT id, content, images, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') AS created_at 
      FROM mutual_aid WHERE openid = ? ORDER BY created_at DESC
    `;
    const [rows] = await promisePool.query(query, [openid]);

    res.json({ items: rows });
  } catch (error) {
    console.error("❌ 获取我的互助失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 获取互助信息（分页 & 搜索）
router.get("/mutualAid", async (req, res) => {
  try {
    let { page = 1, pageSize = 5, search = "" } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);
    const offset = (page - 1) * pageSize;

    // ✅ 取消 ORDER BY，提升查询性能
    let query = `
      SELECT * 
      FROM mutual_aid 
      WHERE content LIKE ? 
      LIMIT ? OFFSET ?
    `;
    const values = [`%${search}%`, pageSize, offset];

    // ✅ 计算总数
    const [rows] = await promisePool.query(query, values);
    const [[{ total }]] = await promisePool.query(
      "SELECT COUNT(*) AS total FROM mutual_aid WHERE content LIKE ?",
      [`%${search}%`]
    );

    res.json({ items: rows, total });
  } catch (error) {
    console.error("❌ 获取互助信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 发布互助信息
router.post("/mutualAid", async (req, res) => {
  const { openid, images, content } = req.body;

  if (!openid || !content) {
    return res.status(400).json({ error: "用户openid和内容不能为空" });
  }

  // 确保 images 数量不超过 3
  if (images && images.length > 3) {
    return res.status(400).json({ error: "最多只能上传 3 张图片或视频" });
  }

  try {
    await promisePool.query(
      "INSERT INTO mutual_aid (openid, images, content) VALUES (?, ?, ?)",
      [openid, JSON.stringify(images), content]
    );
    res.json({ message: "互助信息已发布" });
  } catch (error) {
    console.error("❌ 发布互助信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 修改互助信息
router.put("/mutualAid/:id", async (req, res) => {
  const { content, images } = req.body;
  const { id } = req.params;

  if (!content) {
    return res.status(400).json({ error: "内容不能为空" });
  }

  // 确保 images 是 JSON 数组
  if (!Array.isArray(images)) {
    return res.status(400).json({ error: "图片/视频格式错误，必须是数组" });
  }

  // 限制最多 3 张
  if (images.length > 3) {
    return res.status(400).json({ error: "最多只能上传 3 张图片或视频" });
  }

  try {
    await promisePool.query(
      "UPDATE mutual_aid SET content=?, images=? WHERE id=?",
      [content, JSON.stringify(images), id]
    );
    res.json({ message: "互助信息已更新" });
  } catch (error) {
    console.error("❌ 更新互助信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 删除互助信息
router.delete("/mutualAid/:id", async (req, res) => {
  try {
    await promisePool.query("DELETE FROM mutual_aid WHERE id=?", [
      req.params.id,
    ]);
    res.json({ message: "互助信息已删除" });
  } catch (error) {
    console.error("❌ 删除互助信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
