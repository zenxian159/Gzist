const express = require("express");
const promisePool = require("../../db"); // 引入 MySQL 连接池
const router = express.Router();

// 检查用户是否存在
router.post("/checkUser", async (req, res) => {
  try {
    const { openid } = req.body;

    if (!openid) {
      return res.status(400).json({ error: "缺少 openid 参数" });
    }

    // 使用 MySQL 查询用户是否存在
    const [rows] = await promisePool.query("SELECT * FROM users WHERE openid = ?", [openid]);

    if (rows.length > 0) {
      res.json({ exists: true, userInfo: rows[0] }); // 返回用户信息
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("查询用户失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
