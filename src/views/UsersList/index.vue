<template lang="pug">
  .bigger-container#users-list-view
    .filters-box(v-if="isUsersListView")
      .filters.flex-center-space-between.flex-wrap
        .filter-item
          //- .filter-label Gender
          v-select.filter-input(
            v-model="filters.selected_gender"
            item-text="label"
            item-value="value"
            :items="gender_options"
            :menu-props="{ maxHeight: '400' }"
            label="Select gender"
          )
        .filter-item.double
          //- .filter-label Age Range
          .filter-input.flex-center-center
            v-range-slider.custom-slider.align-center(
              v-model="filters.age_range"
              :max="max"
              :min="min"
              hint="Select age range"
              persistent-hint
            )
              template(v-slot:prepend)
                span.custom-slider-slots {{ filters.age_range[0] }}
              template(v-slot:append)
                span.custom-slider-slots {{ filters.age_range[1] }}
        .filter-item.double
          //- .filter-label Nationality
          v-select.filter-input(
            v-model="filters.selected_nationalities"
            item-text="label"
            item-value="value"
            :items="nationalities_options"
            :menu-props="{ maxHeight: '400' }"
            label="Select specific nationalities"
            multiple
          )
            template(v-slot:selection="{ item, index }")
              v-chip(v-if="index < 2")
                span {{ item.label }}
              span(v-if="index === 2" class="grey--text caption") (+{{ filters.selected_nationalities.length - 1 }})

      .filters-actions.flex-center-space-between
        .filters-extra-actions
          v-btn(@click="resetFilters" primary) Reset filters
          //- v-btn(@click="fetchData" primary) Download CSV
        v-btn(@click="fetchData" color="primary") Filter users
        //- v-btn(@click="filterUsersList" primary) Filter users

    .download-csv-box.flex-center-space-between.flex-wrap(v-else-if="isExportFavouriteUsersView")
      .message Click the button to download all favourite users as a CSV file
      v-btn(color="primary")
        download-csv.excel-button(
          v-if="isExportFavouriteUsersView"
          :data="filteredUsersToExport"
          :labels="export_fields_labels"
          encoding="utf-8"
          name="favouriteUsers.csv"
        ) Download CSV

    //- div ({{ filters }})
    //- div filteredUsersList.length: {{ this.filteredUsersList.length }}

    v-progress-linear(
      v-if="loading"
      color="blue darken-2"
      indeterminate
      rounded
      height="6"
    )
    .list-messages(v-if="!loading")
      .list-message(v-if="!filtered_users_list.length") No results found
      .list-message(v-else) Showing {{ filtered_users_list.length }} results
    //- h1(v-if="loading") LOADING
    .users-list.flex-center-center.flex-wrap(v-if="!loading")
      //- v-card sa
      //- | {{ users_list }}
      //- user-card.user-card-component(v-for="user in filteredUsersList" :key="user.id.value" :user_data="user")
      user-card.user-card-component(v-for="(user, index) in filtered_users_list" :key="index" :user_data="user")
      .user-card-fake-component
      .user-card-fake-component
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from '@/components/UserCard/index.vue'
import nationalities from '@/utils/nationalities'
import axios from 'axios'

export default {
  name: 'UsersListView',
  components: {
    UserCard
  },
  async mounted() {
    await this.fetchData()

    this.$bus.$on('reloadFavourites', () => {
      if (this.isExportFavouriteUsersView) this.fetchData()
    })
  },
  data() {
    return {
      loading: true,
      max: 90,
      min: 18,
      filters: {
        selected_gender: 0,
        age_range: [18, 90],
        age_from: null,
        age_to: null,
        selected_nationalities: []
      },
      gender_options: [
        { label: 'All', value: 0 },
        { label: 'Female', value: 'female' },
        { label: 'Male', value: 'male' }
      ],
      nationalities_options: nationalities,
      original_users_list: [],
      filtered_users_list: [],
      export_fields_fields: ['name', 'gender', 'email', 'birth_date', 'register_date'],
      export_fields_labels: {
        gender: 'Gender',
        name: 'Name',
        email: 'Email',
        nationality: 'Nationality',
        birth_date: 'Birth Date',
        register_date: 'Register Date'
      }
    }
  },
  computed: {
    ...mapGetters({
      vuexFavouriteUsersList: 'favouriteUsers'
    }),
    isUsersListView() {
      return (this.$route.name === 'UsersListRoute')
    },
    isExportFavouriteUsersView() {
      return (this.$route.name === 'ExportFavouriteUsersRoute')
    },
    filteredUsersToExport() {
      // The library cannot read inside object, so we generate the final array with essencial info
      return this.filtered_users_list.map((filtered_user) => {
        return {
          gender: filtered_user.gender,
          name: `${filtered_user.name.first} ${filtered_user.name.last}`,
          email: filtered_user.email,
          nationality: filtered_user.nat,
          birth_date: this.$moment(filtered_user.dob.date).format('DD-MM-YYYY'),
          register_date: this.$moment(filtered_user.registered.date).format('DD-MM-YYYY')
        }
      })
    },
    apiFilters() {
      const api_filters = { results: 100 }

      if (this.filters.selected_gender) api_filters.gender = this.filters.selected_gender
      if (this.filters.selected_nationalities.length) api_filters.nat = this.filters.selected_nationalities.toString()

      return api_filters
    }
  },
  methods: {
    async fetchData() {
      this.loading = true

      if (this.isUsersListView) {
        await this.getRandomUsersFromApi()
      } else if (this.isExportFavouriteUsersView) {
        this.original_users_list = this.vuexFavouriteUsersList
        this.filtered_users_list = this.vuexFavouriteUsersList
      }

      this.loading = false
    },
    async getRandomUsersFromApi() {
      const url = 'https://randomuser.me/api'
      const api_version = '1.3'

      try {
        const res = await axios.get(`${url}/${api_version}`, { params: this.apiFilters })
        // NOTE: as some of the results return an empty id.value, I will generate
        // a random id in order to work correctly (and set as favourite)
        this.original_users_list = res.data.results.map((result) => { return { ...result, custom_id: this.generateRandomId() } })
        this.filterUsersList()
      } catch (error) {
        console.error('Error en la API')
        console.error(error)
      }
    },
    generateRandomId() {
      return Math.random().toString(36).replace('0.', '')
    },
    resetFilters() {
      this.filters.selected_gender = 0
      this.filters.age_range = [18, 90]
      this.filters.age_from = null
      this.filters.age_to = null
      this.filters.selected_nationalities = []
    },
    filterUsersList() {
      this.filtered_users_list = this.original_users_list.filter((user) => {
        return this.checkIfUserPassFilters(user)
      })
    },
    checkIfUserPassFilters(user_to_check) {
      let pass_filters = true

      if (!((user_to_check.dob.age >= this.filters.age_range[0]) && (user_to_check.dob.age <= this.filters.age_range[1]))) {
        pass_filters = false
      }

      return pass_filters
    }
  },
  watch: {
    '$route'(new_route, prev_route) {
      if (prev_route.name !== new_route.name) {
        this.resetFilters()
        this.fetchData()
      }
    }
  }
}
</script>

<style lang="sass" scoped>
  #users-list-view
    .filters-box
      .filter-item
        flex: 1
        margin: 10px
        min-width: 180px
        &.double
          min-width: 320px
        .filter-label
        .filter-input
          .custom-slider
            .custom-slider-slots
              margin-top: -20px

      .filters-actions
        margin: 10px 20px 30px 20px
    .download-csv-box
      margin: 20px 0px
    .users-list
      margin: 10px 0px
      .user-card-component, .user-card-fake-component
        margin: 10px
        padding: 20px
        min-width: 320px
        flex: 1

  @media screen and (max-width: 480px)
    .user-card-component, .user-card-fake-component
      margin: 10px 0px !important
</style>
