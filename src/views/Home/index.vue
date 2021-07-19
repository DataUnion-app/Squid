<template>
  <div class="home">
    <CHeader title="Home" />
    <CPopMenu :flag="1"/>
    <div class="main-body">
      <div v-if="photos.length > 0" class="flex flex-wrap justify-left">
        <div v-for="photo in photos" :key="photo.hash" class="image-relative">
          <div class="comment">
            <CImage
              :hash="photo.hash"
              class="w-full h-full absolute p-1 comment-item"
            />
          </div>
        </div>
      </div>
      <div v-else>There is no image you uploaded</div>
    </div>
  </div>
</template>

<style>
  /* This is for documentation purposes and will not be needed in your application */
  .v-speed-dial {
    position: absolute;
  }

</style>

<script>
import { mapState, mapActions } from "vuex";
import API from "@/utils/api";

export default {
  name: "Home",
  components: {},
  computed: {},
  methods: {
    ...mapActions(["initClickImage"]),
  },
  data() {
    return {
      photos: [],
    };
  },
  watch: {},
  mounted() {
    API.myImages().then((photos) => {
      this.photos = photos;
    });
    this.initClickImage();
  },
  
};
</script>
