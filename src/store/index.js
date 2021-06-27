import Vue from 'vue';
import Vuex from 'vuex';
import API from '../utils/api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    tags: [],
    imageCache: {},
    tagsCache: {},
    albums: {},
  },
  actions: {
    init({commit}) {
      console.log('initing');
      API.tags().then(tags => {
        commit('set', ['tags', tags])
      })
    },
    getImage({state}, id) {
      if (state.imageCache[id]) {
        return Promise.resolve(state.imageCache[id]);
      }
      return API.thumbnail(id).then(thumbnail => {
        state.imageCache[id] = thumbnail;
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
    }
  },
  mutations: {
    set(state, [key, value]) {
      state[key] = value;
    }
  }
})
export default store