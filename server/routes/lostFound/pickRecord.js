const express = require("express");
const promisePool = require("../../db");
const router = express.Router();

router.post("/pickRecord", async (req, res) => {
  try {
    const {
      openid, // 获取 openid
      itemName,
      fileList,
      pickLocation,
      time,
      claimMethod,
      contact,
      remarks,
    } = req.body;

    // 校验必填字段
    if (!itemName || !fileList || !pickLocation || !time || !claimMethod || !contact || !openid) {
      console.warn("缺少必填字段", req.body);
      return res.status(400).json({ message: "缺少必填字段" });
    }

    // 确保 fileList 是数组
    const fileListJson = Array.isArray(fileList) ? JSON.stringify(fileList) : "[]";

    // 准备 SQL 语句
    const sql = `
      INSERT INTO pickrecords (openid, itemName, fileList, location, time, claimMethod, contact, remarks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      openid,
      itemName,
      fileListJson, // 将文件列表序列化为 JSON 格式
      pickLocation,
      time,
      claimMethod,
      contact,
      remarks || null, // 备注字段可以为空
    ];

    console.log("执行 SQL:", sql);
    console.log("SQL 参数:", values);

    // 执行数据库插入操作
    const [result] = await promisePool.execute(sql, values);

    console.log("数据库插入结果:", result);

    res.status(200).json({ message: "记录插入成功", recordId: result.insertId });
  } catch (err) {
    console.error("数据库插入错误:", err);
    res.status(500).json({ message: "服务器内部错误" });
  }
});

module.exports = router;
