const express = require("express");
const router = express.Router();
const promisePool = require("../../db"); // 引入数据库连接

// ✅ 获取寻物列表（分页 + 搜索）
router.get("/foundItems", async (req, res) => {
  try {
    let query =
      "SELECT *, DATE_FORMAT(time, '%Y-%m-%d %H:%i') AS time FROM pickrecords WHERE 1=1";
    const values = [];

    // 处理搜索查询
    if (req.query.search) {
      query += " AND itemName LIKE ?";
      values.push(`%${req.query.search}%`);
    }

    // 处理分页
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    query += " LIMIT ?, ?";
    values.push(offset, pageSize);

    const [items] = await promisePool.query(query, values);
    const [[{ total }]] = await promisePool.query(
      "SELECT COUNT(*) AS total FROM pickrecords"
    );

    res.json({ items, total });
  } catch (error) {
    console.error("❌ 获取寻物失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 修改寻物信息
router.put("/foundItems/:id", async (req, res) => {
  const { itemName, claimMethod, contact, remarks, time } = req.body;
  try {
    await promisePool.query(
      "UPDATE pickrecords SET itemName=?, claimMethod=?, contact=?, remarks=?, time=?, createdAt=NOW() WHERE id=?",
      [itemName, claimMethod, contact, remarks, time, req.params.id]
    );
    res.json({ message: "寻物信息已更新" });
  } catch (error) {
    console.error("❌ 更新寻物信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 删除寻物
router.delete("/foundItems/:id", async (req, res) => {
  try {
    await promisePool.query("DELETE FROM pickrecords WHERE id=?", [
      req.params.id,
    ]);
    res.json({ message: "寻物已删除" });
  } catch (error) {
    console.error("❌ 删除寻物失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
