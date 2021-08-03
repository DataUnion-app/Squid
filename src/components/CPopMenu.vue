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
      <v-btn fab dark small class="pop-menu-pencil">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
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

      <div class="flex">
        <div class="flex flex-col add-dialog">
          <div v-if="datas.length > 0" class="p-3 flex justify-center">
            <vs-select
              v-if="datas.length > 0"
              placeholder="Select a Data Set"
              v-model="data"
            >
              <vs-option
                v-for="item in datas"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                {{ item.name }}
              </vs-option>
            </vs-select>
            <vs-button @click="addDataSet_m"> Save </vs-button>
          </div>
          <div v-else class="p-3 flex justify-center">
            There is no data set yet, Please create one
            <vs-button @click="connectSidebar"> Create </vs-button>
          </div>
        </div>
      </div>
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
import { mapActions, mapState } from "vuex";
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
      datas: [],
      data: "",
      plus_data: false,
      removeDataSet: false,
      dataName: "",
      showdatas: false,
    };
  },
  computed: {
    ...mapState(["click_images", "page", "selectTag"]),
  },
  methods: {
    addDataSet_m() {
      let i = 0;
      if (!this.plus_data) {
        for (i = 0; i < this.click_images.length; i++) {
          API.saveData({ name: this.data, hash: this.click_images[i].hash });
        }
        this.openNotificationSucess("top-right", "success");
        this.showDataSet = false;
      } else {
        API.photos({ tag: this.selectTag, page: this.page }).then((photos) => {
          for (i = 0; i < photos.length; i++) {
            API.saveData({ name: this.data, hash: photos[i].hash });
          }
          this.openNotificationSucess("top-right", "success");
          this.showDataSet = false;
        });
      }
    },
    removeClickedImage() {
      API.removeSelectDatas({
        name: this.$route.params.id,
        images: this.click_images,
      }).then((flag) => {
        this.openNotificationSucessRemove("top-right", "success");
        this.removeDataSet = false;
        this.$root.$refs.Data.getDatas();
      });
    },
    showDataSetDialog() {
      if (this.click_images.length > 0) {
        this.showDataSet = true;
        this.refreshDataSet();
      } else {
        this.openNotificationNoSelect("top-right", "danger");
      }
    },
    showRemoveDialog() {
      if (this.click_images.length > 0) {
        this.removeDataSet = true;
      } else {
        this.openNotificationNoSelect("top-right", "danger");
      }
    },
    openNotificationSucess(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "Successfuly added",
      });
    },
    openNotificationSucessRemove(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "Successfuly removed",
      });
    },
    openNotificationNoSelect(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "No images selected",
        text: "Please select images",
      });
    },
    openNotificationFailed(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Failed",
        text: "Already images exists!",
      });
    },
    openNotificationAlbumFailed(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Failed",
        text: "Already images exists!",
      });
    },
    connectSidebar() {
      this.showDataSet = false;
      this.addDataTooltip = false;
      this.addDataDetailTooltip = false;
      this.$root.$refs.Sidebar.createData();
    },
    refreshDataSet() {
      API.datas().then((datas) => {
        this.datas = datas;
      });
    },
    showDataSetDlg() {
      this.showdatas = true;
    },
    createData() {
      if (this.dataName !== "") {
        API.createData({ name: this.dataName }).then((flag) => {
          if (flag) {
            this.refreshDataSet();
            this.$root.$refs.Sidebar.updateData();
            let i, timer;
            if (typeof this.selectTag == "string") {
              API.photos({ tag: this.selectTag, page: this.page }).then(
              (photos) => {
                for (i = 0; i < photos.length; i++) {
                  API.saveData({ name: this.dataName, hash: photos[i].hash });
                }
                this.openNotificationSucess("top-right", "success");
                this.showdatas = false;
                this.dataName = "";
              });
            } 
            else {
              const name_temp = this.dataName;
              i = 0;
              timer = setInterval(() => {
                if (i >= this.selectTag.length) {
                  this.openNotificationSucess("top-right", "success");
                  this.showdatas = false;
                  this.dataName = "";
                  clearInterval(timer);
                }
                  const temp_tag = this.selectTag[i];
                  API.photos({ tag: temp_tag, page: this.page }).then(
                    (photos) => {
                      let j;
                      for (j = 0; j < photos.length; j++) {
                        API.saveData({ name: name_temp, hash: photos[j].hash });
                      }
                    });
                i++;
              }, 50);
            }
          } else {
            this.showdatas = true;
            this.openNotificationAlbumFailed("top-right", "danger");
          }
        });
      }
    },
  },
  mounted() {
    this.refreshDataSet();
  },
};
</script>
