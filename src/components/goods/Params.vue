<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>属性管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert show-icon title="注意：只允许选择第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>请选择商品分类：</span>
          <el-cascader
            v-model="chooseList"
            :options="cateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs页标签 -->
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnIsDisabled"
            @click="paramsDialogVisible=true"
          >添加参数</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyDate" stripe border>
            <el-table-column type="expand">
              <template v-slot:default="props">
                <el-tag
                  v-for="(item,i) in props.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(i,props.row)"
                >{{item}}</el-tag>
                <el-input
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="props">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(props.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(props.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="动态属性" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnIsDisabled"
            @click="paramsDialogVisible=true"
          >添加属性</el-button>
          <!-- 动态属性表格 -->
          <el-table :data="manyDate" stripe border>
            <el-table-column type="expand">
              <template v-slot:default="props">
                <el-tag
                  v-for="(item,i) in props.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClosed(i,props.row)"
                >{{item}}</el-tag>
                <el-input
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(props.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot:default="props">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(props.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeParams(props.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加静态属性/动态对话框 -->
    <el-dialog
      :title="'添加'+titleName"
      :visible.sync="paramsDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addParams" :rules="addParamsRules" ref="addParamsRef" label-width="100px">
        <el-form-item :label="titleName" prop="attr_name">
          <el-input v-model="addParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsEvent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改属性/参数对话框 -->
    <el-dialog
      :title="'添加'+titleName"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editParams" :rules="editParamsRules" ref="editParamsRef" label-width="100px">
        <el-form-item :label="titleName" prop="attr_name">
          <el-input v-model="editParams.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      chooseList: [],
      activeName: 'only',
      manyDate: [],
      onlyDate: [],
      paramsDialogVisible: false,
      addParams: {
        attr_name: ''
      },
      addParamsRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editParams: {},
      editParamsRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$Message.error('获取商品列表失败')
      }
      this.cateList = res.data
    },
    handleChange() {
      this.getParamsDate()
    },
    tabClick() {
      console.log(this.activeName)
      this.getParamsDate()
    },
    async getParamsDate() {
      if (this.chooseList.length !== 3) {
        this.chooseList = []
        this.manyDate = []
        this.onlyDate = []
        return
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('获取属性失败')
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        this.manyDate = res.data
      } else {
        this.onlyDate = res.data
      }
    },
    addDialogClosed() {
      this.$refs['addParamsRef'].resetFields()
    },
    addParamsEvent() {
      this.$refs['addParamsRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addParams.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$Message.error('添加属性失败')
        }
        this.$Message.success('添加属性成功')
        this.paramsDialogVisible = false
        this.getParamsDate()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('获取参数信息失败')
      }

      this.editParams = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs['editParamsRef'].resetFields()
    },
    editParamsEvent() {
      this.$refs['editParamsRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editParams.attr_id}`,
          {
            attr_name: this.editParams.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('修改参数失败')
        }
        this.$Message.success('修改参数成功')
        this.editDialogVisible = false
        this.getParamsDate()
      })
    },
    async removeParams(id) {
      const result = await this.$confirm(
        '此操作将永久删除该属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$Message.info('以取消删除')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('删除参数失败')
      }
      this.$Message.success('删除成功')
      this.getParamsDate()
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.saveHandle(row)
    },
    showInput(row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClosed(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveHandle(row)
    },
    async saveHandle(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )
      if (res.meta.status !== 200) {
        return this.$Message.error('修改属性失败')
      }
      row.inputValue = ''
      this.$Message.success('修改属性成功')
    }
  },
  computed: {
    btnIsDisabled() {
      if (this.chooseList.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.chooseList.length !== 3) {
        return null
      }
      return this.chooseList[2]
    },
    titleName() {
      if (this.activeName === 'only') {
        return '静态属性'
      } else {
        return '动态参数'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0px;
}
.el-input {
  width: 120px;
}
</style>
