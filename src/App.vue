<template>
  <div id="app">
    <md-toolbar>
      <h2 class="md-title" style="flex: 1;cursor:pointer;" 
      @click="$router.push('/')">Mahasiswa</h2>

      <md-button class="md-icon-button" @click=" menu = false " v-if="$localStorage.get('auth').logged === true">
        <md-icon>menu</md-icon>
      </md-button>

      <md-button class="" @click="$router.push('/login')" v-if="$localStorage.get('auth').logged === false">
        login
      </md-button>
    </md-toolbar>

    <md-layout md-gutter md-align="center" style="padding-top:10px;">
      <md-layout md-flex-xsmall="80" md-flex-small="60" md-flex-medium="70" md-flex-large="55">
        <router-view style="width:100%;"></router-view>
      </md-layout>
    </md-layout>

    <div class="modal trigerBlock " :class="{ triggerNone : menu }">
      <md-button class="md-icon-button close" @click="menu = true">
        <md-icon class="md-size-2x">close</md-icon>
      </md-button>
      <div style="">
        <button @click.prevent = "goMenu('/home/cuti')" class="menu-btn">Cuti</button>
        <button @click.prevent = "goMenu('/home/aktif')" class="menu-btn">Aktif kuliah</button>
        <button class="menu-btn" @click.prevent = "logout()">logout</button>
      </div>
    </div>
    
  </div>
</template>

<script>
import Push from 'push.js'
export default {
  sockets: {
    sendMsgFromBaakF (val) {
      if (val.resp.success === true) {
        if (val.npm === this.$localStorage.get('auth').user.npm) {
          this.play()
          // Push.create('Pesan baru', {
          //   body: 'BAAK : ' + val.resp.data_back.msg,
          //   icon: '/static/stikom.png',
          //   timeout: 4000,
          //   onClick: function () {
          //     window.focus()
          //     this.close()
          //   }
          // })
          this.push('Baak : ' + val.resp.data_back.msg)
        }
      }
    },
    gantiMhsCutiStatusFeedback (val) {
      if (val.npm === this.$localStorage.get('auth').user.npm) {
        if (val.resp.success === true) {
          let msg = null
          if (val.resp.status_back.toString() === '2') {
            msg = 'Mahasiswa cuti anda di tolak.'
          }
          if (val.resp.status_back.toString() === '5') {
            msg = 'Anda diterima mahasiswa cuti.'
          }
          this.play()
          // Push.create('Notification', {
          //   body: msg,
          //   icon: '/static/stikom.png',
          //   timeout: 4000,
          //   onClick: function () {
          //     window.focus()
          //     this.close()
          //   }
          // })
          this.push(msg)
        }
      }
    },
    gantiBaakCutiStatusFeedback (val) {
      if (val.npm === this.$localStorage.get('auth').user.npm) {
        if (val.resp.success === true) {
          let msg = null
          if (val.resp.status_back.toString() === '5') {
            msg = 'Anda menjadi mahasiswa cuti.'
          }
          if (val.resp.status_back.toString() === '2') {
            msg = 'Anda di tolak mahasiswa cuti.'
          }
          if (val.resp.status_back.toString() === '3') {
            msg = 'Anda mempunyai pembayaran untuk menjadi mahasiswa cuti.'
          }
          this.play()
          // Push.create('Notification', {
          //   body: msg,
          //   icon: '/static/stikom.png',
          //   timeout: 4000,
          //   onClick: function () {
          //     alert('wokee')
          //     window.focus()
          //     this.close()
          //   }
          // })
          this.push(msg)
        }
      }
    },
    gantiBaakAktifStatusFeedback (val) {
      if (val.npm === this.$localStorage.get('auth').user.npm) {
        if (val.resp.success === true) {
          let msg = null
          if (val.resp.status_back.toString() === '5') {
            msg = 'Anda menjadi mahasiswa aktif kuliah.'
          }
          if (val.resp.status_back.toString() === '2') {
            msg = 'Anda di tolak mahasiswa aktif kuliah.'
          }
          if (val.resp.status_back.toString() === '3') {
            msg = 'Anda mempunyai pembayaran untuk menjadi mahasiswa aktif kuliah.'
          }
          this.play()
          // Push.create('Notification', {
          //   body: msg,
          //   icon: '/static/stikom.png',
          //   timeout: 4000,
          //   onClick: function () {
          //     alert('wokee')
          //     window.focus()
          //     this.close()
          //   }
          // })
          this.push(msg)
        }
      }
    }
  },
  name: 'app',
  data () {
    return {
      menu: true,
      width: 1
    }
  },
  methods: {
    logout () {
      this.$localStorage.set('auth', {
        logged: false,
        token: null
      })
      this.menu = true
      this.$router.push('/login')
    },
    goMenu (url) {
      this.menu = true
      this.$router.push(url)
    },
    play () {
      var audio = new Audio('/static/music/served.mp3')
      audio.play()
    },
    push (msg, title = 'Notification') {
      Push.create(title, {
        body: msg,
        icon: '/static/stikom.png',
        timeout: (99999 * 99999 * 99999 * 99999 * 99999 * 999999 * 999999 * 999999) * 999999999,
        requireInteraction: true,
        onClick: function () {
          window.focus()
          this.close()
        }
      })
    }
  }
}
</script>

<style scoped>
.modal {
  width:100%;
  height:100vh;
  background-color:rgba(0,0,0,0.85);
  position:fixed;
  top:0;
  z-index:1;
}

.triggerBlock {
  display:block;
}

.triggerNone {
  display:none;
}

.close {
  position:absolute;
  top:10px;
  right:10px;
  color:red;
}

.menu-btn {
  width:70%;
  padding:15px;
  background-color:dodgerblue;
  color:white;
  font-size:24px;
  border:0px;
  margin:0 auto;
  display:block;
  margin-top:10px;
  cursor:pointer;
}
</style>
