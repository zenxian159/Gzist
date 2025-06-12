const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// 发送聊天消息
router.post("/chat", async (req, res) => {
  try {
    const { trade_id, buyer_id, seller_id, sender_id, message, user_type } =
      req.body;

    if (
      !trade_id ||
      !buyer_id ||
      !seller_id ||
      !sender_id ||
      !message ||
      !user_type
    ) {
      return res.status(400).json({ error: "缺少必要的字段" });
    }
    console.log(user_type);

    const query = `
      INSERT INTO chats (trade_id, buyer_id, seller_id, sender_id, message, user_type, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    await promisePool.query(query, [
      trade_id,
      buyer_id,
      seller_id,
      sender_id,
      message,
      user_type,
    ]);

    res.json({ message: "消息发送成功" });
  } catch (error) {
    console.error("❌ 发送消息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 获取聊天记录
router.get("/chat/:trade_id", async (req, res) => {
  try {
    const { trade_id } = req.params;

    if (!trade_id) {
      return res.status(400).json({ error: "trade_id 不能为空" });
    }
    const query = `
      SELECT * FROM chats WHERE trade_id = ? ORDER BY timestamp ASC
    `;

    const [messages] = await promisePool.query(query, [trade_id]);

    res.json({ messages });
  } catch (error) {
    console.error("❌ 获取聊天记录失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

router.get("/userInfo", async (req, res) => {
  try {
    const { buyer_id, seller_id } = req.query;
    if (!buyer_id || !seller_id) {
      return res.status(400).json({ error: "缺少参数" });
    }

    // 查询数据库，获取头像信息
    const [buyerInfo] = await promisePool.query(
      "SELECT avatarUrl FROM users WHERE openid = ?",
      [buyer_id]
    );
    const [sellerInfo] = await promisePool.query(
      "SELECT avatarUrl FROM users WHERE openid = ?",
      [seller_id]
    );

    res.json({
      buyerAvatar: buyerInfo[0]?.avatarUrl || "",
      sellerAvatar: sellerInfo[0]?.avatarUrl || "",
    });
  } catch (error) {
    console.error("获取用户信息失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

router.get("/conversations/:openid", async (req, res) => {
  const { openid } = req.params;

  try {
    const [rows] = await promisePool.query(
      `
      SELECT 
        c.trade_id,
        c.message AS last_message,
        DATE_FORMAT(c.timestamp, '%Y-%m-%d %H:%i') AS timestamp,
        CASE 
          WHEN c.sender_id = ? THEN u2.nickName
          ELSE u1.nickName
        END AS other_nickname,
        CASE 
          WHEN c.sender_id = ? THEN u2.avatarUrl
          ELSE u1.avatarUrl
        END AS other_avatar,
        c.buyer_id,
        c.seller_id
      FROM chats c
      INNER JOIN (
        SELECT trade_id, MAX(timestamp) AS max_time
        FROM chats
        WHERE (buyer_id = ? OR seller_id = ?) AND (
          (buyer_id = ? AND buyer_deleted = 0) OR 
          (seller_id = ? AND seller_deleted = 0)
        )
        GROUP BY trade_id
      ) latest ON c.trade_id = latest.trade_id AND c.timestamp = latest.max_time
      LEFT JOIN users u1 ON u1.openid = c.sender_id
      LEFT JOIN users u2 ON u2.openid = IF(c.buyer_id = c.sender_id, c.seller_id, c.buyer_id)
      ORDER BY c.timestamp DESC
      `,
      [openid, openid, openid, openid, openid, openid]
    );

    res.json({ chatList: rows });
  } catch (error) {
    console.error("获取会话失败", error);
    res.status(500).json({ error: "服务器错误" });
  }
});


// DELETE /api/chat/:trade_id/:user_id
router.delete("/chat/:trade_id/:user_id", async (req, res) => {
  const { trade_id, user_id } = req.params;

  try {
    // 查询聊天记录以判断身份
    const [rows] = await promisePool.query(
      "SELECT buyer_id, seller_id FROM chats WHERE trade_id = ? LIMIT 1",
      [trade_id]
    );

    if (!rows.length) return res.status(404).json({ error: "聊天不存在" });

    const { buyer_id, seller_id } = rows[0];
    let columnToUpdate = "";

    if (user_id === buyer_id) columnToUpdate = "buyer_deleted";
    else if (user_id === seller_id) columnToUpdate = "seller_deleted";
    else return res.status(403).json({ error: "无权限删除该聊天" });

    await promisePool.query(
      `UPDATE chats SET ${columnToUpdate} = 1 WHERE trade_id = ?`,
      [trade_id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("删除聊天失败：", err);
    res.status(500).json({ error: "服务器错误" });
  }
});


module.exports = router;
