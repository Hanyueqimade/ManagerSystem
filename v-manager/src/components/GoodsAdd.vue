<template>
  <div>
    <a-breadcrumb style="margin: 16px 0" separator=">">
      <a-breadcrumb-item style="font-weight: 700; color: #000"
        >首页</a-breadcrumb-item
      >
      <a-breadcrumb-item>商品管理</a-breadcrumb-item>
      <a-breadcrumb-item>添加商品</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card style="height: 900px">
      <a-alert message="添加商品信息" type="warning" show-icon />

      <!-- 步骤条 -->
      <a-row style="margin-top: 24px">
        <a-col :span="20" :offset="1">
          <a-steps
            :current="Number(activeKey)"
            size="small"
            labelPlacement="vertical"
          >
            <a-step title="基本信息" />
            <a-step title="商品参数" />
            <a-step title="商品属性" />
            <a-step title="商品图片" />
            <a-step title="商品内容" />
            <a-step title="完成" />
          </a-steps>
        </a-col>
      </a-row>

      <!-- tabs -->
      <a-form layout="vertical" ref="ruleForm" :model="form" :rules="rules">
        <a-tabs
          tab-position="left"
          style="margin-top: 24px"
          :activeKey="activeKey"
          @change="handleTabsChange"
        >
          <a-tab-pane key="0" tab="基本信息">
            <a-form-item label="商品名称" required name="goods_name">
              <a-input size="large" v-model:value="form.goods_name" />
            </a-form-item>
            <a-form-item label="商品价格" required name="goods_price">
              <a-input size="large" v-model:value="form.goods_price" />
            </a-form-item>
            <a-form-item label="商品重量" required name="goods_weight">
              <a-input size="large" v-model:value="form.goods_weight" />
            </a-form-item>
            <a-form-item label="商品数量" required name="goods_number">
              <a-input size="large" v-model:value="form.goods_number" />
            </a-form-item>
            <a-form-item label="商品分类" required name="goods_cat">
              <a-cascader
                :fieldNames="{
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                v-model:value="form.goods_cat"
                size="large"
                :options="options"
                placeholder="请选择"
                @change="handleCascaderC"
              />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="1" tab="商品参数">
            <a-form-item
              :label="item.attr_name"
              v-for="item in manyData"
              :key="item.attr_id"
            >
              <a-checkbox-group
                v-model:value="item.attr_vals"
                :options="item.attr_vals"
              />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="2" tab="商品属性">
            <a-form-item
              v-for="item in onlyData"
              :key="item.id"
              :label="item.attr_name"
            >
              <a-input v-model:value="item.attr_vals" />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="3" tab="商品图片">
            <a-upload
              accept="image/*"
              list-type="picture"
              action="http://www.wanlum.com:8888/api/private/v1/upload"
              @change="handleUploadChange"
              @preview="handleUploadPreview"
              :headers="headersObj"
              :remove="handleUploadRemove"
            >
              <a-button type="primary"> <upload-outlined /> 上传图片 </a-button>
            </a-upload>
            <a-modal
              title="图片预览"
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
            >
              <img alt="example" style="width: 100%" :src="previewPath" />
            </a-modal>
          </a-tab-pane>
          <a-tab-pane key="4" tab="商品内容">
            <ckeditor
              :editor="editor"
              v-model="form.goods_introduce"
            ></ckeditor>
            <!-- 添加商品按钮 -->
            <a-button
              style="margin-top: 24px; float: right"
              type="primary"
              @click="handleAddGoods"
              >添加商品</a-button
            >
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { httpGet, httpPost } from "@/utils/http";
import { goods } from "@/api";
import { UploadOutlined } from "@ant-design/icons-vue";
import _ from "lodash";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
export default {
  data() {
    return {
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        goods_cat: [],
        attrs: [],
        pics: [],
      },
      rules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商数量",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入重量",
            trigger: "blur",
          },
        ],

        goods_cat: [
          {
            type: "array",
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ],
      },
      options: [],
      activeKey: "0",
      cat_id: 0,
      manyData: [],
      onlyData: [],

      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },

      previewPath: "",

      previewVisible: false,

      editor: ClassicEditor,
    };
  },
  components: {
    UploadOutlined,
  },
  created() {
    this.handleReadGoods();
  },
  methods: {
    handleReadGoods() {
      httpGet(goods.Getcategories)
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
    handleTabsChange(activeKey) {
      if (activeKey !== "0" && this.form.goods_cat.length !== 3) {
        message.error("请选择商品分类");
        this.activeKey = "0";
      } else {
        this.activeKey = activeKey;
        if (this.activeKey == "1") {
          httpGet(`categories/${this.cat_id}/attributes`, { sel: "many" })
            .then((res) => {
              let { meta, data } = res;
              if (meta.status == 200) {
                data.forEach((ele) => {
                  ele.attr_vals =
                    ele.attr_vals.length == 0 ? [] : ele.attr_vals.split(" ");
                });
                this.manyData = data;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (this.activeKey == "2") {
          httpGet(`categories/${this.cat_id}/attributes`, { sel: "only" })
            .then((res) => {
              console.log(res);
              let { meta, data } = res;
              if (meta.status == 200) {
                this.onlyData = data;
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    handleCascaderC(value) {
      this.cat_id = value[value.length - 1];
    },
    // 上传图片
    handleUploadChange(file) {
      if (file.file.status == "done") {
        let { fileList } = file;
        let arr = [];
        console.log(file);
        fileList.forEach((item) => {
          arr.push({ pics: item.response.data.tmp_path });
        });
        this.form.pics = arr;
        console.log(this.form.pics);
      }
    },
    // 预览图片
    handleUploadPreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url.replace(
        /127.0.0.1/,
        "www.wanlum.com"
      );
      this.previewVisible = true;
    },
    // 取消图片预览
    handleCancel() {
      this.previewVisible = false;
    },
    // 删除图片
    handleUploadRemove(file) {
      let index = this.form.pics.findIndex((item) => {
        item.pics == file.response.data.tmp_path;
      });
      this.form.pics.splice(index, 1);
      console.log(this.form.pics);
    },

    // 添加商品 表单验证
    handleAddGoods() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          let form = _.cloneDeep(this.form);
          form.goods_cat = form.goods_cat.join(",");
          console.log(form.goods_cat);
          // 收集动态参数
          console.log(this.manyData);
          this.manyData.forEach((ele) => {
            form.attrs.push({
              attr_id: ele.attr_id,
              attr_vals: ele.attr_vals.join(" "),
            });
          });
          // 收集静态参数
          console.log(this.onlyData);
          this.onlyData.forEach((ele) => {
            form.attrs.push({
              attr_id: ele.attr_id,
              attr_vals: ele.attr_vals,
            });
          });
          console.log(form);
          httpPost(goods.AddGoods, form)
            .then((response) => {
              console.log(response);
              let { meta } = response;
              console.log(meta);
              if (meta.status == 201) {
                message.success(meta.msg);
                this.$router.push("/goods");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })

        .catch();
    },
  },
};
</script>

<style>
.ck-editor__editable {
  min-height: 300px;
}
</style>