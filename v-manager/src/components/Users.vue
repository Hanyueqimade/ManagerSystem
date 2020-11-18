<template>
  <div>
    <a-breadcrumb style="margin: 16px 0" separator=">">
      <a-breadcrumb-item style="font-weight: 700; color: #000"
        >首页</a-breadcrumb-item
      >
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>用户列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '800px' }">
      <a-form>
        <a-row>
          <a-col :span="10">
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="20">
                <a-input-search
                  size="large"
                  v-model:value="value"
                  placeholder="请输入内容"
                />
              </a-col>
              <a-col class="gutter-row" :span="4">
                <a-button type="primary" block size="large">添加用户</a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格 -->
      <a-table
        :row-key="(record) => record.id"
        :columns="tableColumns"
        :data-source="tableData"
        bordered
      >
        <template #mg_state="{ text }">
          <a-switch v-model:checked="text.mg_state" />
        </template>
        <template #operation="{  }">
          <a-button type="primary">
            <EditOutlined />
          </a-button>
          <!-- 删除 -->
          <a-button type="danger" style="margin: 0 10px">
            <DeleteOutlined
          /></a-button>
          <!-- 权限 -->
          <a-button
            type="default"
            style="background-color: #e6a23c; color: #fff"
          >
            <SettingOutlined
          /></a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";

// 引入请求方法 httpGet
import { httpGet } from "@/utils/http";
// 引入请求路径
import { user } from "@/api";
export default {
  data() {
    return {
      tableData: [],
      tableColumns: [
        {
          title: "#",
          dataIndex: "index",
          key: "index",
        },
        {
          title: "姓名",
          dataIndex: "username",
          key: "username",
        },
        {
          title: "邮箱",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "电话",
          dataIndex: "mobile",
          key: "mobile",
        },
        {
          title: "角色",
          dataIndex: "role_name",
          key: "role_name",
        },
        {
          title: "状态",
          key: "mg_state",
          slots: { customRender: "mg_state" },
        },
        {
          title: "操作",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
    };
  },
  components: {
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
  },
  created() {
    this.GetUsers();
  },
  methods: {
    GetUsers() {
      httpGet(user.GetUsers, {
        pagenum: 1,
        pagesize: 2,
      })
        .then((response) => {
          let { data, meta } = response;

          if (meta.status == 200) {
            this.tableData = data.users;
            this.tableData.forEach((element, index) => {
              element.index = index + 1;
            });
          }
          console.log(this.tableData);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>