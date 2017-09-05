<template>

  <div style="width:100%;">
    <md-card  style="width:100%;">
      <div v-if="loading_picture == true">
        Loading...
      </div>
      <md-card-media>
        <div style="position:absolute;right:5px;bottom:5px;background-color:rgba(0,0,0,0.8);padding:3px 10px 3px 10px;">
          <a href="" v-if="t_foto == false" @click.prevent = "t_foto = true" style="color:white;">
            ganti foto
            <md-icon style="">create</md-icon>
          </a>
          <a href="" v-if="t_foto == true" @click.prevent = "t_foto = false" style="color:white;"> 
            Cancel
          </a>
        </div>
        <div v-if="t_foto == false">
          <img v-if="mahasiswa.foto == null" src="/static/drawing.png" alt="">
          <div v-else-if = "mahasiswa.foto != null" style="width:200px;margin:0 auto;">
            <md-avatar class="md-large" style="width:200px;height:200px;">
              <img :src="mahasiswa.foto" alt="People">
            </md-avatar>
          </div>
        </div>
        <div v-if="t_foto == true">
          <picture-input 
            ref="pictureInput" 
            @change="onChange" 
            width="300" 
            height="200" 
            margin="8" 
            accept="image/jpeg,image/png" 
            size="10" 
            buttonClass="btn"
            :customStrings="{
              upload: '<h1>Bummer!</h1>',
              drag: 'drag atau klik.'
            }">
          </picture-input>
          <button 
          @click.prevent = "gantiFoto()"
          style="display:block;margin:0 auto;border:0px;color:white;
          background-color:dodgerblue;padding:5px 10px 5px 10px;cursor:pointer;"
            > ganti 
          </button>
        </div>
      </md-card-media>

      <md-card-header style="text-align:center;">
        <div> 
          <b>Nama Lengkap</b> 
          <small><a href="" v-if="t_nama_lengkap == false" @click.prevent = "t_nama_lengkap = true" style="position:absolute;right:5px;"> Ganti </a></small> 
          <small><a href="" v-if="t_nama_lengkap == true" @click.prevent = "t_nama_lengkap = false" style="position:absolute;right:5px;"> Cancel </a></small> 
        </div>
        <div v-if="t_nama_lengkap == false">{{ mahasiswa.nama_lengkap }}</div>
        <div v-if="t_nama_lengkap == true">
          <input @keyup.enter.prevent = "gantiNamaLengkap()" type="text" v-model = "nama_lengkap" :placeholder = "mahasiswa.nama_lengkap">
          <button 
          @click.prevent = "gantiNamaLengkap()"
          style="display:block;margin:0 auto;border:0px;color:white;
          background-color:dodgerblue;padding:2px 10px 2px 10px;cursor:pointer;"
            > ganti 
          </button>
        </div>
        <hr>
        <div> <b> Username </b> 
          <small><a href="" v-if="t_username == false" @click.prevent = "t_username = true" style="position:absolute;right:5px;"> Ganti </a></small> 
          <small><a href="" v-if="t_username == true" @click.prevent = "t_username = false" style="position:absolute;right:5px;"> Cancel </a></small> 
        </div>
        <div v-if="t_username == false"> {{ mahasiswa.username }} </div>
        <div v-if="t_username == true">
          <input @keyup.enter.prevent = "gantiUsername()" type="text" v-model = "username" :placeholder = "mahasiswa.username">
          <button 
          @click.prevent = "gantiUsername()"
          style="display:block;margin:0 auto;border:0px;color:white;
          background-color:dodgerblue;padding:2px 10px 2px 10px;cursor:pointer;"
            > ganti 
          </button>
        </div>
        <hr>
        <a href="" v-if="t_password == false" @click.prevent = "t_password = true"> Ganti Password </a>
        <a href="" v-if="t_password == true" @click.prevent = "t_password = false"> Cancel Ganti Password</a>
        <div v-if="t_password == true">
          <input type="text" v-model="password_lama" placeholder="password lama">
          <input type="text" v-model="password_baru" placeholder="password baru">
          <button 
          @click.prevent = "gantiPassword()"
          style="display:block;margin:0 auto;border:0px;color:white;
          background-color:dodgerblue;padding:2px 10px 2px 10px;cursor:pointer;"
            > ganti 
          </button>
        </div>
      </md-card-header>

    </md-card>
  </div>

</template>

<script>
  import PictureInput from 'vue-picture-input'
  export default {
    components: {
      PictureInput
    },
    data () {
      return {
        mahasiswa: {
          foto: null
        },
        t_nama_lengkap: false,
        nama_lengkap: null,
        t_username: false,
        username: null,
        t_foto: false,
        foto: null,
        t_password: false,
        password_lama: null,
        password_baru: null,
        loading_picture: false
      }
    },
    methods: {
      getMahasiswa () {
        this.$http.get(this.$config.API + 'api/mhs/' + this.$localStorage.get('auth').user.npm, {
          headers: {
            Authorization: this.$localStorage.get('auth').token
          }
        })
        .then(resp => {
          console.log(resp)
          this.mahasiswa = resp.body.data
        })
      },
      gantiNamaLengkap () {
        this.$http.post(this.$config.API + 'api/mhs/ganti', {
          nama_lengkap: this.nama_lengkap
        }, {
          headers: {
            Authorization: this.$localStorage.get('auth').token
          }
        })
        .then(resp => {
          if (resp.body.success === true) {
            this.$swal('sukes', 'berhasil update nama lengkap', 'success')
            this.t_nama_lengkap = false
            this.nama_lengkap = null
            this.getMahasiswa()
          }
        })
      },
      gantiUsername () {
        this.$http.post(this.$config.API + 'api/mhs/ganti', {
          username: this.username
        }, {
          headers: {
            Authorization: this.$localStorage.get('auth').token
          }
        })
        .then(resp => {
          if (resp.body.success === true) {
            this.$swal('sukes', 'berhasil update username', 'success')
            this.t_username = false
            this.username = null
            this.getMahasiswa()
          }
        })
      },
      gantiFoto () {
        this.$http.post(this.$config.API + 'api/mhs/ganti', {
          foto: this.foto
        }, {
          headers: {
            Authorization: this.$localStorage.get('auth').token
          }
        })
        .then(resp => {
          console.log(resp)
          if (resp.body.success === true) {
            this.$swal('sukes', 'berhasil update Foto', 'success')
            this.t_foto = false
            this.foto = null
            this.getMahasiswa()
          }
        })
      },
      onChange () {
        this.loading_picture = true
        this.foto = this.$refs.pictureInput.image
        // console.log(this.$refs.pictureInput.image)
        if (this.$refs.pictureInput.image) {
          this.loading_picture = false
        } else {
          console.log('FileReader API not supported: use the <form>, Luke!')
        }
      },
      gantiPassword () {
        this.$http.post(this.$config.API + 'api/mhs/ganti', {
          password_lama: this.password_lama,
          password_baru: this.password_baru
        }, {
          headers: {
            Authorization: this.$localStorage.get('auth').token
          }
        })
        .then(resp => {
          console.log(resp)
          if (resp.body.success === true) {
            this.$swal('sukes', 'berhasil update Password', 'success')
            this.t_password = false
            this.password_lama = null
            this.password_baru = null
            this.getMahasiswa()
          }
          if (resp.body.success === false) {
            this.$swal('Gagal', resp.body.msg, 'error')
            this.t_password = false
            this.password_lama = null
            this.password_baru = null
          }
        })
      }
    },
    mounted () {
      this.getMahasiswa()
    }
  }

</script>
