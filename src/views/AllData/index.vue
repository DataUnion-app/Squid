<template>
  <div class="home">
    <CHeader title="All Data" :flag="2" />
    <CPopMenu :flag="1" />
    <div class="main-body" v-show="!pageLoading">
      <CLoader v-if="apiLoading" message="Checking for searched data..." />
      <!-- <div v-if="apiLoading">
        <div v-show="!tagsLoaded" class="smt-spinner-circle">
          <div class="smt-spinner"></div>
        </div>
      </div> -->
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
import { toArrayKeys } from "@/utils/utils";

export default {
  name: "Gallery",
  // components: { VueAutoVirtualScrollList  },
  data() {
    return {
      realPage: 1,
    };
  },
  computed: {
    ...mapState([
      "selectTag",
      "apiLoading",
      "pageCount",
      "pageLoading",
      "page",
      "totalPhotos",
    ]),
    photos() {
      const photos = this.totalPhotos.slice(
        (this.page - 1) * this.pageCount,
        this.page * this.pageCount
      );
      return photos;
    },
  },
  methods: {
    ...mapActions(["initClickImage", "setPage"]),
    async fetchPhotoHashs(cTags, page = 1) {
      this.$store.dispatch("setApiLoading", true);
      let result = [];
      const photosResult = await Promise.all(
        cTags.map((t) =>
          API.photos({
            tag: t,
            page,
          })
        )
      );
      photosResult.map((r) => result.push(...r));
      this.$store.dispatch("setApiLoading", false);
      return result;
    },
    deDuplicateData(arrData) {
      const newSet = [...new Set(arrData.map((item) => JSON.stringify(item)))];
      const dedup = [...newSet].map((item) => JSON.parse(item));
      return dedup;
    },
  },
  watch: {
    selectTag(newVal) {
      const newKeys = toArrayKeys(newVal);
      this.fetchPhotoHashs(newKeys).then((totalPhotos) => {
        totalPhotos = this.deDuplicateData(totalPhotos);
        this.$store.dispatch("setTotalPhotos", totalPhotos);
        this.$store.commit(
          "setTotalPage",
          Math.ceil(totalPhotos.length / this.pageCount) || 1
        );
      });
    },
    async page(newVal) {
      if (Math.ceil(this.totalPhotos.length / this.pageCount) <= newVal) {
        this.realPage++;
        const selectedTags = toArrayKeys(this.selectTag);
        const newPhotos = await this.fetchPhotoHashs(
          selectedTags,
          this.realPage
        );
        let currentPhotos = this.totalPhotos;
        currentPhotos.push(...newPhotos);
        currentPhotos = this.deDuplicateData(currentPhotos);
        this.$store.commit(
          "setTotalPage",
          Math.ceil(currentPhotos.length / this.pageCount) || 1
        );
        this.$store.dispatch("setTotalPhotos", currentPhotos);
      }
    },
  },

  async mounted() {
    if (this.page !== 1) {
      this.$store.dispatch("setPage", 1);
    }
    const selectedTags = toArrayKeys(this.selectTag);
    let newPhotos = await this.fetchPhotoHashs(selectedTags);
    newPhotos = this.deDuplicateData(newPhotos);
    this.$store.commit(
      "setTotalPage",
      Math.ceil(newPhotos.length / this.pageCount) || 1
    );
    this.$store.dispatch("setTotalPhotos", newPhotos);
    this.initClickImage();
  },
};
</script>
