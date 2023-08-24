<template>
  <v-dialog
    v-model="dialog"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @keydown.esc="cancel"
  >
    <v-card>
      <form ref="form" @submit.prevent="edit()">
        <v-toolbar dark :color="options.color" dense flat>
          <v-toolbar-title class="text-body-2 font-weight-bold grey--text">
            Edit User
          </v-toolbar-title>
        </v-toolbar>
        <v-text-field
          v-model="name"
          name="name"
          label="Name"
          type="text"
          placeholder="Name"
          required
        ></v-text-field>
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
            >Edit</v-btn
          >
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditDialog",
  data() {
    return {
      setLoading: null,
      errorMessage: "",
      name: "",
      user: null,
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
    open(user, setLoading, options) {
      this.setLoading = setLoading;
      this.name = user.name;
      this.user = user;
      this.errorMessage = "";
      this.dialog = true;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    async edit() {
      this.setLoading(true);
      try {
        await this.$axios.patch(`/users/${this.user.id}`, {
          name: this.name
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
