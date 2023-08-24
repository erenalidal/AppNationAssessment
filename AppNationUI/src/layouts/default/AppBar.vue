<template>
  <v-app-bar flat style="background-color:black">
    <v-img src="@/assets/logo.svg" style="object-fit: contain;" />
    <app-bar-user/>
  </v-app-bar>
</template>

<script setup>
  import AppBarUser from '@/components/AppBarUser.vue'
</script>
