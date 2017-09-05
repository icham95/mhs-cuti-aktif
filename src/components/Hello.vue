<template>
  <div style="">
    <div style="width:100%;margin:10px;">
      <div style="float:left;">
        <img src="/static/skm.png" style="width:75px;">
      </div>
      <div style="float:left;font-size:24px;margin-top:15px;margin-left:10px;">
        <b style="color:#287cbc;"> STIKOM </b> 
        <b style="color:#e98436;"> BINANIAGA </b>
        <div style="font-size:14px;color:#e98436;margin-top:10px;">
          change continuous quality improvement, de'bottlenecking, enhancement.....do it!
        </div>
      </div>
      <div style="clear:both;"></div>
    </div>
    
    <md-boards style="height:450px !important;" class="md-primary" :md-controls="true" :md-auto="true" :md-infinite="true" :md-duration="5000" :md-swipeable="true">
      <md-board id="slide1" stlye="position:relative;">
        <img src="/static/fronts/1.jpg" style="width:100%;height:350px;">
        <div style="position:absolute;bottom:5px;padding:20px;">
          <b style="color:#e98436;display:block;">
            5 Sertifikat Penting untuk Sukses di Bidang IT
          </b>
          <p style="color:white;">
            Setiap pekerjaan biasanya menuntut satu standar kompetensi tertentu bagi para pelakunya. Salah satunya adalah dengan memiliki sertifikat-sertifikat untuk menunjang bidang tersebut. Ijazah memang juga merupakan salah satu jenis sertifikat, namun biasanya ijazah berperan sebagai penentu batasan umum saja. Sementara itu masih ada sertifikat-sertifikat lain yang harus didapatkan untuk bisa mendapatkan posisi yang lebih dibanding dengan seseorang yang hanya memiliki modal ijazah saja.
          </p>
        </div>
      </md-board>

      <md-board id="slide2" stlye="position:relative;">
        <img src="/static/fronts/2.jpg" style="width:100%;height:350px;" alt="">
        <div style="position:absolute;bottom:5px;padding:20px;">
          <b style="color:#e98436;display:block;">
            Mengapa Penelitian Dilakukan?
          </b>
          <p style="color:white;">
            Sekurang-kurangnya ada empat sebab yang melatarbelakangi mengapa penelitian itu perlu dilakukan, yaitu: (1) Kesadaran keterbatasan pengetahuan, pemahaman, dan kemampuan (2) Pemenuhan rasa ingin tahu; (3) Pemecahan masalah; dan (4) Pemenuhan pengembangan diri.
          </p>
        </div>
      </md-board>

      <md-board id="slide3" stlye="position:relative;">
        <img src="/static/fronts/3.jpg" style="width:100%;height:350px;" alt="">
        <div style="position:absolute;bottom:5px;padding:20px;">
        </div>
      </md-board>

    </md-boards>

    <div style="margin-bottom:35px;">
      <h2 style="color:#e98436;">News</h2>
      <div v-for="blog in blogs" style="float:left;width:48%;margin-right:1%;">
        <a href="" @click.prevent = "single(blog)"><b style="color:#287cbc;">{{ blog.judul }}</b> </a>
        <p>
          <div> <small> <i> posted : {{ blog.dibuat }} </i> </small> </div>
          {{ blog.isi.substring(0, 220) }}
        </p>
      </div>
      <div style="clear:both;"></div>
    </div>
    
    <div>
      <h2 style="color:#e98436;">Gallery</h2>
      <div>
        <img src="/static/gallery/1.jpg" style="float:left;margin-right:10px;">
        <img src="/static/gallery/2.jpg" style="float:left;margin-right:10px;">
        <img src="/static/gallery/3.jpg" style="float:left;margin-right:10px;">
        <img src="/static/gallery/4.jpg" style="float:left;margin-right:10px;">
        <img src="/static/gallery/5.jpg" style="float:left;margin-right:10px;">
        <div style="clear:both;"></div>
      </div>
    </div>
    
    <div style="width:100%;background-color:red;margin-top:50px;background-color:#555555;color:white;text-align:center;padding:30px;">
      <div style="color:#e98436;font-size:14px;font-style:italic;margin-bottom:10px;">Contact Us: </div>
      <div style="font-size:24px;margin-bottom:10px;"> <md-icon>local_phone</md-icon> 0251-8343980 </div>
      <div>Jl. Mayor Oking Jayaatmaja No.27</div>
      <div>Bogor - Indonesia 16124</div>
      <div>info@stikombinaniaga.ac.id</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      blogs: {}
    }
  },
  methods: {
    getBlogs () {
      this.$http.get(this.$config.API + 'api/blog')
      .then(resp => {
        this.blogs = resp.body
      })
    },
    single (blog) {
      this.$swal({
        title: blog.judul,
        html: `
        <div> posted: ${blog.dibuat} </div>
        <div> ${blog.isi} </div>
        `
      })
    }
  },
  mounted () {
    this.getBlogs()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
