<template>
  <div>
    <CHeader title="Welcome. Please login via Metamask." :flag="'nopage'" />
    <div class="main-body">
      <h4><b>What is Metamask?</b></h4>
          Metamask is a cryptocurrency wallet app. Through Metamask, you can generate a cryptocurrency wallet or connect an existing wallet. 
          Your Metamask wallet connects to DataUnion and acts as your anonymous account. In Squid we are using Metamask to identify the data that you uploaded to DataUnion and to facilitate paying and tracking service usage.
      <br />
      <br />
      <container :title="title">
        <youtube video-id="GNPz-Dv5BjM"
          @ready="ready"
          @ended="ended"
          @playing="playing"
          @paused="paused"
          @buffering="buffering"
          @qued="qued"
        ></youtube>
      </container>
      <br />
      <br />

      <h4><b>Troubleshooting</b></h4>
      <ol>
          <li><i>Check the Metamask icon in the top-right corner of your browser</i> (if there is one). Login and signature notifcations should appear here if Metamask is pinned to your extensions bar.</li>
          <br/>
          <li>Please double check that you have actually downloaded Metamask by visiting your browser's extensions.</li>
          <br/>
          <li>Please ensure you're using the correct browser. Remember that Metamask will only work on <b>Chrome, Brave, Firefox or Edge</b>. You may have downloaded Metamask on a different browser to the one you're using.</li>
          <br/>
          <li>
              <b>Please check your Metamask settings in your browser's extensions tab. If you only enable Metamask on certain sites, you need to manually enable it on this site.</b> 
          </li>
      </ol>
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from "vuex";
import API from "@/utils/api";

export default {
  name: 'Welcome',
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