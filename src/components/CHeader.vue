<template>
  <div class="header" >
    <div v-if="flag" class="header-child">
      <div class="flex">
        <div>
          <h1 class="text-4xl not-margin header-title">
            {{ title }} Data Set
          </h1>
        </div>
        <div class="header-edit-button">
          <i
            @click="editClicked()"
            class="
              font-bold
              text-black
              absolute
              text-2xl
              bx bx-edit
              cursor-pointer
            "
          ></i>
        </div>
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
export default {
  name: "CHeader",
  props: {
    title: String,
    flag: Boolean,
  },
  watch: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    editClicked(event) {
      this.$emit("edit_clicked");
    },
  },
};
</script>