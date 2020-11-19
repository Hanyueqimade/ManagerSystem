<template>
  <div>
    <a-breadcrumb style="margin: 16px 0" separator=">">
      <a-breadcrumb-item style="font-weight: 700; color: #000"
        >首页</a-breadcrumb-item
      >
      <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      <a-breadcrumb-item>用户列表</a-breadcrumb-item>
    </a-breadcrumb>
    <div
      :style="{
        padding: '24px',
        background: '#fff',
        minHeight: '600px',
      }"
    >
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
                <a-button
                  type="primary"
                  block
                  size="large"
                  @click="showUserModal"
                  >添加用户</a-button
                >
                <a-modal
                  title="添加用户"
                  concelText="取消"
                  okText="确定"
                  v-model:visible="visible"
                  :confirm-loading="confirmLoading"
                >
                  <a-form>
                    <a-row>
                      <a-col :span="24">
                        <a-form-item
                          required
                          label="用户名"
                          has-feedback
                          name="username"
                          :wrapperCol="{ span: 20 }"
                          :labelCol="{ span: 4 }"
                        >
                          <a-input type="text" />
                        </a-form-item>
                        <a-form-item
                          required
                          label="密码"
                          has-feedback
                          name="password"
                          :wrapperCol="{ span: 20 }"
                          :labelCol="{ span: 4 }"
                        >
                          <a-input-password type="password" />
                        </a-form-item>
                        <a-form-item
                          required
                          label="邮箱"
                          has-feedback
                          name="email"
                          :labelCol="{ span: 4 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input type="text" />
                        </a-form-item>
                        <a-form-item
                          required
                          label="手机号"
                          has-feedback
                          name="mobile"
                          :labelCol="{ span: 4 }"
                          :wrapperCol="{ span: 20 }"
                        >
                          <a-input type="text" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </a-modal>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格 -->
      <a-table
        style="margin: 20px 0"
        :row-key="(record) => record.id"
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        bordered
      >
        <template #mg_state="{ text }">
          <a-switch v-model:checked="text.mg_state" />
        </template>
        <template #operation="{}">
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

      <a-pagination
        show-size-changer
        v-model:current="current"
        :show-total="(total) => `总数 ${total} 条`"
        :total="total"
        :defaultPageSize="2"
        @showSizeChange="onShowSizeChange"
        :page-size-options="pageSizeOptions"
        @change="onPageChange"
        show-quick-jumper 
      />
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
      pageSizeOptions: ["1", "2", "5", "10"],
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
      total: 0,
      current: 1,
      // pagesize: 2,
      visible: false,
      confirmLoading: false,
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
    GetUsers(pagenum = 1, pagesize = 2) {
      httpGet(user.GetUsers, {
        pagenum: pagenum,
        pagesize: pagesize,
      })
        .then((response) => {
          let { data, meta } = response;

          if (meta.status == 200) {
            this.tableData = data.users;
            this.total = data.total;
            this.current = data.pagenum;
            console.log(data);
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
    onShowSizeChange(current, pageSize) {
      this.GetUsers(current, pageSize);
      console.log(current, pageSize);
    },
    onPageChange(page, pageSize) {
      this.GetUsers(page, pageSize);
    },
    showUserModal() {
      this.visible = true;
    },
    // handleOk() {
    //   this.confirmLoading = true;
    //   setTimeout(() => {
    //     this.visible = false;
    //   }, 2000);
    // },
  },
};
</script>

<style>
</style>