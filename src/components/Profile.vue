<template>

  <div style="width:100%;">
    <md-card  style="width:100%;">
      <md-card-media>
        <img src="http://cdn.pcwallart.com/images/cool-computer-keyboards-wallpaper-2.jpg" alt="People">
      </md-card-media>

      <md-card-header>
        <div class="md-title">{{ mahasiswa.nama_lengkap }}</div>
        <div class="md-subhead">{{ mahasiswa.program_studi }}</div>
      </md-card-header>

    </md-card>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        mahasiswa: {}
      }
    },
    methods: {
      getMahasiswa () {
        this.$http.get('http://localhost/cutiff/api/mhs/' + this.$localStorage.get('auth').user.npm)
        .then(resp => {
          console.log(resp)
          this.mahasiswa = resp.body.data
        })
      }
    },
    mounted () {
      this.getMahasiswa()
    }
  }

</script>
