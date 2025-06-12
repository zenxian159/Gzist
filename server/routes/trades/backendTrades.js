const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// 获取商品列表（带搜索和分页）
router.get("/backendTrades", async (req, res) => {
  try {
    let query = "SELECT * FROM second_hand_trades WHERE 1=1";
    const values = [];

    if (req.query.search) {
      query += " AND title LIKE ?";
      values.push(`%${req.query.search}%`);
    }
    if (req.query.category) {
      query += " AND category = ?";
      values.push(req.query.category);
    }
    if (req.query.status) {
      query += " AND status = ?";
      values.push(req.query.status);
    }

    query += " ORDER BY create_time DESC LIMIT ?, ?";
    values.push((req.query.page - 1) * 10, 8);

    const [rows] = await promisePool.query(query, values);
    const [[{ total }]] = await promisePool.query(
      "SELECT COUNT(*) as total FROM second_hand_trades"
    );

    res.json({ items: rows, total });
  } catch (error) {
    console.error("❌ 获取商品失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 更新商品信息
router.put("/backendTrades/:id", async (req, res) => {
  try {
    const { title, category, price, status, description, fileList } = req.body;
    console.log(JSON.stringify(fileList));
    // 确保 fileList 是 JSON 数组
    if (!Array.isArray(fileList)) {
      return res.status(400).json({ error: "图片/视频格式错误，必须是数组" });
    }

    // 限制最多 9 张
    if (fileList.length > 9) {
      return res.status(400).json({ error: "最多只能上传 9 张图片或视频" });
    }

    await promisePool.query(
      "UPDATE second_hand_trades SET title=?, category=?, price=?, status=?, description=?, fileList=? WHERE trade_id=?",
      [
        title,
        category,
        price,
        status,
        description,
        JSON.stringify(fileList),
        req.params.id,
      ]
    );
    res.json({ message: "商品信息已更新" });
  } catch (error) {
    console.error("❌ 更新商品失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 删除商品
router.delete("/backendTrades/:id", async (req, res) => {
  try {
    await promisePool.query("DELETE FROM second_hand_trades WHERE trade_id=?", [
      req.params.id,
    ]);
    res.json({ message: "商品已删除" });
  } catch (error) {
    console.error("❌ 删除商品失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
