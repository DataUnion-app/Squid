<template>
  <div class="header">
    <div v-if="this.$store.state.tags.length === 0" class="center">
      <CLoader message="Loading tags..." />
    </div>

    <div v-if="flag == 1 && this.$store.state.tags.length > 0" class="flex w-2/5">
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

    <div v-else-if="flag == 2 && this.$store.state.tagData.length > 0 && this.$store.state.tags.length > 0" class="flex w-2/5">
      
      <div class="header-title-div">
        <h5 class="text-4xl not-margin header-title">
          {{ title }}
        </h5>
        <p class="header-description">
          {{ description }}
        </p>
      </div>

      <div class="select-body">
        <vs-select
          v-if="this.$store.state.tagData.length > 0"
          placeholder="Select a tag"
          v-model="tag"
          class="select-tag"
          filter
          multiple
          collapse-chips
        >
          <vs-option
            v-for="item in this.$store.state.tags.slice(0, 30)"
            :key="item"
            :label="item"
            :value="item"
          >
            {{ item }}
          </vs-option>
        </vs-select>
      </div>

      <div class="pl-5 flex items-center">
        Select All: <vs-checkbox v-model="select_all" class="pl-2"/>
      </div>
    </div>

    <div v-else class="w-2/5 flex">
      <h1 class="text-4xl not-margin header-title-div">
        <h5 class="text-4xl not-margin header-title">
          {{ title }}
        </h5>
        <p class="header-description">
          {{ description }}
        </p>
      </h1>
    </div>

    <div v-if="flag != 1" class="center con-pagination flex">
      <vs-pagination only-arrows v-model="page" :length="20" />
      <code class="pt-7">
        Page: <b>{{ page }}</b>
      </code>
    </div>

    <div class="header-icon">
      <ul class="flex">
        <li class="header-icon-item">
          <vs-avatar>
            <i class="bx bx-code-alt"></i>
          </vs-avatar>
        </li>
        <li class="header-icon-item">
          <vs-avatar>
            <i class="bx bxl-telegram"></i>
          </vs-avatar>
        </li>
        <li class="header-icon-item">
          <vs-avatar>
            <i class="bx bxl-discord"></i>
          </vs-avatar>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CHeader",
  props: {
    title: String,
    description: String,
    flag: Number,
  },
  watch: {
    tag(newVal, oldVal) {
      if (newVal == "") {
        return;
      }
      this.page = 1;
      this.$store.dispatch("setSelectTag", newVal);
    },
    page(newVal, oldVal) {
      this.$store.dispatch("setPage", newVal);
      this.$store.dispatch("selectAll", false);
      this.select_all = false;
    },
    select_all(newVal, oldVal) {
      this.$store.dispatch("selectAll", newVal);
    }
  },
  data() {
    return {
      tag: [],
      page: 1,
      select_all: false,
    };
  },
  computed: {
    ...mapState(["tags"]),
  },
  methods: {
    ...mapActions(["setPage"]),
    editClicked(event) {
      this.$emit("onClickEdit");
    },
  },
  mounted() {
    console.log(`mounted`);
    console.log(`tags != undefined && tags.length > 0 = ${this.$store.state.tags != undefined && this.$store.state.tags.length > 0}`);
    
    console.log(this.$store.state.tags)
    console.log(this.$store.state.tagData)
    console.log(this.$store.state.tagData[this.$store.state.tags[0]])
    
    if (this.$store.state.selectTag == "" || this.$store.state.selectTag == undefined) {
      if (this.$store.state.tags) {
        this.tag = this.$store.state.tags[0]; 
      }
    } 
    else {
      this.tag = this.$store.state.selectTag;
    }
    this.$store.dispatch("setSelectTag", this.tag);
    this.$store.dispatch("selectAll", false);
  },
};
</script>