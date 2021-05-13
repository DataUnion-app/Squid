<template>
  <div class="p-page p-page-login">
    <v-toolbar flat color="secondary" dense class="mb-3" :height="42">
      <v-toolbar-title class="subheading">
        {{ siteDescription }}
      </v-toolbar-title>
    </v-toolbar>
    <v-form ref="form" dense autocomplete="off" class="p-form-login" accept-charset="UTF-8" @submit.prevent="login">
      <v-card flat tile class="ma-2 application">
        <v-card-actions>
          <v-layout wrap align-top>
            <v-flex xs12 class="px-2 py-3">
              <v-btn color="primary-button"
                     class="white--text ml-0 action-confirm"
                     depressed
                     @click.stop="login">
                <translate>Sign in</translate>
                <v-icon :right="!rtl" :left="rtl" dark>login</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-form>

    <p-about-footer></p-about-footer>
  </div>
</template>

<script>
import Auth from 'common/auth';
export default {
  name: 'Login',
  data() {
    const c = this.$config.values;

    return {
      loading: false,
      showPassword: false,
      username: "admin",
      password: "",
      siteDescription: c.siteDescription ? c.siteDescription : c.siteCaption,
      nextUrl: this.$route.params.nextUrl ? this.$route.params.nextUrl : "/",
      rtl: this.$rtl,
    };
  },
  methods: {
    login() {
      Auth.login();
    },
  },
  mounted() {
    console.log(process.env);
  }
};
</script>
