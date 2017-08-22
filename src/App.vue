<template>
  <div id="app">
    <md-toolbar>
      <h2 class="md-title" style="flex: 1">Mahasiswa</h2>

      <md-button class="md-icon-button" @click=" menu = false " v-if="$localStorage.get('auth').logged === true">
        <md-icon>menu</md-icon>
      </md-button>
    </md-toolbar>

    <md-layout md-gutter md-align="center" style="padding-top:10px;">
      <md-layout md-flex-xsmall="80" md-flex-small="60" md-flex-medium="50" md-flex-large="40">
        <router-view></router-view>
      </md-layout>
    </md-layout>

    <div class="modal trigerBlock " :class="{ triggerNone : menu }">
      <md-button class="md-icon-button close" @click="menu = true">
        <md-icon class="md-size-2x">close</md-icon>
      </md-button>
      <div style="">
        <button class="menu-btn">Kirim permintaan cuti</button>
        <button class="menu-btn">Aktif kuliah</button>
        <button class="menu-btn" @click.prevent = "logout()">logout</button>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      menu: true
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
