<template>
  <div class="">
    <img v-if="image" class="w-full h-full cursor-pointer" :src="image" @click="details" />
    <div v-show="!image" ref="loader" class="relative w-full h-full"></div>

    <vs-dialog v-model="showDetails">
      <template #header>
        <h4 class="not-margin">
          Details
        </h4>
      </template>
      
      <div class="flex">
        <img :src="image" style="width: 300px; height: 300px;"/>
        <div class="m-3">
          <div v-for="tag in tags" :key="tag.tag" class="flex">
            <div class="flex mr-1 items-center">{{tag.tag}}</div>
            <div>
              <div style="height: 16px;">
                <i :class="isUp(tag) ? 'text-green-300 bxs-up-arrow' : ''" class='text-xl bx bx-up-arrow'></i>
              </div>
              <div>
                <i :class="!isUp(tag) ? 'text-red-300 bxs-down-arrow' : ''" class='text-xl bx bx-down-arrow'></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
      </template>
    </vs-dialog>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'CImage',
  props: {
    hash: String
  },
  watch: {
  },
  data() {
    return {
      image: null,
      showDetails: false,
      tags: []
    };
  },
  computed: {
  },
  methods: {
    ...mapActions(['getImage', 'getTags']),
    details() {
      this.getTags(this.hash).then(tags => {
        console.log(tags);
        this.tags = tags;
        this.showDetails = true;
      })
    },
    isUp(tag) {
      const down = tag.down_votes || tag.down_Votes;
      return tag.up_votes > down;
    }
  },
  mounted() {
    this.$vs.loading({
      target: this.$refs['loader'],
      text: '',
      type: 'circles'
    })

    this.getImage(this.hash).then((image) => {
      this.image = image;
    });
  }
}
</script>