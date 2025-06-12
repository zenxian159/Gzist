const express = require("express");
const promisePool = require("../../db");
const router = express.Router();

router.post("/lostRecord", async (req, res) => {
  try {
    const {
      openid, // 用户 openid
      itemName,
      fileList,
      lostPath,
      time,
      claimMethod,
      contact,
      remarks,
      reward, // 是否有酬金 ("无" / "面议" / "有")
      rewardAmount, // 酬金金额 (可选)
    } = req.body;

    // 校验必填字段
    if (!itemName || !fileList || !lostPath || !time || !claimMethod || !contact || !openid) {
      console.warn("缺少必填字段", req.body);
      return res.status(400).json({ message: "缺少必填字段" });
    }

    // 确保 fileList 和 lostPath 是 JSON 格式
    const fileListJson = Array.isArray(fileList) ? JSON.stringify(fileList) : "[]";
    const lostPathJson = typeof lostPath === "object" ? JSON.stringify(lostPath) : lostPath;

    // SQL 语句
    const sql = `
      INSERT INTO lostrecords (openid, itemName, fileList, lostPath, time, claimMethod, contact, remarks, reward, rewardAmount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      openid,
      itemName,
      fileListJson, // 图片 JSON
      lostPathJson, // 丢失地点 JSON
      time,
      claimMethod,
      contact,
      remarks || null,
      reward || "无",
      rewardAmount || null,
    ];

    console.log("执行 SQL:", sql);
    console.log("SQL 参数:", values);

    // 执行数据库插入
    const [result] = await promisePool.execute(sql, values);

    console.log("数据库插入结果:", result);

    res.status(200).json({ message: "丢失物品记录插入成功", recordId: result.insertId });
  } catch (err) {
    console.error("数据库插入错误:", err);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

module.exports = router;
