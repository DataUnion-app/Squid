import Vue from 'vue';
import Vuex from 'vuex';
import API from '../utils/api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    tags: [],
    imageCache: {},
    tagsCache: {},
    datas: [],
    imageWorld: "",
    selectTag: "",
  },
  actions: {
    init({commit}) {
      console.log('initing');
      API.tags().then(tags => {
        commit('set', ['tags', tags])
      });
      API.datas().then(datas => {
        commit('set', ['datas', datas])
      });
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
    },
    setdatas({commit}) {
      API.datas().then(datas => {
        commit('set', ['datas', datas])
      });
    },
    setImageWorld({commit}, hash) {
      commit('set', ['imageWorld', hash])
    },
    setSelectTag({commit}, tag) {
      commit('set', ['selectTag', tag]);
    }
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
    getdatas: (state) => {
      return state.datas;
    },
    getImageWorld: (state) => {
      return state.imageWorld;
    }
  }
})
export default store