<template>
  <div class="">
    <div class="map-size overflow-hidden" id="map"></div>
    <CDetails
      v-if='hash !== "" && hash !== undefined && photos !== [] && photos !== undefined' 
      :hash="hash"
      :photos="photos"
      :showDetails="showDetails"
      :location="location"
      @closedPopup="closedPopup"
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

      // showDetails 
      // needs to change to True inside CDetails to activate the popup. (Parent -> Child communication)
      // needs to change back to False inside CDetails when popup is closed. (Child -> Parent communication)

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
  watch: {
    // ts
    // hash: function (newVal, oldVal) {
    //   console.log(`=== [WELCOME index.vue] hash changed ! ===`);
    //   console.log(`[WELCOME index.vue] hash newVal = ${newVal}`);
    // }
  },
  mounted() {
    // Maps ALL the thumbnails to the icons on the map.
    // console.log(this.photos);
    if (this.photos.length == 0) {
      this.getMyPhotos().then(photos => {
        // console.log(photos);
        this.photos = photos;
        let i, length = photos.length;
        let tempImage = [];
        for (i = 0; i < length; i++) tempImage.push(photos[i].hash);

        API.imageGeoloc(tempImage, "GeoLocation").then(images => {
          this.markers = images;
          let marker;

          for (let i = 0; i < this.markers.length; i++) {
            if (this.markers[i].image_id == this.hash) {
              // map.flyTo({
              //   center: [
              //     this.markers[i].value.longitude,
              //     this.markers[i].value.latitude,
              //   ],
              // });
            } else {
              // map.flyTo({
              //   center: [
              //     this.markers[0].value.longitude,
              //     this.markers[0].value.latitude,
              //   ],
              // });
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
              // ts 
              // console.log(`=== [WELCOME index.vue] CLICKED! ===\nimage_id = ${markerItem.image_id}`);
              
              let newHash = markerItem.image_id;
              this.updateHash(newHash);
              this.updateShowDetails(true);
              this.detailsMap();
              
              // map.flyTo({
              //   center: [markerItem.value.longitude, markerItem.value.latitude],
              // });
            });

            marker = new window.maplibregl.Marker(markerIcon)
              .setLngLat([
                this.markers[i].value.longitude,
                this.markers[i].value.latitude,
              ])
              .addTo(map);
          }
        });
      }).catch(err => {
        console.log(err);
      });
    }

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
    ...mapActions(["getImage", "getTags", "getMyPhotos"]),
    closedPopup() {
      // ts
      // console.log(`[WELCOME index.vue] closedPopup() called`);
      this.updateShowDetails(false);
    },
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
    detailsMap() {
      this.refreshComments();
      this.getImage(this.hash).then((image) => {
        this.image = image;
      });
      this.getTags(this.hash).then((tags) => {
        this.tags = tags;
        this.updateShowDetails(true);
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
    updateShowDetails(newShowDetails) {
      this.showDetails = newShowDetails;
    },
    updateHash(newHash) {
      // console.log(`calling updateHash`);
      // console.log(newHash);
      this.hash = newHash;
    }
  },

  updated() {
    if (this.$refs.tooltip) {
      this.$refs.tooltip.removeTooltip = () => {};
    }
  },
};
</script>

