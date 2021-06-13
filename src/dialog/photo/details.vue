<template>
  <div class="p-tab p-tab-photo-details">
    <v-container fluid>
      <v-form ref="form" lazy-validation
              dense class="p-form-photo-details-meta" accept-charset="UTF-8"
              @submit.prevent="save">
        <v-layout row wrap align-top fill-height>
          <v-flex
              class="p-photo pa-2"
              xs12 sm4 md2
          >
            <v-card tile
                    class="ma-1 elevation-0"
                    :title="model.Title">
              <v-img v-touch="{left, right}"
                     :src="model.thumbnailUrl('tile_500')"
                     aspect-ratio="1"
                     class="accent lighten-2 elevation-0 clickable"
                     @click.exact="openPhoto()"
              >
              </v-img>

            </v-card>
          </v-flex>
          <v-flex xs12 sm8 md10 fill-height>
            <v-layout row wrap>
              <v-flex xs12 class="pa-2">
                <v-text-field
                    v-model="model.Title"
                    :append-icon="model.TitleSrc === 'manual' ? 'check' : ''"
                    :disabled="disabled"
                    :rules="[textRule]"
                    hide-details
                    :label="$gettext('Tags')"
                    placeholder=""
                    color="secondary-dark"
                    browser-autocomplete="off"
                    class="input-title"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 class="pa-2">
                <v-textarea
                    v-model="model.Description"
                    :append-icon="model.DescriptionSrc === 'manual' ? 'check' : ''"
                    :disabled="disabled"
                    hide-details
                    browser-autocomplete="off"
                    auto-grow
                    :label="$gettext('Description')"
                    placeholder=""
                    :rows="1"
                    color="secondary-dark"
                    class="input-description"
                ></v-textarea>
              </v-flex>

              
              <v-flex v-if="!disabled" xs12 :text-xs-right="!rtl" :text-xs-left="rtl" class="pt-3">
                <v-btn depressed color="secondary-light" class="action-close"
                       @click.stop="close">
                  <translate>Close</translate>
                </v-btn>
                <v-btn color="primary-button" depressed dark class="action-apply action-approve"
                       @click.stop="save(false)">
                  <span v-if="$config.feature('review') && model.Quality < 3"><translate>Apply</translate></span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <div class="mt-5"></div>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import countries from "options/countries.json";
import Thumb from "model/thumb";
import * as options from "options/options";

export default {
  name: 'PTabPhotoDetails',
  props: {
    model: Object,
    uid: String,
  },
  data() {
    return {
      disabled: !this.$config.feature("edit"),
      config: this.$config.values,
      all: {
        colors: [{label: this.$gettext("Unknown"), name: ""}],
      },
      readonly: this.$config.get("readonly"),
      options: options,
      countries: countries,
      showDatePicker: false,
      showTimePicker: false,
      invalidDate: false,
      utcTime: "",
      localTime: "",
      textRule: v => v.length <= this.$config.get('clip') || this.$gettext("Text too long"),
      rtl: this.$rtl,
    };
  },
  computed: {
    cameraOptions() {
      return this.config.cameras;
    },
    lensOptions() {
      return this.config.lenses;
    },
  },
  watch: {
    model() {
      this.updateTime();
    },
    uid() {
      this.updateTime();
    },
  },
  created() {
    this.updateTime();
  },
  methods: {
    updateTime() {
      if (!this.model.hasId()) {
        return;
      }

      let localDate = this.model.localDate(this.localTime);

      this.invalidDate = !localDate.isValid;

      if (this.invalidDate) {
        return;
      }

      const utcDate = localDate.toUTC();

      this.localTime = localDate.toFormat("HH:mm:ss");
      this.utcTime = utcDate.toFormat("HH:mm:ss");

      if (this.model.Day === 0) {
        this.model.Day = parseInt(localDate.toFormat("d"));
      }

      if (this.model.Month === 0) {
        this.model.Month = parseInt(localDate.toFormat("L"));
      }

      if (this.model.Year === 0) {
        this.model.Year = parseInt(localDate.toFormat("y"));
      }

      this.model.TakenAtLocal = localDate.toISO({
        suppressMilliseconds: true,
        includeOffset: false,
      }) + "Z";

      this.model.TakenAt = localDate.toUTC().toISO({
        suppressMilliseconds: true,
        includeOffset: false,
      }) + "Z";
    },
    left() {
      this.$emit('next');
    },
    right() {
      this.$emit('prev');
    },
    openPhoto() {
      this.$viewer.show(Thumb.fromFiles([this.model]), 0);
    },
    save(close) {
      if (this.invalidDate) {
        this.$notify.error(this.$gettext("Invalid date"));
        return;
      }

      this.model.update().then(() => {
        if (close) {
          this.$emit('close');
        }

        this.updateTime();
      });
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
