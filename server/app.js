// 导入所需模块
const path = require("path");
const express = require("express");
const cors = require("cors"); // 解决跨域问题
const bodyParser = require("body-parser"); // 解析请求体

// 创建Express应用
const app = express();

// 中间件配置
app.use(cors()); // 启用CORS中间件
app.use(bodyParser.urlencoded({ extended: false })); // 解析URL编码的请求体
app.use(express.json({ limit: "50mb" })); // 解析JSON请求体，支持大文件上传
app.use(express.urlencoded({ limit: "50mb", extended: true })); // 解析URL编码的请求体，支持大文件上传
app.use(bodyParser.json()); // 解析JSON请求体

// 路由模块
// 失物招领模块
const pickRecordRouter = require("./routes/lostFound/pickRecord");
const lostRecordRouter = require("./routes/lostFound/lostRecord");
const updateLostFoundRouter = require("./routes/lostFound/updateLostFound");
const deleteLostFoundRouter = require("./routes/lostFound/deleteLostFound");
const lostAndFoundRouter = require("./routes/lostFound/lostAndFound");
const lostItemsRouter = require("./routes/lostFound/lostItems");
const foundItemsRouter = require("./routes/lostFound/foundItems");
app.use("/api", pickRecordRouter);
app.use("/api", lostRecordRouter);
app.use("/api", updateLostFoundRouter);
app.use("/api", deleteLostFoundRouter);
app.use("/api", lostAndFoundRouter);
app.use("/api", lostItemsRouter);
app.use("/api", foundItemsRouter);

// 用户相关模块
const getOpenidRouter = require("./routes/users/getOpenid");
const saveUserRouter = require("./routes/users/saveUser");
const updateUserRouter = require("./routes/users/updateUser");
const checkUserRouter = require("./routes/users/checkUser");
const backendUsersRouter = require("./routes/users/backendUsers");
app.use("/api", getOpenidRouter);
app.use("/api", saveUserRouter);
app.use("/api", updateUserRouter);
app.use("/api", checkUserRouter);
app.use("/api", backendUsersRouter);

// 二手交易模块
const tradesRouter = require("./routes/trades/trades");
const chatRouter = require("./routes/trades/chat");
const backendTradesRouter = require("./routes/trades/backendTrades");
app.use("/api", tradesRouter);
app.use("/api", chatRouter);
app.use("/api", backendTradesRouter);

// 校园跑腿模块
const tasksRouter = require("./routes/tasks/tasks");
const backendTasksRouter = require("./routes/tasks/backendTasks");
const campusTasksRouter = require("./routes/tasks/campusTasks");
app.use("/api", tasksRouter);
app.use("/api", backendTasksRouter);
app.use("/api", campusTasksRouter);

// 管理员模块
const adminRouter = require("./routes/admin");
app.use("/api", adminRouter);

// 评论模块
const commentsRouter = require("./routes/comments");
app.use("/api", commentsRouter);

// 兼职模块
const jobsRouter = require("./routes/jobs");
app.use("/api", jobsRouter);

// 互助模块
const mutualAidRouter = require("./routes/mutualAid");
app.use("/api", mutualAidRouter);

// 图片上传模块
const uploadRouter = require("./routes/upload");
app.use("/api", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 提供静态文件服务

// 启动服务器
app.listen(3000, () => {
  console.log("服务已经启动，地址是：http://127.0.0.1:3000");
});
