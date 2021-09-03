<template>
  <div class="header">
    <div v-if="flag == 1" class="flex w-2/5">
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
    <div v-else-if="flag == 2" class="flex w-2/5">
      <h1 class="text-4xl not-margin header-title">
        {{ title }}
      </h1>
      <p>
        {{ description }}
      </p>
      <div v-if="tags != undefined" class="select-body">
        <multiselect v-model="tag" :options="tags" multiple> </multiselect>
      </div>
      <div class="pl-5 flex items-center">
        Select All: <vs-checkbox v-model="select_all" class="pl-2" />
      </div>
    </div>
    <div v-else class="w-2/5 flex">
      <h1 class="text-4xl not-margin header-title">
        {{ title }}
      </h1>
    </div>

    <div v-if="flag != 1" class="center con-pagination flex">
      <vs-pagination only-arrows v-model="page" :length="this.totalPage" />
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
import Multiselect from "vue-multiselect";

export default {
  name: "CHeader",
  components: {
    Multiselect,
  },
  props: {
    title: String,
    description: String,
    flag: Number,
  },
  watch: {
    tag(newVal) {
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
    },
  },
  data() {
    return {
      tag: [],
      tagIndex: 0,
      page: 1,
      select_all: false,
    };
  },
  computed: {
    ...mapState(["tags", "totalPage"]),
  },
  methods: {
    ...mapActions(["setPage"]),
    editClicked(event) {
      this.$emit("onClickEdit");
    },
  },
  async mounted() {
    await this.$store.dispatch("setTags");

    if (!this.$store.state.selectTag) {
      this.tag = "dataunion";
      this.$store.dispatch("setSelectTag", this.tag);
    } else {
      this.tag = this.$store.state.selectTag;
    }
    this.$store.dispatch("selectAll", false);
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>