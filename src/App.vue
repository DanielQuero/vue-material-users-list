<template lang="pug">
  v-app
    v-app-bar(app color="primary" dark)
      .d-flex.align-center
        v-img(
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        )
        h2.hide-on-phones Material Users List

      v-spacer
      router-link.link-to-route(:to="{ name: 'UsersListRoute' }")
        v-btn(text)
          v-icon mdi-account-group
          span.mr-2.fake-space-left Users

      router-link.link-to-route(:to="{ name: 'ExportFavouriteUsersRoute' }")
        v-btn(text)
          v-icon mdi-star
          span.mr-2.fake-space-left Favourites

    v-main
      .app-main
        v-dialog
        router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="sass" scoped>
  .link-to-route
    color: #FFF
    text-decoration: none
    font-weight: bold

  @media screen and (max-width: 767px)
    .hide-on-phones
      display: none
  @media screen and (max-width: 480px)
    .link-to-route
      font-size: 12px
</style>
