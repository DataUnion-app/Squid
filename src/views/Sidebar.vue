<template>
  <div class="">
    <vs-sidebar background="dark" textWhite v-model="active" open>
      <template #logo>
        <img class="mr-3" alt="Vue logo" src="@/assets/logo-avatar.svg" />
        <div class="text-5xl font-extrabold text-purple-600">Squid</div>
      </template>
      <vs-sidebar-item id="Home">
        <template #icon>
          <i class="bx bx-home"></i>
        </template>
        Home
      </vs-sidebar-item>
      <vs-sidebar-item id="Gallery">
        <template #icon>
          <i class="bx bx-grid-alt"></i>
        </template>
        Gallery
      </vs-sidebar-item>
      <div v-if="albums.length > 0">
        <vs-sidebar-group>
          <template #header>
            <vs-sidebar-item arrow>
              <template #icon>
                <i class="bx bx-group"></i>
              </template>
              <div style="width: 180px">
                Albums
                <i
                  @click="createAlbum"
                  class="bx bx-plus"
                  style="float: right"
                ></i>
              </div>
            </vs-sidebar-item>
          </template>
          <vs-sidebar-item
            v-for="album in albums"
            :key="album.name"
            :id="album.name"
          >
            <template #icon>
              <i class="bx bx-album"></i>
            </template>
            {{ album.name }}
          </vs-sidebar-item>
        </vs-sidebar-group>
      </div>
      <div v-else>
        <vs-sidebar-item>
          <template #icon>
            <i class="bx bx-album"></i>
          </template>
          <div style="width: 180px">
                Albums
                <i
                  @click="createAlbum"
                  class="bx bx-plus"
                  style="float: right"
                ></i>
              </div>
        </vs-sidebar-item>
      </div>
      <vs-sidebar-item id="Map">
        <template #icon>
          <i class="bx bx-world"></i>
        </template>
        World Map
      </vs-sidebar-item>
      <template #footer v-if="blockies">
        <div class="w-full flex flex-nowrap items-center">
          <vs-avatar class="mr-3" style="min-width: 44px">
            <img :src="blockies" alt="" />
          </vs-avatar>
          <div
            class="
              text-white-600
              font-bold
              text-sm
              overflow-ellipsis overflow-hidden
            "
          >
            {{ account }}
          </div>
        </div>
      </template>
    </vs-sidebar>
    <vs-dialog v-model="showAlbums">
      <template #header>
        <h1 class="text-3xl not-margin">Create Album</h1>
      </template>

      <div class="flex">
        <div
          class="flex flex-col"
          style="width: 50%; min-width: 400px; max-height: 80%"
        >
          <div class="p-3 flex justify-center">
            <vs-input v-model="albumName" placeholder="Input your album name" />
            <vs-button @click="createAlbum"> Create </vs-button>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </vs-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import Observer from "@/utils/observer";
import Auth from "@/utils/auth";
import API from "@/utils/api";

export default {
  name: "Sidebar",
  props: {},
  watch: {
    $route() {
      this.active = this.$route.name;
    },
    active() {
      if (this.$route.name == this.active) {
        return;
      }
      for (var i = 0; i < this.albums.length; i++) {
        if (this.active == this.albums[i].name) break;
      }

      if (i == this.albums.length) this.$router.push({ name: this.active });
      else {
        const param = this.active;
        this.$router
          .push({ name: "Albums", params: { id: param } })
          .catch(() => {});
      }
    },
  },
  data() {
    return {
      active: "Home",
      blockies: null,
      account: null,
      showAlbums: false,
      albumName: "",
      albums: [],
    };
  },
  computed: {},
  
  methods: {
    createAlbum() {
      this.showAlbums = true;
      if (this.albumName !== "") {
        API.createAlbum({ name: this.albumName }).then(() => {
          this.refreshAlbums();
          this.albumName = "";
          this.showAlbums = false;
          this.openNotification("top-right", "success");
        });
      }
    },
    openNotification(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "Album successfuly created",
      });
    },

    refreshAlbums() {
      API.albums().then((albums) => {
        this.albums = albums;
      });
    },
  },
  mounted() {
    if (Auth.token()) {
      this.blockies = Auth.blockies();
      console.log(this.blockies);
      this.account = Auth.account;
    }

    this.refreshAlbums();

    Observer.$on("login", ({ account }) => {
      this.blockies = Auth.blockies();
      this.account = account;
    });
  },
};
</script>