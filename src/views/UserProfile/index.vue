<template lang="pug">
  //- .container#users-profile-view
  .container#users-profile-view
    user-card.user-card-component(v-if="vuexSelectedUser" :user_data="vuexSelectedUser" is_profile_card)
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from '@/components/UserCard/index.vue'

export default {
  name: 'UserProfileView',
  components: {
    UserCard
  },
  computed: {
    ...mapGetters({
      vuexSelectedUser: 'selectedUser'
    })
  }
}
</script>

<style lang="sass" scoped>
  #users-profile-view
    .user-card-component
      margin-top: 30px
</style>
