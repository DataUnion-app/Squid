<template>
  <div class="home">
    <CHeader title="Home" />
    <div class="main-body">
      <div v-if="photos.length > 0" class="flex flex-wrap justify-center">
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

<script>
import { mapState } from "vuex";
import API from "@/utils/api";

export default {
  name: "Home",
  components: {},
  computed: {},
  methods: {},
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
  },
};
</script>
