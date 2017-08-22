<template>

  <div>
    <router-view></router-view>
  </div>

</template>

<script>
  export default {
    mounted () {
      let auth = this.$localStorage.get('auth')
      if (auth.logged === false) {
        this.$router.push('/login')
      }
    }
  }
</script>
