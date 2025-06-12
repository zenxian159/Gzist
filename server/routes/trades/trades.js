const express = require("express");
const promisePool = require("../../db");
const router = express.Router();
// 获取所有商品
/* router.get("/trades", async (req, res) => {
  try {
    const [products] = await promisePool.query(`
        SELECT second_hand_trades.*, users.nickName AS sellerName, users.avatarUrl AS sellerAvatar
        FROM second_hand_trades
        JOIN users ON second_hand_trades.seller_id = users.openid
        ORDER BY create_time DESC
      `);

    res.json(products);
  } catch (error) {
    console.error("获取商品失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
}); */
/* router.get("/tradesa", async (req, res) => {
  try {
    // 1. 读取分页参数
    const pageNum = parseInt(req.query.pageNum, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (pageNum - 1) * pageSize;

    // 2. 分页查询
    const [rows] = await promisePool.query(
      `
      SELECT * FROM  second_hand_trades ORDER BY create_time DESC LIMIT ? OFFSET ?
      `,
      [pageSize, offset]
    );

    res.json(rows);
  } catch (error) {
    console.error("获取商品失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
}); */

/**
 * GET /userPurchasedTrades
 * 分页查询「我购买的」订单
 * Query 参数：
 *   - openid   （必填，当前用户的 openid）
 *   - pageNum  （第几页，默认 1）
 *   - pageSize （每页多少条，默认 10）
 */
router.get('/userPurchasedTrades', async (req, res) => {
  try {
    const openid   = req.query.openid
    const pageNum  = parseInt(req.query.pageNum,  10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10

    if (!openid) {
      return res.status(400).json({ error: '缺少 openid 参数' })
    }

    const offset = (pageNum - 1) * pageSize

    const [rows] = await promisePool.query(
      `
      SELECT
        *
      FROM second_hand_trades
      WHERE buyer_id = ?
      ORDER BY update_time DESC
      LIMIT ? OFFSET ?
      `,
      [openid, pageSize, offset]
    )

    res.json(rows)
  } catch (err) {
    console.error('❌ 获取「我购买的」订单失败:', err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

/**
 * GET /userSoldTrades
 * 分页查询「我出售的」订单
 * Query 参数：
 *   - openid   （必填，当前用户的 openid）
 *   - pageNum  （第几页，默认 1）
 *   - pageSize （每页多少条，默认 10）
 */
router.get('/userSoldTrades', async (req, res) => {
  try {
    const openid   = req.query.openid
    const pageNum  = parseInt(req.query.pageNum,  10) || 1
    const pageSize = parseInt(req.query.pageSize, 10) || 10

    if (!openid) {
      return res.status(400).json({ error: '缺少 openid 参数' })
    }

    const offset = (pageNum - 1) * pageSize

    const [rows] = await promisePool.query(
      `
      SELECT
        *
      FROM second_hand_trades
      WHERE seller_id = ?
        AND status NOT IN ('可交易', '已下架')
      ORDER BY update_time DESC
      LIMIT ? OFFSET ?
      `,
      [openid, pageSize, offset]
    )

    res.json(rows)
  } catch (err) {
    console.error('❌ 获取「我出售的」订单失败:', err)
    res.status(500).json({ error: '服务器内部错误' })
  }
})
router.get("/trades", async (req, res) => {
  try {
    const pageNum = parseInt(req.query.pageNum, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (pageNum - 1) * pageSize;

    // ① 在 WHERE 中加上 status = '可交易'
    const [rows] = await promisePool.query(
      `
      SELECT
        t.*,
        u.nickName  AS sellerName,
        u.avatarUrl AS sellerAvatar
      FROM
        second_hand_trades AS t
      JOIN
        users AS u
        ON t.seller_id = u.openid
      WHERE
        t.status = '可交易'
      ORDER BY
        t.create_time DESC
      LIMIT ? OFFSET ?
      `,
      [pageSize, offset]
    );

    res.json(rows);
  } catch (error) {
    console.error("获取商品失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// **获取单个商品详情**
router.get("/trades/:trade_id", async (req, res) => {
  try {
    const trade_id = req.params.trade_id; // 获取 URL 参数
    console.log(`🔍 正在获取商品 ID: ${trade_id}`);

    // **联表查询商品和卖家信息**
    const [rows] = await promisePool.query(
      `SELECT 
      t.*, 
      u.nickName AS sellerName, 
      u.avatarUrl AS sellerAvatar
    FROM second_hand_trades AS t
    LEFT JOIN users AS u ON t.seller_id = u.openid
    WHERE t.trade_id = ?`,
      [trade_id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ 获取商品详情失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
// 获取用户的商品
router.get("/userTrades", async (req, res) => {
  try {
    // 1. 解析并校验请求参数
    const { openid } = req.query;
    const pageNum = parseInt(req.query.pageNum, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;

    if (!openid) {
      return res.status(400).json({ error: "缺少 openid 参数" });
    }

    const offset = (pageNum - 1) * pageSize;

    // 2. 分页查询数据库：按 update_time 倒序、只取当前页的记录
    const [products] = await promisePool.query(
      `
      SELECT *
      FROM second_hand_trades
      WHERE seller_id = ?
      ORDER BY update_time DESC
      LIMIT ? OFFSET ?
      `,
      [openid, pageSize, offset]
    );

    // 3. 返回当前页数据
    res.json(products);
  } catch (err) {
    console.error("❌ 获取用户商品失败:", err);
    res.status(500).json({ error: "服务器错误" });
  }
});

router.post("/trades", async (req, res) => {
  try {
    const { title, description, fileList, currentCategory, price, openid } =
      req.body;

    if (!openid || !title || !currentCategory) {
      return res.status(400).json({ error: "缺少必要参数" });
    }

    const sql =
      "INSERT INTO second_hand_trades (seller_id, title, description, category, price, fileList) VALUES (?, ?, ?, ?, ?, ?)";

    const [result] = await promisePool.query(sql, [
      openid,
      title,
      description,
      currentCategory,
      price,
      JSON.stringify(fileList), // ✅ 存储 JSON 字符串
    ]);

    res.json({ success: true, insertId: result.insertId });
  } catch (err) {
    console.error("❌ 交易发布失败:", err);
    res.status(500).json({ error: "服务器错误", details: err.message });
  }
});
// 更新商品信息
router.put("/trades/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, currentCategory, price, fileList } = req.body;
    console.log(title, description, currentCategory, price, fileList);

    const sql = `
        UPDATE second_hand_trades
        SET title = ?, description = ?, category = ?, price = ?, fileList = ?,update_time = NOW()
        WHERE trade_id = ?
      `;
    const values = [
      title,
      description,
      currentCategory,
      price,
      JSON.stringify(fileList),
      id,
    ];

    const [result] = await promisePool.query(sql, values);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "商品更新成功" });
    } else {
      res.status(404).json({ error: "商品不存在" });
    }
  } catch (error) {
    console.error("更新失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
// 修改商品状态
router.put("/trades/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const sql =
      "UPDATE second_hand_trades SET status = ?,buyer_confirm = 0, seller_confirm = 0, buyer_id=null,update_time = NOW() WHERE trade_id = ?";
    await promisePool.query(sql, [status, id]);

    res.json({ success: true, message: "商品状态更新成功" });
  } catch (err) {
    console.error("更新商品状态失败:", err);
    res.status(500).json({ error: "数据库错误" });
  }
});

router.put("/trades/:id/buyer", async (req, res) => {
  const { id } = req.params;
  const { status, buyer_id } = req.body;
  console.log(id, status, buyer_id);

  try {
    const sql =
      "UPDATE second_hand_trades SET status = ?,buyer_id=?,update_time = NOW() WHERE trade_id = ?";
    await promisePool.query(sql, [status, buyer_id, id]);

    res.json({ success: true, message: "商品状态更新成功" });
  } catch (err) {
    console.error("更新商品状态失败:", err);
    res.status(500).json({ error: "数据库错误" });
  }
});

// confirm
router.put("/trades/:id/confirm", async (req, res) => {
  const { id } = req.params;
  const { openid } = req.body;

  try {
    // 先查出当前交易记录
    const [[trade]] = await promisePool.query(
      "SELECT buyer_id, seller_id, buyer_confirm, seller_confirm FROM second_hand_trades WHERE trade_id = ?",
      [id]
    );

    if (!trade) {
      return res.status(404).json({ error: "交易不存在" });
    }

    // 判断当前是买家还是卖家
    let fieldToUpdate = "";
    if (openid === trade.buyer_id) {
      fieldToUpdate = "buyer_confirm";
    } else if (openid === trade.seller_id) {
      fieldToUpdate = "seller_confirm";
    } else {
      return res.status(403).json({ error: "无权操作此交易" });
    }

    // 更新当前用户的确认字段
    await promisePool.query(
      `UPDATE second_hand_trades SET ${fieldToUpdate} = 1 WHERE trade_id = ?`,
      [id]
    );

    // 检查是否双方都确认，更新为交易完成
    if (
      (fieldToUpdate === "buyer_confirm" && trade.seller_confirm === 1) ||
      (fieldToUpdate === "seller_confirm" && trade.buyer_confirm === 1)
    ) {
      await promisePool.query(
        "UPDATE second_hand_trades SET status = '交易完成', update_time = NOW() WHERE trade_id = ?",
        [id]
      );
    }

    res.json({ success: true, message: "确认成功" });
  } catch (err) {
    console.error("确认交易失败:", err);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 删除交易
router.delete("/trades/:id", async (req, res) => {
  try {
    const tradeId = req.params.id; // 获取商品 ID
    if (!tradeId) {
      return res.status(400).json({ error: "缺少商品 ID" });
    }

    // 删除数据库中的商品
    const [result] = await promisePool.query(
      "DELETE FROM second_hand_trades WHERE trade_id = ?",
      [tradeId]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "商品删除成功" });
    } else {
      res.status(404).json({ error: "未找到该商品" });
    }
  } catch (error) {
    console.error("❌ 删除商品失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});
module.exports = router;
