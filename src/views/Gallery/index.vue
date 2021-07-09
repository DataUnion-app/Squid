<template>
  <div class="home">
    <CHeader title="Gallery" :flag="2" />
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
      <div v-else>There is no image</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import API from "@/utils/api";

export default {
  name: "Gallery",
  components: {},
  computed: {
    ...mapState(["tags", "selectTag"]),
  },
  methods: {},
  data() {
    return {
      photos: [],
    };
  },
  watch: {
    selectTag(newVal, oldVal) {
      if (newVal == "") {
        return;
      }
      API.photos({ tag: newVal }).then((photos) => {
        this.photos = photos;
      });
    },
  },
  mounted() {
    API.photos({ tag: this.$store.state.selectTag }).then((photos) => {
      this.photos = photos;
    });
  },
};
</script>
