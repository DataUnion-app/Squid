<template>
  <div class="home">
    <CHeader title="Algorithms" :flag="'nopage'" />
    <div class="main-body">
      <h1 class="text-3xl p-3 not-margin">
        This feature is still under development
      </h1>
      <h4 class="text-2xl p-3 not-margin">
        Feature description:
      </h4>
      <img src="@/assets/Algorithms.png" />
      <p class="p-3 not-margin">This feature allows you to use the Data Sets that are selected from the data to apply machine learning algorithms to. These algorithms can either be for machine learning training of new models or inference to verify existing models. The algorithms have to be published on Ocean Protocol and vetted on our dataset - we do not want the data to leak.</p>
      <p class="p-3 not-margin">These compute jobs run via compute-to-data on our hardware. The configuration of the hardware as well as of the algorithms e.g. hyperparemeters or even hyperparameter optimizers (HyperOpt, AutoML etc.) can be selected.</p>
      <p class="p-3 not-margin">This configuration as well as the selection of images determine the price in QUICRA-0/datatokens that the job costs. The price is displayed here as well as its different components - data, hardware, and overhead costs.</p>
      <p class="p-3 not-margin">The results of the compute-to-data job can be downloaded after completion or published as a data asset to the marketplace.</p>
      <p class="p-3 not-margin">Currently we are setting up our own Ocean provider and environment to publish our dataset there as a compute-to-data asset. After this is done we will start listing our first algorithms here. The first tests on an AWS V100 environment were already successful (<a href="https://market.oceanprotocol.com/asset/did:op:3ef07Ed802ba04C403c320E907F2e78eC3927d3F" target="_blank"><b>dataset</b></a> and <a href="https://market.oceanprotocol.com/asset/did:op:848a595b5B7fA51808427B13513169665a97D45b" target="_blank"><b>algorithm</b></a>) - a big thanks to <a href="https://mpowered.io">mPowered</a> for the help!.</p>
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
