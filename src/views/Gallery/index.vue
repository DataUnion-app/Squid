<template>
  <div class="home">
    <CHeader title="Gallery" :flag="2" />
    <CPopMenu :flag="1" />
    <div class="main-body">
      <div v-if="photos.length > 0" class="flex flex-wrap justify-left ml-12">
        <!-- <VueAutoVirtualScrollList
        :totalHeight="800"
        :defaultHeight="80"
        > -->
          <div v-for="photo in photos" :key="photo.hash" class="image-relative">
            <div class="comment">
              <CImage
                :hash="photo.hash"
                class="w-full h-full absolute p-1 comment-item"
              />
            </div>
          </div>
        <!-- </VueAutoVirtualScrollList> -->
      </div>
      <div v-else>
        <h1 class="text-3xl p-3 not-margin">There is no image</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VueAutoVirtualScrollList from 'vue-auto-virtual-scroll-list'
import API from "@/utils/api";

export default {
  name: "Gallery",
  // components: { VueAutoVirtualScrollList  },
  computed: {
    ...mapState(["selectTag", "page"]),
  },
  methods: {
    ...mapActions(["initClickImage", "setPage"]),
  },
  data() {
    return {
      photos: [],
    };
  },
  watch: {
    selectTag(newVal, oldVal) {
      let i;
      if (typeof newVal == "string") {
        API.photos({ tag: newVal }).then((photos) => {
          this.photos = photos;
        });
      } else {
        for (i = 0; i < newVal.length; i++) {
          if (i == 0) {
            API.photos({ tag: newVal[i] }).then((photos) => {
              this.photos = photos;
            });
          } else {
            API.photos({ tag: newVal[i] }).then((photos) => {
              let j = 0;
              for (j = 0; j < photos.length; j++) {
                if (
                  !this.photos.filter((item) => item.hash == photos[j].hash)
                    .length
                )
                  this.photos.push(photos[j]);
              }
            });
          }
        }
      }
    },
    page(newVal, oldVal) {
      API.photos({ tag: this.$store.state.selectTag, page: newVal }).then(
        (photos) => {
          this.photos = photos;
        }
      );
    },
  },
  mounted() {
    let i;
    if (typeof this.$store.state.selectTag == "string") {
      API.photos({ tag: this.$store.state.selectTag }).then((photos) => {
        this.photos = photos;
      });
    } else {
      for (i = 0; i < this.$store.state.selectTag.length; i++) {
        if (i == 0) {
          API.photos({ tag: this.$store.state.selectTag[i] }).then((photos) => {
            this.photos = photos;
          });
        } else {
          API.photos({ tag: this.$store.state.selectTag[i] }).then((photos) => {
            let j = 0;
            for (j = 0; j < photos.length; j++) {
              if (
                !this.photos.filter((item) => item.hash == photos[j].hash)
                  .length
              )
                this.photos.push(photos[j]);
            }
          });
        }
      }
    }

    this.initClickImage();
  },
};
</script>
