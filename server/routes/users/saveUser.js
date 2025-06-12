const express = require("express");
const promisePool = require("../../db");
const router = express.Router();

router.post("/saveUser", async (req, res) => {
  const { openid, avatarUrl, nickName, phone } = req.body;

  if (!openid) {
    console.log("11111111111111111111");

    return res.status(400).json({ message: "缺少必填字段" });
  }

  try {
    // 检查用户是否存在
    const [existingUser] = await promisePool.query(
      "SELECT * FROM users WHERE openid = ?",
      [openid]
    );

    if (existingUser.length > 0) {
      return res.status(200).json({ message: "用户已存在" });
    }

    // 插入用户信息
    const sql = `INSERT INTO users (openid, avatarUrl, nickName, phone) VALUES (?, ?, ?, ?)`;
    const values = [openid, avatarUrl, nickName, phone];

    await promisePool.execute(sql, values);
    res.status(200).json({ message: "用户存储成功", openid });
  } catch (err) {
    console.error("数据库错误:", err);
    res.status(500).json({ message: "服务器内部错误" });
  }
});
/* router.post("/saveUser", async (req, res) => {
  const { openid, nickName, avatarUrl } = req.body;
  try {
    await db.query(
      "INSERT INTO users (openid, nickName, avatarUrl) VALUES (?, ?, ?)",
      [openid, nickName, avatarUrl]
    );
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "数据库插入失败" });
  }
}); */
module.exports = router;
