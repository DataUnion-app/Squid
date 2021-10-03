<template>
  <div class="">
    <vs-sidebar background="dark" textWhite v-model="active" open :key="force">
      <template #logo>
        <img v-on:click.stop="" class="mr-3" alt="Vue logo" src="@/assets/logo-avatar.svg" />
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

      <!-- FOOTER -->
      <template #footer>
        <button
          @click="showMetamaskPopup" 
          class="w-full flex flex-nowrap items-center"
        >
          <CMetamaskPopup
            class="metamask-relative"
            :display="displayMetamaskPopup"
            @closedMetamaskPopup="showMetamaskPopup"
          />

          <vs-avatar class="mr-3 comment-avatar">
            <img v-if="blockies" :src="blockies" alt="" />
            <img v-if="!blockies" src="@/assets/metamask.svg" alt="" />
          </vs-avatar>
          <div
            v-if="account"
            class="
              text-white-600
              font-bold
              text-sm
              overflow-ellipsis overflow-hidden
            "
          >
            {{ account }}
          </div>
          <div
            v-else-if="!account && connecting"
            class="
              text-white-600
              font-bold
              text-sm
              overflow-ellipsis overflow-hidden
            "
          >
            Connecting your wallet...
          </div>
          <div
            v-else
            class="
              text-white-600
              font-bold
              text-sm
              overflow-ellipsis overflow-hidden
            "
          >
            Connect Wallet
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

<style>
  .metamask-relative {
    top: 75%;
  }
</style>

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
    // blockies(newVal, oldVal) {
    //   console.log(`BLOCKIES CHANGED = ${newVal}`);
    //   console.log(typeof this.blockies);
    // },
    // account(newVal, oldVal) {
    //   console.log(`ACCOUNT CHANGED = ${newVal}`);
    // },
    // displayMetamaskPopup(newVal, oldVal) {
    //   console.log(`displayMetamaskPopup = ${newVal}`);
    // },
    active: function () {
      // ts
      // console.log(`[SIDEBAR] running active...`);
      // console.log(`this.active = ${this.active}`);
      
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
      connecting: false,
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
    // change to toggleMetamaskPopup
    updateBlockies() {
      this.blockies = Auth.blockies();
    },
    updateAccount(account) {
      this.account = account;
    },
    showMetamaskPopup() {
      if (this.displayMetamaskPopup) {
        this.updateDisplayMetamaskPopup(false);
      } else {
        this.updateDisplayMetamaskPopup(true);
      }
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
      this.account = Auth.getAccount();
    }

    for (let i = 0; i < 50; i++) this.openTooltip[i] = false;
    Observer.$on("login", ({ account }) => {
      // console.log(`[SIDEBAR] Login triggered`);
      this.connecting = false;
      this.updateBlockies();
      this.updateAccount(account);
    });

    Observer.$on("rejectedLogin", () => {
      this.connecting = false;
    });

    Observer.$on("tryingToConnect", () => {
      this.connecting = true;
    });

    // ts
    // console.log(`this.account = ${this.account}`);
    // console.log(`!this.account && this.connecting = ${!this.account && this.connecting}`);
  },
};
</script>