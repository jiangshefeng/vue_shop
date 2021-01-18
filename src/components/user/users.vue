<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userlist" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot:default="props">
            <el-switch
              v-model="props.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeStatus(props.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="操作" width="200px">
          <template v-slot:default="slotProps">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(slotProps.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(slotProps.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showRoleDialog(slotProps.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="dialogClose">
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="50%" @close="roleDialogClose">
      <span>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </span>
      <span slot="footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            required: true,
            min: 3,
            max: 10,
            message: '用户名的长度在3-10之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            required: true,
            min: 6,
            max: 15,
            message: '密码的长度在6-15之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '请输入电话号码',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确邮箱格式',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入电话号码',
            trigger: 'blur'
          },
          {
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '请输入正确电话号码',
            trigger: 'blur'
          }
        ]
      },
      // 角色框可视
      roleDialogVisible: false,
      // 角色信息
      userInfo: {},
      // 角色列表
      roleList: [],
      // 选中的角色
      selectRole: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败  ')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    handleCurrentChange(num) {
      this.queryInfo.pagenum = num
      this.getUserList()
    },
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    async changeStatus(obj) {
      const { data: res } = await this.$http.put(
        `users/${obj.id}/state/${obj.mg_state}`
      )
      if (res.meta.status !== 200) {
        obj.status = !obj.status
        return this.$Message.error('更新用户状态失败')
      }
      return this.$Message.success('用户更新成功')
    },
    dialogClose() {
      this.$refs['addFormRef'].resetFields()
    },
    addUser() {
      this.$refs['addFormRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status != 201) {
          return this.$Message.error('添加用户失败')
        }
        this.dialogVisible = false
        this.$Message.success('添加用户成功')
        this.getUserList()
      })
    },
    // 显示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status != 200) {
        return this.$Message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    /* 关闭修改用户对话框 */
    editDialogClose() {
      this.$refs['editFormRef'].resetFields()
    },
    editDialogInfo() {
      this.$refs['editFormRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('修改用户信息失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 更新列表
        this.getUserList()
        // 提示用户修改成功
        this.$Message.success('修改用户成功')
      })
    },
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$Message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除用户失败')
      }
      this.$Message.success('删除成功')
      this.getUserList()
    },
    async showRoleDialog(role) {
      this.userInfo = role
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取角色失败')
      }
      this.roleList = res.data

      this.roleDialogVisible = true
    },
    async saveRoleInfo() {
      if (!this.selectRole) {
        return this.$Message.error('请选中用户角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRole
        }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('更新角色失败')
      }
      this.$Message.success('更新角色成功')
      this.getUserList()
      this.roleDialogVisible = false
    },
    roleDialogClose() {
      this.selectRole = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
