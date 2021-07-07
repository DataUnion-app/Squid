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
      <div v-if="datas.length > 0">
        <vs-sidebar-group>
          <template #header>
            <vs-sidebar-item arrow>
              <template #icon>
                <i class="bx bx-group"></i>
              </template>
              <div class="sidebar">
                Data Set
                <i
                  @click="createData"
                  class="bx bx-plus sidebar-item"
                ></i>
              </div>
            </vs-sidebar-item>
          </template>
          <vs-sidebar-item
            v-for="data in datas"
            :key="data.name"
            :id="data.name"
          >
            <template #icon>
              <i class="bx bx-data"></i>
            </template>
            {{ data.name }}
          </vs-sidebar-item>
        </vs-sidebar-group>
      </div>
      <div v-else>
        <vs-sidebar-item>
          <template #icon>
            <i class="bx bx-data"></i>
          </template>
          <div class="sidebar">
            Data Set
            <i
              @click="createData"
              class="bx bx-plus sidebar-item">
            </i>
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
          <vs-avatar class="mr-3 comment-avatar">
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
    <vs-dialog v-model="showdatas">
      <template #header>
        <h1 class="text-3xl not-margin">Create Data Set</h1>
      </template>

      <div class="flex">
        <div
          class="flex flex-col add-dialog"
        >
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
import { mapState } from "vuex";

import Observer from "@/utils/observer";
import Auth from "@/utils/auth";
import API from "@/utils/api";

export default {
  name: "Sidebar",
  created() {
    this.$root.$refs.Sidebar = this;
  },
  props: {},
  watch: {
    $route() {
        if(this.$route.name != "datas")
          this.active = this.$route.name;
    },
    active() {
      if (this.$route.name != this.active) {
        
      for (var i = 0; i < this.datas.length; i++) {
        if (this.active == this.datas[i].name) break;
      }

      if (i == this.datas.length) this.$router.push({ name: this.active });
      else {
        const param = this.active;
        this.$router
          .push({ name: "datas", params: { id: param } })
          .catch(() => {});
      }
      }
    },
  },
  data() {
    return {
      active: "Home",
      blockies: null,
      account: null,
      showdatas: false,
      dataName: "",
    };
  },
  computed: {
    ...mapState(["datas"]),
  },

  methods: {
    createData() {
      this.showdatas = true;
      if (this.dataName !== "") {
        API.createData({ name: this.dataName }).then(() => {
          this.refreshdatas();
          this.dataName = "";
          this.showdatas = false;
          this.openNotification("top-right", "success");
        });
      }
    },
    openNotification(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "data successfuly created",
      });
    },

    refreshdatas() {
      this.$store.dispatch("setdatas");
    },
  },
  mounted() {
    if (Auth.token()) {
      this.blockies = Auth.blockies();
      this.account = Auth.account;
    }

    //this.refreshdatas();

    Observer.$on("login", ({ account }) => {
      this.blockies = Auth.blockies();
      this.account = account;
    });
  },
};
</script>