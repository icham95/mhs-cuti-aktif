<template>
  <div>
    
    <div style="width:75%;margin:0 auto;">
      <div style="background-color:#3f51b5; margin-bottom:10px;color:white;font-size:18px;margin-top:5px;">
        <div style="float:left;line-height:30px;padding-left:10px;">
          LIST CUTI
        </div>
        <div style="float:right;">
          <button 
            @click.prevent ="$router.push('/home/create-cuti')"
            style="display:inline-block;border-color:transparent;background-color:indigo;color:white;cursor:pointer;">
            <md-icon>chrome_reader_mode</md-icon>
            Permintaan cuti
          </button>
        </div>
        <div style="clear:both;"></div>
      </div>

      <md-card v-for="item in cutis" class="card " :class="cardChange(item.status)" style="">
        <div class="card-menu" style="">
          <button class="card-menu-btn" @click.prevent = "singleItem(item)">
            <md-icon>visibility</md-icon>
          </button>
          <button v-if="item.status == 5" class="card-menu-btn" @click.prevent = "toPdf(item)">
            <md-icon>picture_as_pdf</md-icon>
          </button>
        </div>

        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{ item.c_npm }}</div>
            <div class="">{{ item.mahasiswa_cuti_dibuat }}</div>
            <div> 
              Status
              <label class="" v-if="item.status == 1"> menunggu konfirmasi baak </label>
              <label style="" v-if="item.status == 2"> 
                <label style="">
                  ditolak 
                </label>
                <div style="background-color:rgba(0,0,0,0.60);color:snow;padding:10px;">
                  <label>Catatan : </label>
                  <label> {{item.catatan_lebih}} </label>
                </div>
              </label>
              <label class="" v-if="item.status == 3"> 
                <label for="">
                  Diterima tetapi lunasi terlebih dahulu
                </label>
                <div style="background-color:rgba(0,0,0,0.60);color:snow;padding:10px;margin-bottom:5px;">
                  Bayar : 
                  <label> {{item.tunggakan}} </label>
                </div>
                <div style="background-color:rgba(0,0,0,0.60);color:snow;padding:10px;">
                  Catatan : 
                  <label> {{item.catatan_lebih}} </label>
                </div>
              
                <md-button 
                  v-if="item.toggle_pembayaran == false"
                  style="margin-top:10px;"
                  class="md-raised md-primary" 
                  @click.native.prevent = "item.toggle_pembayaran = true">
                  Tampilkan form pembayaran
                  <md-icon v-if="item.toggle_pembayaran == false">keyboard_arrow_right</md-icon>
                </md-button>
                <md-button 
                  v-if="item.toggle_pembayaran == true"
                  style="margin-top:10px;"
                  class="md-raised md-primary" 
                  @click.native.prevent = "item.toggle_pembayaran = false">
                  Tampilkan form pembayaran
                  <md-icon v-if="item.toggle_pembayaran == true">keyboard_arrow_down</md-icon>
                </md-button>
              </label>
              <label class="" v-if="item.status == 4"> Menunggu konfirmasi pembayaran baak </label>
              <label class="" v-if="item.status == 5"> Mahasiswa cuti </label>
            </div>
          </md-card-header-text>
        </md-card-header>
        
        <md-card-content 
          style="background-color:snow; color:black;"
          v-if="item.status == 3 && item.toggle_pembayaran">
        <div>
          <h2> Form pembayaran </h2>
          <md-input-container>
            <label>Bank</label>
            <md-select name="movie" id="movie" v-model="item.pay_rekening_id">
              <md-option v-for="rek in rekening" :value="rek.id">
                {{ rek.nama_rekening }} | {{ rek.no_rekening }}
              </md-option>
            </md-select>
          </md-input-container>

          <md-input-container>
            <label>No rekening</label>
            <md-input v-model.trim="item.pay_no_rekening_mahasiswa" ></md-input>
          </md-input-container>

          <md-input-container>
            <label>Jumlah</label>
            <md-input v-model.trim="item.pay_jumlah" ></md-input>
          </md-input-container>

          <md-input-container>
            <label>Catatan</label>
            <md-textarea v-model="item.catatan_lebih2" ></md-textarea>
          </md-input-container>

          <form>
            <div v-if="loading_pembayaran_pic == true">
              Loading...
            </div>
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
                    drag: 'Bukti foto, drag atau klik.'
                  }">
            </picture-input>
          </form>

          <div style="margin-top:15px;width:100%;">
            <md-button 
              style="display:block;width:96%;"
              class="md-raised md-primary" 
              @click.native.prevent = "pembayaranStatusTiga(item)">
              Kirim
            </md-button>
          </div>
        </div>

        </md-card-content>

        <md-card-actions v-if="item.status == 40" >
          
        </md-card-actions>
      </md-card>
    </div>
    
  </div>
</template>

<script>
  import PictureInput from 'vue-picture-input'
  import JSPDF from 'jspdf'
  // import { mapGetters } from 'vuex'
  export default {
    sockets: {
      gantiMhsCutiStatusFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.getCutis()
          }
        }
      },
      mhsInsertCutiFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.$swal('Sukses', 'Permintaan berhasil di kirim', 'success')
            this.$router.push('/home/cuti')
          }
        }
      },
      mhsPembayaranStatusTigaFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.$swal('Sukses', 'Pembayaran terkirim', 'success')
            this.getCutis()
          }
        }
      },
      gantiBaakCutiStatusFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          this.getCutis()
        }
      },
      getCutisFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          let data = val.resp.data
          for (let i = 0; i < data.length; i++) {
            data[i].pay_rekening_id = null
            data[i].pay_jumlah = null
            data[i].pay_catatan_lebih2 = null
            data[i].pay_no_rekening_mahasiswa = null
            data[i].toggle_pembayaran = false
          }
          this.cutis = val.resp.data
          this.rekening = val.resp.rekening
        }
      },
      terimaPembayaranAdministrasiCutiFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.getCutis()
          }
        }
      },
      uploadCutiFeedbacks (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.$swal('Sukses', 'berhasil di upload', 'success')
            this.getCutis()
          } else {
            this.$swal('Opps', val.resp.msg, 'warning')
          }
        }
      },
      cancelPembayaranAdministrasiCutiFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.getCutis()
          }
        }
      }
    },
    components: {
      PictureInput
    },
    data () {
      return {
        files: [],
        image: null,
        image2: null,
        cutis: {},
        rekening: {},
        loading_pembayaran_pic: false
      }
    },
    methods: {
      singleItem (item) {
        let html = `
          <div> <b> Nama lengkap </b> </div>
          <div> ${item.c_nama_lengkap} </div>
          <hr>
          <div> <b> NPM </b> </div>
          <div> ${item.c_npm} </div>
          <hr>
          <div> <b> Program studi </b> </div>
          <div> ${item.c_program_studi} </div>
          <hr>
          <div> <b> Semester tahun akademik </b> </div>
          <div> ${item.c_semester_tahun_akademik} </div>
          <hr>
          <div> <b> Alamat rumah </b> </div>
          <div> ${item.c_alamat_rumah} </div>
          <hr>
          <div> <b> Telepon </b> </div>
          <div> ${item.c_telepon} </div>
          <hr>
          <div> <b> Jumlah semester diselesaikan </b> </div>
          <div> ${item.c_jumlah_semester_diselesaikan} </div>
          <hr>
          <div> <b> Jumlah sks diperoleh </b> </div>
          <div> ${item.c_jumlah_sks_diperoleh} </div>
          <hr>
          <div> <b> IPK </b> </div>
          <div> ${item.c_ipk_diperoleh} </div>
          <hr>
          <div> <b> Cuti pada semester </b> </div>
          <div> ${item.c_cuti_disemester} </div>
          <hr>
          <div> <b> Tahun </b> </div>
          <div> ${item.c_cuti_tahun_akademik} </div>
          <hr>
          <div> <b> Karena </b> </div>
          <div> ${item.c_karena} </div>
          <hr>
          <div> <b> Dibuat </b> </div>
          <div> ${item.dibuat} </div>
          <hr>
        `
        this.$swal({
          title: 'Detail',
          html: html,
          imageUrl: item.pic,
          imageWidth: 400,
          imageHeight: 200,
          animation: true
        })
      },
      cardChange (status) {
        if (status.toString() === '1') {
          return 'teal'
        }
        if (status.toString() === '2') {
          return 'red'
        }
        if (status.toString() === '3') {
          return 'indianred'
        }
        if (status.toString() === '4') {
          return 'sienna'
        }
      },
      pembayaranStatusTiga (item) {
        let data = {
          token: this.$localStorage.get('auth').token,
          npm: this.$localStorage.get('auth').user.npm,
          id: item.id,
          rekening_id: item.pay_rekening_id,
          no_rekening_mahasiswa: item.pay_no_rekening_mahasiswa,
          jumlah: item.pay_jumlah,
          catatan_lebih2: item.catatan_lebih2,
          pic: this.image,
          karyawan_id: item.karyawan_id
        }
        this.$socket.emit('mhsPembayaranStatusTiga', data)
      },
      upload (id) {
        let data = {
          id: id,
          pic: this.image,
          token: this.$localStorage.get('auth').token,
          npm: this.$localStorage.get('auth').user.npm
        }
        this.$socket.emit('uploadCuti', data)
      },
      onChange () {
        this.loading_pembayaran_pic = true
        this.image = this.$refs.pictureInput[0].image
        if (this.$refs.pictureInput[0].image) {
          this.loading_pembayaran_pic = false
        } else {
          console.log('FileReader API not supported: use the <form>, Luke!')
        }
      },
      getCutis () {
        this.$socket.emit('getCutis', {
          token: this.$localStorage.get('auth').token,
          npm: this.$localStorage.get('auth').user.npm
        })
      },
      toPdf (item) {
        let url = window.location.origin + '/static/stikom.png'
        this.$http.get(url, {
          responseType: 'blob'
        })
        .then(resp => {
          return resp.blob()
        })
        .then(data => {
          const reader = new FileReader()
          reader.onload = event => {
            let res = event.target.result
            let doc = new JSPDF()
            doc.addImage(res, 'PNG', 10, 10, 30, 20)
            doc.setFontSize(14)
            doc.text(105, 10, 'SEKOLAH TINGGI ILMU KOMPUTER (STIKOM) BINANIAGA', null, null, 'center')
            doc.setFontSize(10)
            doc.text(105, 15, 'Program Studi : S1 Sistem Informasi dan S1 Tehnik Informatika', null, null, 'center')
            doc.text(105, 20, 'Status "Terakreditasi"', null, null, 'center')
            doc.text(105, 25, 'Kampus : Jl. Mayor Oking Jayaatmaja No. 27 BOGOR', null, null, 'center')
            doc.text(105, 30, 'Telepon (0251) 8343980', null, null, 'center')
            doc.text(105, 35, 'Email : info@stikombinaniaga.ac.id', null, null, 'center')
            doc.setLineWidth(1.5)
            doc.line(200, 38, 10, 38)
            doc.setFontSize(16)
            doc.text(105, 50, 'FORMULIR PERMOHONAN CUTI AKADEMIK', null, null, 'center')
            // new line
            doc.setFontSize(12)
            doc.text(10, 65, 'Dengan ini saya, :')
            // new line
            doc.text(10, 75, 'Nama Mahasiswa')
            doc.text(80, 75, ':')
            doc.text(90, 75, item.c_nama_lengkap)
            // new line
            doc.text(10, 85, 'NPM')
            doc.text(80, 85, ':')
            doc.text(90, 85, item.c_npm)
            // new line
            doc.text(10, 95, 'Program Studi')
            doc.text(80, 95, ':')
            doc.text(90, 95, item.c_program_studi)
            // new line
            doc.text(10, 105, 'Semester/Tahun Akademik')
            doc.text(80, 105, ':')
            doc.text(90, 105, item.c_semester_tahun_akademik)
            // new line
            doc.text(10, 115, 'Alamat Rumah')
            doc.text(80, 115, ':')
            doc.text(90, 115, item.c_alamat_rumah)
            // new line
            doc.text(10, 125, 'Telepon/Hp')
            doc.text(80, 125, ':')
            doc.text(90, 125, item.c_telepon)
            // new line
            doc.text(10, 135, 'Jumlah semester yang telah diselesaikan')
            doc.text(100, 135, ':')
            doc.text(110, 135, item.c_jumlah_semester_diselesaikan)
            // new line
            doc.text(10, 145, 'Jumlah SKS yang telah diperoleh')
            doc.text(100, 145, ':')
            doc.text(110, 145, item.c_jumlah_sks_diperoleh)
            // new line
            doc.text(10, 155, 'IPK yang telah diperoleh')
            doc.text(100, 155, ':')
            doc.text(110, 155, item.c_ipk_diperoleh)
            // new line
            doc.text(10, 165, 'Mengajukan permohonan cuti akademik pada semester')
            doc.text(120, 165, item.c_cuti_disemester + ' / ')
            doc.text(130, 165, 'Tahun Akademik')
            doc.text(165, 165, '2017')
            // new line
            doc.text(10, 175, 'Dikarenakan : ')
            doc.text(40, 175, item.c_karena)
            // new line
            doc.text(10, 190, 'Demikian permohonan ini saya buat dengan sebenarnya.')
            doc.text(10, 200, 'Mengetahui,')
            // new line
            doc.text(120, 200, item.di + ', ')
            let dibuat = item.mahasiswa_cuti_dibuat
            let tanggal = dibuat.substr(8, 2)
            let bulan = dibuat.substr(5, 2)
            let tahun = dibuat.substr(0, 4)
            doc.text(140, 200, tanggal)
            doc.text(150, 200, '/')
            doc.text(155, 200, this.bulan(bulan))
            doc.text(175, 200, '/')
            doc.text(180, 200, tahun)
            // asd
            doc.text(10, 210, 'Wakil Ketua Bidang Akademik,')
            doc.text(10, 240, '.................................................')
            // asd
            doc.text(140, 210, 'Dosen Wali,')
            doc.text(140, 240, '.................................................')
            // asd
            doc.text(88, 250, 'Menyutujui,')
            doc.text(88, 260, 'Ka. BAAK')
            doc.text(70, 290, '.................................................')
            // end
            doc.save(item.c_npm + '-formulir-surat-permohonan-cuti-akademik.pdf')
          }
          reader.readAsDataURL(data)
        })
      },
      bulan (bulan) {
        bulan.toString()
        if (bulan === '01') {
          return 'januari'
        }
        if (bulan === '02') {
          return 'februari'
        }
        if (bulan === '03') {
          return 'maret'
        }
        if (bulan === '04') {
          return 'april'
        }
        if (bulan === '05') {
          return 'mei'
        }
        if (bulan === '06') {
          return 'juni'
        }
        if (bulan === '07') {
          return 'juli'
        }
        if (bulan === '08') {
          return 'agustus'
        }
        if (bulan === '09') {
          return 'september'
        }
        if (bulan === '10') {
          return 'oktober'
        }
        if (bulan === '11') {
          return 'november'
        }
        if (bulan === '12') {
          return 'desember'
        }
        return 'haha'
      }
    },
    // computed: {
    //   ...mapGetters([
    //     'cutis',
    //     'uploadFeedback'
    //   ])
    // },
    mounted () {
      this.getCutis()
    }
  }
</script>

<style scoped>
.card-menu {
  width: auto;
  height:auto;
  position: absolute;
  display: block;
  right:0px;
  z-index:2;
}
.card-menu-btn {
  padding:10px;
  border:0px;
  cursor:pointer;
  background-color:rgba(0,0,0,0.50);
  color:white;
  display:block;
  border-radius: 5px;
}
.card-menu-btn:hover {
  background-color:#3f51b5;
}

.card {
  width:100%;float:left;margin-right:10px;margin-bottom:10px;position:relative;
  background-color:rgba(0,180,0, 0.9);
  color:white;
}
.card:hover > .card-menu {
  display:block;
  border-radius: 5px;
}

.red {
  background-color:rgba(200, 0, 0, 0.8);
}
/* teal = status 1 */
.teal {
  background-color:rgba(0,0,200, 0.8);
}

.indianred {
  background-color:rgba(150, 30, 10, 0.9);
}
.sienna {
  background-color:rgba(197, 135, 78, 0.8);
}
</style>
