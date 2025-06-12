const express = require("express");
const router = express.Router();
const promisePool = require("../../db"); // 数据库连接

// **删除丢失/拾取物品**
router.post("/deleteLostFound", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "缺少 ID" });
    }

    // **解析真实 ID**
    const realId = parseInt(id.replace("L_", "").replace("P_", ""), 10);
    const isLost = id.startsWith("L_");
    const tableName = isLost ? "lostrecords" : "pickrecords";

    console.log(`🔍 目标表: ${tableName}, ID: ${realId}`);

    // **删除数据库记录**
    const sql = `DELETE FROM ${tableName} WHERE id = ?`;
    const [result] = await promisePool.execute(sql, [realId]);

    if (result.affectedRows > 0) {
      console.log("✅ 删除成功:", realId);
      res.json({ success: true, message: "删除成功" });
    } else {
      console.log("❌ 删除失败, 记录不存在:", realId);
      res.json({ success: false, message: "删除失败，记录不存在" });
    }
  } catch (error) {
    console.error("❌ 删除失败:", error);
    res.status(500).json({ success: false, message: "服务器错误" });
  }
});

module.exports = router;
