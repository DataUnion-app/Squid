<template>
  <div class="">
    <vs-sidebar background="dark" textWhite v-model="active" open :key="force">
      <template #logo>
        <img class="mr-3" alt="Vue logo" src="@/assets/logo-avatar.svg" />
        <div class="text-5xl font-extrabold text-purple-600">Squid</div>
      </template>
      <vs-sidebar-item id="MyData">
        <template #icon>
          <i class="bx bx-home"></i>
        </template>
        My data
      </vs-sidebar-item>
      <vs-sidebar-item id="AllData">
        <template #icon>
          <i class="bx bx-grid-alt"></i>
        </template>
        Data
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
                  v-on:click.stop="createData"
                  class="bx bx-plus sidebar-item"
                ></i>
              </div>
            </vs-sidebar-item>
          </template>
          <vs-sidebar-item
            v-for="(data, index) in datas"
            :key="data.name"
            :id="data.name"
          >
            <template #icon>
              <i class="bx bx-data"></i>
            </template>
            <div class="sidebar">
              {{ data.name }}
               <i
                  v-on:click.stop="removeData(index)"
                  class="bx bx-trash sidebar-item"
                ></i>
              <!-- <vs-tooltip right shadow not-hover v-model="openTooltip[index]">
                <i
                  @click="openTooltip[index] = !openTooltip[index]"
                  class="bx bx-trash sidebar-item"
                >
                </i>
                <template #tooltip>
                  <div class="content-tooltip">
                    <h4 class="center">Confirm</h4>
                    <p>
                      Are you sure you want to delete this user, by doing so you cannot
                      recover the data
                    </p>
                    <footer class="flex">
                      <vs-button
                        v-on:click.stop="removeData(index)"
                        danger
                        block
                      >
                        Delete
                      </vs-button>
                      <vs-button
                        @click="openTooltip[index] = false"
                        transparent
                        dark
                        block
                      >
                        Cancel
                      </vs-button>
                    </footer>
                  </div>
                </template>
              </vs-tooltip> -->
            </div>
          </vs-sidebar-item>
        </vs-sidebar-group>
      </div>
      <div v-else>
        <vs-sidebar-item @click.native="createData">
          <template #icon>
            <i class="bx bx-data"></i>
          </template>
          <div class="sidebar">
            Data Set
            <i class="bx bx-plus sidebar-item"> </i>
          </div>
        </vs-sidebar-item>
      </div>
      <vs-sidebar-item id="Map">
        <template #icon>
          <i class="bx bx-world"></i>
        </template>
        World Map
      </vs-sidebar-item>
      <vs-sidebar-item id="Algorithm">
        <template #icon>
          <img src="@/assets/algorithm.svg" style="width:20px;" />
        </template>
        Algorithms
      </vs-sidebar-item>
      <vs-sidebar-item id="About">
        <template #icon>
          <img src="@/assets/about.png" style="width:20px;" />
        </template>
        About
      </vs-sidebar-item>

      <template #footer v-if="blockies">
        <CMetamaskPopup />
        <button
          @click="showMetamaskPopup" 
          class="w-full flex flex-nowrap items-center"
        >
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
        </button>
      </template>

    </vs-sidebar>
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
import { mapState, mapActions } from "vuex";

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
      if (this.$route.name !== "datas") this.active = this.$route.name;
    },
    displayMetamaskPopup(newVal, oldVal) {
      console.log(`displayMetamaskPopup = ${newVal}`);
    },
    active: function () {
      if (this.$route.name != this.active) {
        for (var i = 0; i < this.datas.length; i++) {
          if (this.active == this.datas[i].name) break;
        }
        if (i == this.datas.length) this.$router.push({ name: this.active }).catch(()=>{});
        else {
          const param = this.active;
          this.initClickImage();
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
      openTooltip: [],
      force: 0,
      displayMetamaskPopup: false,
    };
  },
  computed: {
    ...mapState(["datas"]),
  },
  methods: {
    ...mapActions(["initClickImage"]),
    showMetamaskPopup() {
      this.updateDisplayMetamaskPopup(true);
    },
    updateDisplayMetamaskPopup(newVal) {
      this.displayMetamaskPopup = newVal;
    },
    createData() {
      this.showdatas = true;
      if (this.dataName !== "") {
        API.createData({ name: this.dataName }).then((flag) => {
          if (flag) {
            this.refreshdatas();
            this.dataName = "";
            this.showdatas = false;
            this.openNotification("top-right", "success");
            this.force ++;
            // vm.$forceUpdate();
          } else {
            this.showdatas = true;
            this.openNotificationFailed("top-right", "danger");
          }
        });
      }
    },
    updateData() {
      this.refreshdatas();
      this.force ++;
    },
    removeData(index) {
      API.removeDataSet({ index: index }).then((flag) => {
        if (flag) {
          this.refreshdatas();
          this.dataName = "";
          this.showdatas = false;
          this.active = "Home";
          this.openNotificationRemoved("top-right", "success");
          this.openTooltip[index] = false;
          this.force --;
        }
      });
    },
    openNotification(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "Data Set successfuly created",
      });
    },
    openNotificationRemoved(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "Data Set successfuly removed",
      });
    },
    openNotificationFailed(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Failed",
        text: "Data Set name already exists",
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

    for (let i = 0; i < 50; i++) this.openTooltip[i] = false;
    Observer.$on("login", ({ account }) => {
      this.blockies = Auth.blockies();
      this.account = account;
    });
  },
};
</script>