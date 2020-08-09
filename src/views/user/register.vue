<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="title">会员管理系统 - 注册</h1>
      <el-form ref="ruleForm"
               :model="formData"
               :rules="rules"
               label-width="0"
               size="mini">
        <el-form-item prop="username">
          <el-input prefix-icon="el-input__icon el-icon-s-custom"
                    placeholder="请输入用户名"
                    v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    prefix-icon="el-input__icon el-icon-s-cooperation"
                    placeholder="请输入密码"
                    v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input type="password"
                    prefix-icon="el-input__icon el-icon-s-cooperation"
                    placeholder="请再次确认密码"
                    v-model="formData.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%"
                     type="primary"
                     @click="submitForm">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    const validatePassWord = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      redirect: '',
      formData: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePassWord, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler (route) {
        this.redirect = route.query.redirect || ''
      },
      immediate: true
    }
  },
  methods: {
    // 登陆
    submitForm () {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          this.$store.dispatch('user/register', {
            username: this.formData.username,
            password: this.formData.password
          }).then(res => {
            this.$message.success('注册成功，请登陆！')
            this.$router.push({ path: '/login' })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
// 外边框
.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
  background: url(~@/assets/images/login-bg.png);
  background-size: 100% 100%;
  // 登录的中心盒子
  .login-content {
    position: absolute;
    border-radius: 5px;
    overflow: hidden;
    background: #fff;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -300px;
    width: 600px;
    height: 340px;
    padding: 20px 80px;
    .title {
      text-align: center;
      margin: 20px 0;
    }
    /deep/ .el-form {
      width: 100%;
    }
  }
}
</style>
