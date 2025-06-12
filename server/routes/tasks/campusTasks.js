const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// ✅ 获取跑腿员申请列表（支持分页 & 搜索）
router.get("/runner-applications", async (req, res) => {
  try {
    const { page = 1, pageSize = 8, search = "" } = req.query;
    const offset = (page - 1) * pageSize;

    let query = "SELECT * FROM runner_applications";
    let countQuery = "SELECT COUNT(*) as total FROM runner_applications";
    const queryParams = [];

    // 如果有搜索关键词
    if (search) {
      query += " WHERE name LIKE ?";
      countQuery += " WHERE name LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += " ORDER BY application_id DESC LIMIT ?, ?";
    queryParams.push(parseInt(offset), parseInt(pageSize));

    // 执行查询
    const [rows] = await promisePool.query(query, queryParams);
    const [countRows] = await promisePool.query(countQuery, queryParams);

    res.json({
      applications: rows,
      total: countRows[0].total,
    });
  } catch (error) {
    console.error("❌ 获取跑腿员申请列表失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 📌 获取单个申请详情
router.get("/runner-applications/:openid", async (req, res) => {
  const { openid } = req.params;
  try {
    const sql = "SELECT * FROM runner_applications WHERE openid = ?";
    const [rows] = await promisePool.query(sql, [openid]);

    if (rows.length > 0) {
      res.json(rows[0]); // 返回申请数据
    } else {
      res.json(null); // 如果未申请，则返回 null
    }
  } catch (error) {
    res.status(500).json({ message: "查询失败", error });
  }
});
// 重新申请
router.post("/apply-runner/reset", async (req, res) => {
  const { openid } = req.body;
  try {
    const sql = "DELETE FROM runner_applications WHERE openid = ?";
    await promisePool.query(sql, [openid]);
    res.json({ message: "申请已重置，请重新提交" });
  } catch (error) {
    res.status(500).json({ message: "重置失败", error });
  }
});

// 📌 申请成为跑腿员（用户端）
router.post("/apply-runner", async (req, res) => {
  const { openid, name, phone, id_card } = req.body;
  try {
    const sql = `
      INSERT INTO runner_applications (openid, name, phone, id_card, status) 
      VALUES (?, ?, ?, ?, '待审核')
      ON DUPLICATE KEY UPDATE 
      name = VALUES(name), phone = VALUES(phone), id_card = VALUES(id_card), status = '待审核', rejection_reason = NULL, reviewed_at = NULL
    `;
    await promisePool.query(sql, [openid, name, phone, id_card]);
    res.json({ message: "申请已提交" });
  } catch (error) {
    res.status(500).json({ message: "提交失败", error });
  }
});

// 📌 管理员审核申请
router.put("/runner-applications/:id", async (req, res) => {
  const { status, reviewer_id, rejection_reason } = req.body;
  try {
    const sql = `
            UPDATE runner_applications
            SET status = ?, reviewer_id = ?, rejection_reason = ?, reviewed_at = NOW()
            WHERE application_id = ?;
        `;
    await promisePool.query(sql, [
      status,
      reviewer_id,
      rejection_reason,
      req.params.id,
    ]);

    res.json({ success: true, message: "审核成功" });
  } catch (error) {
    res.status(500).json({ message: "审核失败", error });
  }
});

// 📌 管理员删除申请
router.delete("/runner-applications/:id", async (req, res) => {
  try {
    const applicationId = req.params.id;
    const [result] = await promisePool.query(
      "DELETE FROM runner_applications WHERE application_id = ?",
      [applicationId]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "删除成功" });
    } else {
      res.status(404).json({ error: "未找到该记录" });
    }
  } catch (error) {
    console.error("❌ 删除失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
