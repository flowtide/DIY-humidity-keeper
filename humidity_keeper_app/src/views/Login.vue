<template>
  <b-container class="bv-example-row">
  <b-row class="justify-content-md-center">
    <b-col sm="6">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-card-group style="text-align:center;">
          <b-card 
          header="로그인"
          header-text-variant="white"
          header-tag="header"
          header-bg-variant="dark"
          footer-tag="footer"
          footer-bg-variant="#eee"
          footer-border-variant="gray"
          style="box-shadow: 5px 5px 5px 5px #eee;color: #5b5d5f;margin-top:100px;"
        >  
      <b-form-group
        label-cols="4" label-cols-lg="2" label-size="sm"
        id="input-group-userId"
        label="사용자 ID:"
        label-for="login-userId"
        style="padding-top:20px"
      >
        <b-form-input
          id="login-userId"
          v-model="form.userId"
          type="text"
          required
          autocomplete="username"
          placeholder="Enter user id"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        label-cols="4" label-cols-lg="2" label-size="sm"
        id="input-group-password"
        label="패스워드:"
        label-for="input-password"
      >
        <b-form-input
          id="input-password"
          v-model="form.password"
          type="password"
          autocomplete="current-password"
          :disabled='!this.form.userId.length' 
        ></b-form-input>
      </b-form-group>

      <div style="padding-top:30px;">
      	<b-button type='submit' :disabled='isDisabled || !this.form.userId.length' variant="info">로그인</b-button>
      </div>

    </b-card>
    </b-card-group>
    </b-form>
    
    <b-card class="mt-3" header="Error" v-if="error">
      <pre class="m-0">{{ this.error }}</pre>
    </b-card>
    </b-col >

  </b-row >

</b-container>
</template>

<script>
import { mapActions } from "vuex"

export default {
  // 데이터 객체
  data() {
    return {
      form: {
        userId: '',
        password: '',
      },
      show: true,
      isDisabled: false,
      error: ''
    }
  },
  // Vue 인스턴스에 추가할 메소드
  methods: {
    ...mapActions(["login"]),

    onSubmit(evt) {
      evt.preventDefault()
      this.handleLogin(this.form.userId, this.form.password)
    },
    
    async handleLogin(userId, password) {
      this.isDisabled = true
      try {
        await this.login({ userId: userId, password: password})
        if (this.$route.params.nextUrl) {
          console.log('nextUrl', this.$route.params.nextUrl)
          this.$router.push(this.$route.params.nextUrl)
        }
        else {
          //let user = this.$store.getters.currentUser
          let user = this.$store.state.user
          console.log('current-user:', user)
          if(user.admin) {
            this.$router.push('/')
          }
          else {
            this.$router.push('/')
          }
        }
      } catch (error) {
        this.$emit('loadingOff')
        this.error = error
        console.log('login error: ', error)
      }
      this.isDisabled = false
    },

    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.form.user = ''
      this.form.password = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
  mounted() {
  },
}

</script>
<style scoped>
.b-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
</style>
