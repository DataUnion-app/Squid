<template>
  <div class="">
    <vs-sidebar
      absolute
      v-model="active"
      open
      >
      <template #logo>
        <img alt="Vue logo" src="@/assets/logo-avatar.svg">
      </template>
      <vs-sidebar-item id="Home">
        <template #icon>
          <i class='bx bx-home'></i>
        </template>
        Home
      </vs-sidebar-item>
      <vs-sidebar-item id="Gallery">
        <template #icon>
          <i class='bx bx-grid-alt'></i>
        </template>
        My Images
      </vs-sidebar-item>
      <template #footer>
        <vs-row justify="space-between">
          <vs-avatar>
            <img src="/avatars/avatar-5.png" alt="">
          </vs-avatar>

          <vs-avatar badge-color="danger" badge-position="top-right">
            <i class='bx bx-bell' ></i>

            <template #badge>
              28
            </template>
          </vs-avatar>
        </vs-row>
      </template>
    </vs-sidebar>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
  },
  watch: {
    '$route'() {
      this.active = this.$route.name;
    },
    active() {
      if (this.$route.name == this.active) {
        return;
      }
      this.$router.push({name: this.active});
    }
  },
  data() {
    return {
      active: 'Home'
    };
  },
  computed: {
  },
  methods: {
  }
}
</script>