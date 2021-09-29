import Vue from 'vue';
import Vuex from 'vuex';

import API from '../utils/api';
import Auth from '../utils/api';

Vue.use(Vuex);

const event = new Date();
const date = event.toLocaleString(`en`);
const splitDate = date.split(`, `)[0].split(`/`);
const currentDate = [splitDate[1], splitDate[0], splitDate[2]].join(`-`);

const start_date = "14-05-2021";
const end_date = currentDate;

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
    pageCount: 20,
    myPhotos: undefined,
    pageLoading: true,
    apiLoading: false,
    select_all: false,
  },
  actions: {
    init({ commit }) {
      // console.log('initing');
      API.tags(start_date, end_date).then(tags => {
        // console.log(tags)
        if (tags) {
          const defaultTag = 'dataunion';
          const tagKeys = Object.keys(tags);
          tagKeys.sort((x, y) => {
            return x == defaultTag ? -1 : y == defaultTag ? 1 : 0;
          });
          let tagCountKeys = [];
          tagKeys.forEach((v, i) => {
            tagCountKeys.push(`${v} - (${tags[v].map(tag => tag.value).reduce((a, b) => b + a)})`);
          });
          commit('set', ['tags', tagKeys])
          commit('set', ['tagData', tags])
          commit('set', ['tagCountKeys', tagCountKeys])
        }
      });
      API.datas().then(datas => {
        commit('set', ['datas', datas])
      });
    },
    switchWallet({ commit }, account) {
      console.log(`user switched wallet to ${account}`);
      Auth.switchWallet(account);      
    },
    logOut({ commit }) {
      console.log(`user logged out`);
      Auth.logOut()
    },
    getImage({ state }, id) {
      if (state.imageCache[id]) {
        return Promise.resolve(state.imageCache[id]);
      } else {
        return API.thumbnail(id).then(thumbnail => {
          state.imageCache[id] = thumbnail;
          return thumbnail;
        });
      }
    },
    getTags({ state }, id) {
      if (state.tagsCache[id]) {
        return Promise.resolve(state.tagsCache[id]);
      } else {
        return API.queryTags(id).then(response => {
          state.tagsCache[id] = response;
          return response;
        });
      }
    },
    getMyPhotos({ state }) {
      if (state.myPhotos !== undefined) {
        // console.log(`myPhotos NOT undefined!`)
        return Promise.resolve(state.myPhotos);
      } else {
        return API.myImages({ page: 1 }).then(response => {
          state.myPhotos = response;
          return response; 
        })
      }
    },
    setdatas({ commit }) {
      API.datas().then(datas => {
        commit('set', ['datas', datas])
      });
    },
    setTags({ commit }) {
      API.tags(start_date, end_date).then(tags => {
        if (tags) {
          const defaultTag = 'dataunion';
          const tagKeys = Object.keys(tags);
          tagKeys.sort((x, y) => {
            return x == defaultTag ? -1 : y == defaultTag ? 1 : 0;
          });
          let tagCountKeys = [];
          tagKeys.forEach((v, i) => {
            tagCountKeys.push(`${v} - (${tags[v].map(tag => tag.value).reduce((a, b) => b + a)})`);
          });
          commit('set', ['tags', tagKeys])
          commit('set', ['tagData', tags])
          commit('set', ['tagCountKeys', tagCountKeys])
        }
      });
    },
    setPageLoading({ commit }, v) {
      commit('set', ['pageLoading', v]);
    },
    setApiLoading({ commit }, v) {
      commit('set', ['apiLoading', v]);
    },
    setTagCountKeys({ commit }, newTagCountkeys) {
      commit('set', ['tagCountKeys', newTagCountkeys]);
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
    },
    setMyPhotos({ commit }, myPhotos) {
      commit('set', ['myPhotos', [myPhotos]])
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