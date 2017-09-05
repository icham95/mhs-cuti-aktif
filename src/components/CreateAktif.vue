<template>
  <div style="width:75%;margin: 0 auto;">
    <md-card style="background-color:rgba(255,255,255, 0.6)">
      <md-card-header>
        <h2>Formulir keterangan aktif kuliah</h2>  
      </md-card-header>
    
      <md-card-content>
        <div style="width:100%;">
          <md-input-container class="input">
            <md-icon class="md-primary">
              account_box
              <md-tooltip>Nama mahasiswa</md-tooltip>
            </md-icon>
            <label>Nama lengkap</label>
            <md-input v-model="mhs.nama_lengkap"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              assignment
              <md-tooltip>NPM</md-tooltip>
            </md-icon>
            <label>NPM</label>
            <md-input v-model="mhs.npm"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              date_range
              <md-tooltip>Semester</md-tooltip>
            </md-icon>
            <label>Semester</label>
            <md-input v-model="mhs.semester "></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              build
              <md-tooltip>Program studi</md-tooltip>
            </md-icon>
            <label>Program studi</label>
            <md-input v-model="mhs.program_studi"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              event
              <md-tooltip>tahun akademik</md-tooltip>
            </md-icon>
            <label>Tahun akademik</label>
            <md-input v-model="mhs.tahun_akademik"></md-input>
          </md-input-container>
          
          <md-input-container class="input">
            <md-icon class="md-primary">
              supervisor_account
              <md-tooltip>Nama orang tua</md-tooltip>
            </md-icon>
            <label>Nama orang tua</label>
            <md-input v-model="mhs.nama_orang_tua_wali"></md-input>
          </md-input-container>
          
          <md-input-container class="input">
            <md-icon class="md-primary">
              receipt
              <md-tooltip>NRP / NIP</md-tooltip>
            </md-icon>
            <label>NIP/NRP</label>
            <md-input v-model="mhs.nip_nrp "></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              star
              <md-tooltip>Pangkat</md-tooltip>
            </md-icon>
            <label>Pangkat</label>
            <md-input v-model="mhs.pangkat"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              stars
              <md-tooltip>Golongan</md-tooltip>
            </md-icon>
            <label>Golongan</label>
            <md-input v-model="mhs.golongan"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              store
              <md-tooltip>Instansi</md-tooltip>
            </md-icon>
            <label>Instansi</label>
            <md-input v-model="mhs.instansi"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              turned_in
              <md-tooltip>di</md-tooltip>
            </md-icon>
            <label>di</label>
            <md-input v-model="mhs.di"></md-input>
          </md-input-container>
        </div>

        <md-button class="md-raised md-primary" @click.native.prevent="mhsInsertAktif()">Kirim</md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  export default {
    sockets: {
      mhsInsertAktifFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.$swal('Sukses', 'Permintaan Aktif Kuliah Berhasil!', 'success')
            this.$router.push('/home/aktif')
          }
        }
      }
    },
    data () {
      return {
        mhs: {
          nama_lengkap: null,
          npm: null,
          semester: 0,
          program_studi: null,
          tahun_akademik: null,
          nama_orang_tua_wali: null,
          nip_nrp: null,
          pangkat: null,
          golongan: null,
          instansi: null,
          di: null
        }
      }
    },
    methods: {
      mhsInsertAktif () {
        let data = {
          npm: this.$localStorage.get('auth').user.npm,
          token: this.$localStorage.get('auth').token,
          mahasiswa: this.mhs
        }
        this.$socket.emit('mhsInsertAktif', data)
      },
      toRp (angka) {
        let rev = parseInt(angka, 10).toString().split('').reverse().join('')
        let rev2 = ''
        for (let i = 0; i < rev.length; i++) {
          rev2 += rev[i]
          if ((i + 1) % 3 === 0 && i !== (rev.length - 1)) {
            rev2 += '.'
          }
        }
        return 'Rp. ' + rev2.split('').reverse().join('') + ',00'
      },
      sendAktif () {
        this.$http.post(this.$config.API + 'api/aktif/create', {
          nip: this.nip,
          nrp: this.nrp,
          pangkat: this.pangkat,
          golongan: this.golongan,
          instansi: this.instansi,
          di: this.di
        }, {
          headers: {
            Authorization: this.$localStorage.get('auth').token
          }
        })
        .then(resp => {
          let data = resp.body
          console.log(data)
          if (data.success === true) {
            this.$swal({
              title: 'Sukses',
              text: 'Tinggal menunggu konfirmasi selanjut nya.',
              type: 'success'
            })
            this.$router.push('/home/aktif')
          } else if (data.success === false && data.type === 'validation') {
            this.$swal(
              'Maaf',
              data.msg,
              'error'
            )
          } else if (data.success === false && data.type === 'syarat') {
            let err = '<div>anda mempunyai : <div> \n'
            for (let i = 0; i < data.msg.length; i++) {
              if (data.msg[i].type === 'tunggakan') {
                for (let value in data.msg[i].data) {
                  let obj = data.msg[i].data[value]
                  err += '<div>tunggakan : ' + this.toRp(obj.tunggakan) + ' di semester ' + obj.semester + '</div>\n'
                }
              }
            }
            this.$swal(
              'Maaf',
              err,
              'error'
            )
          }
        })
      }
    },
    mounted () {
      this.getMahasiswa()
    }
  }
</script>

<style scoped>
.md-input-container.md-input-disabled label, .md-input-container.md-input-disabled input, .md-input-container.md-input-disabled textarea {
  color:rgba(0,0,0,0.75)
}
.md-input-container label {
  color:rgba(0,0,0,0.90)
}
</style>
