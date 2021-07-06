<template>
  <div class="home">
    <CHeader title="Gallery" />
    <div class="main-body">
      <vs-select
        v-if="tags.length > 0"
        placeholder="Select a tag"
        v-model="tag"
      >
        <vs-option
          v-for="item in tags.slice(0, 20)"
          :key="item"
          :label="item"
          :value="item"
        >
          {{ item }}
        </vs-option>
      </vs-select>
      <div class="main-body">
        <div v-if="tag != ''" class="flex flex-wrap justify-center">
          <div v-for="photo in photos" :key="photo.hash" class="image-relative">
            <div class="comment">
              <CImage
                :hash="photo.hash"
                class="w-full h-full absolute p-1 comment-item"
              />
            </div>
          </div>
        </div>
        <div v-else>Please Select a tag to see images</div>
      </div>
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
    ...mapState(["tags"]),
  },
  methods: {},
  data() {
    return {
      tag: "",
      photos: [],
    };
  },
  watch: {
    tag(newVal, oldVal) {
      if (newVal == "") {
        return;
      }
      API.photos({ tag: this.tag }).then((photos) => {
        this.photos = photos;
      });
    },
  },
  mounted() {
    this.tag = this.$store.state.tags[0];
  },
};
</script>
