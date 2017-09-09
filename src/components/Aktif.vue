<template>
  <div style="width:75%;margin: 0 auto;">
    <div style="background-color:#3f51b5; margin:10px auto;color:white;font-size:18px;margin-top:5px;">
      <div style="float:left;line-height:30px;padding-left:10px;">
        LIST AKTIF
      </div>
      <div style="float:right;">
        <button 
          @click.prevent ="$router.push('/home/create-aktif')"
          style="display:inline-block;border-color:transparent;background-color:indigo;color:white;cursor:pointer;">
          <md-icon>chrome_reader_mode</md-icon>
          Permintaan Aktif
        </button>
      </div>
      <div style="clear:both;"></div>
    </div>

    <div>
      <div v-if="aktifs.length < 1 "> tidak ada mahasiswa aktif kuliah </div>
      <md-card v-for="item in aktifs" class="card" :class="cardChange(item.status)">
        <div class="card-menu">
          
          <button class="card-menu-btn" @click.prevent = "singleItem(item)">
            <md-icon>visibility</md-icon>
          </button>
          <button v-if="item.status == 5" class="card-menu-btn" @click.prevent = "toPdf(item)">
            <md-icon>picture_as_pdf</md-icon>
          </button>
        </div>

        <md-menu v-if="item.status == 10">
          <md-button class="md-fab md-mini md-fab-top-right" md-menu-trigger>
          <md-icon>print</md-icon>
        </md-button>

          <md-menu-content>
            <md-menu-item @click.native.prevent = "toPdf(item)">PDF</md-menu-item>
          </md-menu-content>
        </md-menu>
        
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{ item.c_npm }}</div>
            <div class="">{{ item.mahasiswa_aktif_kuliah_dibuat }}</div>
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
              <label class="" v-if="item.status == 5"> Mahasiswa aktif </label>
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
                @click.native.prevent = "pembayaranStatusTigaAktif(item)">
                Kirim
              </md-button>
            </div>
          </div>

        </md-card-content>

        <md-card-actions v-if="item.status == 40">
          <md-button v-if="item.status == 100" style="margin:0 auto;" class="md-raised md-primary" @click.native.prevent = "upload(item.id)">Upload</md-button>
          <md-button v-if="item.status == 30" style="margin:0 auto;" class="md-raised md-primary" @click.native.prevent = "pembayaranStatusTigaAktif(item)">Upload</md-button>
        </md-card-actions>
      </md-card>
    </div>
  </div>
</template>

<script>
  import JSPDF from 'jspdf'
  import PictureInput from 'vue-picture-input'
  export default {
    sockets: {
      gantiBaakAktifStatusFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          this.getAktif()
        }
      },
      mhsPembayaranStatusTigaAktifFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.$swal('sukses', 'Pembayaran berhasil', 'success')
            this.getAktif()
          }
        }
      },
      uploadAktifFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.$swal('Sukses', 'berhasil di upload', 'success')
            this.getAktif()
          } else {
            this.$swal('Opps', 'Gamabar belum di pilih', 'warning')
          }
        }
      },
      getMhsAktifFeedback (val) {
        console.log(val)
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            let data = val.resp.data
            for (let i = 0; i < data.length; i++) {
              data[i].pay_rekening_id = null
              data[i].pay_no_rekening_mahasiswa = null
              data[i].pay_jumlah = null
              data[i].catatan_lebih2 = null
              data[i].toggle_pembayaran = false
            }
            this.aktifs = val.resp.data
            this.rekening = val.resp.rekening
          }
        }
      },
      terimaPembayaranAdministrasiAktifFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.getAktif()
          }
        }
      },
      cancelPembayaranAdministrasiAktifFeedback (val) {
        if (this.$localStorage.get('auth').user.npm === val.npm) {
          if (val.resp.success === true) {
            this.getAktif()
          }
        }
      }
    },
    components: {
      PictureInput
    },
    data () {
      return {
        aktifs: {},
        files: [],
        image: null,
        image2: null,
        rekening: null
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
          <div> <b> Semester </b> </div>
          <div> ${item.c_semester} </div>
          <hr>
          <div> <b> Program studi </b> </div>
          <div> ${item.c_program_studi} </div>
          <hr>
          <div> <b> Tahun akademik </b> </div>
          <div> ${item.c_tahun_akademik} </div>
          <hr>
          <div> <b> Nama orang tua/wali </b> </div>
          <div> ${item.c_nama_orang_tua_wali} </div>
          <hr>
          <div> <b> NIP/NRP </b> </div>
          <div> ${item.c_nip_nrp} </div>
          <hr>
          <div> <b> Pangkat </b> </div>
          <div> ${item.c_pangkat} </div>
          <hr>
          <div> <b> Golongan </b> </div>
          <div> ${item.c_golongan} </div>
          <hr>
          <div> <b> Instansi </b> </div>
          <div> ${item.c_instansi} </div>
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
      pembayaranStatusTigaAktif (item) {
        let data = {
          token: this.$localStorage.get('auth').token,
          npm: this.$localStorage.get('auth').user.npm,
          id: item.mahasiswa_aktif_kuliah_id,
          rekening_id: item.pay_rekening_id,
          no_rekening_mahasiswa: item.pay_no_rekening_mahasiswa,
          jumlah: item.pay_jumlah,
          catatan_lebih2: item.catatan_lebih2,
          pic: this.image,
          karyawan_id: item.karyawan_id
        }
        this.$socket.emit('mhsPembayaranStatusTigaAktif', data)
      },
      getAktif () {
        let data = {
          npm: this.$localStorage.get('auth').user.npm,
          token: this.$localStorage.get('auth').token
        }
        this.$socket.emit('getMhsAktif', data)
      },
      upload (id) {
        let data = {
          npm: this.$localStorage.get('auth').user.npm,
          token: this.$localStorage.get('auth').token,
          pic: this.image,
          id: id
        }
        this.$socket.emit('uploadAktif', data)
      },
      onChange () {
        console.log('New picture selected!')
        this.image = this.$refs.pictureInput[0].image
        // console.log(this.$refs.pictureInput[0].image)
        if (this.$refs.pictureInput[0].image) {
          console.log('Picture loaded.')
        } else {
          console.log('FileReader API not supported: use the <form>, Luke!')
        }
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
            doc.text(105, 50, 'FORMULIR SURAT KETERANGAN AKTIF KULIAH', null, null, 'center')
            // new line
            doc.setFontSize(12)
            doc.text(10, 65, 'Nama Mahasiswa')
            doc.text(80, 65, ':')
            doc.text(90, 65, item.c_nama_lengkap)
            // new line
            doc.text(10, 75, 'NPM')
            doc.text(80, 75, ':')
            doc.text(90, 75, item.c_npm)
            // new line
            doc.text(10, 85, 'Semester')
            doc.text(80, 85, ':')
            doc.text(90, 85, item.c_semester)
            // new line
            doc.text(10, 95, 'Program Studi')
            doc.text(80, 95, ':')
            doc.text(90, 95, item.c_program_studi)
            // new line
            doc.text(10, 105, 'Tahun Akademik')
            doc.text(80, 105, ':')
            doc.text(90, 105, item.c_tahun_akademik)
            // new line
            doc.text(10, 115, 'Nama Orang Tua / wali')
            doc.text(80, 115, ':')
            doc.text(90, 115, item.c_nama_orang_tua_wali)
            // new line
            doc.text(10, 125, 'NIP/NRP')
            doc.text(80, 125, ':')
            doc.text(90, 125, item.c_nip_nrp)
            // new line
            doc.text(10, 135, 'Pangkat')
            doc.text(80, 135, ':')
            doc.text(90, 135, item.c_pangkat)
            // new line
            doc.text(10, 145, 'Golongan')
            doc.text(80, 145, ':')
            doc.text(90, 145, item.c_golongan)
            // new line
            doc.text(10, 155, 'Instansi')
            doc.text(80, 155, ':')
            doc.text(90, 155, item.c_instansi)
            // new line
            doc.text(120, 180, item.c_di + ', ')
            let dibuat = item.mahasiswa_aktif_kuliah_dibuat
            let tanggal = dibuat.substr(8, 2)
            let bulan = dibuat.substr(5, 2)
            let tahun = dibuat.substr(0, 4)
            doc.text(140, 180, tanggal)
            doc.text(150, 180, '/')
            doc.text(155, 180, this.bulan(bulan))
            doc.text(175, 180, '/')
            doc.text(180, 180, tahun)
            doc.text(120, 190, 'Pemohon,')
            doc.text(120, 230, item.c_nama_lengkap)
            // end
            doc.save(item.c_npm + '-formulir-surat-keterangan-aktif-kuliah.pdf')
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
    mounted () {
      this.getAktif()
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
  background-color:rgba(0,180,0, 0.9) !important;
  color:white;
}
.card:hover > .card-menu {
  display:block;
  border-radius: 5px;
}

.red {
  background-color:rgba(200, 0, 0, 0.8) !important;
}
/* teal = status 1 */
.teal {
  background-color:rgba(0,0,200, 0.8) !important;
}

.indianred {
  background-color:rgba(150, 30, 10, 0.9) !important;
}
.sienna {
  background-color:rgba(197, 135, 78, 0.8) !important;
}
</style>
