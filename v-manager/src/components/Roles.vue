<template>
  <div>
    <a-breadcrumb style="margin: 16px 0" separator=">">
      <a-breadcrumb-item style="font-weight: 700; color: #000"
        >首页</a-breadcrumb-item
      >
      <a-breadcrumb-item>权限管理</a-breadcrumb-item>
      <a-breadcrumb-item>权限列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card>
      <a-row>
        <a-col :span="2">
          <a-button size="large" block type="primary" @click="handleAddRoles"
            >添加</a-button
          >
        </a-col>
      </a-row>
    </a-card>

    <a-table
      :columns="rolesColumns"
      :data-source="rolesData"
      :row-key="(record) => record.id"
      bordered
      :pagination="false"
      childrenColumnName="111"
    >
      <template #index="{ index }">
        {{ index + 1 }}
      </template>
      <template #expandedRowRender="{ record }">
        <a-row
          v-for="(item, index) in record.children"
          :roleId="record.id"
          :key="item.id"
          :index="index"
          :class="['bdbottom vcenter', index == 0 ? 'bdtop' : '']"
        >
          <a-col :span="5"
            ><span
              ><a-tag
                closable
                color="cyan"
                @close="handleCloseTag($event, record.id, item.id)"
                >{{ item.authName }}</a-tag
              >
              <CaretRightOutlined
            /></span>
          </a-col>
          <a-col :span="19">
            <a-row
              v-for="(item1, index) in item.children"
              :key="item1.id"
              :class="[
                'vcenter',
                index == item.children.length - 1 ? '' : 'bdbottom',
              ]"
            >
              <!-- <a-col>{{ item }}</a-col> -->
              <a-col :span="6">
                <span
                  ><a-tag
                    closable
                    @close="handleCloseTag($event, record.id, item1.id)"
                    color="green"
                    >{{ item.authName }}</a-tag
                  >
                  <CaretRightOutlined
                /></span>
              </a-col>
              <a-col :span="18" class="">
                <span v-for="item in item1.children" :key="item.id"
                  ><a-tag
                    closable
                    color="orange"
                    @close="handleCloseTag($event, record.id, item.id)"
                    >{{ item.authName }}</a-tag
                  >
                </span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </template>
      <template #operation="{ record }">
        <!-- 编辑 -->
        <a-button type="primary" @click="ModifyRole(record.id)">
          <EditOutlined />编辑
        </a-button>
        <!-- 删除 -->
        <a-button
          type="danger"
          style="margin: 0 10px"
          @click="handleDel(record.id)"
        >
          <DeleteOutlined />删除</a-button
        >
        <!-- 权限 -->
        <a-button
          type="default"
          style="background-color: #e6a23c; color: #fff"
          @click="distributionRights(record)"
        >
          <SettingOutlined />分配权限</a-button
        >
      </template>
    </a-table>

    <!-- 添加用户弹出框 -->
    <a-modal
      title="添加角色"
      v-model:visible="visible"
      cancelText="取消"
      okText="确定"
      @ok="handlAddOk"
      @cancel="handlAddCancel"
    >
      <a-form ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="角色名称"
              required
              name="roleName"
              has-feedback
              :wrapperCol="{ span: 20 }"
              :labelCol="{ span: 4 }"
            >
              <a-input type="text" v-model:value="form.roleName" />
            </a-form-item>
            <a-form-item
              name="roleDesc"
              label="角色描述"
              :wrapperCol="{ span: 20 }"
              :labelCol="{ span: 4 }"
            >
              <a-input type="text" v-model:value="form.roleDesc" />
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
      @ok="ModifyRolePut"
      @cancel="cancelUp"
      v-model:visible="Editvisible"
    >
      <a-form ref="" :model="Editform">
        <a-row>
          <a-col :span="24">
            <a-form-item
              label="添加角色"
              name="roleName"
              :wrapperCol="{ span: 20 }"
              :labelCol="{ span: 4 }"
            >
              <a-input type="text" v-model:value="Editform.roleName" />
            </a-form-item>
            <a-form-item
              label="角色描述"
              name="roleDesc"
              :labelCol="{ span: 4 }"
              :wrapperCol="{ span: 20 }"
            >
              <a-input type="text" v-model:value="Editform.roleDesc" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 分配权限弹出框 -->
    <a-modal
      v-model:visible="distributionVisible"
      title="分配权限"
      :afterClose="handleRepeatKey"
      @ok="handleSub"
    >
      <a-tree
        checkable
        :tree-data="treeData"
        :replaceFields="{ children: 'children', title: 'authName', key: 'id' }"
        v-model:checkedKeys="defKeys"
        defaultExpandAll
        @check="onCheck"
      >
      </a-tree>
    </a-modal>
  </div>
</template>

<script>
import { createVNode } from "vue";
import { httpGet, httpPost, httpDelete, httpPut } from "@/utils/http.js";
import { rights, role } from "@/api";
import {
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  CaretRightOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { message, Modal } from "ant-design-vue";

export default {
  data() {
    return {
      rolesColumns: [
        {
          title: "#",
          key: "index",
          slots: { customRender: "index" },
        },
        {
          title: "角色名称",
          dataIndex: "roleName",
        },
        {
          title: "角色描述",
          dataIndex: "roleDesc",
        },
        {
          title: "操作",
          dataIndex: "operation",
          slots: { customRender: "operation" },
        },
      ],
      rolesData: [],
      treeData: [],
      defKeys: [],
      visible: false,
      Editvisible: false,
      distributionVisible: false,
      roleId: "",
      form: {
        roleName: "",
        roleDesc: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请输入添加的角色名", trigger: "blur" },
        ],
      },

      Editform: {},
      halfKey: [],
    };
  },
  created() {
    this.handleRoles();
  },
  methods: {
    handleRoles() {
      httpGet(role.GetRolesList)
        .then((response) => {
          let { data, meta } = response;
          if (meta.status == 200) {
            this.rolesData = data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleAddRoles() {
      this.visible = true;
    },
    // 校验表单成功后添加用户
    handlAddOk() {
      this.$refs.ruleForm.validate().then(() => {
        let parms = {
          roleId: this.Editform.roleId,
          roleName: this.form.roleName,
          roleDesc: this.form.roleDesc,
        };
        httpPost(role.AddRole, parms)
          .then((res) => {
            let { meta } = res;
            if (meta.status == 201) {
              this.$refs.ruleForm.resetFields();
              this.visible = false;
              message.success(meta.msg);
              this.handleRoles();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    handlAddCancel() {
      this.visible = false;
      this.$refs.ruleForm.resetFields();
    },

    handleDel(id) {
      let _this = this;
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "此操作将永久删除该用户, 是否继续?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpDelete(role.DelRole + id)
            .then((response) => {
              let { meta } = response;
              if (meta.status == 200) {
                _this.handleRoles();
                return message.success(meta.msg);
              }
              if (meta.status == 400) {
                _this.handleRoles();
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

    ModifyRole(id) {
      this.Editvisible = true;
      httpGet(role.EditRole + id)
        .then((response) => {
          let { meta, data } = response;
          if (meta.status == 200) {
            this.Editform = data;
            console.log(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ModifyRolePut() {
      httpPut(role.UpdateRole + `${this.Editform.roleId}`, this.Editform)
        .then((res) => {
          let { meta } = res;
          if (meta.status == 200) {
            this.handleRoles();
            this.Editvisible = false;
            message.success("修改用户成功");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelUp() {
      message.success("已取消修改用户信息");
    },

    // 删除角色权限
    handleCloseTag(e, roleId, rightId) {
      e.preventDefault();
      // httpDelete(role.DelRightRole + `/${roleId}/${rightId}`);
      let _this = this;
      Modal.confirm({
        title: "提示",
        icon: createVNode(ExclamationCircleOutlined),
        content: "此操作将永久删除该用户, 是否继续?",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          httpDelete(role.DelRightRole + `/${roleId}/rights/${rightId}`)
            .then((response) => {
              let { meta } = response;
              if (meta.status == 200) {
                _this.handleRoles();
                return message.success(meta.msg);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
      });
    },

    onCheck(checkedKeys, e) {
      // console.log("checkedKeys", checkedKeys, "e", e);
      // let concatTreeData =this.defKeys.concat(e.halfCheckedKeys);
      this.halfKey = e.halfCheckedKeys;
      // this.defKeys.push();
    
      // console.log(this.halfKey);
      // console.log(checkedKeys, e);
      // this.treeData.push(e.halfCheckedKeys);
      // return this.defKeys.push(e.halfCheckedKeys);
    },

    // 分配权限
    distributionRights(record) {
      this.roleId = record.id;
      this.distributionVisible = true;
      httpGet(rights.GetTreeRights)
        .then((res) => {
          let { meta, data } = res;
          if (meta.status == 200) {
            this.treeData = data;
            this.distributionAdditionalRights(record, this.defKeys);
            // this.onCheck();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    distributionAdditionalRights(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((element) =>
        this.distributionAdditionalRights(element, arr)
      );
    },

    handleRepeatKey() {
      this.defKeys = [];
    },

    // 角色授权
    handleSub() {
      let rids = this.defKeys.concat(this.halfKey).join(",");
      console.log(rids, this.halfKey);
      httpPost(`roles/${this.roleId}/rights`, {
        rids: rids,
      })
        .then((res) => {
          // console.log(res);
          let { meta } = res;
          if (meta.status == 200) {
            message.success(meta.msg);
            this.handleRoles();
            this.distributionVisible = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  components: {
    EditOutlined,
    DeleteOutlined,
    SettingOutlined,
    CaretRightOutlined,
  },
};
</script>

<style>
.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
.ant-tag {
  padding: 2px 14px;
  font-size: 14px;
}

.ant-tag {
  margin: 7px;
}
</style>