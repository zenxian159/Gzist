const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// **更新物品信息**
router.post("/updateLostFound", async (req, res) => {
  try {
    console.log("✅ 收到更新请求:", req.body); // 👉 日志

    const {
      id,
      itemName,
      fileList,
      pickLocation, // 拾取地点
      lostPath, // 丢失路径
      time,
      claimMethod,
      contact,
      remarks,
      reward,
      rewardAmount,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "❌ 缺少 ID 参数" });
    }

    const isLostItem = id.startsWith("L_"); // 判断是丢失物品还是拾取物品
    const tableName = isLostItem ? "lostrecords" : "pickrecords";
    const realId = parseInt(id.replace("L_", "").replace("P_", ""), 10);

    if (isNaN(realId)) {
      return res.status(400).json({ error: "❌ ID 无效" });
    }

    // **构造 SQL 更新语句**
    let updateQuery = `
      UPDATE ${tableName} 
      SET itemName = ?, fileList = ?, time = ?, 
          claimMethod = ?, contact = ?, remarks = ?
    `;

    let values = [
      itemName,
      JSON.stringify(fileList),
      time,
      claimMethod,
      contact,
      remarks,
    ];

    // **丢失物品更新 lostPath**
    if (isLostItem) {
      updateQuery += `, lostPath = ?, reward = ?, rewardAmount = ? `;
      values.push(JSON.stringify(lostPath), reward, rewardAmount || null);
    } else {
      // **拾取物品更新 pickLocation**
      updateQuery += `, location = ? `;
      values.push(JSON.stringify(pickLocation));
    }

    updateQuery += ` WHERE id = ?;`;
    values.push(realId);

    console.log(`📝 SQL 执行: ${updateQuery}`);
    console.log("📌 SQL 参数:", values);

    const [result] = await promisePool.execute(updateQuery, values);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "✅ 更新成功" });
    } else {
      res.status(404).json({ error: "❌ 更新失败，ID 可能不存在" });
    }
  } catch (error) {
    console.error("❌ 更新失败:", error.message || error);
    res.status(500).json({ error: "服务器内部错误", details: error.message });
  }
});

module.exports = router;
