<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <span style="color: #fff">后台管理系统</span>
        
      </div>
      <a-menu theme="dark" v-model:selectedKeys="selectedKeys" mode="inline">
        <a-sub-menu key="sub1">
          <template #title>
            <span><user-outlined /><span>用户管理</span></span>
          </template>
          
          <a-menu-item key="1"><appstore-outlined /> <router-link to="userlist">用户列表</router-link> </a-menu-item>
        </a-sub-menu>
        
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <a-button style="float:right; margin: 16px 24px;" @click="handleBack"> 退出</a-button>
      </a-layout-header>


      <a-layout-content style="margin: 0 16px">
      <router-view></router-view>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";

export default {
  components: {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    AppstoreOutlined,
  },
  data() {
    return {
      collapsed: false,
      // selectedKeys: ['1'],
    };
  },
  methods:{
    handleBack(){
      window.sessionStorage.removeItem("token")
      this.$router.push("/login")
    }
  }
};
</script>

<style>
#components-layout-demo-side .logo {
  height: 30px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px;
  overflow: hidden;
}

.logo img {
  width: 25px;
  margin-right: 20px;
  margin-left: 10px;
}

.trigger{
  display: inline-block;
  margin-left: 20px;
}
</style>
