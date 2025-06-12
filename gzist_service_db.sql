/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3307
 Source Server Type    : MySQL
 Source Server Version : 80035
 Source Host           : localhost:3307
 Source Schema         : gzist_service_db

 Target Server Type    : MySQL
 Target Server Version : 80035
 File Encoding         : 65001

 Date: 11/06/2025 05:46:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `admin_id` int NOT NULL AUTO_INCREMENT COMMENT '超级管理员唯一标识，主键',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '超级管理员用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '超级管理员登录密码（加密存储）',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '超级管理员手机号',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '管理员账号创建时间',
  `role` enum('superadmin','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'admin',
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '管理员',
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '超级管理员表，用于存储系统中唯一的超级管理员信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', '123456', '111', '2025-02-13 23:17:27', 'admin', '管理员');
INSERT INTO `admin` VALUES (2, 'lzh', '123', '2', '2025-02-15 08:05:54', 'superadmin', '超级管理员？');
INSERT INTO `admin` VALUES (3, '111', '111', '3', '2025-03-12 05:46:09', 'superadmin', '2');
INSERT INTO `admin` VALUES (4, '1', '3', '3', '2025-03-12 06:05:48', 'admin', '2');
INSERT INTO `admin` VALUES (5, '1', '1', '1', '2025-03-12 07:04:38', 'admin', '1');
INSERT INTO `admin` VALUES (6, '1', '1', '1', '2025-03-12 07:04:42', 'admin', '1');
INSERT INTO `admin` VALUES (7, '1', '1', '1', '2025-03-12 07:04:46', 'admin', '1');
INSERT INTO `admin` VALUES (8, '1', '', '1', '2025-03-12 07:04:49', 'admin', '1');
INSERT INTO `admin` VALUES (9, '1', '1', '1', '2025-03-12 07:04:54', 'admin', '1');
INSERT INTO `admin` VALUES (10, '1', '1', '1', '2025-03-12 07:04:59', 'admin', '1');

-- ----------------------------
-- Table structure for chats
-- ----------------------------
DROP TABLE IF EXISTS `chats`;
CREATE TABLE `chats`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `seller_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `trade_id` int NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sender_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `timestamp` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `user_type` enum('buyer','seller') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `buyer_deleted` tinyint(1) NULL DEFAULT 0,
  `seller_deleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 115 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chats
-- ----------------------------
INSERT INTO `chats` VALUES (43, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '??????????', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-23 05:20:49', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (44, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '?????????', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-23 05:20:50', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (45, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '11', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-23 05:21:15', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (46, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 7, '1', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-23 05:21:19', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (55, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 7, '111', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-23 05:27:30', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (56, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 7, '111?', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-23 05:27:33', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (75, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '..', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-23 23:31:22', 'seller', 0, 0);
INSERT INTO `chats` VALUES (76, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '?', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-23 23:35:13', 'seller', 0, 0);
INSERT INTO `chats` VALUES (81, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '服了你了', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-23 23:45:55', 'seller', 0, 0);
INSERT INTO `chats` VALUES (100, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '??', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-24 00:33:22', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (101, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '11', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-24 00:33:53', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (102, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '11', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 00:01:09', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (103, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '..', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 07:30:38', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (104, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '111', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 07:31:04', 'seller', 0, 0);
INSERT INTO `chats` VALUES (105, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '11', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 07:34:50', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (106, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 7, '。。', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 07:41:54', 'seller', 0, 0);
INSERT INTO `chats` VALUES (107, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 7, '1', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 22:39:26', 'seller', 0, 0);
INSERT INTO `chats` VALUES (108, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '11', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 22:56:05', 'seller', 0, 0);
INSERT INTO `chats` VALUES (109, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '11', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 23:26:07', 'seller', 0, 0);
INSERT INTO `chats` VALUES (110, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '11', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-03-25 23:28:36', 'seller', 0, 0);
INSERT INTO `chats` VALUES (111, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 17, '..', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-25 23:29:13', 'buyer', 0, 0);
INSERT INTO `chats` VALUES (112, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '..', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-25 23:37:14', 'seller', 0, 0);
INSERT INTO `chats` VALUES (113, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '??', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-25 23:39:46', 'seller', 0, 0);
INSERT INTO `chats` VALUES (114, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 22, '。。', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-25 23:50:16', 'seller', 0, 0);
INSERT INTO `chats` VALUES (115, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 13, '。。', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-25 23:51:10', 'buyer', 0, 0);

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `module` enum('mutualAid','lostAndFound') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `target_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `parent_id` int NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (1, 'lostAndFound', 'L_12', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '222', NULL, '2025-03-26 08:33:21', 0);
INSERT INTO `comments` VALUES (2, 'lostAndFound', 'L_12', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '333', 1, '2025-03-26 08:33:25', 0);
INSERT INTO `comments` VALUES (3, 'lostAndFound', 'L_12', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '444', 2, '2025-03-26 08:33:31', 0);
INSERT INTO `comments` VALUES (4, 'lostAndFound', 'L_12', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '11', NULL, '2025-03-26 21:19:44', 0);
INSERT INTO `comments` VALUES (5, 'lostAndFound', 'L_12', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '22', 1, '2025-03-26 21:19:49', 0);
INSERT INTO `comments` VALUES (6, 'lostAndFound', 'L_12', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '33', 5, '2025-03-26 21:19:58', 0);
INSERT INTO `comments` VALUES (7, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '11', NULL, '2025-03-28 04:21:03', 0);
INSERT INTO `comments` VALUES (17, 'lostAndFound', 'L_8', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '哈哈', 9, '2025-03-28 04:42:30', 1);
INSERT INTO `comments` VALUES (18, 'lostAndFound', 'L_8', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '111', 7, '2025-03-28 04:42:38', 0);
INSERT INTO `comments` VALUES (29, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '测试', 18, '2025-03-28 05:26:02', 0);
INSERT INTO `comments` VALUES (30, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '哈哈哈', 29, '2025-03-28 05:38:08', 1);
INSERT INTO `comments` VALUES (31, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '11', 18, '2025-03-28 05:39:10', 0);
INSERT INTO `comments` VALUES (32, 'lostAndFound', 'L_8', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '你好', 31, '2025-03-28 05:39:48', 0);
INSERT INTO `comments` VALUES (33, 'lostAndFound', 'L_8', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '22', 0, '2025-03-28 05:45:28', 0);
INSERT INTO `comments` VALUES (34, 'lostAndFound', 'L_8', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '11', 7, '2025-03-28 05:45:36', 0);
INSERT INTO `comments` VALUES (35, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'nihao', 34, '2025-03-28 05:46:14', 1);
INSERT INTO `comments` VALUES (36, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '111', 32, '2025-03-28 05:57:54', 0);
INSERT INTO `comments` VALUES (37, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '222', 32, '2025-03-28 05:58:09', 0);
INSERT INTO `comments` VALUES (38, 'lostAndFound', 'L_8', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '222', 34, '2025-03-28 05:58:30', 0);
INSERT INTO `comments` VALUES (39, 'mutualAid', '14', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '111', 0, '2025-03-28 17:30:49', 0);
INSERT INTO `comments` VALUES (40, 'mutualAid', '14', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '111', 0, '2025-03-29 15:14:39', 0);
INSERT INTO `comments` VALUES (41, 'mutualAid', '17', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '222', 0, '2025-04-21 00:34:42', 1);
INSERT INTO `comments` VALUES (42, 'mutualAid', '16', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1', 0, '2025-04-21 00:56:40', 0);
INSERT INTO `comments` VALUES (43, 'mutualAid', '16', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1', 0, '2025-04-21 00:56:41', 0);
INSERT INTO `comments` VALUES (44, 'mutualAid', '16', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1', 0, '2025-04-21 00:56:42', 0);
INSERT INTO `comments` VALUES (45, 'mutualAid', '16', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1', 0, '2025-04-21 00:56:43', 0);
INSERT INTO `comments` VALUES (46, 'mutualAid', '16', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1', 0, '2025-04-21 00:56:44', 0);
INSERT INTO `comments` VALUES (47, 'mutualAid', '16', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1', 0, '2025-04-21 00:56:45', 0);
INSERT INTO `comments` VALUES (48, 'lostAndFound', 'L_9', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '111', 0, '2025-04-21 07:33:11', 0);
INSERT INTO `comments` VALUES (49, 'lostAndFound', 'L_9', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '222', 0, '2025-04-21 07:33:21', 0);

-- ----------------------------
-- Table structure for job_posts
-- ----------------------------
DROP TABLE IF EXISTS `job_posts`;
CREATE TABLE `job_posts`  (
  `job_id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int NULL DEFAULT NULL,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salary` decimal(10, 2) NOT NULL,
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contact_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` enum('open','closed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'open',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 76 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of job_posts
-- ----------------------------
INSERT INTO `job_posts` VALUES (5, 2, '1', '2', 3.00, '4', '5', 'closed', '2025-03-12 08:43:35', '2025-03-12 08:43:35');
INSERT INTO `job_posts` VALUES (6, 2, '1', '2', 3.00, '4', '5', 'open', '2025-03-12 08:43:41', '2025-03-12 08:43:41');
INSERT INTO `job_posts` VALUES (17, 1, '校园代理', '负责推广产品，联系同学下单', 800.00, '信息楼301', 'agent@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (18, 1, '家教兼职', '为小学生提供数学和英语辅导1', 120.00, '教学楼A202', 'teacher@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-17 05:34:53');
INSERT INTO `job_posts` VALUES (19, 1, '图书馆管理员', '负责整理书籍、帮助借阅', 1000.00, '图书馆服务台', 'library@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (20, 1, '快递站兼职', '帮助快递分拣、通知同学取件', 900.00, '东门快递站', 'express@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (21, 1, '食堂收银员', '负责餐厅收银、点餐服务', 1200.00, '第二食堂收银台', 'canteen@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (22, 1, '校园兼职客服', '解答同学咨询，记录反馈', 950.00, '学生活动中心105', 'service@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (23, 1, '海报设计兼职', '设计校园活动海报，需熟练PS', 1500.00, '艺术学院403', 'design@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (24, 1, '勤工俭学助理', '协助老师整理资料、打印复印', 800.00, '信息楼301', 'assistant@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (25, 1, '实验室助理', '协助老师进行实验、整理实验室', 1100.00, '理科楼504', 'lab@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (26, 1, '宣传推广员', '校园活动推广，社交媒体运营', 700.00, '宣传部办公室', 'media@campus.com', 'open', '2025-03-12 21:58:20', '2025-03-12 21:58:20');
INSERT INTO `job_posts` VALUES (27, 1, '校园代理', '负责推广产品，联系同学下单', 800.00, '信息楼301', 'agent@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-17 05:34:55');
INSERT INTO `job_posts` VALUES (28, 1, '家教兼职', '为小学生提供数学和英语辅导', 120.00, '教学楼A202', 'teacher@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (29, 1, '图书馆管理员', '负责整理书籍、帮助借阅', 1000.00, '图书馆服务台', 'library@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (30, 1, '快递站兼职', '帮助快递分拣、通知同学取件', 900.00, '东门快递站', 'express@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (31, 1, '食堂收银员', '负责餐厅收银、点餐服务', 1200.00, '第二食堂收银台', 'canteen@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (32, 1, '校园兼职客服', '解答同学咨询，记录反馈', 950.00, '学生活动中心105', 'service@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (33, 1, '海报设计兼职', '设计校园活动海报，需熟练PS', 1500.00, '艺术学院403', 'design@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (34, 1, '勤工俭学助理', '协助老师整理资料、打印复印', 800.00, '信息楼301', 'assistant@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (35, 1, '实验室助理', '协助老师进行实验、整理实验室', 1100.00, '理科楼504', 'lab@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (36, 1, '宣传推广员', '校园活动推广，社交媒体运营', 700.00, '宣传部办公室', 'media@campus.com', 'open', '2025-03-12 21:59:47', '2025-03-12 21:59:47');
INSERT INTO `job_posts` VALUES (37, 1, '校园代理', '负责推广产品，联系同学下单', 800.00, '信息楼301', 'agent@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (38, 1, '家教兼职', '为小学生提供数学和英语辅导', 120.00, '教学楼A202', 'teacher@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (39, 1, '图书馆管理员', '负责整理书籍、帮助借阅', 1000.00, '图书馆服务台', 'library@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (40, 1, '快递站兼职', '帮助快递分拣、通知同学取件', 900.00, '东门快递站', 'express@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (41, 1, '食堂收银员', '负责餐厅收银、点餐服务', 1200.00, '第二食堂收银台', 'canteen@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (42, 1, '校园兼职客服', '解答同学咨询，记录反馈', 950.00, '学生活动中心105', 'service@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (43, 1, '海报设计兼职', '设计校园活动海报，需熟练PS', 1500.00, '艺术学院403', 'design@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (44, 1, '勤工俭学助理', '协助老师整理资料、打印复印', 800.00, '信息楼301', 'assistant@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (45, 1, '宣传推广员', '校园活动推广，社交媒体运营', 700.00, '宣传部办公室', 'media@campus.com', 'open', '2025-03-12 22:01:18', '2025-03-12 22:01:18');
INSERT INTO `job_posts` VALUES (46, 1, '校园代理', '负责推广产品，联系同学下单', 800.00, '信息楼301', 'agent@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (47, 1, '家教兼职', '为小学生提供数学和英语辅导', 120.00, '教学楼A202', 'teacher@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (48, 1, '图书馆管理员', '负责整理书籍、帮助借阅', 1000.00, '图书馆服务台', 'library@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (49, 1, '快递站兼职', '帮助快递分拣、通知同学取件', 900.00, '东门快递站', 'express@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (50, 1, '食堂收银员', '负责餐厅收银、点餐服务', 1200.00, '第二食堂收银台', 'canteen@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (51, 1, '校园兼职客服', '解答同学咨询，记录反馈', 950.00, '学生活动中心105', 'service@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (52, 1, '海报设计兼职', '设计校园活动海报，需熟练PS', 1500.00, '艺术学院403', 'design@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (53, 1, '勤工俭学助理', '协助老师整理资料、打印复印', 800.00, '信息楼301', 'assistant@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (54, 1, '实验室助理', '协助老师进行实验、整理实验室', 1100.00, '理科楼504', 'lab@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (55, 1, '宣传推广员', '校园活动推广，社交媒体运营', 700.00, '宣传部办公室', 'media@campus.com', 'open', '2025-03-12 22:01:21', '2025-03-12 22:01:21');
INSERT INTO `job_posts` VALUES (56, 1, '校园代理', '负责推广产品，联系同学下单', 800.00, '信息楼301', 'agent@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (57, 1, '家教兼职', '为小学生提供数学和英语辅导', 120.00, '教学楼A202', 'teacher@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (58, 1, '图书馆管理员', '负责整理书籍、帮助借阅', 1000.00, '图书馆服务台', 'library@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (59, 1, '快递站兼职', '帮助快递分拣、通知同学取件', 900.00, '东门快递站', 'express@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (60, 1, '食堂收银员', '负责餐厅收银、点餐服务', 1200.00, '第二食堂收银台', 'canteen@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (61, 1, '校园兼职客服', '解答同学咨询，记录反馈', 950.00, '学生活动中心105', 'service@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (62, 1, '海报设计兼职', '设计校园活动海报，需熟练PS', 1500.00, '艺术学院403', 'design@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (63, 1, '勤工俭学助理', '协助老师整理资料、打印复印', 800.00, '信息楼301', 'assistant@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (64, 1, '实验室助理', '协助老师进行实验、整理实验室', 1100.00, '理科楼504', 'lab@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (65, 1, '宣传推广员', '校园活动推广，社交媒体运营', 700.00, '宣传部办公室', 'media@campus.com', 'open', '2025-03-12 22:02:30', '2025-03-12 22:02:30');
INSERT INTO `job_posts` VALUES (66, 1, '校园代理', '负责推广产品，联系同学下单', 800.00, '信息楼301', 'agent@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (67, 1, '家教兼职', '为小学生提供数学和英语辅导', 120.00, '教学楼A202', 'teacher@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (68, 1, '图书馆管理员', '负责整理书籍、帮助借阅', 1000.00, '图书馆服务台', 'library@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-17 05:04:53');
INSERT INTO `job_posts` VALUES (69, 1, '快递站兼职', '帮助快递分拣、通知同学取件', 900.00, '东门快递站', 'express@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (70, 1, '食堂收银员', '负责餐厅收银、点餐服务', 1200.00, '第二食堂收银台', 'canteen@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (71, 1, '校园兼职客服', '解答同学咨询，记录反馈', 950.00, '学生活动中心105', 'service@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (72, 1, '海报设计兼职', '设计校园活动海报，需熟练PS', 1500.00, '艺术学院403', 'design@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (73, 1, '勤工俭学助理', '协助老师整理资料、打印复印', 800.00, '信息楼301', 'assistant@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (74, 1, '实验室助理', '协助老师进行实验、整理实验室', 1100.00, '理科楼504', 'lab@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');
INSERT INTO `job_posts` VALUES (75, 1, '宣传推广员', '校园活动推广，社交媒体运营', 700.00, '宣传部办公室', 'media@campus.com', 'open', '2025-03-12 22:03:09', '2025-03-12 22:03:09');

-- ----------------------------
-- Table structure for lostrecords
-- ----------------------------
DROP TABLE IF EXISTS `lostrecords`;
CREATE TABLE `lostrecords`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键，自增',
  `openid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '微信用户唯一标识',
  `itemName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '物品名称',
  `fileList` json NULL COMMENT '文件列表，存储图片/视频的 JSON 数据',
  `lostPath` json NULL COMMENT '丢失轨迹路径，存储标记点数组',
  `time` datetime NULL DEFAULT NULL COMMENT '丢失时间',
  `claimMethod` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '认领方式',
  `contact` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系电话',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注信息',
  `reward` enum('无','面议','输入') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '无' COMMENT '酬金选项',
  `rewardAmount` decimal(10, 2) NULL DEFAULT NULL COMMENT '酬金金额',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lostrecords
-- ----------------------------
INSERT INTO `lostrecords` VALUES (8, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'U盘', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741208600391.jpg\", \"type\": \"image\"}]', '[{\"color\": \"#204dad9a\", \"width\": 2, \"points\": [{\"latitude\": 23.25958924225095, \"longitude\": 113.45772637088952}, {\"latitude\": 23.259278468739396, \"longitude\": 113.45795760580052}, {\"latitude\": 23.25936580796675, \"longitude\": 113.45736808279594}]}]', '2025-03-27 04:22:00', '自提', '13635743531', '找到请联系电话', '输入', 1.00, '2025-03-29 04:21:48');
INSERT INTO `lostrecords` VALUES (9, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1钥匙1', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741208600391.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1745275679629.png\", \"type\": \"image\"}]', '[{\"color\": \"#204dad9a\", \"width\": 2, \"points\": [{\"latitude\": 23.25958924225095, \"longitude\": 113.45772637088952}, {\"latitude\": 23.259278468739396, \"longitude\": 113.45795760580052}, {\"latitude\": 23.25936580796675, \"longitude\": 113.45736808279594}, {\"latitude\": 23.26012991805421, \"longitude\": 113.45583206541984}]}]', '2025-03-06 00:00:00', '联系我自1111提', '13635743531', '找到请联系电话', '面议', NULL, '2025-03-29 04:23:53');
INSERT INTO `lostrecords` VALUES (11, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '1', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741745736417.jpg\", \"type\": \"image\"}]', '[{\"color\": \"#204dad9a\", \"width\": 2, \"points\": [{\"latitude\": 23.25841144566949, \"longitude\": 113.4554933278738}, {\"latitude\": 23.26012510984001, \"longitude\": 113.4558818200312}, {\"latitude\": 23.25873290154891, \"longitude\": 113.4592818500812}, {\"latitude\": 23.25734542110421, \"longitude\": 113.45694800059788}]}]', '2025-03-12 00:00:00', '2', '3', '4', '无', NULL, '2025-03-12 10:15:41');
INSERT INTO `lostrecords` VALUES (12, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '1', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741745835839.jpg\", \"type\": \"image\"}]', '[{\"color\": \"#204dad9a\", \"width\": 2, \"points\": [{\"latitude\": 23.258322310239556, \"longitude\": 113.45611508068988}, {\"latitude\": 23.260482024972355, \"longitude\": 113.45594023831212}, {\"latitude\": 23.25764886273457, \"longitude\": 113.45741659174077}]}]', '2025-03-12 00:00:00', '3', '4', '5', '无', NULL, '2025-03-12 10:17:25');

-- ----------------------------
-- Table structure for mutual_aid
-- ----------------------------
DROP TABLE IF EXISTS `mutual_aid`;
CREATE TABLE `mutual_aid`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '唯一ID',
  `openid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '微信用户唯一标识',
  `images` json NULL COMMENT '存储图片/视频JSON数组',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '互助内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of mutual_aid
-- ----------------------------
INSERT INTO `mutual_aid` VALUES (1, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741460004925.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1742254183916.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1742999405677-695145661.mp4\", \"type\": \"video\"}]', '5.19号下午三点 广州南站拼车回广州理工 ', '2025-03-12 19:24:00', '2025-03-26 22:30:08');
INSERT INTO `mutual_aid` VALUES (2, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741448081408.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741448081408.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1742254065903.mp4\", \"type\": \"video\"}]', '测试', '2025-03-17 06:37:16', '2025-03-18 07:27:48');
INSERT INTO `mutual_aid` VALUES (3, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741448081408.jpg\", \"name\": \"file-0\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741448086408.mp4\", \"name\": \"file-1\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1742253621905.jpg\", \"type\": \"image\"}]', '测试2', '2025-03-18 00:00:08', '2025-03-18 07:20:24');
INSERT INTO `mutual_aid` VALUES (5, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741448081408.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741448086408.mp4\", \"type\": \"video\"}]', '测试4', '2025-03-18 00:00:25', '2025-03-18 00:00:46');
INSERT INTO `mutual_aid` VALUES (6, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741448081408.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1742296826621.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1742296830441.mp4\", \"type\": \"video\"}]', '测试5', '2025-03-18 00:00:29', '2025-03-18 19:20:32');
INSERT INTO `mutual_aid` VALUES (8, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745163192999.png\", \"type\": \"image\"}]', '11', '2025-03-19 02:26:35', '2025-04-20 23:33:13');
INSERT INTO `mutual_aid` VALUES (11, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[]', '111', '2025-03-19 02:29:02', '2025-03-19 02:29:02');
INSERT INTO `mutual_aid` VALUES (14, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745163178538.jpg\", \"type\": \"image\"}]', '221saasdasas2', '2025-03-19 02:57:52', '2025-04-20 23:32:58');
INSERT INTO `mutual_aid` VALUES (16, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745162263651.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1745162281339.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1745163162250.jpg\", \"type\": \"image\"}]', '22', '2025-04-20 06:23:03', '2025-04-20 23:32:42');
INSERT INTO `mutual_aid` VALUES (17, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '[]', '11', '2025-04-21 00:34:28', '2025-04-21 00:34:28');

-- ----------------------------
-- Table structure for pickrecords
-- ----------------------------
DROP TABLE IF EXISTS `pickrecords`;
CREATE TABLE `pickrecords`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '记录唯一标识，自增',
  `openid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '微信用户唯一标识',
  `itemName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '物品名称',
  `fileList` json NOT NULL COMMENT '文件列表，存储图片/视频的 JSON 数据',
  `location` json NOT NULL COMMENT '拾取地点，包括经纬度和名称',
  `time` datetime NOT NULL COMMENT '拾取时间',
  `claimMethod` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '认领方式',
  `contact` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '联系电话',
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注信息',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pickrecords
-- ----------------------------
INSERT INTO `pickrecords` VALUES (15, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '钥匙', '[{\"url\": \"http://127.0.0.1:3000/uploads/1743229525211.png\", \"type\": \"image\"}]', '{\"id\": 0, \"title\": \"选中位置\", \"width\": 32, \"height\": 32, \"iconPath\": \"/static/image/7.png\", \"latitude\": 23.25879971158144, \"longitude\": 113.45795150343406}', '2025-03-27 00:00:00', '联系我后我去取', '13513463731', '找到请联系我', '2025-03-27 03:36:13');
INSERT INTO `pickrecords` VALUES (16, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '11', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741206582684.mp4\", \"type\": \"video\"}]', '{\"id\": 0, \"title\": \"选中位置\", \"width\": 32, \"height\": 32, \"iconPath\": \"/static/image/7.png\", \"latitude\": 23.25942891253753, \"longitude\": 113.45817437873166}', '2025-03-06 00:00:00', 'aa', 'aa', 'aa', '2025-03-06 04:29:57');
INSERT INTO `pickrecords` VALUES (17, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '11', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741207182417.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741207187238.mp4\", \"type\": \"video\"}]', '{\"id\": 0, \"title\": \"选中位置\", \"width\": 32, \"height\": 32, \"iconPath\": \"/static/image/7.png\", \"latitude\": 23.25916182033659, \"longitude\": 113.45685398795035}', '2025-03-06 00:00:00', '111', '111', '11111啊啊', '2025-03-06 04:40:03');
INSERT INTO `pickrecords` VALUES (18, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '11', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741207182417.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741207187238.mp4\", \"type\": \"video\"}]', '{\"id\": 0, \"title\": \"选中位置\", \"width\": 32, \"height\": 32, \"iconPath\": \"/static/image/7.png\", \"latitude\": 23.25916182033659, \"longitude\": 113.45685398795035}', '2025-03-06 00:00:00', '111', '111', '111aaa1', '2025-03-07 04:13:11');
INSERT INTO `pickrecords` VALUES (19, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1112', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741299823033.mp4\", \"type\": \"video\"}]', '{\"id\": 0, \"title\": \"选中位置\", \"width\": 32, \"height\": 32, \"iconPath\": \"/static/image/7.png\", \"latitude\": 23.258215158079285, \"longitude\": 113.45724174966529}', '2025-03-07 00:00:00', 'aaas', '110', '222', '2025-03-07 06:24:03');
INSERT INTO `pickrecords` VALUES (20, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '11', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741744248211.png\", \"type\": \"image\"}]', '{\"id\": 0, \"title\": \"选中位置\", \"width\": 32, \"height\": 32, \"iconPath\": \"/static/image/7.png\", \"latitude\": 23.259143302672015, \"longitude\": 113.45856287095204}', '2025-03-12 00:00:00', '2', '3', '4', '2025-03-12 09:51:00');

-- ----------------------------
-- Table structure for runner_applications
-- ----------------------------
DROP TABLE IF EXISTS `runner_applications`;
CREATE TABLE `runner_applications`  (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_card` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` enum('待审核','已通过','已拒绝') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '待审核',
  `rejection_reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `reviewer_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`application_id`) USING BTREE,
  INDEX `openid`(`openid` ASC) USING BTREE,
  INDEX `reviewer_id`(`reviewer_id` ASC) USING BTREE,
  CONSTRAINT `runner_applications_ibfk_1` FOREIGN KEY (`openid`) REFERENCES `users` (`openid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `runner_applications_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `admin` (`admin_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of runner_applications
-- ----------------------------
INSERT INTO `runner_applications` VALUES (1, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '刘志宏', '13456789241', '20210411', '已通过', NULL, '2025-03-17 04:56:00', '2025-03-17 04:56:25', 1);
INSERT INTO `runner_applications` VALUES (12, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'lzh小号', '13113489241', '2021', '已通过', NULL, '2025-03-12 08:20:44', '2025-03-12 08:21:19', 1);

-- ----------------------------
-- Table structure for second_hand_trades
-- ----------------------------
DROP TABLE IF EXISTS `second_hand_trades`;
CREATE TABLE `second_hand_trades`  (
  `trade_id` int NOT NULL AUTO_INCREMENT COMMENT '交易唯一标识',
  `seller_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '卖家openid',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '商品描述',
  `category` enum('电子产品','学习用品','生活用品','运动用品','其他') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '电子产品' COMMENT '商品类别，如书籍、电子设备',
  `price` decimal(10, 2) NOT NULL COMMENT '商品价格',
  `status` enum('可交易','交易中','交易完成','已取消','已下架') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '可交易' COMMENT '商品状态',
  `fileList` json NULL COMMENT '商品的图片/视频',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  `buyer_confirm` tinyint(1) NULL DEFAULT 0 COMMENT '买家确认收货（0-未确认，1-已确认）',
  `seller_confirm` tinyint(1) NULL DEFAULT 0 COMMENT '卖家确认收货（0-未确认，1-已确认）',
  `buyer_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `update_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`trade_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 50 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '校园二手交易表，用于记录商品交易信息' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of second_hand_trades
-- ----------------------------
INSERT INTO `second_hand_trades` VALUES (7, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '22', '11', '电子产品', 22.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741448081408.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741448086408.mp4\", \"type\": \"video\"}]', '2025-03-08 23:34:52', 0, 0, NULL, '2025-03-08 23:51:51');
INSERT INTO `second_hand_trades` VALUES (8, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '视频', '演示', '学习用品', 99.00, '交易完成', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741455557895.mp4\", \"type\": \"video\"}]', '2025-03-09 01:39:23', 1, 1, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 04:57:11');
INSERT INTO `second_hand_trades` VALUES (10, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '22', '223333', '运动用品', 11.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741461041735.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741461041757.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1744924570139.png\", \"type\": \"image\"}]', '2025-03-09 03:10:50', 0, 0, NULL, '2025-04-18 06:42:02');
INSERT INTO `second_hand_trades` VALUES (11, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '11', '22啊啊', '电子产品', 33.00, '已下架', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741461336019.jpg\", \"type\": \"image\"}]', '2025-03-09 03:15:40', 0, 0, NULL, '2025-03-10 02:52:35');
INSERT INTO `second_hand_trades` VALUES (12, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'aaa啊', '啊啊啊', '学习用品', 2.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741461388939.png\", \"type\": \"image\"}]', '2025-03-09 03:16:32', 0, 0, NULL, '2025-04-18 07:43:00');
INSERT INTO `second_hand_trades` VALUES (13, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '测试', '看到请联系', '其他', 999.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741471159536.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471159541.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471165163.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471170898.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471175540.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471175557.jpg\", \"type\": \"image\"}]', '2025-03-09 05:59:43', 0, 0, '', '2025-03-12 23:52:53');
INSERT INTO `second_hand_trades` VALUES (14, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '22', '22', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741479373500.png\", \"type\": \"image\"}]', '2025-03-09 08:16:17', 0, 0, NULL, '2025-04-18 07:55:05');
INSERT INTO `second_hand_trades` VALUES (15, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '测试11223', '看到请联系', '其他', 999.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741471159536.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471159541.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471165163.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471170898.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471175540.png\", \"type\": \"image\"}]', '2025-03-09 08:20:59', 0, 0, NULL, '2025-04-18 07:42:59');
INSERT INTO `second_hand_trades` VALUES (17, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '测2啊啊1111a啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊', '看到请联系111111111', '学习用品', 12222.10, '交易完成', '[{\"url\": \"http://127.0.0.1:3000/uploads/1741471159536.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471159541.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471170898.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1741471175540.png\", \"type\": \"image\"}]', '2025-03-09 08:21:32', 1, 1, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-03-25 07:20:29');
INSERT INTO `second_hand_trades` VALUES (21, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '22222222222222222222222222222222222222222222222222222222222222', '11', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1743007314124.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743007314118.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743008795822.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743009017773.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218433.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218438.jpg\", \"type\": \"image\"}]', '2025-03-10 01:02:41', 0, 0, NULL, '2025-06-06 05:01:07');
INSERT INTO `second_hand_trades` VALUES (22, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '33', '2211', '电子产品', 11.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1743007314124.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743007314118.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743008795822.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743009017773.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218433.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218438.jpg\", \"type\": \"image\"}]', '2025-03-10 01:03:18', 0, 0, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2025-06-07 23:40:13');
INSERT INTO `second_hand_trades` VALUES (24, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'ces', 'ces', '电子产品', 111.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1744929750785.png\", \"type\": \"image\"}]', '2025-04-18 06:42:35', 0, 0, NULL, '2025-06-06 05:06:58');
INSERT INTO `second_hand_trades` VALUES (25, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '1', '2', '电子产品', 22.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1744929997605.png\", \"type\": \"image\"}]', '2025-04-18 06:46:41', 0, 0, NULL, '2025-06-08 09:10:26');
INSERT INTO `second_hand_trades` VALUES (26, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2', '1', '电子产品', 3.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1744932132238.jpg\", \"type\": \"image\"}]', '2025-04-18 07:22:14', 0, 0, NULL, '2025-06-08 09:12:16');
INSERT INTO `second_hand_trades` VALUES (27, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '222', '1ww', '电子产品', 213.00, '已下架', '[{\"url\": \"http://127.0.0.1:3000/uploads/1744932570813.png\", \"type\": \"image\"}]', '2025-04-18 07:29:35', 0, 0, NULL, '2025-04-18 07:43:02');
INSERT INTO `second_hand_trades` VALUES (28, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '21', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 1, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 05:06:53');
INSERT INTO `second_hand_trades` VALUES (29, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '222', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 05:06:56');
INSERT INTO `second_hand_trades` VALUES (30, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '233', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 05:07:06');
INSERT INTO `second_hand_trades` VALUES (31, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '224', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 05:07:03');
INSERT INTO `second_hand_trades` VALUES (32, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '225', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 05:07:09');
INSERT INTO `second_hand_trades` VALUES (33, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '226', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 05:07:12');
INSERT INTO `second_hand_trades` VALUES (34, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '236', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-06 05:07:15');
INSERT INTO `second_hand_trades` VALUES (35, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '262', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-07 23:45:55');
INSERT INTO `second_hand_trades` VALUES (36, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '232', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-07 23:45:58');
INSERT INTO `second_hand_trades` VALUES (37, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '22342', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-07 23:46:00');
INSERT INTO `second_hand_trades` VALUES (38, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '223423', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-07 23:46:03');
INSERT INTO `second_hand_trades` VALUES (39, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '141', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-07 23:46:05');
INSERT INTO `second_hand_trades` VALUES (40, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '12', '3', '电子产品', 33.00, '交易中', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2025-06-07 23:46:07');
INSERT INTO `second_hand_trades` VALUES (41, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '2124124', '3', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, NULL, '2025-06-08 09:24:23');
INSERT INTO `second_hand_trades` VALUES (42, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '12', '3', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, NULL, NULL);
INSERT INTO `second_hand_trades` VALUES (43, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '124', '3', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, NULL, NULL);
INSERT INTO `second_hand_trades` VALUES (44, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '21241', '3', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, NULL, NULL);
INSERT INTO `second_hand_trades` VALUES (45, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '124', '3', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, NULL, NULL);
INSERT INTO `second_hand_trades` VALUES (46, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '242112', '3', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, NULL, NULL);
INSERT INTO `second_hand_trades` VALUES (47, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '12141', '3', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1745101427188.png\", \"type\": \"image\"}]', '2025-04-20 06:23:50', 0, 0, NULL, NULL);
INSERT INTO `second_hand_trades` VALUES (48, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2412', '11', '电子产品', 33.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1743007314124.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743007314118.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743008795822.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743009017773.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218433.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218438.jpg\", \"type\": \"image\"}]', '2025-03-10 01:02:41', 0, 0, NULL, '2025-06-06 05:01:07');
INSERT INTO `second_hand_trades` VALUES (49, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '2412', '2211', '电子产品', 11.00, '可交易', '[{\"url\": \"http://127.0.0.1:3000/uploads/1743007314124.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743007314118.mp4\", \"type\": \"video\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743008795822.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743009017773.jpg\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218433.png\", \"type\": \"image\"}, {\"url\": \"http://127.0.0.1:3000/uploads/1743155218438.jpg\", \"type\": \"image\"}]', '2025-03-10 01:03:18', 0, 0, NULL, '2025-06-06 04:57:21');

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks`  (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `runner_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `task_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `task_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `reward` decimal(10, 2) NOT NULL,
  `status` enum('待接单','进行中','已完成','已取消') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '待接单',
  `pickup_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `delivery_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`openid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tasks
-- ----------------------------
INSERT INTO `tasks` VALUES (1, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '', '奶茶', '取餐号9999', 4.00, '待接单', '瑞辛咖啡', '19栋宿舍楼', '2025-03-10 05:11:28', '2025-03-19 23:21:13');
INSERT INTO `tasks` VALUES (3, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '', '寄快递', '货号1199', 3.00, '待接单', '19栋宿舍楼', '34栋快递站', '2025-03-11 03:31:14', '2025-03-12 21:40:26');
INSERT INTO `tasks` VALUES (4, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', NULL, '米饭', '你来选', 5.00, '待接单', '二饭', '19栋宿舍楼', '2025-03-11 06:44:48', '2025-03-12 21:38:25');
INSERT INTO `tasks` VALUES (5, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '猪喷', '外卖自提单号002', 5.00, '进行中', '三饭', '19栋宿舍楼', '2025-03-11 06:44:55', '2025-03-12 21:39:18');
INSERT INTO `tasks` VALUES (6, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '', '汉堡', '取餐号110', 4.00, '待接单', '五饭', '19栋宿舍楼', '2025-03-11 06:45:00', '2025-03-12 21:38:57');
INSERT INTO `tasks` VALUES (7, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '代拿快递', '重物，取件码234', 10.00, '已完成', '34栋快递站', '19栋a', '2025-03-11 06:45:37', '2025-03-12 21:39:37');
INSERT INTO `tasks` VALUES (9, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '代拿快递', '取件码123', 1.00, '已完成', '桥门快递站', '19栋宿舍楼', '2025-03-11 21:02:21', '2025-03-26 00:12:59');
INSERT INTO `tasks` VALUES (10, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', NULL, '代拿快递', '取件码4637', 2.00, '待接单', '35栋快递站', '19栋宿舍楼', '2025-03-11 21:02:27', '2025-03-12 21:39:47');
INSERT INTO `tasks` VALUES (11, 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', '代拿快递', '取件码43724', 3.00, '进行中', '35栋快递站', '19栋宿舍楼', '2025-03-11 21:02:32', '2025-03-26 00:12:25');
INSERT INTO `tasks` VALUES (12, 'oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'oWpvM5Xdby_dxlQlLCSpaeyuG-CI', '代拿快递', '取件码2342', 5.00, '已完成', '34栋快递站', '19栋宿舍楼', '2025-03-12 08:16:08', '2025-03-12 21:39:54');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `openid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '微信用户唯一标识，作为主键',
  `avatarUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户头像的 URL',
  `nickName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户手机号',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '用户注册时间',
  PRIMARY KEY (`openid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('2', 'http://tmp/eQzfta1B2OSr5dd75bada270aae2fe63fdf8a54aeff2.png', 'nm', NULL, '2025-02-13 06:23:52');
INSERT INTO `users` VALUES ('oWpvM5f_e4aR1JgKuk_zlucLyIw4', 'http://127.0.0.1:3000/uploads/1743120388800.jpg', '微信用户', NULL, '2025-03-05 04:26:53');
INSERT INTO `users` VALUES ('oWpvM5Xdby_dxlQlLCSpaeyuG-CI', 'http://127.0.0.1:3000/uploads/1740148304561.png', '　初', '2222', '2025-02-19 22:47:09');

SET FOREIGN_KEY_CHECKS = 1;
