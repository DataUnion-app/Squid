<template>
  <div
    style="
      height: 50px;
      width: 110%;
      margin-left: -45px;
      margin-top: -20px;
      background-color: RGB(238, 242, 245);
      display: flex;
      position: relative;
    "
  >
    <div v-if="flag" style="width: 60%">
      <div style="display: flex">
        <div>
          <h1
            class="text-3xl not-margin"
            style="padding: 10px; margin-left: 100px"
          >
            Data: {{ title }}
          </h1>
        </div>
        <div style="margin-left: 20px; margin-top: 10px">
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
    <div v-else style="width: 60%">
      <h1 class="text-3xl not-margin" style="padding: 10px; margin-left: 100px">
        {{ title }}
      </h1>
    </div>
    <div style="padding: 15px; width: 40%">
      <ul style="display: flex">
        <li>
          <i style="margin-left: 20px" class="bx bx-code-alt"></i>
        </li>
        <li>
          <i style="margin-left: 20px" class="bx bxl-telegram"></i>
        </li>
        <li>
          <i style="margin-left: 20px" class="bx bxl-discord"></i>
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