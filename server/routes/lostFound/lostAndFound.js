const express = require("express");
const promisePool = require("../../db");
const router = express.Router();

// 获取所有丢失和拾取的物品（包含用户头像和昵称）
router.get("/lostAndFound", async (req, res) => {
  const query = `
    (SELECT CONCAT('L_', l.id) AS id, l.openid, l.itemName, l.fileList, l.lostPath AS location, 
            l.time, l.claimMethod, l.contact, l.remarks, l.reward, l.rewardAmount, l.createdAt, 
            u.avatarUrl, u.nickName, '丢失物品' AS type
     FROM lostrecords l 
     LEFT JOIN users u ON l.openid = u.openid)
    UNION
    (SELECT CONCAT('P_', p.id) AS id, p.openid, p.itemName, p.fileList, p.location, p.time, p.claimMethod, 
            p.contact, p.remarks, NULL AS reward, NULL AS rewardAmount, p.createdAt, 
            u.avatarUrl, u.nickName, '拾取物品' AS type
     FROM pickrecords p 
     LEFT JOIN users u ON p.openid = u.openid)
    ORDER BY createdAt DESC;
  `;

  try {
    const [results] = await promisePool.query(query);
    // console.log(results);

    res.json(results);
  } catch (err) {
    console.error("查询失败:", err);
    res.status(500).json({ error: "数据库查询错误" });
  }
});

// 获取当前用户发布的所有失物招领和寻物启事
router.get("/posts", async (req, res) => {
  const { openid } = req.query; // 获取用户 openid
  console.log(openid);

  if (!openid) {
    return res.status(400).json({ error: "缺少 openid 参数" });
  }

  try {
    // 查询失物招领 & 寻物启事
    const query = `
        (SELECT CONCAT('L_', l.id) AS id, l.openid, l.itemName, l.fileList, l.lostPath AS location, 
        l.time, l.claimMethod, l.contact, l.remarks, l.reward, l.rewardAmount, l.createdAt, 
        u.avatarUrl, u.nickName, '丢失物品' AS type
        FROM lostrecords l  
        LEFT JOIN users u ON l.openid = u.openid
        WHERE l.openid = ?)  
        UNION
        (SELECT CONCAT('P_', p.id) AS id, p.openid, p.itemName, p.fileList, p.location, p.time, p.claimMethod, 
                p.contact, p.remarks, NULL AS reward, NULL AS rewardAmount, p.createdAt, 
                u.avatarUrl, u.nickName, '拾取物品' AS type
        FROM pickrecords p  
        LEFT JOIN users u ON p.openid = u.openid
        WHERE p.openid = ?)  
        ORDER BY createdAt DESC;
      `;

    const [results] = await promisePool.query(query, [openid, openid]);

    res.json(results);
  } catch (err) {
    console.error("获取用户发布失败:", err);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
