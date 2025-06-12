const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/comments', async (req, res) => {
  const { module, target_id } = req.query;
  const [rows] = await db.query(`
    SELECT c.*, u.nickName, u.avatarUrl 
    FROM comments c 
    LEFT JOIN users u ON c.user_id = u.openid
    WHERE c.module = ? AND c.target_id = ? AND c.is_deleted = 0
    ORDER BY c.create_time ASC
  `, [module, target_id]);

  const map = {}, root = [];
  rows.forEach(row => {
    const comment = {
      id: row.id,
      module: row.module,
      target_id: row.target_id,
      user_id: row.user_id,
      content: row.content,
      parent_id: row.parent_id,
      create_time: row.create_time,
      user: {
        nickname: row.nickName || '微信用户',
        avatarUrl: row.avatarUrl || '/assets/default-avatar.png'
      },
      replyToNickname: '',
      parent_content: '',
      children: []
    };
    map[comment.id] = comment;
  });

  rows.forEach(row => {
    const comment = map[row.id];
    if (comment.parent_id && map[comment.parent_id]) {
      const parent = map[comment.parent_id];
      comment.replyToNickname = parent.user.nickname;
      comment.parent_content = parent.content;
      parent.children.push(comment);
    } else {
      root.push(comment);
    }
  });

  res.json(root);
});

router.post('/comments', async (req, res) => {
  const { module, target_id, content, parent_id, user_id } = req.body;
  await db.query(`
    INSERT INTO comments (module, target_id, user_id, content, parent_id, create_time, is_deleted)
    VALUES (?, ?, ?, ?, ?, NOW(), 0)
  `, [module, target_id, user_id, content, parent_id || 0]);
  res.json({ message: 'success' });
});

router.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('UPDATE comments SET is_deleted = 1 WHERE id = ?', [id]);
  res.json({ message: 'deleted' });
});

module.exports = router;