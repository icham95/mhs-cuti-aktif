<template>
  <div style="width:100%;">
    <md-card>
      <md-card-header>
        <div style="text-align:center;">
          <md-icon class="md-size-4x md-primary">lock</md-icon>
        </div>
      </md-card-header>
      <md-card-content>
        <form novalidate>
          <md-input-container md-clearable>
            <label style="color:crimson;" v-if="!$v.username.required">Username dibutuhkan.</label>
            <label style="color:crimson;" v-else-if="!$v.username.minLength">username minimal 4 huruf.</label>
            <label v-else>Username</label>
            <md-input v-model.trim="username" ></md-input>
          </md-input-container>

          <md-input-container md-has-password>
            <label style="color:crimson;" v-if="!$v.password.required"> Password dibutuhkan.</label>
            <label v-else>Password </label v-else>
            <md-input type="password" v-model.trim="password"></md-input>
          </md-input-container>

          <md-button class="md-raised md-primary" @click.native.prevent = "login()">
            Login
            <md-icon>keyboard_arrow_right</md-icon>
          </md-button>
        </form>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    data () {
      return {
        username: null,
        password: null
      }
    },
    validations: {
      username: {
        required,
        minLength: minLength(4)
      },
      password: {
        required
      }
    },
    methods: {
      login () {
        // this.$http.headers.common['Authorization'] = 'asdsad'
        this.$http.post(this.$config.API + 'api/mhs/login', {
          username: this.username,
          password: this.password
        })
        .then(resp => {
          console.log(resp)
          // get body data
          if (resp.body.success === true) {
            this.$localStorage.set('auth', {
              logged: true,
              token: resp.body.token,
              user: resp.body.user
            })
            this.$router.push('/home/cuti')
          } else {
            this.$swal(
              'Ooops...',
              resp.body.msg,
              'error'
            )
          }
        })
        .catch(response => {
          console.log(response)
        })
      }
    },
    mounted () {
      let auth = this.$localStorage.get('auth')
      if (auth.logged === true) {
        this.$router.push('/home/profile')
      }
      // this.$swal('hello')
    }
  }
</script>
