<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <span style="color: #fff">后台管理系统</span>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :openKeys="openKeys"
        @openChange="onOpenChange"
      >
        <a-sub-menu v-for="item in menuList" :key="item.id">
          <template #title v-if="item.path == 'users'">
            <span
              ><user-outlined /><span>{{ item.authName }}</span></span
            >
          </template>
          <template #title v-else-if="item.path == 'rights'">
            <span
              ><CodeSandboxOutlined /><span>{{ item.authName }}</span></span
            >
          </template>
          <template #title v-else-if="item.path == 'goods'">
            <span
              ><ShoppingOutlined /><span>{{ item.authName }}</span></span
            >
          </template>
          <template #title v-else-if="item.path == 'orders'">
            <span
              ><ContainerOutlined /><span>{{ item.authName }}</span></span
            >
          </template>
          <template #title v-else-if="item.path == 'reports'">
            <span
              ><AreaChartOutlined /><span>{{ item.authName }}</span></span
            >
          </template>

          <a-menu-item v-for="subitem in item.children" :key="subitem.id">
            <appstore-outlined />
            <router-link :to="subitem.path" style="color: #fff; display: inline">{{
              subitem.authName
            }}</router-link>
          </a-menu-item>
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
        <a-button style="float: right; margin: 16px 24px" @click="handleBack">
          退出</a-button
        >
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
  ShoppingOutlined,
  ContainerOutlined,
  AreaChartOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons-vue";

// 引入请求方法 httpGet
import { httpGet } from "@/utils/http";
// 引入请求路径
import { rights } from "@/api";

export default {
  components: {
    UserOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    ContainerOutlined,
    AreaChartOutlined,
    CodeSandboxOutlined,
  },
  data() {
    return {
      collapsed: false,
      // selectedKeys: ['1'],
      // 侧边栏菜单
      menuList: [],
      // 默认打开的那一项
      openKeys: [],
      // 所有项
      rootSubmenuKeys: [],
    };
  },

  created() {
    this.getMenuList();
  },

  methods: {
    // 退出
    handleBack() {
      // 删除token
      window.sessionStorage.removeItem("token");
      // 跳转页面到login
      this.$router.push("/login");
    },
    getMenuList() {
      httpGet(rights.AsideMenus)
        .then((response) => {
          let { data, meta } = response;

          // console.log(data, meta);

          if (meta.status == 200) {
            this.menuList = data;

            // 保存一级菜单id
            this.menuList.forEach((item) => {
              this.rootSubmenuKeys.push(item.id);
            });
            // console.log(this.rootSubmenuKeys)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
     // 点击当前 关闭其他菜单
     onOpenChange(openKeys) {
      //  获取最后一次选中的openKey
      const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
      // 如果最后一次openkye在rootSubmenuKey中找不到
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        // 就把点击的哪个openkey放到默认打开的那个数组
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  },
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

.trigger {
  display: inline-block;
  margin-left: 20px;
}
</style>
