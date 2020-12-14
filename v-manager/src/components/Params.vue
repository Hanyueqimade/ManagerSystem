<template>
  <a-layout>
    <a-breadcrumb style="margin: 16px 0">
      <a-breadcrumb-item
        ><router-link to="/home" style="font-weight: bold; color: #000"
          >首页</router-link
        ></a-breadcrumb-item
      >
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>参数列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card>
      <a-alert message="注意：只允许为三级分类设置相关参数" banner />
      <a-row style="margin-top: 24px">
        <a-col :span="8">
          <span>选择商品分类</span>
          <a-cascader
            style="margin-left: 10px"
            size="large"
            v-model:value="ParamsKeys"
            :options="options"
            placeholder="请选择"
            :fieldNames="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
            }"
            @change="onCascaderChange"
          />
        </a-col>
      </a-row>
      <a-tabs @change="handleTabsChange">
        <a-tab-pane key="many" tab="动态参数">
          <a-button type="primary" :disabled="isDisabled" @click="showParams">
            添加参数
          </a-button>
          <a-table
            bordered
            :row-key="(record) => record.attr_id"
            style="margin-top: 24px"
            :columns="columns"
            :data-source="manyData"
          >
            <template #expandedRowRender="{ record }">
              {{ record }}
              <a-tag
                v-for="(item, index) in record.attr_vals"
                :key="item"
                color="orange"
                closable
                @close="preventDefault(record, index)"
              >
                {{ item }}
              </a-tag>
              <a-input
                v-if="record.inputVisible"
                ref="input"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                v-model:value="record.inputValue"
                @blur="handleInputConfirm(record)"
              />
              <a-tag
                v-else
                @click="showInput(record)"
                style="background: #fff; borderstyle: dashed"
              >
                <plus-outlined /> New Tag
              </a-tag>
            </template>
            <template #index="{ index }">
              {{ index + 1 }}
            </template>
            <template #operation="{ record }">
              <!-- 编辑 -->
              <a-button type="primary" @click="modifyParams(record)">
                <EditOutlined />
              </a-button>
              <!-- 删除 -->
              <a-button
                type="danger"
                style="margin: 0 10px"
                @click="DelParams(record)"
              >
                <DeleteOutlined
              /></a-button>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="only" tab="静态属性" force-render>
          <a-button @click="showParams" type="primary" :disabled="isDisabled">
            添加属性
          </a-button>
          <a-table
            :row-key="(record) => record.attr_id"
            bordered
            style="margin-top: 24px"
            :columns="columns"
            :data-source="onlyData"
          >
            <template #expandedRowRender="{ record }">
              <a-tag
                v-for="(item, index) in record.attr_vals"
                :key="item"
                color="orange"
                closable
                @close="preventDefault(record, index)"
              >
                {{ item }}
              </a-tag>
              <a-input
                v-if="record.inputVisible"
                ref="input"
                type="text"
                size="small"
                :style="{ width: '78px' }"
                v-model:value="record.inputValue"
                @blur="handleInputConfirm(record)"
              />
              <a-tag
                v-else
                @click="showInput(record)"
                style="background: #fff; borderstyle: dashed"
              >
                <plus-outlined /> New Tag
              </a-tag>
            </template>
            <template #index="{ index }">
              {{ index + 1 }}
            </template>
            <template #operation="{ record }">
              <!-- 编辑 -->
              <a-button type="primary" @click="modifyParams(record)">
                <EditOutlined />
              </a-button>
              <!-- 删除 -->
              <a-button
                type="danger"
                style="margin: 0 10px"
                @click="DelParams(record)"
              >
                <DeleteOutlined
              /></a-button>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <!-- 添加参数弹出框 -->
    <a-modal
      :title="'添加' + titleText"
      v-model:visible="visible"
      @ok="handleOk"
    >
      <a-form ref="ruleForm" :model="form" :rules="rules">
        <a-form-item :label="titleText" name="params">
          <a-input v-model:value="form.params" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 修改 -->
    <a-modal
      :title="'修改' + titleText"
      v-model:visible="ModifyVisible"
      @ok="handleOkModify"
    >
      <a-form>
        <a-form-item :label="titleText">
          <a-input v-model:value="form.params" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { httpGet, httpPut, httpPost, httpDelete } from "@/utils/http";
import { goods } from "@/api";
import { message, Modal } from "ant-design-vue";
export default {
  data() {
    return {
      ParamsKeys: [],
      options: [],
      columns: [
        {
          title: "#",
          key: "index",
          slots: { customRender: "index" },
        },
        {
          title: "属性名称",
          dataIndex: "attr_name",
        },
        {
          title: "操作",
          key: "operation",
          slots: { customRender: "operation" },
        },
      ],

      activeKey: "many",

      visible: false,
      ModifyVisible: false,
      record: "",

      manyData: [],
      onlyData: [],

      form: {
        params: "",
      },
      rules: {
        params: [
          { required: true, message: "参数/属性名不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.handleParamsList();
  },
  methods: {
    handleParamsList() {
      httpGet(goods.GetCategories)
        .then((res) => {
          let { meta, data } = res;
          if (meta.status == 200) {
            this.options = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    onCascaderChange() {
      httpGet(`categories/${this.catId}/attributes`, { sel: this.activeKey })
        .then((res) => {
          let { meta, data } = res;
          if (meta.status == 200) {
            data.forEach((ele) => {
              ele.attr_vals =
                ele.attr_vals.length == 0 ? [] : ele.attr_vals.split(" ");
            });
            if (this.activeKey == "many") {
              this.manyData = data;
            }
            this.onlyData = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleTabsChange(activeKey) {
      this.activeKey = activeKey;
      console.log(this.activeKey);
      this.onCascaderChange();
    },

    preventDefault(r, i) {
      r.attr_vals.splice(i, 1);
      httpPut(`categories/${r.cat_id}/attributes/${r.attr_id}`, {
        attr_name: r.attr_name,
        attr_sel: r.attr_sel,
        attr_vals: r.attr_vals.join(" "),
      })
        .then((res) => {
          let { meta } = res;
          if (meta.status == 200) {
            message.success(meta.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showInput(r) {
      r.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },


    handleInputConfirm(r) {
      // if (r.inputValue.trim() == "") {
      //   r.inputVisible = true;
      //   return;
      // }
      r.attr_vals.push(r.inputValue);
      r.inputVisible = false;
      httpPut(`categories/${r.cat_id}/attributes/${r.attr_id}`, {
        attr_name: r.attr_name,
        attr_sel: r.attr_sel,
        attr_vals: r.attr_vals.join(" "),
      })
        .then((res) => {
          let { meta } = res;
          if (meta.status == 200) {
            message.success(meta.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    showParams() {
      this.visible = true;
    },

    handleOk() {
      this.visible = false;

      httpPost(`categories/${this.catId}/attributes`, {
        attr_name: this.form.params,
        attr_sel: this.activeKey,
      })
        .then((res) => {
          let { meta } = res;
          if (meta.status == 201) {
            message.success(meta.msg);
            this.onCascaderChange();
            this.form.params = "";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    DelParams(r) {
      console.log(111);
      let _this = this;
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "此操作将永久删除该用户, 是否继续?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpDelete(`categories/${_this.catId}/attributes/${r.attr_id}`)
            .then((res) => {
              let { meta } = res;
              if (meta.status == 200) {
                message.success(meta.msg);
                _this.onCascaderChange();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel() {
          message.success("已取消");
        },
      });
    },

    modifyParams(r) {
      this.ModifyVisible = true;
      this.form.params = r.attr_name;
      this.record = r;
    },

    handleOkModify() {
      httpPut(`categories/${this.catId}/attributes/${this.record.attr_id}`, {
        attr_name: this.form.params,
        attr_sel: this.record.attr_sel,
        attr_vals: this.record.attr_vals.join(" "),
      })
        .then((res) => {
          let { meta } = res;
          console.log(res);
          if (meta.status == 200) {
            message.success(meta.msg);
            this.ModifyVisible = false;
            this.onCascaderChange();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存

    isDisabled() {
      return this.ParamsKeys.length != 3;
    },

    catId() {
      if (this.ParamsKeys.length == 3) {
        return this.ParamsKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeKey == "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  components: {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
  },
};
</script>

<style></style>
