<template>
  <div class="header">
    <div v-if="flag==1" class="header-child">
      <div class="flex">
        <div>
          <h1 class="text-4xl not-margin header-title">{{ title }} Data Set</h1>
        </div>
        <div class="header-edit-button">
          <vs-button danger icon @click="editClicked">
            <i class="bx bx-edit"></i>
          </vs-button>
        </div>
      </div>
    </div>
    <div v-else-if="flag==2" class="header-child flex">
      <h1 class="text-4xl not-margin header-title">
        {{ title }}
      </h1>
      <div class="select-body">
      <vs-select
        v-if="tags.length > 0"
        placeholder="Select a tag"
        v-model="tag"
      >
        <vs-option
          v-for="item in tags.slice(0, 20)"
          :key="item"
          :label="item"
          :value="item"
        >
          {{ item }}
        </vs-option>
      </vs-select>
      </div>
    </div>
    <div v-else class="header-child">
      <h1 class="text-4xl not-margin header-title">
        {{ title }}
      </h1>
    </div>
    <div class="header-icon">
      <ul class="flex">
        <li>
          <i class="bx bx-code-alt header-icon-item"></i>
        </li>
        <li>
          <i class="bx bxl-telegram header-icon-item"></i>
        </li>
        <li>
          <i class="bx bxl-discord header-icon-item"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CHeader",
  props: {
    title: String,
    flag: Number,
  },
  watch: {
    tag(newVal, oldVal) {
      if (newVal == "") {
        return;
      }
      this.$store.dispatch("setSelectTag", newVal);
    },
  },
  data() {
    return {
      tag: "",
    };
  },
    computed: {
    ...mapState(["tags"]),
  },
  methods: {
    editClicked(event) {
      this.$emit("onClickEdit");
    },
  },
  mounted() {
    if(this.$store.state.selectTag == "" || this.$store.state.selectTag == undefined) {
      this.tag = this.$store.state.tags[0];
      this.$store.dispatch("setSelectTag", this.tag);
    }
    else {
      this.tag = this.$store.state.selectTag;
    }
  },
};
</script>