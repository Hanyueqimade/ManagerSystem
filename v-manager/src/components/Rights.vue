<template>
  <div>
    <a-breadcrumb style="margin: 16px 0" separator=">">
      <a-breadcrumb-item style="font-weight: 700; color: #000"
        >首页</a-breadcrumb-item
      >
      <a-breadcrumb-item>权限管理</a-breadcrumb-item>
      <a-breadcrumb-item>权限列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-table
      :columns="rightsColumns"
      :data-source="rightsData"
      :row-key="(record) => record.id"
      bordered
      :pagination="false"
    >
      <template #index="{ index }">
        {{ index + 1 }}
      </template>

      <template #level="{ record }">
        <a-tag v-if="record.level == 0" color="blue">一级</a-tag>
        <a-tag v-else-if="record.level == 1" color="green">二级</a-tag>
        <a-tag v-else color="orange">三级</a-tag>
      </template>
    </a-table>
  </div>
</template>

<script>
import { httpGet } from "@/utils/http.js";
import { rights } from "@/api";
export default {
  data() {
    return {
      rightsColumns: [
        {
          title: "#",
          key: "index",
          slots: { customRender: "index" },
        },
        {
          title: "权限名称",
          dataIndex: "authName",
        },
        {
          title: "路径",
          dataIndex: "path",
        },
        {
          title: "权限等级",
          dataIndex: "level",
          slots: { customRender: "level" },
        },
      ],
      rightsData: [],
    };
  },
  created() {
    this.handleRights();
  },
  methods: {
    handleRights() {
      httpGet(rights.GetRightsList)
        .then((response) => {
          let { data, meta } = response;
          if (meta.status == 200) {
            this.rightsData = data;
          }
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