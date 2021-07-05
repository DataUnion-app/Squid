<template>
  <div>
    <CHeader
      :title="$route.params.id"
      :flag="true"
      @edit_clicked="onClickEdit"
    />
    <div style="margin-top: 10px">
      <div>
        <div
          v-if="photos.length > 0"
          class="flex flex-wrap justify-center overflow-y-auto"
        >
          <div
            v-for="(photo, index) in photos"
            :key="photo"
            class="w-1/4 relative"
          >
            <div style="width: 100%; padding-top: 100%">
              <CImage
                :hash="photo"
                :flag="true"
                :index="index"
                @clicked="onClickChild"
                class="w-full h-full absolute p-1"
                style="top: 0; left: 0"
              />
            </div>
          </div>
        </div>
        <div v-else>There is no image</div>
      </div>
      <vs-dialog v-model="showModal">
        <template #header>
          <h1 class="text-3xl not-margin">Change Data Name</h1>
        </template>

        <div class="flex">
          <div
            class="flex flex-col"
            style="width: 50%; min-width: 400px; max-height: 80%"
          >
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

export default {
  name: "datas",
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
    onClickChild(value) {
      this.removedatas(value);
    },
    onClickEdit() {
      this.showChangeNameModal();
    },
    showChangeNameModal() {
      this.showModal = true;
    },
    changeName() {
      API.changedataName({ oldname: this.name, newname: this.dataName }).then(
        () => {
          this.showModal = false;

          const param = this.dataName;

          this.$router.push({ name: "datas", params: { id: param } });
          this.$store.dispatch("setdatas");
        }
      );
    },
    removedatas(index) {
      API.removedatas({ name: this.name, index: index }).then((photos) => {
        this.photos = photos;
        this.openNotification("top-right", "success");
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
  },

  watch: {
    name(newVal, oldVal) {
      if (newVal == "") {
        return;
      }
      API.getdatas({ name: this.name }).then((photos) => {
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
    API.getdatas({ name: this.name }).then((photos) => {
      this.photos = photos;
    });
  },
};
</script>
