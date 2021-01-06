<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/head.jpg" alt />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="toggleWidth">
        <div class="toggleButton" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :collapse="isCollapse"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#4F9DFE"
          :unique-opened="true"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="String(item.id)" v-for="item in this.menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="String(subItem.path) "
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-help',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data'
      },
      isCollapse: false
    }
  },
  computed: {
    toggleWidth() {
      return this.isCollapse ? '64px' : '200px'
    },
    activePath() {
      const path = this.$route.path.split('/')
      const activePath = path[path.length - 1]
      return activePath
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logOut() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.message)
      }
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 100%;
      margin-right: 15px;
    }
  }
  color: white;
  padding-left: 0px;
}
.el-aside {
  background-color: #313743;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: snow;
}
.home-container {
  height: 100%;
}
.toggleButton {
  color: white;
  background-color: #495065;
  text-align: center;
  cursor: pointer;
  letter-spacing: 2px;
  font-size: 14px;
  line-height: 24px;
}
</style>
