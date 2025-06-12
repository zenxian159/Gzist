<template>
  <el-container>
    <el-aside width="200px">
      <el-menu router>
        <el-menu-item index="/home">仪表盘</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>后台管理系统</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue";
</script>
