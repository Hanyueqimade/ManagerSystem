<template>
  <div>
    <a-breadcrumb style="margin: 16px 0" separator=">">
      <a-breadcrumb-item style="font-weight: 700; color: #000"
        >首页</a-breadcrumb-item
      >
      <a-breadcrumb-item>订单管理</a-breadcrumb-item>
      <a-breadcrumb-item>订单列表</a-breadcrumb-item>
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
                <a-input-search size="large" placeholder="请输入内容" />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>

      <!-- 表格 -->
      <a-table
        style="margin: 20px 0"
        :row-key="(record) => record.order_id"
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        bordered
      >
        <template #index="{ index }">
          {{ index + 1 }}
        </template>

        <template #pay_status="{ record }">
          <a-tag v-if="record.pay_status == 0" color="orange">未付款</a-tag>
          <a-tag v-else color="green">已付款</a-tag>
        </template>

        <template #operation="{ text }">
          <!-- 修改 -->
          <a-button
            type="primary"
            style="margin-right: 10px"
            @click="handleAdress"
          >
            <EditOutlined />
          </a-button>
          <!-- 地址 -->
          <a-button type="danger" @click="EditUser(text.id)">
            <EnvironmentOutlined />
          </a-button>
        </template>
      </a-table>

      <a-pagination
        show-size-changer
        v-model:current="current"
        v-model:pageSize="pagesize"
        :show-total="(total) => `总数 ${total} 条`"
        :total="total"
        :defaultPageSize="10"
        @showSizeChange="onShowSizeChange"
        :page-size-options="pageSizeOptions"
        @change="onPageChange"
        show-quick-jumper
      />

      <!--修改地址弹出框 -->
      <a-modal
        :afterClose="resetForm"
        title="修改地址"
        cancelText="取消"
        okText="确定"
        @ok="handleupAdress"
        v-model:visible="visible"
      >
        <a-form ref="ruleForm" :model="form" :rules="rules">
          <a-row>
            <a-col :span="24">
              <a-form-item
                required
                label="省市区/县"
                has-feedback
                name="address"
                :wrapperCol="{ span: 20 }"
                :labelCol="{ span: 4 }"
              >
                <a-cascader
                  :options="options"
                  placeholder="请选择"
                  v-model:value="form.address"
                />
              </a-form-item>
              <a-form-item
                required
                label="详细地址"
                has-feedback
                name="detail"
                :wrapperCol="{ span: 20 }"
                :labelCol="{ span: 4 }"
              >
                <a-input type="text" v-model:value="form.detail" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { EditOutlined, EnvironmentOutlined } from "@ant-design/icons-vue";

// 引入请求方法 httpGet
import { httpGet } from "@/utils/http";
// 引入请求路径
import { orders } from "@/api";

import citydata from "@/api/citydata";
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      pageSizeOptions: ["1", "2", "5", "10"],
      tableData: [],
      tableColumns: [
        {
          title: "",
          dataIndex: "index",
          slots: { customRender: "index" },
        },
        {
          title: "订单编号",
          dataIndex: "order_number",
        },
        {
          title: "订单价格",
          dataIndex: "order_price",
        },
        {
          title: "是否付款",
          key: "pay_status",
          slots: { customRender: "pay_status" },
        },
        {
          title: "是否发货",
          dataIndex: "is_send",
        },
        {
          title: "下单时间",
          dataIndex: "create_time",
        },
        {
          title: "操作",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
      total: 0,
      current: 1,
      pagesize: 10,
      visible: false,

      form: {
        address: "",
        detail: "",
      },

      rules: {
        address: [
          {
            type: "array",
            required: true,
            message: "请选择所在区域",
            trigger: "blur",
          },
        ],
        detail: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: "blur",
          },
        ],
      },

      options: [],
    };
  },
  components: {
    EditOutlined,
    EnvironmentOutlined,
  },
  created() {
    this.Getgoods();
  },
  methods: {
    // 获取用户数据信息
    Getgoods() {
      (this.options = citydata), console.log(citydata);
      httpGet(orders.GetOrdersList, {
        query: this.searchUser,
        pagenum: this.current,
        pagesize: this.pagesize,
      })
        .then((response) => {
          let { data, meta } = response;

          if (meta.status == 200) {
            this.tableData = data.goods;
            this.total = data.total;
            this.current = Number(data.pagenum);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 下拉选项传curent,pagesize
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.Getgoods(current, pageSize);
    },
    // 改变页显示其他数据
    onPageChange(page, pageSize) {
      this.current = page;
      this.Getgoods(page, pageSize);
    },

    handleAdress() {
      this.visible = true;
    },

    handleupAdress() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          message.success("修改成功");
          this.visible = false;
        })
        .catch((error) => {
          console.log("更新失败", error);
        });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style>
</style>