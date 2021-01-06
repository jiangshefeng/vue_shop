<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 表单登录区域 -->
      <el-form label-width="0px" class="login_form" :model="form" :rules="loginRules" ref="formDom">
        <!-- 用户名 -->
        <el-form-item prop="name">
          <el-input prefix-icon="el-icon-s-custom" placeholder="用户名" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pw">
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="密码"
            show-password
            v-model="form.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reSetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在3到10个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在6到15个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    reSetLogin() {
      this.$refs.formDom.resetFields()
    },
    login() {
      this.$refs.formDom.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('login', this.form)

        if (res.meta.status != 200) {
          this.$Message.error('登录失败!')
          return
        }
        this.$Message.success('登录成功!')
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: skyblue;
  height: 100%;
}
.login_box {
  width: 550px;
  height: 350px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px #c0c0c0;
  .avatar_box {
    height: 160px;
    width: 160px;
    border: 1px solid #c0c0c0;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 0 20px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .btns {
    margin: 20px 0px;
    display: flex;
    justify-content: center;
  }
  .login_form {
    transform: translate(-50%, -30%);
    position: absolute;
    bottom: 50px;
    width: 80%;
    left: 50%;
    top: 50%;
    box-sizing: border-box;
  }
}
</style>
