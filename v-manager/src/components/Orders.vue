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

      <!-- 修改用户角色弹出框 -->
      <a-modal
        title="修改地址"
        cancelText="取消"
        okText="确定"
        v-model:visible="visible"
        @ok="onSubmit"
        :afterClose="close"
      >
        <a-form ref="ruleForm" :model="form" :rules="rules">
          <a-row>
            <a-col :span="24">
              <a-form-item
                label="省市区/县"
                required
                :wrapperCol="{ span: 20 }"
                :labelCol="{ span: 4 }"
                name="address"
              >
                <a-cascader
                  v-model:value="form.address"
                  :options="options"
                  placeholder="请选择"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                label="详细地址"
                required
                :wrapperCol="{ span: 20 }"
                :labelCol="{ span: 4 }"
                name="detail"
              >
                <a-input v-model:value="form.detail"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
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

        <template #pay_status="{ text }">
          <a-tag color="pink" v-if="text.pay_status == 0"> 未支付 </a-tag>
          <a-tag color="green" v-if="text.pay_status == 1"> 已支付 </a-tag>
        </template>

        <template #operation="{}">
          <a-button
            type="primary"
            shape="round"
            style="margin-right: 10px"
            @click="handleModal"
          >
            <template #icon>
              <EditOutlined />
            </template>
          </a-button>
          <a-button type="danger" shape="round">
            <template #icon>
              <EnvironmentOutlined />
            </template>
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
    </div>
  </div>
</template>

<script>
import { EditOutlined, EnvironmentOutlined } from "@ant-design/icons-vue";

// import { createVNode } from "vue";

// 引入全局提示框
// import { message } from "ant-design-vue";
// 引入请求方法 httpGet
import { httpGet } from "@/utils/http";
// 引入请求路径
import { orders } from "@/api";

// 引入城市数据
import citydata from "@/api/citydata";
export default {
  data() {
    return {
      pageSizeOptions: ["1", "2", "5", "10"],
      tableData: [],
      tableColumns: [
        {
          title: "#",
          key: "index",
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
          title: "是否支付",
          key: "pay_status",
          slots: { customRender: "pay_status" },
        },
        {
          title: "是否发货",
          dataIndex: "is_send",
          key: "is_send",
        },
        {
          title: "下单时间",
          dataIndex: "update_time",
          key: "update_time",
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
            message: "请选择地区",
            trigger: "blur",
          },
        ],
        detail: [
          {
            type: "array",
            required: true,
            message: "请填写详细地址",
            trigger: "blur",
          },
        ],
      },

      options: citydata,
    };
  },
  components: { EditOutlined, EnvironmentOutlined },
  created() {
    this.GetOrders();
  },
  methods: {
    // 获取用户数据信息
    GetOrders() {
      httpGet(orders.GetOrdersList, {
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
      this.pagesize = pageSize;
      this.GetOrders(current, pageSize);
    },
    // 改变页显示其他数据
    onPageChange(page, pageSize) {
      this.current = page;
      this.pagesize = pageSize;
      this.GetOrders(page, pageSize);
    },

    handleModal() {
      this.visible = true;
    },

    onSubmit() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          console.log("成功");
          this.visible = false;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },

    close() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style>
</style>