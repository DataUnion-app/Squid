<template>
  <div class="home">
    <CHeader title="All Data" :flag="2" />
    <CPopMenu :flag="1" />
    <div class="main-body" v-show="!pageLoading">
      <div v-if="apiLoading">
        <h1 class="text-3xl p-3 not-margin">Data is loading now...</h1>
      </div>
      <div v-else>
        <div v-if="photos">
          <div
            v-if="photos.length > 0"
            class="flex flex-wrap justify-left ml-12"
          >
            <!-- <VueAutoVirtualScrollList
          :totalHeight="800"
          :defaultHeight="80"
          > -->
            <div
              v-for="photo in photos"
              :key="photo.hash"
              class="image-relative"
            >
              <div class="comment">
                <CImage
                  :hash="photo.hash"
                  class="w-full h-full absolute p-1 comment-item"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h1 class="text-3xl p-3 not-margin">There is no image</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueAutoVirtualScrollList from "vue-auto-virtual-scroll-list";
import API from "@/utils/api";

export default {
  name: "Gallery",
  // components: { VueAutoVirtualScrollList  },
  computed: {
    ...mapState([
      "selectTag",
      "apiLoading",
      "pageCount",
      "pageLoading",
      "page",
    ]),
  },
  methods: {
    ...mapActions(["initClickImage", "setPage"]),
    async fetchPhotoHashs(cTags) {
      this.$store.dispatch("setApiLoading", true);
      let result = [];
      const photosResult = await Promise.all(
        cTags.map((t) =>
          API.photos({
            tag: t,
          })
        )
      );
      photosResult.map((r) => result.push(...r));
      this.$store.dispatch("setApiLoading", false);
      return result;
    },
    getSelectedTags() {
      let selTags = [];

      if (typeof this.$store.state.selectTag == "string") {
        selTags.push(this.$store.state.selectTag);
      } else {
        selTags = this.$store.state.selectTag;
      }

      return selTags;
    },
  },
  data() {
    return {
      photos: [],
      totalPhotos: []
    };
  },
  watch: {
    async selectTag(newVal) {
      if (newVal === undefined) return;
      console.log("called again")
      const selectedTags = this.getSelectedTags();
      this.totalPhotos = await this.fetchPhotoHashs(selectedTags);

      this.$store.commit(
        "setTotalPage",
        Math.ceil(this.totalPhotos.length / this.pageCount) || 1
      );
      this.photos = this.totalPhotos.slice(
        (this.page - 1) * this.pageCount,
        this.page * this.pageCount
      );
    },
    page(newVal, oldVal) {
      // ts
      // console.log('new page num', newVal);
      // console.log('photos', this.photos);
      this.$store.dispatch("setPage", newVal || 1);
      this.photos = this.totalPhotos.slice(
        (this.page - 1) * this.pageCount,
        this.page * this.pageCount
      );
    },
  },

  async mounted() {
    const defaultTag = "dataunion - 1";
    this.$store.dispatch("setPage", 1);

    if (
      !this.$store.state.selectTag ||
      this.$store.state.selectTag?.length === 0
    ) {
      this.$store.dispatch("setSelectTag", defaultTag);
    } else {
      const selectedTags = this.getSelectedTags();
      this.totalPhotos = await this.fetchPhotoHashs(selectedTags);
      // ts
      // console.log("photosResult", this.totalPhotos);
      this.$store.commit(
        "setTotalPage",
        Math.ceil(this.totalPhotos.length / this.pageCount) || 1
      );
      this.photos = this.totalPhotos.slice(
        (this.page - 1) * this.pageCount,
        this.page * this.pageCount
      );
    }
    this.initClickImage();
  },
};
</script>
