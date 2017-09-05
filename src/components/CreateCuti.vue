<template>
  <div style="width:75%;margin:0 auto;">
    <md-card style="background-color:rgba(255,255,255, 0.6)">
      <md-card-header>
        <h2>Formulir permohonan cuti akademik</h2>
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
              build
              <md-tooltip>Program studi</md-tooltip>
            </md-icon>
            <label>Program studi</label>
            <md-input  v-model="mhs.program_studi"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              date_range
              <md-tooltip>Semester tahun akademik</md-tooltip>
            </md-icon>
            <label>Semester/Tahun Akademik</label>
            <md-input  v-model="mhs.semester_tahun_akademik"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              home
              <md-tooltip>Alamat rumah</md-tooltip>
            </md-icon>
            <label>Alamat rumah</label>
            <md-textarea  v-model="mhs.alamat_rumah"></md-textarea>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              phone
              <md-tooltip>Telepon</md-tooltip>
            </md-icon>
            <label>Telepon/Hp </label>
            <md-input v-model="mhs.telepon"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              assignment_turned_in
              <md-tooltip>Jumlah sesmter yang telah di selesaikan</md-tooltip>
            </md-icon>
            <label>Jumlah semester yang telah di selesaikan</label>
            <md-input  v-model="mhs.jumlah_semester_diselesaikan"></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              check_circle
              <md-tooltip>Jumlah sks yang telah di peroleh</md-tooltip>
            </md-icon>
            <label>Jumlah SKS yang telah di peroleh</label>
            <md-input  v-model="mhs.jumlah_sks_diperoleh "></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              donut_large
              <md-tooltip>IPK yang telah di peroleh</md-tooltip>
            </md-icon>
            <label>IPK yang telah diperoleh</label>
            <md-input  v-model="mhs.ipk_diperoleh "></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              event_seat
              <md-tooltip>permohonan cuti akademik pada semester</md-tooltip>
            </md-icon>
            <label>Cuti akademik pada semester</label>
            <md-input  v-model="mhs.cuti_di_semester "></md-input>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              event
              <md-tooltip>Tahun akademik</md-tooltip>
            </md-icon>
            <label>Tahun akademik </label>
            <md-select name="movie" id="movie" v-model="mhs.cuti_tahun_akademik ">
              <md-option v-for="item in 18" :value="2019 - item"> {{ 2019 - item }} </md-option>
            </md-select>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              label
              <md-tooltip>karena</md-tooltip>
            </md-icon>
            <label>Di karenakan </label>
            <md-textarea v-model="mhs.karena"></md-textarea>
          </md-input-container>

          <md-input-container class="input">
            <md-icon class="md-primary">
              receipt
              <md-tooltip>dimana</md-tooltip>
            </md-icon>
            <label>Di  *ex bogor</label>
            <md-input v-model="mhs.di"></md-input>
          </md-input-container>
        </div>
        <md-button class="md-raised md-primary" @click.native.prevent="sendCutiWs(mhs)">Kirim</md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
  export default {
    sockets: {
      mhsInsertCutiFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.$swal('Sukses', 'Permintaan berhasil di kirim', 'success')
            this.$router.push('/home/cuti')
          }
        }
      }
    },
    data () {
      return {
        mhs: {
          nama_lengkap: null,
          npm: null,
          program_studi: null,
          semester_tahun_akademik: null,
          alamat_rumah: null,
          telepon: null,
          jumlah_semester_diselesaikan: 0,
          jumlah_sks_diperoleh: 0,
          ipk_diperoleh: 0,
          cuti_di_semester: 0,
          cuti_tahun_akademik: null,
          karena: null,
          di: null
        }
      }
    },
    methods: {
      getMahasiswa () {
        // let mhs = this.$localStorage.get('auth').user
        // this.$http.get(this.$config.API + 'api/mhs/' + mhs.npm)
        // .then(resp => {
        //   this.mhs = resp.body.data
        // })
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
      sendCutiWs (item) {
        let data = {
          npm: this.$localStorage.get('auth').user.npm,
          token: this.$localStorage.get('auth').token,
          mahasiswa: this.mhs
        }
        this.$socket.emit('mhsInsertCuti', data)
      },
      sendCuti () {
        this.$http.post(this.$config.API + 'api/cuti/create', {
          npm: this.$localStorage.get('auth').user.npm,
          telepon: this.mhs.telepon,
          pada_semester: this.padaSemester,
          karena: this.karena,
          tahun_akademik: this.tahunAkademik,
          di: this.di
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
            this.$router.push('/home/cuti')
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
