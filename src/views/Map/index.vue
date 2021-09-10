<template>
  <div class="">
    <div class="map-size overflow-hidden" id="map"></div>
    <CDetails
      v-if='hash !== "" && hash !== undefined && photos !== [] && photos !== undefined' 
      :hash="hash"
      :photos="photos"
      :location="location"
    />
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
      location: 'map',
      photos: [],
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
    API.myImages({ page: 1 }, 'map').then((photos) => {
      this.photos = photos;
      let i, length = photos.length;
      let tempImage = [];
      for (i = 0; i < length; i++) tempImage.push(photos[i].hash);

      //
      API.imageGeoloc(tempImage, "GeoLocation").then((images) => {
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

          // Create image on world map
          const markerItem = this.markers[i];
          const markerIcon = document.createElement("img");
          markerIcon.style.width = "50px";
          markerIcon.style.height = "50px";
          markerIcon.style.borderRadius = "50%";
          markerIcon.style.backgroundSize = "cover";
          markerIcon.src = this.imagebyId(markerItem.image_id);
          markerIcon.style.cursor = "pointer";

          // add event listener to the image
          markerIcon.addEventListener("click", () => {
            this.detailsMap(markerItem.image_id);
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
    detailsMap(hash) {
      this.hash = hash;
      this.refreshComments();
      this.getImage(this.hash).then((image) => {
        this.image = image;
      });
      this.getTags(this.hash).then((tags) => {
        this.tags = tags;
        this.showDetails = true;
      });
    },
    detailsDataGrid() {
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
      API.imageGeoloc(this.hash, "BoundingBox").then((images) => {
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

