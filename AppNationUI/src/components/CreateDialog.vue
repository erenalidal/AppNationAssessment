<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <form ref="form" @submit.prevent="create()">
        <v-toolbar dark :color="options.color" dense flat>
          <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
            Create User
          </v-toolbar-title>
        </v-toolbar>
        <v-text-field
          v-model="email"
          name="email"
          label="Email"
          type="text"
          placeholder="email"
          required
        ></v-text-field>
        <v-text-field
          v-model="name"
          name="name"
          label="Name"
          type="text"
          placeholder="Name"
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
        <v-select
          v-model="role"
          :items="roles"
          label="Role"
          required
        ></v-select>
        <div class="text-red-lighten-1">{{ errorMessage }}</div>
        <v-card-actions class="pt-3">
          <v-spacer></v-spacer>
          <v-btn
            v-if="!options.noconfirm"
            color="grey"
            text
            class="body-2 font-weight-bold"
            @click="cancel"
            >Cancel</v-btn
          >
          <v-btn
            type="submit"
            color="primary"
            class="body-2 font-weight-bold"
            outlined
            >Create</v-btn
          >
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "CreateDialog",
  data() {
    return {
      setLoading: null,
      errorMessage: "",
      roles: ["user", "admin"],
      role: "user",
      email: "",
      name: "",
      password: "",
      loading: false,
      dialog: false,
      resolve: null,
      reject: null,
      options: {
        color: "grey lighten-3",
        width: 400,
        zIndex: 200,
        noconfirm: false,
      },
    };
  },
  methods: {
    open(setLoading, options) {
      this.setLoading = setLoading;
      this.role = "user";
      this.email = "";
      this.name = "";
      this.password = "";
      this.errorMessage = "";
      this.dialog = true;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    async create() {
      this.setLoading(true);
      try {
        await this.$axios.post("/users", {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        this.setLoading(false);
        this.resolve(true);
        this.dialog = false;
      } catch (error) {
        this.setLoading(false);
        this.errorMessage = error?.response?.data?.message ?? error?.message;
      }
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
