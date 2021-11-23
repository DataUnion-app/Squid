<template>
  <div class="home">
    <CHeader title="My Data" />
    <CPopMenu :flag="1" />
    <div v-show="!pageLoading" class="main-body">
      <div
        v-if="!loading && photos.length > 0"
        class="flex flex-wrap justify-left ml-12"
      >
        <div v-for="photo in photos" :key="photo.hash" class="image-relative">
          <div class="comment">
            <CImage
              :hash="photo.hash"
              class="w-full h-full absolute p-1 comment-item"
            />
          </div>
        </div>
      </div>

      <div v-else-if="!loading && photos.length === 0">
        <h1 class="text-3xl p-3 not-margin">There is no image you uploaded</h1>
      </div>

      <CLoader v-else-if="loading" message="Checking for your images..." />
    </div>
  </div>
</template>

<style>
/* This is for documentation purposes and will not be needed in your application */
.v-speed-dial {
  position: fixed;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import API from "@/utils/api";

export default {
  name: "Home",
  components: {},
  computed: {
    ...mapState([
      "page",
      "pageLoading",
      "totalPage",
      "pageCount",
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
    ...mapActions(["initClickImage", "getMyPhotos"]),
    updateLoading(newLoading) {
      this.loading = newLoading;
    },
    loadPhotos() {
      this.updateLoading(true);
      this.getMyPhotos()
        .then((photos) => {
          this.$store.dispatch("setTotalPhotos", photos);
          this.$store.commit(
            "setTotalPage",
            Math.ceil(photos.length / this.pageCount) || 1
          );
          this.updateLoading(false);
        })
        .catch((err) => {
          console.log(`MyData/index ${err}`);
          this.$store.dispatch("setTotalPhotos", []);
          this.updateLoading(false);
        });
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  watch: {
    page(newVal) {
      // Implement later
      this.updateLoading(false);
    },
  },
  mounted() {
    this.$store.commit("setTotalPage", 1);

    if (this.page !== 1) {
      this.$store.dispatch("setPage", 1);
    }
    this.loadPhotos();
    this.initClickImage();
  },
};
</script>
