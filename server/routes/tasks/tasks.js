const express = require("express");
const router = express.Router();
const promisePool = require("../../db");

// **获取所有待接单任务**
// router.get("/tasks", async (req, res) => {
//   try {
//     const [tasks] = await promisePool.query(
//       "SELECT tasks.*, users.nickname AS publisher_name FROM tasks JOIN users ON tasks.user_id = users.openid WHERE tasks.status = '待接单'or tasks.status ='进行中' ORDER BY created_at DESC"
//     );
//     res.json(tasks);
//   } catch (error) {
//     console.error("❌ 获取任务失败:", error);
//     res.status(500).json({ error: "获取任务失败" });
//   }
// });
router.get("/tasks", async (req, res) => {
  try {
    const [rows] = await promisePool.query(`
            SELECT 
                t.*, 
                u.nickName, 
                u.avatarUrl,
                DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i') AS created_at
            FROM tasks t
            JOIN users u ON t.user_id = u.openid
            ORDER BY t.created_at DESC
        `);

    res.json(rows);
  } catch (error) {
    console.error("❌ 获取任务列表错误:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});


// 获取任务详情
/* router.get("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  console.log("📌 请求任务 ID:", taskId);

  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM tasks WHERE task_id = ?",
      [taskId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "任务未找到" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ 获取任务详情错误:", error);
    res.status(500).json({ error: "服务器错误" });
  }
}); */

router.get("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const [rows] = await promisePool.query(
      `
            SELECT 
                t.*, 
                u.nickName, 
                u.avatarUrl,
                DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i') AS created_at
            FROM tasks t
            JOIN users u ON t.user_id = u.openid
            WHERE t.task_id = ?
        `,
      [taskId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "任务未找到" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ 获取任务详情错误:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// **发布任务**
router.post("/tasks", async (req, res) => {
  const {
    user_id,
    task_title,
    task_description,
    reward,
    pickup_location,
    delivery_location,
  } = req.body;

  try {
    const sql =
      "INSERT INTO tasks (user_id, task_title, task_description, reward, pickup_location, delivery_location) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await promisePool.query(sql, [
      user_id,
      task_title,
      task_description,
      reward,
      pickup_location,
      delivery_location,
    ]);
    res.json({ success: true, task_id: result.insertId });
  } catch (error) {
    console.error("❌ 任务发布失败:", error);
    res.status(500).json({ error: "任务发布失败" });
  }
});

// **更新任务**
router.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const {
    task_title,
    task_description,
    pickup_location,
    delivery_location,
    reward,
  } = req.body;

  try {
    const [result] = await promisePool.query(
      "UPDATE tasks SET task_title = ?, task_description = ?, pickup_location = ?, delivery_location = ?, reward = ?, updated_at = NOW() WHERE task_id = ?",
      [
        task_title,
        task_description,
        pickup_location,
        delivery_location,
        reward,
        taskId,
      ]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "任务更新成功" });
    } else {
      res.status(404).json({ error: "任务不存在" });
    }
  } catch (error) {
    console.error("❌ 更新任务失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// **获取当前用户发布的任务**
router.get("/user/tasks", async (req, res) => {
  const { openid } = req.query;
  console.log("📌 获取用户任务, openid:", openid);

  if (!openid) {
    return res.status(400).json({ error: "缺少 openid 参数" });
  }

  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [openid]
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ 获取任务失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 📌 接单 API: 任务配送员接单
router.put("/tasks/:id/accept", async (req, res) => {
  const taskId = req.params.id;
  const { runner_id } = req.body;

  if (!runner_id) {
    return res.status(400).json({ error: "缺少 runner_id" });
  }

  try {
    // 1️⃣ **检查任务是否存在**
    const [task] = await promisePool.query(
      "SELECT * FROM tasks WHERE task_id = ?",
      [taskId]
    );

    if (task.length === 0) {
      return res.status(404).json({ error: "任务未找到" });
    }

    const taskOwner = task[0].user_id;
    if (task[0].status !== "待接单") {
      return res.status(400).json({ error: "任务已被接单或无法接单" });
    }

    // 2️⃣ **不能接自己的任务**
    if (taskOwner === runner_id) {
      return res.status(403).json({ error: "不能接自己发布的任务" });
    }

    // 3️⃣ **检查 runner_id 是否为已审核跑腿员**
    const [runner] = await promisePool.query(
      "SELECT status FROM runner_applications WHERE openid = ?",
      [runner_id]
    );

    if (runner.length === 0 || runner[0].status !== "已通过") {
      return res
        .status(403)
        .json({ error: "您还不是配送员，请先申请或等待审核通过" });
    }

    // 4️⃣ **更新任务状态**
    const [updateResult] = await promisePool.query(
      "UPDATE tasks SET runner_id = ?, status = '进行中' WHERE task_id = ? AND status = '待接单'",
      [runner_id, taskId]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: "任务状态更新失败" });
    }

    res.json({ message: "任务接单成功" });
  } catch (error) {
    console.error("❌ 接单错误:", error);
    res.status(500).json({ error: "服务器错误", details: error.message });
  }
});

// **完成任务**
router.put("/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await promisePool.query(
      "UPDATE tasks SET status = '已完成' WHERE task_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "任务未找到" });
    }

    res.json({ message: "任务已标记为完成" });
  } catch (error) {
    console.error("❌ 任务完成失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// **取消任务**
/* router.put("/tasks/:id/cancel", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await promisePool.query(
      "UPDATE tasks SET status = '待接单',runner_id=null WHERE task_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "任务未找到" });
    }

    res.json({ message: "任务已取消" });
  } catch (error) {
    console.error("❌ 取消任务失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
}); */
// **取消任务**
router.put("/tasks/:id/cancel", async (req, res) => {
  const taskId = req.params.id;
  try {
    const [result] = await promisePool.query(
      "UPDATE tasks SET status = '待接单',runner_id=null WHERE task_id = ?",
      [taskId]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "任务已取消" });
    } else {
      res.status(404).json({ error: "任务未找到" });
    }
  } catch (error) {
    console.error("❌ 取消任务失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// **删除任务**
router.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const [result] = await promisePool.query(
      "DELETE FROM tasks WHERE task_id = ?",
      [taskId]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true, message: "任务已删除" });
    } else {
      res.status(404).json({ error: "任务未找到" });
    }
  } catch (error) {
    console.error("❌ 删除任务失败:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

// 获取当前跑腿员的所有接单任务
router.get("/runner/tasks", async (req, res) => {
  const { openid } = req.query;

  if (!openid) {
    return res.status(400).json({ error: "缺少 openid 参数" });
  }

  try {
    const [orders] = await promisePool.query(
      `SELECT t.*, u.nickName AS userName, u.avatarUrl AS userAvatar
         FROM tasks t
         JOIN users u ON t.user_id = u.openid
         WHERE t.runner_id = ?`,
      [openid]
    );

    res.json(orders);
  } catch (error) {
    console.error("❌ 获取接单任务失败:", error);
    res.status(500).json({ error: "服务器错误", details: error.message });
  }
});

// 更新任务状态
router.put("/tasks/:id/:action", async (req, res) => {
  const { id, action } = req.params;
  const statusMap = {
    complete: "已完成",
    cancel: "已取消",
  };
  try {
    await promisePool.query("UPDATE tasks SET status = ? WHERE task_id = ?", [
      statusMap[action],
      id,
    ]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "操作失败" });
  }
});
router.get("/check-runner-status", async (req, res) => {
  const { openid } = req.query;
  try {
    const sql = "SELECT status FROM runner_applications WHERE openid = ?";
    const [rows] = await promisePool.query(sql, [openid]);

    if (rows.length > 0 && rows[0].status === "已通过") {
      res.json({ isRunner: true });
    } else {
      res.json({ isRunner: false });
    }
  } catch (error) {
    res.status(500).json({ message: "查询失败", error });
  }
});
router.get("/runner-applications/status", async (req, res) => {
  const { openid } = req.query;
  console.log(1111);

  if (!openid) {
    return res.status(400).json({ error: "缺少 openid 参数" });
  }

  try {
    const [rows] = await promisePool.query(
      "SELECT status FROM runner_applications WHERE openid = ?",
      [openid]
    );

    console.log("🚀 查询跑腿员状态:", rows);

    if (!rows || rows.length === 0) {
      return res.json({ status: "未申请" }); // ✅ 避免返回 null
    }

    res.json(rows[0]); // ✅ 正确返回 status
  } catch (error) {
    console.error("❌ 获取跑腿员状态错误:", error);
    res.status(500).json({ error: "服务器错误" });
  }
});

module.exports = router;
