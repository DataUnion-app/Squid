import Vue from 'vue';
import Vuex from 'vuex';
import API from '../utils/api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    tags: [],
    imageCache: {},
    tagsCache: {},
    albums: [],
  },
  actions: {
    init({commit}) {
      console.log('initing');
      API.tags().then(tags => {
        commit('set', ['tags', tags])
      });
      API.albums().then(albums => {
        commit('set', ['albums', albums])
      });
    },
    getImage({state}, id) {
      if (state.imageCache[id]) {
        return Promise.resolve(state.imageCache[id]);
      }
      return API.thumbnail(id).then(thumbnail => {
        state.imageCache[id] = thumbnail;
        console.log(id);
        //console.log(state.imageCache[id]);
        return thumbnail;
      });
    },
    getTags({state}, id) {
      if (state.tagsCache[id]) {
        return Promise.resolve(state.tagsCache[id]);
      }
      return API.queryTags(id).then(response => {
        state.tagsCache[id] = response;
        return response;
      });
    },
    setAlbums({commit}) {
      API.albums().then(albums => {
        commit('set', ['albums', albums])
      });
    },
  },
  mutations: {
    set(state, [key, value]) {
      state[key] = value;
    }
  },
  getters: {
    imagebyId: (state) => (id) => {
      return state.imageCache[id];
    },
    getAlbums: (state) => {
      return state.albums;
    },
  }
})
export default store