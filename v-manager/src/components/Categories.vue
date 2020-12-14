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
            <a-row>
              <a-col :span="4">
                <a-button type="primary" block size="large">添加分类</a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-form>

      <!-- 表格 -->
      <a-table
        style="margin: 20px 0"
        :row-key="(record) => record.cat_id"
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :expandIconColumnIndex="1"
        bordered
      >
        <template #index="{ text, index }">
          <span v-if="text.cat_level == 0">{{ index + 1 }}</span>
        </template>
        <template #cat_deleted="{ text }">
          <CheckCircleTwoTone
            v-if="(text.cat_deleted = true)"
            twoToneColor="#52c41a"
          />
          <CloseCircleOutlined
            v-if="(text.cat_deleted = false)"
            twoToneColor="red"
          />
        </template>
        <template #cat_level="{ text }">
          <a-tag v-if="text.cat_level == 0" color="blue">一级</a-tag>
          <a-tag v-if="text.cat_level == 1" color="green">二级</a-tag>
          <a-tag v-if="text.cat_level == 2" color="orange">三级</a-tag>
        </template>
        <template #operation="{ text }">
          <!-- 修改 -->
          <a-button type="primary" @click="EditUser(text.id)">
            修改
            <EditOutlined />
          </a-button>
          <!-- 删除 -->
          <a-button
            type="danger"
            style="margin: 0 10px"
            @click="DeleteUser(text.id)"
          >
            删除
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
        :defaultPageSize="5"
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
  CheckCircleTwoTone,
  CloseCircleOutlined,
  //   ExclamationCircleOutlined,
} from "@ant-design/icons-vue";

// import { createVNode } from "vue";

// 引入全局提示框
// import { message } from "ant-design-vue";
// 引入请求方法 httpGet
import { httpGet } from "@/utils/http";
// 引入请求路径
import { goods } from "@/api";

export default {
  data() {
    return {
      pageSizeOptions: ["5", "10", "15", "20"],
      tableData: [],
      tableColumns: [
        {
          title: "#",
          key: "index",
          slots: { customRender: "index" },
        },
        {
          title: "分类名称",
          dataIndex: "cat_name",
          key: "cat_name",
        },
        {
          title: "是否有效",
          key: "cat_deleted",
          slots: { customRender: "cat_deleted" },
        },
        {
          title: "排序",
          key: "cat_level",
          slots: { customRender: "cat_level" },
        },

        {
          title: "操作",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],
      total: 0,
      current: 1,
      pagesize: 5,

      // 搜索用户
      searchUser: "",
    };
  },
  components: {
    EditOutlined,
    DeleteOutlined,
    CheckCircleTwoTone,
    CloseCircleOutlined,
  },
  created() {
    this.GetCategories();
  },
  methods: {
    // 获取用户数据信息
    GetCategories() {
      httpGet(goods.Getcategories, {
        type: [1, 2, 3],
        pagenum: this.current,
        pagesize: this.pagesize,
      })
        .then((response) => {
          console.log(response);
          let { data, meta } = response;

          if (meta.status == 200) {
            console.log(data);
            this.tableData = data.result;
            this.total = data.total;
            this.current = data.pagenum;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 下拉选项传curent,pagesize
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.GetCategories(current, pageSize);
    },
    // 改变页显示其他数据
    onPageChange(page, pageSize) {
      this.current = page;
      this.GetCategories(page, pageSize);
    },
  },
};
</script>

<style>
</style>