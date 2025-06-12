const express = require("express");
const router = express.Router();
const promisePool = require("../../db"); // 引入数据库连接

// ✅ 获取失物列表（分页 + 搜索）
router.get("/lost-items", async (req, res) => {
  try {
    let query =
      "SELECT *, DATE_FORMAT(time, '%Y-%m-%d %H:%i') AS time FROM lostrecords WHERE 1=1";
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
      "SELECT COUNT(*) AS total FROM lostrecords"
    );

    res.json({ items, total });
  } catch (error) {
    console.error("❌ 获取失物失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 修改失物信息
router.put("/lost-items/:id", async (req, res) => {
  const {
    itemName,
    time,
    claimMethod,
    contact,
    remarks,
    reward,
    rewardAmount,
  } = req.body;
  try {
    await promisePool.query(
      "UPDATE lostrecords SET itemName=?, time=?, claimMethod=?, contact=?, remarks=?, reward=?, rewardAmount=?, createdAt=NOW() WHERE id=?",
      [
        itemName,
        time,
        claimMethod,
        contact,
        remarks,
        reward,
        rewardAmount,
        req.params.id,
      ]
    );
    res.json({ message: "失物信息已更新" });
  } catch (error) {
    console.error("❌ 更新失物信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// ✅ 删除失物
router.delete("/lost-items/:id", async (req, res) => {
  try {
    await promisePool.query("DELETE FROM lostrecords WHERE id=?", [
      req.params.id,
    ]);
    res.json({ message: "失物已删除" });
  } catch (error) {
    console.error("❌ 删除失物失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
