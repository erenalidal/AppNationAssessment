<template>
  <v-container class="fill-height">
    <v-responsive class="fill-height">
      <h1 class="text-h2 font-weight-bold">
        Users <v-icon @click="createUserOnClick()" dark>mdi-plus</v-icon>
      </h1>
      <v-data-table
        :headers="computedHeaders"
        :items="users"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:item="row">
          <tr>
            <td>{{ row.item.raw.name }}</td>
            <td>{{ row.item.raw.role }}</td>
            <td>
              <div v-if="currentUserId != row.item.raw.id">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="blue"
                  @click="editUserOnClick(row.item.raw)"
                >
                  <v-icon dark>mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  small
                  color="pink"
                  @click="deleteUserOnClick(row.item.raw)"
                >
                  <v-icon dark>mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </template>
        <template v-slot:bottom>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="totalPages"></v-pagination>
          </div>
        </template>
      </v-data-table>
    </v-responsive>
    <confirm-dialog ref="confirm" />
    <edit-dialog ref="edit" />
    <create-dialog ref="create" />
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import ConfirmDialog from "./ConfirmDialog.vue";
import EditDialog from "./EditDialog.vue";
import CreateDialog from "./CreateDialog.vue";

export default {
  name: "UserList",
  components: {
    ConfirmDialog,
    EditDialog,
    CreateDialog,
  },
  data() {
    return {
      page: 1,
      itemsPerPage: 5,
      totalPages: 1,
      loading: true,
      errorMessage: "",
      headers: [
        { key: "name", title: "Name", sortable: false },
        { key: "role", title: "Role", sortable: false },
      ],
      users: [],
    };
  },
  mounted() {
    this.getUsers(this.page, this.itemsPerPage);
  },
  methods: {
    async getUsers(page, itemsPerPage) {
      this.setLoading(true);
      try {
        const response = await this.$axios.get("/users", {
          params:{
            page,
          limit: itemsPerPage,
          }
        });
        this.totalPages = response.data.totalPages;
        this.itemsPerPage = response.data.limit;
        this.page = response.data.page;
        this.users = response.data.results;
      } catch (error) {
        this.errorMessage = error?.response?.data?.message ?? error?.message;
      } finally {
        this.setLoading(false);
      }
    },
    setLoading(isLoading) {
      this.loading = isLoading;
    },
    async createUserOnClick() {
      if (await this.$refs.create.open(this.setLoading)) {
        this.getUsers();
      }
    },
    async editUserOnClick(user) {
      if (await this.$refs.edit.open(user, this.setLoading)) {
        this.getUsers();
      }
    },
    async deleteUserOnClick(user) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete this user?"
        )
      ) {
        this.deleteUser(user.id);
      }
    },
    async deleteUser(userId) {
      this.setLoading(true);
      try {
        await this.$axios.delete(`/users/${userId}`);
        this.getUsers();
      } catch (error) {
        this.errorMessage = error?.response?.data?.message ?? error?.message;
        this.setLoading(false);
      }
    },
  },
  computed: {
    isAdmin() {
      const role = localStorage.getItem("role");
      return role === "admin";
    },
    currentUserId() {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);
      return user.id;
    },
    computedHeaders() {
      return this.isAdmin
        ? [
            ...this.headers,
            { title: "Actions", key: "actions", sortable: false },
          ]
        : this.headers;
    },
  },
  watch:{
     page(newPage, oldPage) {
      if(oldPage == newPage) return;
      this.getUsers(newPage, this.itemsPerPage);
    },
  }
};
</script>
