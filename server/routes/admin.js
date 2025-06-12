const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const promisePool = require("../db");

const router = express.Router();
const SECRET_KEY = "supersecret"; // 生产环境请存入 .env

/**
 * 🟢 管理员登录
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("🔍 服务器收到登录请求:", username, password);

    // ✅ 查询 `admin` 表的所有字段
    const [rows] = await promisePool.query(
      "SELECT * FROM admin WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      console.warn("❌ 登录失败: 用户名或密码错误");
      return res.status(401).json({ message: "用户名或密码错误" });
    }

    const adminData = rows[0];

    // ✅ 生成 JWT Token
    const token = jwt.sign(adminData, SECRET_KEY, { expiresIn: "2h" });

    console.log("✅ 登录成功, 生成 Token:", token);

    res.json({
      message: "登录成功",
      token,
      adminData, // ✅ 发送完整管理员数据
    });
  } catch (error) {
    console.error("❌ 服务器错误:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
});
// 更新自己信息
router.put("/my/:id", async (req, res) => {
  const { id } = req.params;
  const { nickname, phone, password } = req.body;

  try {
    // 如果提供了新密码，则更新密码
    if (password) {
      await promisePool.query(
        "UPDATE admin SET nickname = ?, phone = ?, password = ? WHERE admin_id = ?",
        [nickname, phone, password, id]
      );
    } else {
      // 如果没有提供密码，则不修改密码
      await promisePool.query(
        "UPDATE admin SET nickname = ?, phone = ? WHERE admin_id = ?",
        [nickname, phone, id]
      );
    }

    res.json({ message: "管理员信息更新成功" });
  } catch (error) {
    console.error("❌ 更新管理员信息失败:", error);
    res.status(500).json({ error: "服务器错误，无法更新管理员信息" });
  }
});
// 获取所有管理员（仅超级管理员）
router.get("/admin", async (req, res) => {
  try {
    const [admins] = await promisePool.query(
      "SELECT admin_id, username, nickname, phone, role FROM admin"
    );
    res.json(admins);
  } catch (error) {
    console.error("获取管理员失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 添加管理员
router.post("/admin", async (req, res) => {
  const { username, nickname, phone, role, password } = req.body;
  try {
    await promisePool.query(
      "INSERT INTO admin (username, nickname, phone, role, password) VALUES (?, ?, ?, ?, ?)",
      [username, nickname, phone, role, password]
    );
    res.json({ message: "管理员添加成功" });
  } catch (error) {
    console.error("添加管理员失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 更新管理员信息
router.put("/admin/:id", async (req, res) => {
  const { nickname, phone, role } = req.body;
  try {
    await promisePool.query(
      "UPDATE admin SET nickname=?, phone=?, role=? WHERE admin_id=?",
      [nickname, phone, role, req.params.id]
    );
    res.json({ message: "管理员信息更新成功" });
  } catch (error) {
    console.error("更新管理员失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 删除管理员（不能删除超级管理员）
router.delete("/admin/:id", async (req, res) => {
  try {
    const [admin] = await promisePool.query("SELECT role FROM admin WHERE admin_id = ?", [
      req.params.id,
    ]);
    if (admin.length === 0 || admin[0].role === "superadmin") {
      return res.status(403).json({ error: "无法删除超级管理员" });
    }
    await promisePool.query("DELETE FROM admin WHERE admin_id=?", [req.params.id]);
    res.json({ message: "管理员删除成功" });
  } catch (error) {
    console.error("删除管理员失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
module.exports = router;
