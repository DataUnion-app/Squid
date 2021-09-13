<template>
  <div class="smt-spinner"></div>
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
  }
}
</script>