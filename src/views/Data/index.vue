<template>
  <div>
    <CHeader :title="$route.params.id" :flag="'data'" @onClickEdit="onClickEdit" />
    <CPopMenu :flag="2" />
    <div class="main-body">
      <div>
        <div v-if="photos.length > 0" class="flex flex-wrap justify-left ml-12">
          <div
            v-for="(photo, index) in photos"
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
      <vs-dialog v-model="showModal">
        <template #header>
          <h1 class="text-3xl not-margin">Change Data Set Name</h1>
        </template>

        <div class="flex">
          <div class="flex flex-col image-detail-right">
            <div class="p-3 flex justify-center">
              <vs-input v-model="dataName" placeholder="" />
              <vs-button @click="changeName"> Change </vs-button>
            </div>
          </div>
        </div>
        <template #footer> </template>
      </vs-dialog>
    </div>
  </div>
</template>

<script>
import API from "@/utils/api";
import { mapActions, mapState } from "vuex";

export default {
  name: "datas",
  created() {
    this.$root.$refs.Data = this;
  },
  components: {},
  computed: {},
  data() {
    return {
      photos: [],
      name: "",
      dataName: "",
      showModal: false,
    };
  },
  methods: {
    ...mapActions(["initClickImage"]),
    onClickChild(value) {
      this.removeData(value);
    },
    onClickEdit() {
      this.showChangeNameModal();
    },
    showChangeNameModal() {
      this.showModal = true;
    },
    changeName() {
      API.changeDataSetName({
        oldname: this.name,
        newname: this.dataName,
      }).then(() => {
        this.showModal = false;
        const param = this.dataName;
        this.$router
          .push({ name: "datas", params: { id: param } })
          .catch(() => {});
        this.$store.dispatch("setdatas");
      });
    },
    removeData(index) {
      API.removeData({ name: this.name, index: index }).then((photos) => {
        this.photos = photos;
        this.openNotification("top-right", "success");
        this.initClickImage();
      });
    },
    openNotification(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "Successfuly removed",
      });
    },
    getDatas() {
      API.getData({ name: this.name }).then((photos) => {
        this.photos = photos;
        this.initClickImage();
      });
    },
  },

  watch: {
    name(newVal, oldVal) {
      if (newVal == "") {
        return;
      }
      API.getData({ name: this.name }).then((photos) => {
        this.photos = photos;
      });
    },
  },
  updated() {
    this.name = this.$route.params.id;
  },
  mounted() {
    this.name = this.$route.params.id;
    this.dataName = this.name;
    this.getDatas();
    this.initClickImage();
  },
};
</script>
