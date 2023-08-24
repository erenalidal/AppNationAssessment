<template>
  <v-container class="fill-height app-bar-user-container">
    <a style="color: white">Hi, Eren</a>
    <a @click="logout"><b style="color: white; cursor: pointer;">Logout</b></a>
  </v-container>
</template>

<script>
import VueCookies from "vue-cookies";

export default {
  name: "AppBarUser",
  methods: {
    logout() {
      VueCookies.remove("authtoken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
<style scoped lang="scss">
.app-bar-user-container {
  justify-content: end;
  a{
    margin-left: 10px;
  }
}
</style>
