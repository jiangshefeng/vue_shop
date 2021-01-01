<template>
  <div>
    <el-button type="info" @click="logOut">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logOut() {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>
