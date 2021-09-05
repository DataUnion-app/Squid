<template>
  <div class="home">
    <CHeader title="Algorithms" :flag="'nopage'" />
    <div class="main-body">
      <h1 class="text-3xl p-3 not-margin">
        This feature is still under development - here is a description of what is created here and how it works
      </h1>
      <p>We are making it possible to use the Data Sets that are selected from the data to apply machine learning algorithms to. These algorithms can either be for machine learning training or for inference models for verification. The algorithms have to be published on Ocean Protocol and vetted on our dataset - we do not want the data to leak.</p>
      <p>They will run via compute-to-data on our hardware. It will be possible to select the configuration of the hardware as well as the configuration of the algorithms e.g. hyperparemeters or even hyperparameter optimizers (HyperOpt, AutoML etc.).</p>
      <p>This configuration as well as the selection of images will determine the price in QUICRA-0/datatokens that the job will cost. The price will be displayed here.</p>
      <p>The results of the compute-to-data job can be downloaded after completion or published as a data asset to the marketplace.</p>
      <p>Currently we are setting up our own Ocean provider and environment to publish our dataset there as a compute-to-data asset. After this is done we will start listing our first algorithms here. The first tests on a V100 environment were already successful (<a href="https://market.oceanprotocol.com/asset/did:op:3ef07Ed802ba04C403c320E907F2e78eC3927d3F" target="_blank">dataset</a> and <a href="https://market.oceanprotocol.com/asset/did:op:848a595b5B7fA51808427B13513169665a97D45b" target="_blank">algorithm</a>).
    </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: "Algorithm",
  components: {},
  computed: {},
  methods: {},
  data() {
    return {};
  },
  watch: {},
  mounted() {},
};
</script>
