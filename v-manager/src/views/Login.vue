<template>
  <a-layout>
    <a-layout-header class="login-header"></a-layout-header>
    <a-layout-content>
      <a-row>
        <a-col :span="6" :offset="9">
          <!-- 表单开始 -->
          <a-form :model="form" :rules="rules" ref="ruleForm">
            <!-- 登录标题 -->
            <a-row class="login-title">
              <a-col :span="24">
                <h2><img src="../assets/logo.png" alt="" /> Manager System</h2>
                <span>Ant Design 是西湖区最具影响力的 Web 设计规范</span>
              </a-col>
            </a-row>

            <!-- 切换页tabs -->
            <a-row class="login-tabs">
              <a-col :span="24">
                <a-tabs >
                  <!-- 账号密码登录 -->
                  <a-tab-pane key="1" tab="账户密码登录">
                    <!-- 用户账号 -->
                    <a-form-item :wrapperCol="{ span: 24 }" name="username">
                      <a-input
                        placeholder="请输入用户名"
                        size="large"
                        v-model:value="form.username"
                      >
                        <template #prefix
                          ><UserOutlined style="color: rgba(0, 0, 0, 0.25)"
                        /></template>
                      </a-input>
                    </a-form-item>
                    <!-- 用户密码 -->
                    <a-form-item :wrapperCol="{ span: 24 }" name="password">
                      <a-input-password
                        type="password"
                        placeholder="请输入密码"
                        size="large"
                        v-model:value="form.password"
                      >
                        <template #prefix
                          ><LockOutlined style="color: rgba(0, 0, 0, 0.25)"
                        /></template>
                      </a-input-password>
                    </a-form-item>
                  </a-tab-pane>

                  <!-- 手机号登陆 -->
                  <a-tab-pane key="2" tab="手机号登录 " force-render>
                    <!-- 输入手机号 -->
                    <a-form-item :wrapperCol="{ span: 24 }">
                      <a-input placeholder="请输入手机号" size="large">
                        <template #prefix
                          ><MobileOutlined style="color: rgba(0, 0, 0, 0.25)"
                        /></template>
                      </a-input>
                    </a-form-item>
                    <!-- 输入验证码 -->
                    <a-row :gutter="16">
                      <a-col class="gutter-row" :span="16">
                        <a-form-item :wrapperCol="{ span: 24 }">
                          <a-input placeholder="请输入验证码" size="large">
                            <template #prefix
                              ><MailOutlined style="color: rgba(0, 0, 0, 0.25)"
                            /></template>
                          </a-input>
                        </a-form-item>
                      </a-col>
                      <!-- 获取验证码按钮 -->
                      <a-col :span="8">
                        <a-button block size="large">获取验证码</a-button>
                      </a-col>
                    </a-row>
                  </a-tab-pane>
                </a-tabs>
              </a-col>
            </a-row>

            <!-- 自动登录和忘记密码 -->
            <a-row>
              <a-col :span="24">
                <a-checkbox> 自动登录 </a-checkbox>
                <router-link to="#" style="float: right">忘记密码</router-link>
              </a-col>
            </a-row>

            <!-- 确定按钮 -->
            <a-row class="Sign-in">
              <a-col :span="24">
                <a-button @click="onSubmit" type="primary" size="large" block>登录</a-button>
              </a-col>
            </a-row>

            <!-- 其他方式登录 -->
            <a-row>
              <a-col :span="24">
                <span>其他方式登录</span>
                <AlipayCircleOutlined class="item-icon" />
                <TaobaoCircleOutlined class="item-icon" />
                <WeiboCircleOutlined class="item-icon" />

                <router-link to="#" style="float: right">注册账户</router-link>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer></a-layout-footer>
  </a-layout>
</template>

<script>
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
} from "@ant-design/icons-vue";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
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
      },
    };
  },
  components: {
    UserOutlined,
    LockOutlined,
    MobileOutlined,
    MailOutlined,
    AlipayCircleOutlined,
    TaobaoCircleOutlined,
    WeiboCircleOutlined,
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          console.log('values', this.form);
        })
        .catch(error => {
          console.log('error', error);
        });
    },
  }
}
</script>

<style  scoped>
.ant-layout {
  height: 100%;
  background-image: url(../assets/image/bg.svg);
  /* text-align: center; */
}
.ant-layout-header {
  background-color: transparent;
}
.ant-form {
  width: 365px;
  height: 500px;
  margin: 0 auto;
}
.login-title {
  text-align: center;
}

.login-title h2 {
  position: relative;
  top: 0px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 33px;
  font-family: Avenir, helvetica neue, Arial, Helvetica, sans-serif;
}

.login-title h2 img {
  height: 44px;
  margin-right: 10px;
  vertical-align: top;
}
.login-title span {
  margin-top: 12px;
  margin-bottom: 40px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.login-tabs {
  margin-top: 16px;
  /* text-align: center; */
}

.Sign-in {
  margin: 20px 0;
}

.item-icon {
  margin-left: 16px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 24px;
  vertical-align: middle;
}
.item-icon:hover {
  color: #1890ff;
}
</style>
