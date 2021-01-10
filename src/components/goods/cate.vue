<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/rights' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格视图 -->
      <tree-table
        :data="cataList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="tree"
      >
        <template v-slot:isOk="props">
          <i class="el-icon-success" v-if="props.row.cat_deleted===false" style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template v-slot:order="props">
          <el-tag v-if="props.row.cat_level=='0'">标签一</el-tag>
          <el-tag type="success" v-else-if="props.row.cat_level=='1'">标签二</el-tag>
          <el-tag type="warning" v-else>标签三</el-tag>
        </template>
        <template v-slot:opt="props">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(props.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteById(props.row.cat_id)"
          >删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            clearable
            v-model="selectedKeys"
            :options="parentLists"
            :props="cascaderProps"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="addCateFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="活动名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: { type: 3, pagenum: 1, pagesize: 5 },
      // 商品分类的数据列表
      cataList: [],
      // 总条数
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', template: 'isOk', type: 'template' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentLists: [],
      selectedKeys: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      editDialogVisible: false,
      editForm: [],
      editId: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$Message.error('获取商品分类失败')
      }

      // 获取数据列表
      this.cataList = res.data.result
      // 获取总条数
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentLists()
      this.addCateDialogVisible = true
    },
    async getParentLists() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$Message.error('获取父级列表失败')
      }
      this.parentLists = res.data
    },
    // 选中发生变化触发函数
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs['addCateFormRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$Message.error('添加分类失败')
        }
        this.$Message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
      console.log(this.addCateForm)
    },
    addCateDialogClosed() {
      this.$refs['addCateFormRef'].resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    async showEditDialog(id) {
      this.editId = id
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        this.$Message.error('获取分类失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogInfo() {
      this.$refs['editFormRef'].validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(
          'categories/' + this.editId,
          {
            cat_name: this.editForm.cat_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$Message.error('编辑分类失败')
        }
        this.$Message.success('修改分类成功')
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    async deleteById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (result !== 'confirm') {
        return this.$Message.info('取消删除操作')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$Message.error('删除分类失败')
      }
      this.$Message.success('删除分类成功')
      this.getCateList()
    }
  }
}
</script>
<style lang="less" scoped>
.tree {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
