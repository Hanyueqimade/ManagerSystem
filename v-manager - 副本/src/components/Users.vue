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
                  v-model:value="searchUser"
                  @search="GetUsers"
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
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>
      <!-- 添加用户弹出框 -->
      <a-modal
        title="添加用户"
        cancelText="取消"
        okText="确定"
        @ok="AddUser"
        @cancel="CancelUser"
        v-model:visible="visible"
      >
        <a-form ref="ruleForm" :model="form" :rules="rules">
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
                <a-input type="text" v-model:value="form.username" />
              </a-form-item>
              <a-form-item
                required
                label="密码"
                has-feedback
                name="password"
                :wrapperCol="{ span: 20 }"
                :labelCol="{ span: 4 }"
              >
                <a-input-password
                  type="password"
                  v-model:value="form.password"
                />
              </a-form-item>
              <a-form-item
                label="邮箱"
                name="email"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }"
              >
                <a-input type="text" v-model:value="form.email" />
              </a-form-item>
              <a-form-item
                label="手机号"
                name="mobile"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }"
              >
                <a-input type="text" v-model:value="form.mobile" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
      <!-- 修改用户弹出框 -->
      <a-modal
        title="编辑用户"
        cancelText="取消"
        okText="确定"
        @ok="updateUser"
        @cancel="cancelUp"
        v-model:visible="Editvisible"
      >
        <a-form ref="ruleEditForm" :model="Editform" :rules="Editrules">
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="用户名"
                name="username"
                :wrapperCol="{ span: 20 }"
                :labelCol="{ span: 4 }"
              >
                <a-input
                  type="text"
                  v-model:value="Editform.username"
                  disabled
                />
              </a-form-item>
              <a-form-item
                label="邮箱"
                name="email"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }"
              >
                <a-input type="text" v-model:value="Editform.email" />
              </a-form-item>
              <a-form-item
                label="手机号"
                name="mobile"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 20 }"
              >
                <a-input type="text" v-model:value="Editform.mobile" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
      <!-- 修改用户角色弹出框 -->
      <a-modal
        title="分配角色"
        cancelText="取消"
        okText="确定"
        v-model:visible="ModifyVisible"
        @ok="modifyEditRole"
      >
        <p>用户名:{{ userInfo.username }}</p>
        <p>当前角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <a-select
            v-model:value="roleSelected"
            style="width: 120px"
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in userList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.roleName }}
            </a-select-option>
          </a-select>
        </p>
      </a-modal>
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
          <a-switch
            v-model:checked="text.mg_state"
            :id="text.id"
            @change="ModifyState"
          />
        </template>

        <template #operation="{ text }">
          <!-- 修改 -->
          <a-button type="primary" @click="EditUser(text.id)">
            <EditOutlined />
          </a-button>
          <!-- 删除 -->
          <a-button
            type="danger"
            style="margin: 0 10px"
            @click="DeleteUser(text.id)"
          >
            <DeleteOutlined
          /></a-button>
          <!-- 权限 -->
          <a-button
            type="default"
            style="background-color: #e6a23c; color: #fff"
            @click="modifyRole(text)"
          >
            <SettingOutlined
          /></a-button>
        </template>
      </a-table>

      <a-pagination
        show-size-changer
        v-model:current="current"
        v-model:pageSize="pagesize"
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
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

import { createVNode } from "vue";

// 引入全局提示框
import { message, Modal } from "ant-design-vue";
// 引入请求方法 httpGet
import { httpGet, httpPost, httpDelete, httpPut } from "@/utils/http";
// 引入请求路径
import { user, role } from "@/api";

export default {
  data() {
    let validateEmail = async (rule, value) => {
      if (value === "") {
        return Promise.resolve();
      } else if (
        !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
      ) {
        // 如果邮箱格式错误 那么提示
        return Promise.reject("您的邮箱格式错误!");
      } else {
        return Promise.resolve();
      }
    };
    let validateMobile = async (rule, value) => {
      if (value === "") {
        return Promise.resolve();
      } else if (!/^[1]([3-9])[0-9]{9}$/.test(value)) {
        // 如果邮箱格式错误 那么提示
        return Promise.reject("您的手机号格式错误!");
      } else {
        return Promise.resolve();
      }
    };
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
      pagesize: 2,
      visible: false,
      Editvisible: false,
      ModifyVisible: false,
      userInfo: {},
      userList: [],
      roleSelected: null,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "用户名长度在3-5之间", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度在6-16之间", trigger: "blur" },
        ],
        email: [{ validator: validateEmail, trigger: "change" }],
        mobile: [{ validator: validateMobile, trigger: "change" }],
      },

      Editform: {},
      Editrules: {
        email: [{ validator: validateEmail, trigger: "change" }],
        mobile: [{ validator: validateMobile, trigger: "change" }],
      },
      // 搜索用户
      searchUser: "",
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
    // 获取用户数据信息
    GetUsers() {
      httpGet(user.GetUsers, {
        query:this.searchUser,
        pagenum: this.current,
        pagesize: this.pagesize,
      })
        .then((response) => {
          console.log(response);
          let { data, meta } = response;

          if (meta.status == 200) {
            this.tableData = data.users;
            this.total = data.total;
            this.current = data.pagenum;

            this.tableData.forEach((element, index) => {
              element.index = index + 1;
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 下拉选项传curent,pagesize
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.GetUsers(current, pageSize);
    },
    // 改变页显示其他数据
    onPageChange(page, pageSize) {
      this.current = page;
      this.GetUsers(page, pageSize);
    },
    // 点击添加用户显示模态框
    showUserModal() {
      this.visible = true;
    },

    // 添加用户按钮
    AddUser() {
      // 校验表单成功后添加用户
      this.$refs.ruleForm
        .validate()
        .then(() => {
          // 向后台传递参数
          let params = {
            username: this.form.username,
            password: this.form.password,
            email: this.form.email,
            mobile: this.form.mobile,
          };
          httpPost(user.AddUser, params)
            .then((response) => {
              let { meta } = response;
              if (meta.status == 201) {
                // 模态框消失
                this.visible = false;
                // 清空数据
                this.$refs.ruleForm.resetFields();
                // 添加成功的提示
                message.success(meta.msg);

                // let pagenum = this.pagenum;
                // let pagesize = this.pagesize;
                this.GetUsers();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // 取消添加用户按钮
    CancelUser() {
      this.$refs.ruleForm.resetFields();
    },
    // 删除用户数据
    DeleteUser(id) {
      let _this = this;
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "此操作将永久删除该用户, 是否继续?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpDelete(user.DelUser + id)
            .then((response) => {
              let { meta } = response;
              if (meta.status == 200) {
                _this.GetUsers();
                return message.success(meta.msg);
              }
              if (meta.status == 400) {
                _this.GetUsers();
                return message.warning(meta.msg);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
        onCancel() {
          message.warning("已取消删除！！");
        },
      });

      // console.log(id);
    },

    // 修改用户信息的数据回显
    EditUser(id) {
      this.Editvisible = true;

      httpGet(user.EditUser + id)
        .then((response) => {
          let { meta, data } = response;
          if (meta.status == 200) {
            this.Editform = data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 修改并更新数据
    updateUser() {
      this.$refs.ruleEditForm.validate().then(() => {
        httpPut(user.UpdateUser + `${this.Editform.id}`, this.Editform)
          .then((response) => {
            // console.log(response);
            let { meta } = response;
            if (meta.status == 200) {
              this.GetUsers();
              this.Editvisible = false;
              message.success("修改用户成功");
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
    // 取消修改
    cancelUp() {
      message.success("已取消修改用户信息");
    },
    // 设置用户角色渲染页面用户信息
    modifyRole(user) {
      // 弹出模态框
      this.ModifyVisible = true;

      // 将数据赋值给userInfo
      this.userInfo = user;
      // console.log(this.userInfo);
      // 发请求获取角色信息
      httpGet(role.ModifyRole)
        .then((response) => {
          console.log(response);
          let { data, meta } = response;
          if (meta.status == 200) {
            this.userList = data;
            console.log(data);
            
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 设置用户角色并更新数据
    modifyEditRole() {
      let rid = this.roleSelected;
      if (rid == null) {
        message.error("请您选择一个角色！！");
        return;
      }
      httpPut(`users/${this.userInfo.id}/role`, { rid: rid })
        .then((response) => {
          let { meta } = response;
          console.log(meta);
          if (meta.status == 200) {
            message.success(meta.msg);
            this.ModifyVisible = false;
            this.roleSelected = null;
            this.GetUsers();
          }

          // if (meta.status == 400) {
          //   message.error(meta.msg);
          // }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 修改用户状态
    ModifyState(checked, event) {
      console.log(checked, event);
      httpPut(`users/${event.target.id}/state/${checked}`)
        .then((response) => {
          console.log(response);
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