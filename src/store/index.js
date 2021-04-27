import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.sessionStorage // or window.sessionStorage or localForage
})

export default new Vuex.Store({
  state: {
    favourite_users: [],
    arr: [],
    selected_user: null
  },
  mutations: {
    SET_SELECTED_USER: (state, user_data) => {
      state.selected_user = user_data
    },
    SET_FAVOURITE_USERS: (state, favourite_users) => {
      state.favourite_users = favourite_users
    }
  },
  actions: {
    REMOVE_FAVOURITE_USER(state, user_data) {
    },
    ADD_FAVOURITE_USER(state, user_data) {
    },
    SetSelectedUser({ commit }, user_data) {
      commit('SET_SELECTED_USER', user_data)
    },
    AddFavouriteUser({ commit, state }, user_data) {
      const arr_favourite_users = state.favourite_users
      arr_favourite_users.push(user_data)
      commit('SET_FAVOURITE_USERS', arr_favourite_users)
    },
    RemoveFavouriteUser({ commit, state }, user_data) {
      // const arr_favourite_users = state.favourite_users.filter(fav_user => fav_user.id.value != user_data.id.value)
      const arr_favourite_users = state.favourite_users.filter(fav_user => fav_user.custom_id != user_data.custom_id)

      commit('SET_FAVOURITE_USERS', arr_favourite_users)
    }
  },
  getters: {
    favouriteUsersIds(state) {
      // return state.favourite_users.map((fav_user) => fav_user.id.value)
      return state.favourite_users.map((fav_user) => fav_user.custom_id)
    },
    favouriteUsers(state) {
      return state.favourite_users
    },
    selectedUser(state) {
      return state.selected_user
    }
  },
  plugins: [vuexLocalStorage.plugin]
})
