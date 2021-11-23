<template>
  <div>
    <CHeader :title="currentData.name" flag="data" />
    <CPopMenu :flag="2" />
    <div class="main-body">
      <div>
        <div
          v-if="currentData.entity_ids.length > 0"
          class="flex flex-wrap justify-left ml-12"
        >
          <div
            v-for="(photo, index) in currentData.entity_ids"
            :key="photo"
            class="image-relative"
          >
            <div class="comment">
              <CImage
                :hash="photo"
                :flag="true"
                :index="index"
                @onClickChild="onClickChild"
                class="w-full h-full absolute p-1 comment-item"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <h1 class="text-3xl p-3 not-margin">This Data Set is empty.</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from "@/utils/api";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Datas",
  data() {
    return {
      photos: [],
      showModal: false,
    };
  },
  components: {},
  computed: {
    ...mapGetters(["getdatas"]),
    currentData() {
      const id = this.$route.params.id;
      const datas = this.getdatas;
      return datas.find((data) => data.id === id);
    },
  },
  methods: {
    ...mapActions(["initClickImage"]),
    onClickChild(value) {
      this.removeData(value);
    },
    removeData(index) {
      const currentPhotos = [...this.currentData.entity_ids];
      currentPhotos.splice(index, 1);

      API.saveData(this.currentData.id, currentPhotos)
        .then((res) => {
          this.loadLatestData();
          this.showNotification("Success", "Successfuly removed", "success");
        })
        .catch((err) => {
          console.error(err);
          this.showNotification(
            "Failure",
            "Failed to remove an image",
            "danger"
          );
        });
      this.initClickImage();
    },
    showNotification(title, text, color, position = "top-right") {
      this.$vs.notification({
        color,
        position,
        title: title,
        text: text,
      });
    },
    async loadLatestData() {
      await this.$store.dispatch("setdatas");
    },
  },

  watch: {},
  created() {
    this.$root.$refs.Data = this;
  },
  mounted() {
    this.loadLatestData();
    this.initClickImage();
  },
};
</script>
