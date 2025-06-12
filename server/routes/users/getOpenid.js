const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/getOpenid", async (req, res) => {
  const { code } = req.body;
  const appid = "wx78bf9e48e71fe0db";
  const secret = "5cbf8357c8b70f40ecf17fadfe767ca4";
  
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

  try {
    const response = await axios.get(url);
    res.json({ openid: response.data.openid });
  } catch (error) {
    res.status(500).json({ message: "获取 openid 失败" });
  }
});

module.exports = router;
