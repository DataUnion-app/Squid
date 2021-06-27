<template>
  <div>
    <div>Album: {{ $route.params.id }}</div>
    <div class="p-3 flex justify-left">
      <vs-input v-model="albumName" placeholder="" />
      <vs-button @click="changeName"> Change </vs-button>
    </div>
    <div>
      <div v-if="photos.length > 0" class="flex flex-wrap justify-center">
        <div
          v-for="(photo, index) in photos"
          :key="photo"
          class="w-1/4 relative"
        >
          <div style="width: 100%; padding-top: 100%">
            <CImage
              :hash="photo"
              class="w-full h-full absolute p-1"
              style="top: 0; left: 0"
            />
            <i
              @click="removeAlbums(index)"
              class="font-bold text-white absolute text-2xl bx bx-trash cursor-pointer"
              style="right: 15px; top: 15px"
            >
            </i>
          </div>
        </div>
      </div>
      <div v-else>There is no image your album</div>
    </div>
  </div>
</template>

<script>
import API from "@/utils/api";

export default {
  name: "Albums",
  components: {},
  computed: {},
  data() {
    return {
      photos: [],
      name: "",
      albumName: "",
    };
  },
  methods: {
    changeName() {
      API.changeAlbumName({ oldname: this.name, newname: this.albumName }).then(
        () => {
          document.location.reload();
        }
      );
    },
    removeAlbums(index) {
      API.removeAlbums({ name: this.name, index: index }).then((photos) => {
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
      API.getAlbums({ name: this.name }).then((photos) => {
        this.photos = photos;
      });
    },
  },
  updated() {
    this.name = this.$route.params.id;
    //this.albumName = this.name;
  },
  mounted() {
    this.name = this.$route.params.id;
    //this.albumName = this.name;
    API.getAlbums({ name: this.name }).then((photos) => {
      this.photos = photos;
    });
  },
};
</script>
