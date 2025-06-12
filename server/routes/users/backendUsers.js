const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// ✅ 获取用户列表（支持分页 & 搜索）
router.get("/users", async (req, res) => {
  try {
    let { page = 1, pageSize = 8, search = "" } = req.query;
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    let query =
      "SELECT openid, avatarUrl, phone, create_time, nickName FROM users WHERE 1=1";
    let countQuery = "SELECT COUNT(*) AS total FROM users WHERE 1=1";
    const values = [];

    if (search) {
      query += " AND (nickName LIKE ? OR phone LIKE ?)";
      countQuery += " AND (nickName LIKE ? OR phone LIKE ?)";
      values.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY create_time DESC LIMIT ?, ?";
    values.push((page - 1) * pageSize, pageSize);

    const [users] = await promisePool.query(query, values);
    const [total] = await promisePool.query(countQuery, values.slice(0, 2));

    res.json({ users, total: total[0].total });
  } catch (error) {
    console.error("❌ 获取用户列表失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 更新用户信息（支持头像修改）
router.put("/users/:openid", async (req, res) => {
  const { nickName, phone, avatarUrl } = req.body;
  try {
    await promisePool.query(
      "UPDATE users SET nickName=?, phone=?, avatarUrl=? WHERE openid=?",
      [nickName, phone, avatarUrl, req.params.openid]
    );
    res.json({ message: "用户信息已更新" });
  } catch (error) {
    console.error("❌ 更新用户信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
// ✅ 删除用户
router.delete("/users/:openid", async (req, res) => {
  try {
    const { openid } = req.params;
    await promisePool.query("DELETE FROM users WHERE openid = ?", [openid]);

    res.json({ message: "用户已删除" });
  } catch (error) {
    console.error("❌ 删除用户失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
