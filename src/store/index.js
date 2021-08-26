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
    click_images: [],
    page: 1,
    totalPage: 20,
    select_all: false,
  },
  actions: {
    init({ commit }) {
      console.log('initing');
      API.tags().then(tags => {
        commit('set', ['tags', tags])
      });
      API.datas().then(datas => {
        commit('set', ['datas', datas])
      });
    },
    getImage({ state }, id) {
      if (state.imageCache[id]) {
        return Promise.resolve(state.imageCache[id]);
      }
      return API.thumbnail(id).then(thumbnail => {
        state.imageCache[id] = thumbnail;
        return thumbnail;
      });
    },
    getTags({ state }, id) {
      if (state.tagsCache[id]) {
        return Promise.resolve(state.tagsCache[id]);
      }
      return API.queryTags(id).then(response => {
        state.tagsCache[id] = response;
        return response;
      });
    },
    setdatas({ commit }) {
      API.datas().then(datas => {
        commit('set', ['datas', datas])
      });
    },
    setClickImage({ commit }, hash) {
      commit('setImage', ['click_images', hash])
    },
    removeClickImage({ commit }, hash) {
      commit('removeImage', ['click_images', hash])
    },
    setImageWorld({ commit }, hash) {
      commit('set', ['imageWorld', hash])
    },
    setSelectTag({ commit }, tag) {
      commit('set', ['selectTag', tag]);
    },
    initClickImage({ commit }) {
      commit('set', ['click_images', []]);
    },
    setPage({ commit }, page) {
      commit('set', ['page', page]);
    },
    selectAll({ commit }, check) {
      commit('set', ['select_all', check]);
    }
  },
  mutations: {
    set(state, [key, value]) {
      state[key] = value;
    },
    setImage(state, [key, value]) {
      state[key].push(value);
    },
    removeImage(state, [key, value]) {
      const temp_images = state[key].filter(item => item.hash !== value.hash);
      state[key] = temp_images;
    },
    setTotalPage(state, value) {
      state.totalPage = value;
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
    },
  }
})
export default store