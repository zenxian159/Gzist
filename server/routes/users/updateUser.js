const express = require("express");
const promisePool = require("../../db");
const router = express.Router();

router.post("/updateUser", async (req, res) => {
  const { openid, nickName, phone, avatarUrl } = req.body;

  if (!openid || !nickName) {
    return res.status(400).json({ message: "缺少必填字段" });
  }

  try {
    // 确保用户存在
    const [existingUser] = await promisePool.query(
      "SELECT * FROM users WHERE openid = ?",
      [openid]
    );
    console.log(existingUser);
    

    if (existingUser.length === 0) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 更新用户信息
    const sql = `
      UPDATE users
      SET nickName = ?, phone = ?, avatarUrl = ?
      WHERE openid = ?
    `;
    const values = [nickName, phone || null, avatarUrl || null, openid];

    const [result] = await promisePool.execute(sql, values);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "用户信息更新成功", openid });
    } else {
      res.status(400).json({ message: "未更新任何数据" });
    }
  } catch (err) {
    console.error("数据库更新错误:", err);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

module.exports = router;
