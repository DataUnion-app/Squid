<template>
  <div>
    LOADING
    <div class="smt-spinner"></div>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: 'Loading',
  props: {
  },
  watch: {
    page(newVal, oldVal) {
    },
  },
  data() {
    return {
    };
  },
  components: {
  },
  computed: {
    ...mapState(["page"]),
  },
  methods: {
  },
  mounted() {
    console.log(`RENDERING LOADING...`)
  }
}
</script>