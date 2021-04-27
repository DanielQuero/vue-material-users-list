<template lang="pug">
  .user-card.flex-center-center.flex-wrap
    //- Confirm favourite dialog
    v-dialog(v-model="show_favourite_dialog" max-width="290")
      v-card
        v-card-title.headline {{ (isUserOnFavouritesList) ? 'Delete' : 'Add' }} favourite user
        v-card-text
          span(v-if="isUserOnFavouritesList") Are you sure about deleting the user "{{ this.user_data.name.first }} {{ this.user_data.name.last }}" from favourites?
          span(v-else) Are you sure about adding the user {{ this.user_data.name.first }} {{ this.user_data.name.last }} to favourites?
        v-card-actions
          v-spacer
          v-btn(color="green darken-1" text @click="show_favourite_dialog = false") No
          v-btn(color="green darken-1" text @click="addRemoveFavouriteUser") Yes

    //- Favourite button
    v-btn.favourite-button(icon color="orange" @click="show_favourite_dialog = true")
      v-icon(v-if="isUserOnFavouritesList") mdi-star
      v-icon(v-else) mdi-star-outline

    //- Profile section
    .profile-section.flex-center-space-around(:class="{'flex-wrap': is_profile_card}")
      .user-image-box
        img.user-image.shrink(transition="scale-transition" :src="user_data.picture.large" :class="{'bigger-icon': is_profile_card}")

      .user-info-box.flex-direction-column
        .gender-and-name-box.flex-start-center
          .gender-box
            v-icon.gender-icon(v-if="user_data.gender == 'male'" style="color: #5bc5ff;") mdi-gender-male
            v-icon.gender-icon(v-else="user_data.gender == 'female'" style="color: #fe636b;") mdi-gender-female
          .name.profile-item.fake-space-left {{ user_data.name.first }} {{ user_data.name.last }} ({{ user_data.nat }})
        v-btn.profile-redirect-button.flex-align-self-end(v-if="!is_profile_card" @click="setUserAndRedirectToProfile" primary rounded small color="primary")
          v-icon.capitalize-text(color="#FFF" :size="15") mdi-account
          .fake-space-left.capitalize-text View Profile
        template(v-if="is_profile_card")
          .email-box.profile-item.flex-start-center
            v-icon(color="primary") mdi-email-outline
            .fake-space-left {{ user_data.email }}
          .flex-center-space-between
            v-tooltip(bottom)
              template(v-slot:activator="{ on, attrs }")
                .birth-date.profile-item.regular-width.flex-start-center(v-bind="attrs" v-on="on")
                  v-icon(color="primary") mdi-cake-variant
                  .fake-space-left {{ $moment(user_data.dob.date).format('DD-MM-YYYY') }}
              span Birth date
            v-tooltip(bottom)
              template(v-slot:activator="{ on, attrs }")
                .register-date.profile-item.regular-width.flex-start-center(v-bind="attrs" v-on="on")
                  v-icon(color="primary") mdi-calendar-cursor
                  .fake-space-left {{ $moment(user_data.registered.date).format('DD-MM-YYYY') }}
              span Register date

    .extra-section.flex-center-space-between(v-if="!is_profile_card")
      .max-width
        .email-box.profile-item.flex-start-center
          v-icon(color="primary") mdi-email-outline
          .fake-space-left {{ user_data.email }}
        .flex-center-space-between
          v-tooltip(bottom)
            template(v-slot:activator="{ on, attrs }")
              .birth-date.profile-item.regular-width.flex-start-center(v-bind="attrs" v-on="on")
                v-icon(color="primary") mdi-cake-variant
                .fake-space-left {{ $moment(user_data.dob.date).format('DD-MM-YYYY') }}
            span Birth date
          v-tooltip(bottom)
            template(v-slot:activator="{ on, attrs }")
              .register-date.profile-item.regular-width.flex-start-center(v-bind="attrs" v-on="on")
                v-icon(color="primary") mdi-calendar-cursor
                .fake-space-left {{ $moment(user_data.registered.date).format('DD-MM-YYYY') }}
            span Register date

    //- Map section
    .map-box.max-width(v-if="is_profile_card")
      leaflet-custom-map.map.max-width(:value="{ latitude: user_data.location.coordinates.latitude, longitude: user_data.location.coordinates.longitude }" max_width)
    .location-info-box.max-width.flex-center-space-between.flex-wrap(v-if="is_profile_card")
      .city.profile-item.flex-start-center
        v-icon(color="primary") mdi-map-marker
        .fake-space-left {{ user_data.location.street.name }}, {{ user_data.location.street.number }}
      .location.profile-item.flex-start-center
        v-icon(color="primary") mdi-city
        .fake-space-left {{ user_data.location.city }} ({{ user_data.location.state }})
      .phone.profile-item.flex-start-center
        v-icon(color="primary") mdi-phone
        .fake-space-left {{ user_data.phone }}
</template>

<script>
import { mapGetters } from 'vuex'
import LeafletCustomMap from '@/components/LeafletCustomMap'

export default {
  name: 'UserCardComponent',
  components: {
    LeafletCustomMap
  },
  computed: {
    ...mapGetters({
      vuexFavouriteUsersIds: 'favouriteUsersIds'
    }),
    isUserOnFavouritesList() {
      // return this.vuexFavouriteUsersIds.includes(this.user_data.id.value)
      return this.vuexFavouriteUsersIds.includes(this.user_data.custom_id)
    }
  },
  props: {
    user_data: {
      type: Object,
      default: () => { return {} }
    },
    is_profile_card: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show_favourite_dialog: false
    }
  },
  methods: {
    setUserAndRedirectToProfile() {
      this.$store.dispatch('SetSelectedUser', this.user_data)
      this.$router.push({ name: 'UserProfileRoute' })
    },
    addRemoveFavouriteUser() {
      if (this.isUserOnFavouritesList) {
        this.$store.dispatch('RemoveFavouriteUser', this.user_data)
        this.$bus.$emit('reloadFavourites')
      } else {
        this.$store.dispatch('AddFavouriteUser', this.user_data)
      }

      this.show_favourite_dialog = false
    }
  }
}
</script>

<style lang="sass" scoped>
  .user-card
    background: #FFF
    border-radius: 10px
    box-shadow: 1px 1px 8px #d7d7d7
    margin: 10px
    padding: 20px
    .favourite-button
      position: relative
      margin: 0px 0px -7px 98%
      height: 0px
    .profile-section, .extra-section
      min-width: 320px
    .profile-section
      flex: 1
      .profile-item
        margin: 5px
      .user-image-box
        margin-right: 9px
        .user-image
          width: 128px
          height: 128px
          border-radius: 100%
          background: #F2F2F2
          &.bigger-icon
            width: 160px
            height: 160px

      .user-info-box
        .gender-and-name-box
          .gender-box
            .gender-icon
          .name
            font-weight: 500
            text-align: left
        .profile-redirect-button
          margin-top: 15px
          .email-box
          .birth-date
          .register-date
    .map-box
      margin: 20px 0px
      .map
        z-index: 1
        height: 220px !important
</style>
