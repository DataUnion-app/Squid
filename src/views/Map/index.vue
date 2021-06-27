<template>
  <div>
    <div style="width: 100%; height: 800px" id="map"></div>
    <gmap-map
      v-if="false"
      :center="center"
      :zoom="3"
      style="width: 100%; height: 800px"
    >
      <gmap-custom-marker
        v-for="(m, index) in markers"
        :key="index"
        :marker="m"
        :title="m.label"
        @click.native="gotoMap(m)"
      >
        <img :src="images[index]" style="width: 30px; height: 30px" />
      </gmap-custom-marker>
    </gmap-map>
    <vs-dialog v-model="showDetails">
      <template #header>
        <h1 class="text-3xl not-margin">Details</h1>
      </template>

      <div class="flex">
        <div style="width: 50%; min-width: 400px">
          <div class="relative w-full">
            <div style="width: 100%; padding-top: 100%">
              <img
                @click="preview"
                :src="image"
                class="cursor-pointer w-full h-full absolute p-1 object-contain"
                style="top: 0; left: 0"
              />
            </div>
          </div>
          <div class="mt-3 flex flex-wrap">
            <div v-for="tag in tags" :key="tag.tag" class="flex">
              <div
                class="flex mr-1 items-center rounded-full py-1 px-2 m-1"
                :class="isUp(tag) ? 'bg-green-300' : 'bg-red-300'"
              >
                {{ tag.tag }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col"
          style="width: 50%; min-width: 400px; max-height: 80%"
        >
          <div class="relative w-full">
            <div style="width: 100%; padding-top: 100%">
              <div
                class="w-full h-full absolute p-1 object-contain pr-5"
                style="top: 0; left: 0"
              >
                <div v-if="comments.length > 0" class="h-full flex flex-col">
                  <div class="text-2xl text-center">Comments</div>
                  <div class="p-3 overflow-y-auto">
                    <div
                      v-for="(item, index) in comments"
                      :key="index"
                      class="flex items-center m-1"
                    >
                      <vs-avatar class="mr-3" style="min-width: 44px">
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
import utils from "@/utils";
import API from "@/utils/api";
import GmapCustomMarker from "vue2-gmap-custom-marker";

export default {
  name: "GoogleMap",
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      showDetails: false,
      tags: [],
      comment: "",
      comments: [],
      //image: null,
      center: { lat: 100.508, lng: -73.587 },
      markers: [],
      places: [],
      image: "",
      currentPlace: null,
      hash: "",
    };
  },

  mounted() {
    const key = "sAS3TYpCMClh1eeXYWHP";
    const map = new window.maplibregl.Map({
      container: "map", // container id
      style: `https://api.maptiler.com/maps/streets/style.json?key=${key}`, // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 3, // starting zoom
    });
    API.myWorld().then((markers) => {
      this.markers = markers;
      var marker;

      for (var i = 0; i < this.markers.length; i++) {
        const hash = this.markers[i].hash;
        const markerIcon = document.createElement("img");
        markerIcon.style.width = "50px";
        markerIcon.style.height = "50px";
        markerIcon.style.borderRadius = "50%";
        markerIcon.style.backgroundSize = "cover";
        markerIcon.src = this.$store.state.imageCache[hash];
        markerIcon.style.cursor = "pointer";

        markerIcon.addEventListener("click", () => this.details(hash));
        marker = new window.maplibregl.Marker(markerIcon)
          .setLngLat([this.markers[i].lat, this.markers[i].lng])
          .addTo(map);
      }
    });
  },
  methods: {
    ...mapActions(["getImage", "getTags"]),
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
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
    gotoMap(m) {
      this.center = m;
      this.hash = m.hash;
      this.refreshComments();
      this.details();
    },

    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
  },
};
</script>

