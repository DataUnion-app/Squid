<template>
  <div class="home">
    <CHeader title="About" :flag="'nopage'"/>
    <div class="main-body">
      <h1 class="text-3xl p-3 not-margin">
        Need help? Check out this walkthrough of the Data Portal
        <br />
        <br />

        <youtube video-id="g2ywRpntfzE"
          @ready="ready"
          @ended="ended"
          @playing="playing"
          @paused="paused"
          @buffering="buffering"
          @qued="qued"
        ></youtube>
      </h1>
    </div>
  </div>
</template>

<style>
</style>

<script>

import { mapState, mapActions } from "vuex";
import API from "@/utils/api";

export default {
  name: 'Algorithm',
  props: {
  },
  watch: {
    page(newVal, oldVal) {
      API.myImages({ page: newVal }).then((photos) => {
        this.photos = photos;
        if (this.photos.length === 0) {
          this.$store.commit("setTotalPage", this.page);
        } else {
          this.$store.commit("setTotalPage", this.page + 1);
        }
      });
    },
  },
  data() {
    return {
    };
  },
  components: {
  },
  computed: {
    ...mapState(["page", "totalPage"]),
  },
  methods: {
    log (message) {
      this.$log(`${new Date().toLocaleTimeString()} -- ${message}`)
    },
    ready () { this.log('ready') },
    ended () { this.log('ended') },
    playing () { this.log('playing') },
    paused () { this.log('paused') },
    buffering () { this.log('buffering') },
    qued () { this.log('qued') }    
  },
  mounted() {
  }
}
</script>
