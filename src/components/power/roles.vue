<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template v-slot:default="props">
            <el-row
              v-for="(item,index) in props.row.children"
              :key="item.id"
              :class="['rowBotton',index==0 ? 'rowTop' :'','vcenter']"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(props.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二，三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2==0?'':'rowTop','vcenter']"
                  v-for="(item2,i2) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(props.row,item2.id)"
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(props.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot:default="props">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(props.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoleById(props.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRightDialog(props.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改用户框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="editFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="rightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <el-tree
        :data="roleTreeList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            required: true,
            min: 2,
            max: 10,
            message: '角色名的长度在2-10之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            required: true,
            min: 2,
            max: 25,
            message: '角色名的长度在2-25之间',
            trigger: 'blur'
          }
        ]
      },
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addDialogVisible: false,
      rightDialogVisible: false,
      roleTreeList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        this.$Message.error('获取角色失败')
      }

      this.editForm = res.data

      this.editDialogVisible = true
    },
    editDialogClose() {
      this.$refs['editFormRef'].resetFields()
    },
    editDialogInfo() {
      this.$refs['editFormRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('修改用户信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 更新列表
        this.getRoleList()
        this.$Message.success('修改用户信息失败')
      })
    },
    // 删除角色
    async deleteRoleById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$Message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除角色失败')
      }
      this.getRoleList()
      this.$Message.success('删除角色成功')
    },
    addDialogClose() {
      this.$refs['addFormRef'].resetFields()
    },
    addDialogInfo() {
      this.$refs['addFormRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$Message.error('添加用户失败')
        }
        this.getRoleList()
        this.addDialogVisible = false
        this.$Message.success('添加用户成功')
      })
    },
    async removeRightById(role, rightId) {
      const result = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$Message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('删除权限失败')
      }
      role.children = res.data
    },
    async showRightDialog(node) {
      this.roleId = node.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取权限列表失败')
      }
      this.roleTreeList = res.data
      this.getChildrenId(node, this.defKeys)
      this.rightDialogVisible = true
    },
    // 递归获取三级节点
    getChildrenId(node, arry) {
      if (!node.children) {
        return arry.push(node.id)
      }
      node.children.forEach((item) => {
        this.getChildrenId(item, arry)
      })
    },
    setRightDialogClose() {
      this.defKeys = []
    },
    async allotRights() {
      const tree = this.$refs['treeRef']
      const treeId = [...tree.getCheckedKeys(), ...tree.getHalfCheckedKeys()]
      const idStr = treeId.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('授权失败')
      }
      this.$Message.success('授权成功')

      this.getRoleList()
      this.rightDialogVisible = false
    }
  }
}
</script>
<style lang="less">
.el-tag {
  margin: 10px;
}
.rowTop {
  border-top: 1px solid #eee;
}
.rowBotton {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
