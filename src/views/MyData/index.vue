<template>
  <div class="home">
    <CHeader title="My Data" />
    <CPopMenu :flag="1" />
    <div v-show="!pageLoading" class="main-body">
      
      <div v-if="!loading && photos.length > 0" class="flex flex-wrap justify-left ml-12">
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
    ...mapState(["page", "pageLoading", "totalPage"]),
  },
  methods: {
    ...mapActions(["initClickImage"]),
    updateLoading(newLoading) {
      this.loading = newLoading;
    }
  },
  data() {
    return {
      photos: [],
      loading: true,
    };
  },
  watch: {
    // ts
    // loading(newVal, oldVal) {
    //   console.log(`loading newVal = ${newVal}`);
    //   console.log(`photos.length = ${this.photos.length}`);
    // },
    photos(newVal, oldVal) { 
      // ts
      // console.log(`photos newVal = `);
      // console.log(newVal);
      this.updateLoading(false);
    },
    page(newVal, oldVal) {
      this.updateLoading(true);
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
    // ts
    // console.log(`MOUNTING MYDATA...`);
    // console.log(`loading initialVal = ${this.loading}`)
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
