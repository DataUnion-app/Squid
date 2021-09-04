<template>
  <div class="home">
    <CHeader title="Gallery" :flag="2" />
    <CPopMenu :flag="1" />
    <div class="main-body" v-show="!pageLoading">
      <div v-if="photos">
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
        </div>
      </div>
      <div v-else>
        <h1 class="text-3xl p-3 not-margin">There is no image</h1>
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
      if (newVal === undefined) return;
      let i, timer;
      if (typeof newVal == "string") {
        API.photos({ tag: newVal }).then((photos) => {
          this.photos = photos;
          if (this.photos.length === 0) {
            this.$store.commit("setTotalPage", this.page);
          } else {
            this.$store.commit("setTotalPage", this.page + 1);
          }
        });
      } else {
        i = 0;
        timer = setInterval(() => {
          if (i >= newVal.length - 1) {
            clearInterval(timer);
          }
          if (i == 0) {
            API.photos({ tag: newVal[i] }).then((photos) => {
              this.photos = photos;
              if (this.photos.length === 0) {
                this.$store.commit("setTotalPage", this.page);
              } else {
                this.$store.commit("setTotalPage", this.page + 1);
              }
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
                if (this.photos.length === 0) {
                  this.$store.commit("setTotalPage", this.page);
                } else {
                  this.$store.commit("setTotalPage", this.page + 1);
                }
              }
            });
          }
          i++;
        }, 50);
      }
    },
    page(newVal, oldVal) {
      let i, timer;
      if (typeof this.$store.state.selectTag == "string") {
        API.photos({ tag: this.$store.state.selectTag, page: newVal }).then(
          (photos) => {
            this.photos = photos;
            if (this.photos.length === 0) {
              this.$store.commit("setTotalPage", this.page);
            } else {
              this.$store.commit("setTotalPage", this.page + 1);
            }
          }
        );
      } else {
        i = 0;
        timer = setInterval(() => {
          if (i >= this.$store.state.selectTag.length - 1) {
            clearInterval(timer);
          }
          if (i == 0) {
            API.photos({
              tag: this.$store.state.selectTag[i],
              page: newVal,
            }).then((photos) => {
              this.photos = photos;
              if (this.photos.length === 0) {
                this.$store.commit("setTotalPage", this.page);
              } else {
                this.$store.commit("setTotalPage", this.page + 1);
              }
            });
          } else {
            API.photos({
              tag: this.$store.state.selectTag[i],
              page: newVal,
            }).then((photos) => {
              let j = 0;
              for (j = 0; j < photos.length; j++) {
                if (
                  !this.photos.filter((item) => item.hash == photos[j].hash)
                    .length
                )
                  this.photos.push(photos[j]);
                if (this.photos.length === 0) {
                  this.$store.commit("setTotalPage", this.page);
                } else {
                  this.$store.commit("setTotalPage", this.page + 1);
                }
              }
            });
          }
          i++;
        }, 50);
      }
    },
  },

  mounted() {
    let i, timer;
    const defaultTag = "dataunion - 1";

    if (!this.$store.state.selectTag || this.$store.state.selectTag?.length === 0) {
      this.$store.dispatch("setSelectTag", defaultTag);
    } else {
      if (typeof this.$store.state.selectTag == "string") {
        API.photos({ tag: this.$store.state.selectTag }).then((photos) => {
          this.photos = photos;
          if (this.photos.length === 0) {
            this.$store.commit("setTotalPage", this.page);
          } else {
            this.$store.commit("setTotalPage", this.page + 1);
          }
        });
      } else {
        i = 0;
        timer = setInterval(() => {
          if (i >= this.$store.state.selectTag.length - 1) {
            clearInterval(timer);
          }
          if (i == 0) {
            API.photos({ tag: this.$store.state.selectTag[i] }).then(
              (photos) => {
                this.photos = photos;
                if (this.photos.length === 0) {
                  this.$store.commit("setTotalPage", this.page);
                } else {
                  this.$store.commit("setTotalPage", this.page + 1);
                }
              }
            );
          } else {
            API.photos({ tag: this.$store.state.selectTag[i] }).then(
              (photos) => {
                let j = 0;
                for (j = 0; j < photos.length; j++) {
                  if (
                    !this.photos.filter((item) => item.hash == photos[j].hash)
                      .length
                  )
                    this.photos.push(photos[j]);
                  if (this.photos.length === 0) {
                    this.$store.commit("setTotalPage", this.page);
                  } else {
                    this.$store.commit("setTotalPage", this.page + 1);
                  }
                }
              }
            );
          }
          i++;
        }, 50);
      }
    }
    this.initClickImage();
  },
};
</script>
