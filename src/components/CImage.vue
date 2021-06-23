<template>
  <div class="">
    <div class="w-full h-full cursor-pointer relative">
      <!-- <i 
        class='font-bold text-white absolute text-2xl bx bx-zoom-in'
        style="right: 10px; top: 10px;"
      >
      </i> -->
      <i 
        class='font-bold text-white absolute text-2xl bx bx-heart'
        style="left: 10px; top: 10px;"
      >
      </i>
      <img v-if="image" class="object-cover w-full h-full" :src="image" @click="details" />
      <div v-show="!image" ref="loader" class="relative w-full h-full"></div>
    </div>

    <vs-dialog v-model="showDetails">
      <template #header>
        <h1 class="text-3xl not-margin">
          Details
        </h1>
      </template>
      
      <div class="flex">
        <div style="width: 50%; min-width: 400px;">
          <div class="relative w-full">
            <div style="width: 100%; padding-top: 100%;">
              <img @click="preview" :src="image" class="cursor-pointer w-full h-full absolute p-1 object-contain" style="top: 0; left: 0;"/>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap">
            <div v-for="tag in tags" :key="tag.tag" class="flex">
              <div 
                class="flex mr-1 items-center rounded-full py-1 px-2 m-1"
                :class="isUp(tag) ? 'bg-green-300' : 'bg-red-300'"
              >
                {{tag.tag}}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col" style="width: 50%;  min-width: 400px; max-height: 80%;">
          <div class="relative w-full">
            <div style="width: 100%; padding-top: 100%;">
              <div class="w-full h-full absolute p-1 object-contain pr-5" style="top: 0; left: 0;">
                <div v-if="comments.length > 0" class="h-full flex flex-col">
                  <div class="text-2xl text-center">Comments</div>
                  <div class="p-3 overflow-y-auto">
                    <div v-for="(item, index) in comments" 
                      :key="index"
                      class="flex items-center m-1"
                    >
                      <vs-avatar class="mr-3" style="min-width: 44px;">
                        <img :src="avatar(item.from)" alt="">
                      </vs-avatar>
                      <div>{{item.comment}}</div>
                    </div>
                  </div>
                </div>
                <div class="text-xl p-5" v-else>
                  There is no comment yet.
                </div>
              </div>
            </div>
          </div>
          <div class="p-3 flex justify-center">
            <vs-input v-model="comment" placeholder="Input your feedback" />
            <vs-button
              @click="postComment"
            >
              Comment
            </vs-button>
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
import utils from '@/utils';
import API from '@/utils/api';

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
      tags: [],
      comment: '',
      comments: []
    };
  },
  computed: {
  },
  methods: {
    ...mapActions(['getImage', 'getTags']),
    avatar(id) {
      return utils.blockies(id);
    },
    details() {
      this.getTags(this.hash).then(tags => {
        this.tags = tags;
        this.showDetails = true;
      })
    },
    isUp(tag) {
      const down = tag.down_votes || tag.down_Votes;
      return tag.up_votes > down;
    },
    postComment() {
      API.addComment({id: this.hash, comment: this.comment}).then(() => {
        this.refreshComments();
        this.comment = '';
      })
    },
    refreshComments() {
      API.comments(this.hash).then(comments => {
        this.comments = comments;
      });
    },
    preview() {
      this.$viewerApi({
        images: [this.image],
      })
    }
  },
  mounted() {
    this.$vs.loading({
      target: this.$refs['loader'],
      text: '',
      type: 'circles'
    })

    this.refreshComments();

    this.getImage(this.hash).then((image) => {
      this.image = image;
    });
  }
}
</script>