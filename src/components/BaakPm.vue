<template>
  <div>
    <md-whiteframe class="main">
      <div v-for="item in coremsg" v-if="coremsg != null" class="content">
        <div class="chat-baak" v-if="item.status == 2">
          <div class="info" style="background-color:teal;">
            <h2 style="text-align:center;color:white;">BAAK</h2>
          </div>
          <div class="msg">
            <div>
              {{ item.msg }}
            </div>
          </div>
          <div style="clear:both;"></div>
        </div>

        <div class="chat-mhs" v-if="item.status == 1">
          <div class="info" style="background-color:dodgerblue;">
            <h2 style="text-align:center;color:gold;">ME</h2>
          </div>
          <div class="msg">
            <div>
              {{ item.nama_lengkap }}
            </div>
            <div>
              {{ item.msg }}
            </div>
          </div>
          <div style="clear:both;"></div>
        </div>
      </div>
      <div class="bottom">
        <input type="text" v-model ="msg" @keyup.enter = "send()" style="border:1px solid gray;"> 
        <button @click.prevent = "send()">kirim</button>
      </div>
    </md-whiteframe>
  </div>
</template>

<script>
  export default {
    sockets: {
      sendMsgFromBaakF (val) {
        if (val.npm === this.$localStorage.get('auth').user.npm) {
          this.getChat()
        }
      },
      sendMsgFromMhsF (val) {
        if (val.npm === this.$localStorage.get('auth').user.npm) {
          this.getChat()
        }
      }
    },
    data () {
      return {
        msg: null,
        coremsg: null
      }
    },
    methods: {
      getChat () {
        this.$http.get(this.$config.API + 'api/chat/get/' + this.$localStorage.get('auth').user.npm, {
          headers: {
            Authorization: this.$localStorage.get('auth').token
          }
        })
        .then(resp => {
          this.coremsg = resp.body.data
        })
      },
      send () {
        this.$socket.emit('sendMsgFromMhs', {
          npm: this.$localStorage.get('auth').user.npm,
          msg: this.msg,
          token: this.$localStorage.get('auth').token
        })
        this.msg = null
      }
    },
    mounted () {
      this.getChat()
    }
  }
</script>
<style scoped>
.main {
  padding:10px;
  position:relative;
  width:100%;
  height: 80vh;
  background-color:white;
  overflow-y: scroll;
}
.bottom {
  width:100%;
  position:fixed;
  z-index:2;
  bottom:10px;
}
.bottom > input {
  width: 30%;
  padding: 10px;
}
.bottom > button {
  width: 10%;
  padding:10px;
  border:0px;
  background-color:dodgerblue;
  color:white;
}
.chat-baak {
  width:100%;
  margin-bottom: 10px;
}
.chat-baak > .info {
  float:left;width:20%;
}
.chat-baak > .msg {
  width: 80%;
  color:white;
  padding: 10px;
  float:left;
  background-color:rgba(0,0,0,0.5);
  min-height:55px;
}

.chat-mhs {
  width:100%;
}
.chat-mhs > .info {
  float:right;width:20%;
}
.chat-mhs > .msg {
  width: 80%;
  color:white;
  padding: 10px;
  float:right;
  background-color:rgba(0,0,0,0.7);
  min-height:55px;
  margin-bottom: 10px;
}
</style>
