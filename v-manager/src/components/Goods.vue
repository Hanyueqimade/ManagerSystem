<template>
  <div>
    <a-breadcrumb style="margin: 16px 0" separator=">">
      <a-breadcrumb-item style="font-weight: 700; color: #000"
        >首页</a-breadcrumb-item
      >
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>商品列表</a-breadcrumb-item>
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
                  @search="GetGoods"
                  placeholder="请输入内容"
                />
              </a-col>
              <a-col class="gutter-row" :span="4">
                <a-button
                  type="primary"
                  block
                  size="large"
                  @click="showUserModal"
                  ><router-link to="/goods/add">添加商品</router-link></a-button
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
        <template #mg_state="{ text }">
          <a-switch
            v-model:checked="text.mg_state"
            :id="text.id"
            @change="ModifyState"
          />
        </template>

        <template #operation="{ text }">
          {{ text }}
          <!-- 修改 -->
          <a-button type="primary">
            <EditOutlined />
          </a-button>
          <!-- 删除 -->
          <a-button
            type="danger"
            style="margin: 0 10px"
            @click="DeleteUser(text.goods_id)"
          >
            <DeleteOutlined
          /></a-button>
          <!-- 权限 -->
        </template>
      </a-table>

      <a-pagination
        show-size-changer
        v-model:current="current"
        v-model:pageSize="pagesize"
        :show-total="(total) => `总数 ${total} 条`"
        :total="total"
        :defaultPageSize="20"
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
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

import { createVNode } from "vue";

// 引入全局提示框
import { message, Modal } from "ant-design-vue";
// 引入请求方法 httpGet
import { httpGet, httpDelete } from "@/utils/http";
// 引入请求路径
import { goods } from "@/api";

export default {
  data() {
    return {
      pageSizeOptions: ["20", "40", "60", "80", "100"],
      tableData: [],
      tableColumns: [
        {
          title: "#",
          dataIndex: "index",
          key: "index",
        },
        {
          title: "商品名称",
          dataIndex: "goods_name",
          key: "goods_name",
        },
        {
          title: "商品价格(元)",
          dataIndex: "goods_price",
          key: "goods_price",
        },
        {
          title: "商品重量",
          dataIndex: "goods_weight",
          key: "goods_weight",
        },
        {
          title: "创建时间",
          dataIndex: "add_time",
          key: "add_time",
        },

        {
          title: "操作",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
      total: 0,
      current: 1,
      pagesize: 20,
    };
  },
  components: {
    EditOutlined,
    DeleteOutlined,
    // ExclamationCircleOutlined,
  },
  created() {
    this.GetGoods();
  },
  methods: {
    // 获取用户数据信息
    GetGoods() {
      httpGet(goods.GetGoodsList, {
        query: this.searchUser,
        pagenum: this.current,
        pagesize: this.pagesize,
      })
        .then((response) => {
          console.log(response);
          let { data, meta } = response;

          if (meta.status == 200) {
            console.log(data);
            this.tableData = data.goods;
            this.total = data.total;
            this.current = Number(data.pagenum);

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
      this.GetGoods(current, pageSize);
    },
    // 改变页显示其他数据
    onPageChange(page, pageSize) {
      this.current = page;
      this.GetGoods(page, pageSize);
    },
    // 点击添加用户显示模态框
    // showUserModal() {
    //   this.visible = true;
    // },
    DeleteUser(id) {
      console.log(id);
      let _this = this;
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "此操作将永久删除该用户, 是否继续?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpDelete(goods.DelGoods + id)
            .then((response) => {
              let { meta } = response;
              console.log(meta);
              if (meta.status == 200) {
                _this.GetGoods();
                return message.success(meta.msg);
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
  },
};
</script>

<style>
</style>