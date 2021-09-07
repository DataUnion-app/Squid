<template>
  <div class="">
    <div class="map-size overflow-hidden" id="map"></div>
    
    <!-- <CDetails
      v-if='hash !== "" && hash !== undefined' 
      :hash="hash"
      :
    /> -->

      <vs-dialog 
        v-model="showDetails"
        @v-on:close="handleClose"
        >
        <template #header>
        <h1 class="text-3xl not-margin">Details</h1>
        </template>

        <div class="flex position-relative">
        <div v-show="!tagsLoaded" class="smt-spinner-circle">
            <div class="smt-spinner"></div>
        </div>
        <div class="image-detail-left">
            <div class="relative w-full">
            <vs-card>
                <template #img>
                <img
                    v-if="image"
                    class="image-detail"
                    :src="image"
                    @click="preview"
                    alt=""
                />
                </template>
                <template #interactions>
                <vs-tooltip
                    ref="tooltipdetail"
                    v-if="!flag"
                    bottom
                    shadow
                    not-hover
                    v-model="addDataDetailTooltip"
                >
                    <vs-button danger icon @click="showDataDetailTooltip">
                    <i class="bx bx-heart"></i>
                    </vs-button>
                    
                    <!-- SELECT DATASET -->
                    <template #tooltip>
                    <div
                        class="content-tooltip"
                        v-click-outside="onTooltipOutside"
                    >
                        <div v-if="datas.length > 0">
                        <h4>Please select a Data Set</h4>
                        <vs-select
                            class="vs-body"
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
                        <!-- <p>Are you sure you want to add this image in that Data Set?</p> -->
                        <footer class="flex">
                            <vs-button @click="addDataSet" danger block>
                            Yes
                            </vs-button>
                            <vs-button
                            @click="addDataDetailTooltip = false"
                            transparent
                            dark
                            block
                            >
                            No
                            </vs-button>
                        </footer>
                        </div>
                        <div v-else class="p-3 flex justify-center">
                        You haven't created any datasets yet. Please create one.
                        <footer class="flex">
                            <vs-button @click="connectSidebar">
                            Create
                            </vs-button>
                        </footer>
                        </div>
                    </div>
                    </template>
                    <!-- SELECT DATASET -->
                
                </vs-tooltip>
                <vs-tooltip
                    v-else
                    bottom
                    shadow
                    not-hover
                    v-model="removeImageDetail"
                >
                    <vs-button
                    danger
                    icon
                    @click="removeImageDetail = !removeImageDetail"
                    >
                    <i class="bx bx-trash"></i>
                    </vs-button>
                    <template #tooltip>
                    <div class="content-tooltip">
                        <h4 class="center">Confirm</h4>
                        <p>Are you sure you want to remove this image?</p>
                        <footer class="flex">
                        <vs-button @click="removeIconClicked" danger block>
                            Remove
                        </vs-button>
                        <vs-button
                            @click="removeImageDetail = false"
                            transparent
                            dark
                            block
                        >
                            Cancel
                        </vs-button>
                        </footer>
                    </div>
                    </template>
                </vs-tooltip>

                <vs-button danger icon @click="goWorldMap">
                    <i class="bx bx-world"></i>
                </vs-button>
                </template>
            </vs-card>
            </div>
            <div class="mt-3 h-40 overflow-auto">
            <div class="mt-3 flex flex-wrap">
                <div v-for="(tag, index) in tags" :key="index" class="flex">
                <vs-button v-bind:style="styleObject[index]">
                    {{ tag.tag }}
                </vs-button>
                </div>
            </div>
            </div>
        </div>
        <div class="flex image-detail-right">
            <div class="relative w-full">
            <div class="comment">
                <div
                class="
                    w-full
                    h-full
                    absolute
                    p-2
                    object-contain
                    pl-4
                    pr-2
                    comment-item
                "
                >
                <vs-table>
                    <template #thead>
                    <vs-tr>
                        <vs-th> Tag Name </vs-th>
                        <vs-th> Upvotes </vs-th>
                        <vs-th> Downvotes </vs-th>
                        <vs-th> Boxes </vs-th>
                    </vs-tr>
                    </template>
                    <template #tbody>
                    <p v-show="!tagsLoaded"></p>
                    <vs-tr :key="i" v-for="(tr, i) in tags" :data="tr">
                        <vs-td>
                        {{ tr.tag }}
                        </vs-td>
                        <vs-td>
                        {{ tr.up_votes }}
                        </vs-td>
                        <vs-td>
                        {{ tr.down_votes }}
                        </vs-td>
                        <vs-td>
                        {{
                            groupedImages[tr.tag]
                            ? groupedImages[tr.tag].length
                            : 0
                        }}
                        </vs-td>
                    </vs-tr>
                    </template>
                </vs-table>
                </div>
            </div>
            </div>
            <!-- <div class="p-3 flex justify-center">
            <vs-input v-model="comment" placeholder="Input your feedback" />
            <vs-button @click="postComment"> Comment </vs-button>
            </div> -->
        </div>
        </div>
        <template #footer>
        <div class="flex flex-col rounded-xl border-gray-500 border mt-4 p-3">
            <div class="coming-soon">Sales, Price & Usage Information: COMING SOON</div>
        </div>
        </template>
  </vs-dialog>

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
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                {{ item.name }}
              </vs-option>
            </vs-select>
            <vs-button @click="addDataSet"> Save </vs-button>
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
  </div>
</template>
<style>

.vs-select__options {
  z-index: 9999999 !important;
}

</style>
<script>
import { mapActions, mapGetters } from "vuex";
import utils from "@/utils";
import API from "@/utils/api";

export default {
  name: "Map",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      showDetails: false,
      showDataSet: false,
      tags: [],
      comment: "",
      comments: [],
      markers: [],
      image: "",
      hash: "",
      datas: [],
      data: "",
      images: [],
      addDataTooltip: false,
    };
  },
  mounted() {
    let imageHash = this.getImageWorld;
    API.myImages({ page: 1 }).then((photos) => {
      let i,
        length = photos.length;
      let tempImage = [];
      for (i = 0; i < length; i++) tempImage.push(photos[i].hash);

      API.imageTag(tempImage, "GeoLocation").then((images) => {
        this.markers = images;
        let marker;

        for (let i = 0; i < this.markers.length; i++) {
          if (this.markers[i].image_id == imageHash) {
            map.flyTo({
              center: [
                this.markers[i].value.longitude,
                this.markers[i].value.latitude,
              ],
            });
          } else {
            map.flyTo({
              center: [
                this.markers[0].value.longitude,
                this.markers[0].value.latitude,
              ],
            });
            this.$store.dispatch("setImageWorld", "");
          }

          const markerItem = this.markers[i];
          const markerIcon = document.createElement("img");
          markerIcon.style.width = "50px";
          markerIcon.style.height = "50px";
          markerIcon.style.borderRadius = "50%";
          markerIcon.style.backgroundSize = "cover";
          markerIcon.src = this.imagebyId(markerItem.image_id);
          markerIcon.style.cursor = "pointer";

          markerIcon.addEventListener("click", () => {
            this.details(markerItem.image_id);
            map.flyTo({
              center: [markerItem.value.longitude, markerItem.value.latitude],
            });
          });

          marker = new window.maplibregl.Marker(markerIcon)
            .setLngLat([
              this.markers[i].value.longitude,
              this.markers[i].value.latitude,
            ])
            .addTo(map);
        }
      });
    });

    const map = new window.maplibregl.Map({
      container: "map", // container id
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.VUE_APP_KEY}`, // style URL
      center: [-38, -40], // starting position [lng, lat]
      zoom: 3, // starting zoom
    });
  },
  computed: {
    ...mapGetters(["imagebyId", "getImageWorld"]),
  },
  methods: {
    ...mapActions(["getImage", "getTags"]),
    onTooltipOutside(e) {
      if (
        this.addDataTooltip &&
        e.srcElement.className != "vs-select__options__content"
      ) {
        this.addDataTooltip = false;
      }
    },
    // receives a place object via the autocomplete component
    avatar(id) {
      return utils.blockies(id);
    },
    details() {
      this.getImage(this.hash).then((image) => {
        this.image = image;
      });
      this.getTags(this.hash)
        .then((tags) => {
          this.tags = tags;
          let i;
          this.color_rank = [];
          let up_max = 0,
            down_max = 0;
          for (i = 0; i < tags.length; i++) {
            if (up_max < tags[i].up_votes) up_max = tags[i].up_votes;
            if (down_max < tags[i].down_votes) down_max = tags[i].down_votes;
          }

          for (i = 0; i < tags.length; i++) {
            if (tags[i].up_votes > tags[i].down_votes) {
              let d_green = 128 + (64 / up_max) * (up_max - tags[i].up_votes);
              this.styleObject[i] = {
                backgroundColor: `rgb(0, ${d_green}, 0)`,
                color: "white",
              };
            } else if (tags[i].up_votes == tags[i].down_votes) {
              this.styleObject[i] = {
                backgroundColor: "rgb(204, 204, 0)",
                color: "white",
              };
            } else {
              let d_red =
                128 + (64 / down_max) * (down_max - tags[i].down_votes);
              this.styleObject[i] = {
                backgroundColor: `rgb(${d_red}, 0, 0)`,
                color: "white",
              };
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
      API.imageTag(this.hash, "BoundingBox").then((images) => {
        this.groupedImages = this.groupBy(images, "tag");
      });
      this.showDetails = true;
      this.tagsLoaded = true;
    },
    isUp(tag) {
      const down = tag.down_votes || tag.down_Votes;
      return tag.up_votes > down;
    },
    preview() {
      this.$viewerApi({
        images: [this.image],
      });
    },
    showDataTooltip() {
      this.addDataTooltip = true;
      this.refreshDataSet();
    },
    connectSidebar() {
      this.showDataSet = false;
      this.$root.$refs.Sidebar.createData();
    },
    refreshComments() {
      API.comments(this.hash).then((comments) => {
        this.comments = comments;
      });
    },
    postComment() {
      if (this.comment !== "") {
        API.addComment({ id: this.hash, comment: this.comment }).then(() => {
          this.refreshComments();
          this.comment = "";
        });
      }
    },
    showDataDialog() {
      this.refreshDataSet();
      this.showDataSet = true;
    },
    refreshDataSet() {
      API.datas().then((datas) => {
        this.datas = datas;
      });
    },
    addDataSet() {
      if (this.data !== "") {
        API.saveData({ name: this.data, hash: this.hash }).then((flag) => {
          if (flag) {
            this.openNotificationSucess("top-right", "success");
          } else {
            this.openNotificationFailed("top-right", "danger");
          }
          this.addDataTooltip = false;
          this.addDataDetailTooltip = false;
        });
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
    openNotificationFailed(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Failed",
        text: `Photo already exists in this dataset.`,
      });
    },
  },

  updated() {
    if (this.$refs.tooltip) {
      this.$refs.tooltip.removeTooltip = () => {};
    }
  },
};
</script>

