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
              <a-col class="gutter-row" :span="4">
                <a-button
                  type="primary"
                  block
                  size="large"
                  @click="showUserModal"
                  >添加商品</a-button
                >
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>

      <!-- 表格 -->
      <a-table
        style="margin: 20px 0"
        :row-key="(record) => record.goods_id"
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

        <template #operation="{ }">
          <!-- 修改 -->
          <a-button
            type="primary"
            style="margin-right: 10px"
          >
            <EditOutlined />
          </a-button>
          <!-- 删除 -->
            <a-button
            type="danger"
          >
            <DeleteOutlined
          /></a-button>
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
import { EditOutlined, DeleteOutlined } from "@ant-design/icons-vue";

// 引入请求方法 httpGet
import { httpGet } from "@/utils/http";
// 引入请求路径
import { goods } from "@/api";


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
          title: "商品名称",
          dataIndex: "goods_name",
        },
        {
          title: "商品价格(元)",
          dataIndex: "goods_price",
        },
        {
          title: "商品重量",
          dataIndex: "goods_weight",
        },
        {
          title: "创建时间",
          dataIndex: "add_time",
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
    };
  },
  components: {
    EditOutlined,
    DeleteOutlined,
  },
  created() {
    this.Getgoods();
  },
  methods: {
    // 获取用户数据信息
    Getgoods() {
      httpGet(goods.GetGoodsList, {
        pagenum: this.current,
        pagesize: this.pagesize,
      })
        .then((response) => {
          let { data, meta } = response;
          if (meta.status == 200) {
              console.log(data);
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


  
  },
};
</script>

<style>
</style>