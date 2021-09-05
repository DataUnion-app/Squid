<template>
  <div class="header">
    <div v-if="flag === 'data'" class="flex w-2/5">
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
        <vs-select
          v-if="tags.length != 0"
          placeholder="Select a tag"
          v-model="tag"
          class="select-tag"
          filter
          multiple
          collapse-chips
        >
          <vs-option
            v-for="item in tags.slice(0, 100)"
            :key="item"
            :label="item"
            :value="item"
          >
            {{ item }}
          </vs-option>
        </vs-select>
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

    <div v-if="flag != 'data'" class="center con-pagination flex">
      <div v-if="flag != 'welcome'" class="center con-pagination flex">
        <vs-pagination only-arrows v-model="page" :length="this.totalPage" />
        <code class="pt-7">
          Page: <b>{{ page }}</b>
        </code>
      </div>
    </div>

    <div class="header-icon">
      <ul class="flex">
        <li class="header-icon-item">
          <a href="https://twitter.com/datauniona" target="_blank">
            <vs-avatar>
              <i class="bx bxl-twitter"></i>
            </vs-avatar>
          </a>
        </li>
        <li class="header-icon-item">
          <a href="https://t.me/dataunionapp" target="_blank">
            <vs-avatar>
              <i class="bx bxl-telegram"></i>
            </vs-avatar>
          </a>
        </li>
        <li class="header-icon-item">
          <a href="https://discord.com/invite/Jm9C3yD8Sd" target="_blank">
            <vs-avatar>
              <i class="bx bxl-discord"></i>
            </vs-avatar>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import API from "../utils/api";

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
    },
  },
  data() {
    return {
      tag: [],
      page: 1,
      select_all: false,
    };
  },
  computed: {
    ...mapState(["tags", "totalPage"])
  },
  methods: {
    ...mapActions(["setPage"]),
    editClicked(event) {
      this.$emit("onClickEdit");
    },
    async init() {
      const event = new Date();
      const date = event.toLocaleString(`en`);
      const splitDate = date.split(`, `)[0].split(`/`);
      const currentDate = [splitDate[1], splitDate[0], splitDate[2]].join(`-`);

      const start_date = "14-05-2021";
      const end_date = currentDate;

      const apiTags = await API.tags(start_date, end_date);
      this.$store.dispatch("setTags", apiTags);
    },
  },
  async mounted() {
    await this.init();

    if (
      this.$store.state.selectTag == "" ||
      this.$store.state.selectTag == undefined
    ) {
      if (this.$store.state.tags) this.tag = this.$store.state.tags[0];
      this.$store.dispatch("setSelectTag", this.tag || "dataunion");
    } else {
      this.tag = this.$store.state.selectTag;
    }
    this.$store.dispatch("selectAll", false);
  },
};
</script>