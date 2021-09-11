<template>
  <div class="home">
    <CHeader title="My Data" />
    <CPopMenu :flag="1" />
    <div v-show="!pageLoading" class="main-body">
      <div v-if="photos.length > 0" class="flex flex-wrap justify-left ml-12">
        <div v-for="photo in photos" :key="photo.hash" class="image-relative">
          <div class="comment">
            <CImage
              :hash="photo.hash"
              class="w-full h-full absolute p-1 comment-item"
            />
          </div>
        </div>
      </div>
      <div v-else>
        <h1 class="text-3xl p-3 not-margin">There is no image you uploaded</h1>
      </div>
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
    ...mapState(["page", "pageLoading", "totalPage"]),
  },
  methods: {
    ...mapActions(["initClickImage"]),
  },
  data() {
    return {
      photos: [],
    };
  },
  watch: {
    page(newVal, oldVal) {
      API.myImages({ page: newVal, from: 'mydata' }).then((photos) => {
        this.photos = photos;
        if (this.photos.length === 0) {
          this.$store.commit("setTotalPage", this.page);
        } else {
          this.$store.commit("setTotalPage", this.page + 1);
        }
      });
    },
  },
  mounted() {
    this.$store.commit("setTotalPage", 1);
    API.myImages({ page: 1, from: 'mydata' }).then((photos) => {
      this.photos = photos;
      if (photos.length === 0) {
        this.$store.commit("setTotalPage", 1);
      }
    });
    this.initClickImage();
  },
};
</script>
