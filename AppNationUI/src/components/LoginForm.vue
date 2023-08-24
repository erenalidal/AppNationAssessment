<template>
  <v-app>
    <v-main>
      <v-container fluid fill-height>
        <v-layout>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="4">
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Login Form</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <form ref="form" @submit.prevent="login()">
                    <v-text-field
                      v-model="email"
                      name="email"
                      label="Email"
                      type="text"
                      placeholder="email"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="password"
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="password"
                      required
                    ></v-text-field>

                    <div class="text-red-lighten-1">{{ errorMessage }}</div>
                    <v-btn
                      type="submit"
                      class="mt-4"
                      color="primary"
                      value="log in"
                      >Login</v-btn
                    >
                  </form>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import VueCookies from "vue-cookies";

export default {
  name: "App",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      try {
        const response = await this.$axios.post("/auth/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('user',JSON.stringify(response?.data?.user))
        localStorage.setItem('role', response?.data?.user?.role)
        VueCookies.set(
          "authtoken",
          response?.data?.tokens?.access?.token,
          response?.data?.tokens?.access?.expires
            ? new Date(response?.data?.tokens?.access?.expires)
            : undefined
        );
        this.$router.replace({
          name: "Home",
        });
      } catch (error) {
        this.errorMessage = error?.response?.data?.message ?? error?.message;
      }
    },
  },
};
</script>
