<template>
  <div class="">
    <vs-sidebar
      background="dark"
      textWhite
      v-model="active"
      open
      >
      <template #logo>
        <img class="mr-3" alt="Vue logo" src="@/assets/logo-avatar.svg">
        <div class="text-5xl font-extrabold text-purple-600">Squid</div>
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
        Gallery
      </vs-sidebar-item>
      <template #footer v-if="blockies">
        <div class="w-full flex flex-nowrap items-center">
          <vs-avatar class="mr-3" style="min-width: 44px;">
            <img :src="blockies" alt="">
          </vs-avatar>
          <div class="text-white-600 font-bold text-sm overflow-ellipsis overflow-hidden">{{account}}</div>
        </div>
      </template>
    </vs-sidebar>
  </div>
</template>

<script>
import Observer from '@/utils/observer';
import Auth from '@/utils/auth';
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
      active: 'Home',
      blockies: null,
      account: null
    };
  },
  computed: {
  },
  methods: {
  },
  mounted() {
    if (Auth.token()) {
      this.blockies = Auth.blockies();
      this.account = Auth.account;
    }
    Observer.$on('login', ({account}) => {
      this.blockies = Auth.blockies();
      this.account = account;
    })
  }
}
</script>