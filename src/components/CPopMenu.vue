<template>
  <div>
    <v-speed-dial
      v-model="fab"
      :top="top"
      :bottom="bottom"
      :right="right"
      :left="left"
      :transition="transition"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" class="pop-menu" dark fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-square-edit-outline </v-icon>
        </v-btn>
      </template>
      <v-btn
        v-if="flag == 1"
        fab
        dark
        small
        class="pop-menu-plus"
        @click="showDataSetDlg()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn v-else fab dark small class="pop-menu-plus">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn
        v-if="flag == 1"
        fab
        dark
        small
        class="pop-menu-heart"
        @click="showDataSetDialog()"
      >
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn
        v-else
        fab
        dark
        small
        class="pop-menu-heart"
        @click="showRemoveDialog()"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
    <!-- <router-view class="p-5 main"/> -->
    <vs-dialog v-model="showDataSet">
      <template #header>
        <h1 class="text-3xl not-margin">Add to Data Set</h1>
      </template>

      <!-- PLEASE CREATE DATASET -->
      <div class="flex">
        <div class="flex flex-col add-dialog">
          <div v-if="datas.length > 0" class="p-3 flex justify-center">
            <vs-select placeholder="Select a Data Set" v-model="data">
              <vs-option
                v-for="item in datas"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
                {{ item.name }}
              </vs-option>
            </vs-select>
            <vs-button @click="addDataSet_m"> Save </vs-button>
          </div>
          <div v-else class="p-3 flex justify-center">
            You haven't created any datasets yet. Please create one.
            <vs-button @click="connectSidebar"> Create </vs-button>
          </div>
        </div>
      </div>
      <!-- PLEASE CREATE DATASET -->

      <template #footer> </template>
    </vs-dialog>
    <vs-dialog v-model="removeDataSet">
      <template #header>
        <h1 class="text-3xl not-margin">Confirm</h1>
      </template>
      <div class="p-2 text-2xl flex justify-center">Are you sure?</div>
      <div class="p-2 flex justify-center">
        <vs-button @click="removeClickedImage()">Yes</vs-button>
        <vs-button @click="removeDataSet = !removeDataSet">No</vs-button>
      </div>
      <template #footer> </template>
    </vs-dialog>
    <vs-dialog v-model="showdatas">
      <template #header>
        <h1 class="text-3xl not-margin">Create Data Set</h1>
      </template>

      <div class="flex">
        <div class="flex flex-col add-dialog">
          <div class="p-3 flex justify-center">
            <vs-input
              v-model="dataName"
              placeholder="Input your data set name"
            />
            <vs-button @click="createData"> Create </vs-button>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </vs-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import API from "@/utils/api";

export default {
  name: "CPopMenu",
  components: {},
  props: {
    flag: Number,
  },
  data() {
    return {
      direction: "top",
      fab: false,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition",
      showDataSet: false,
      addDataTooltip: false,
      data: "",
      plus_data: false,
      removeDataSet: false,
      dataName: "",
      showdatas: false,
    };
  },
  computed: {
    ...mapState(["click_images", "page", "selectTag", "totalPhotos"]),
    ...mapGetters({
      datas: "getdatas",
    }),
  },
  methods: {
    addDataSet_m() {
      let i = 0;
      if (!this.plus_data) {
        const images = this.click_images.map((img) => img.hash);
        const oldImagesInDataSet = this.datas.find((d) => d.id === this.data);

        API.saveData(this.data, [
          ...new Set([...images, ...oldImagesInDataSet.entity_ids]),
        ])
          .then((res) => {
            this.showNotification("Success", "Successfuly added", "success");
          })
          .catch((err) => {
            console.error(err);
            this.showNotification("Failure", "Failed to add images", "danger");
          });
        this.showDataSet = false;
      } else {
        API.photos({ tag: this.selectTag, page: this.page }).then((photos) => {
          const images = photos.map((img) => img.hash);
          API.saveData(this.data, images)
            .then((res) => {
              this.showNotification("Success", "Successfuly added", "success");
            })
            .catch((err) => {
              console.error(err);
              this.showNotification(
                "Failure",
                "Failed to add images",
                "danger"
              );
            });
          this.showDataSet = false;
        });
      }
    },
    async fetchPhotoHashs(cTags, page = 1) {
      this.$store.dispatch("setApiLoading", true);
      let result = [];
      const photosResult = await Promise.all(
        cTags.map((t) =>
          API.photos({
            tag: t,
            page,
          })
        )
      );
      photosResult.map((r) => result.push(...r));
      this.$store.dispatch("setApiLoading", false);
      return result;
    },
    removeClickedImage() {
      const images = this.click_images.map((img) => img.hash);
      const currentDataset = this.datas.find(
        (d) => d.id === this.$route.params.id
      );
      const remainImages = currentDataset.entity_ids.filter(
        (img) => !images.includes(img)
      );

      API.saveData(this.$route.params.id, remainImages)
        .then((res) => {
          this.removeDataSet = false;
          this.$root.$refs.Data.loadLatestData();
          this.showNotification("Success", "Successfuly removed", "success");
        })
        .catch((err) => {
          console.error(err);
          this.removeDataSet = false;
          this.showNotification(
            "Failure",
            "Failed to remove an image",
            "danger"
          );
        });
    },
    showDataSetDialog() {
      if (this.click_images.length > 0) {
        this.showDataSet = true;
      } else {
        this.showNotification(
          "Warning",
          "No images selected. Please select images",
          "warning"
        );
      }
    },
    showRemoveDialog() {
      if (this.click_images.length > 0) {
        this.removeDataSet = true;
      } else {
        this.showNotification(
          "Warning",
          "No images selected. Please select images",
          "warning"
        );
      }
    },
    showNotification(title, text, color, position = "top-right") {
      this.$vs.notification({
        color,
        position,
        title: title,
        text: text,
      });
    },
    connectSidebar() {
      this.showDataSet = false;
      this.addDataTooltip = false;
      this.addDataDetailTooltip = false;
      this.$root.$refs.Sidebar.createData();
    },
    showDataSetDlg() {
      this.showdatas = true;
    },
    createData() {
      if (this.dataName !== "") {
        const photoIds = this.totalPhotos.map((p) => p.hash);

        API.createData(this.dataName, photoIds)
          .then((res) => {
            this.showNotification("Success", "Successfuly created", "success");
            this.$root.$refs.Sidebar.updateData();
          })
          .catch((err) => {
            console.error(err);
            this.showNotification(
              "Failure",
              "The dataset is already exists or failed to create a dataset with images",
              "danger"
            );
          });
        this.showdatas = false;
        this.dataName = "";
      }
    },
  },
  mounted() {},
};
</script>
