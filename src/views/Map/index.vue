<template>
  <div>
    <div class="map-size" id="map"></div>
    <vs-dialog v-model="showDetails">
      <template #header>
        <h1 class="text-3xl not-margin">Details</h1>
      </template>

      <div class="flex">
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
                <vs-button danger icon>
                  <i class="bx bx-heart" @click="showDataDialog"></i>
                </vs-button>
              </template>
            </vs-card>
          </div>
          <div class="mt-3 flex flex-wrap">
            <div v-for="tag in tags" :key="tag.tag" class="flex">
              <div
                class="flex mr-1 items-center rounded-full py-1 px-2 m-1"
                :class="isUp(tag) ? 'bg-green-300' : 'bg-red-300'"
              >
                {{ tag.tag }}:
                <div>
                  <div><i class="bx bx-upvote"></i>:{{ tag.up_votes }}</div>
                  <div><i class="bx bx-downvote"></i>:{{ tag.down_votes }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col image-detail-right">
          <div class="relative w-full">
            <div class="comment">
              <div
                class="
                  w-full
                  h-full
                  absolute
                  p-1
                  object-contain
                  pr-5
                  comment-item
                "
              >
                <div v-if="comments.length > 0" class="h-full flex flex-col">
                  <div class="text-2xl text-center">Comments</div>
                  <div class="p-3 overflow-y-auto">
                    <div
                      v-for="(item, index) in comments"
                      :key="index"
                      class="flex items-center m-1"
                    >
                      <vs-avatar class="mr-3 comment-avatar">
                        <img :src="avatar(item.from)" alt="" />
                      </vs-avatar>
                      <div>{{ item.comment }}</div>
                    </div>
                  </div>
                </div>
                <div class="text-xl p-5" v-else>There is no comment yet.</div>
              </div>
            </div>
          </div>
          <div class="p-3 flex justify-center">
            <vs-input v-model="comment" placeholder="Input your feedback" />
            <vs-button @click="postComment"> Comment </vs-button>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </vs-dialog>
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
                :value="item.name"
              >
                {{ item.name }}
              </vs-option>
            </vs-select>
            <vs-button @click="addDataSet"> Save </vs-button>
          </div>
          <div v-else class="p-3 flex justify-center">
            There is no data set yet, Please create one
            <vs-button @click="connectSidebar"> Create </vs-button>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </vs-dialog>
  </div>
</template>

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
    };
  },
  mounted() {
    API.myImages().then((photos) => {
      var i,
        length = photos.length;
      var temp_image = [];
      for (i = 0; i < length; i++) temp_image.push(photos[i].hash);

      API.imageTag(temp_image).then((images) => {
        this.markers = images;
        var marker;

        for (var i = 0; i < this.markers.length; i++) {
          if (i == 0) {
            map.flyTo({
              center: [
                this.markers[i].value.longitude,
                this.markers[i].value.latitude,
              ],
            });
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
              center: [
                markerItem.value.longitude,
                markerItem.value.latitude,
              ],
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
    ...mapGetters(["imagebyId"]),
  },
  methods: {
    ...mapActions(["getImage", "getTags"]),
    // receives a place object via the autocomplete component
    avatar(id) {
      return utils.blockies(id);
    },
    details(hash) {
      this.hash = hash;
      this.refreshComments();
      //this.details();
      this.getImage(this.hash).then((image) => {
        this.image = image;
      });
      this.getTags(this.hash).then((tags) => {
        this.tags = tags;
        this.showDetails = true;
      });
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
      API.addComment({ id: this.hash, comment: this.comment }).then(() => {
        this.refreshComments();
        this.comment = "";
      });
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
          this.showDataSet = false;
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
        text: "Already photo exists",
      });
    },
  },
};
</script>

