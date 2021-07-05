<template>
  <div class="">
    <div class="w-full h-full cursor-pointer relative">
      <!-- <i 
        class='font-bold text-white absolute text-2xl bx bx-zoom-in'
        style="right: 10px; top: 10px;"
      >
      </i> -->
      <!-- <i
        @click="showdataDialog"
        class="font-bold text-white absolute text-2xl bx bx-heart"
        style="left: 10px; top: 10px"
      >
      </i>
      <img
        v-if="image"
        class="object-cover w-full h-full"
        :src="image"
        @click="details"
      /> -->
      <vs-card>
        <template #img>
          <img
            v-if="image"
            style="width:100%; height:300px"
            :src="image"
            @click="details"
            alt=""
          />
        </template>
        <template #interactions>
          <vs-button v-if="!flag" danger icon>
            <i class="bx bx-heart" @click="showdataDialog"></i>
          </vs-button>
          <vs-button v-else danger icon>
            <i class="bx bx-trash" @click="removeIconClicked"></i>
          </vs-button>
        </template>
      </vs-card>
      <div v-show="!image" ref="loader" class="relative w-full h-full"></div>
    </div>

    <vs-dialog v-model="showDetails">
      <template #header>
        <h1 class="text-3xl not-margin">Details</h1>
      </template>

      <div class="flex">
        <div style="width: 50%; min-width: 400px">
          <div class="relative w-full">
            <div style="width: 100%">
              <vs-card>
                <template #img>
                  <img
                    v-if="image"
                    style="width:100%; height:350px"
                    :src="image"
                    @click="preview"
                    alt=""
                  />
                </template>
                <template #interactions>
                  <vs-button v-if="!flag" danger icon>
                    <i class="bx bx-heart" @click="showdataDialog"></i>
                  </vs-button>
                  <vs-button v-else danger icon>
                    <i class="bx bx-trash" @click="removeIconClicked"></i>
                  </vs-button>
                </template>
              </vs-card>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap">
            <div v-for="tag in tags" :key="tag.tag" class="flex">
              <div
                class="flex mr-1 items-center rounded-full py-1 px-2 m-1"
                :class="isUp(tag) ? 'bg-green-300' : 'bg-red-300'"
              >
                {{ tag.tag }} ? up : {{tag.up_votes}}, down : {{tag.down_votes}} 
              </div>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col"
          style="width: 50%; min-width: 400px; max-height: 80%"
        >
          <div class="relative w-full">
            <div style="width: 100%; padding-top: 100%">
              <div
                class="w-full h-full absolute p-1 object-contain pr-5"
                style="top: 0; left: 0"
              >
                <div v-if="comments.length > 0" class="h-full flex flex-col">
                  <div class="text-2xl text-center">Comments</div>
                  <div class="p-3 overflow-y-auto">
                    <div
                      v-for="(item, index) in comments"
                      :key="index"
                      class="flex items-center m-1"
                    >
                      <vs-avatar class="mr-3" style="min-width: 44px">
                        <img :src="avatar(item.from)" alt="" />
                      </vs-avatar>
                      <div>{{ item.comment }}</div>
                    </div>
                  </div>
                </div>
                <div class="text-xl p-5" v-else>There is no comment yet.</div>
              </div>
            </div>
          </div>
          <div class="p-3 flex justify-center">
            <vs-input v-model="comment" placeholder="Input your feedback" />
            <vs-button @click="postComment"> Comment </vs-button>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </vs-dialog>
    <vs-dialog v-model="showdatas">
      <template #header>
        <h1 class="text-3xl not-margin">Add Data</h1>
      </template>

      <div class="flex">
        <div
          class="flex flex-col"
          style="width: 50%; min-width: 400px; max-height: 80%"
        >
          <div class="p-3 flex justify-center">
            <vs-select
              v-if="datas.length > 0"
              placeholder="Select a data"
              v-model="data"
            >
              <vs-option
                v-for="item in datas"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                {{ item.name }}
              </vs-option>
            </vs-select>
            <vs-button @click="adddatas"> Save </vs-button>
          </div>
        </div>
      </div>
      <template #footer> </template>
    </vs-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import utils from "@/utils";
import API from "@/utils/api";

export default {
  name: "CImage",
  props: {
    hash: String,
    flag: Boolean,
    index: Number,
  },
  watch: {},
  data() {
    return {
      image: null,
      showDetails: false,
      showdatas: false,
      tags: [],
      comment: "",
      comments: [],
      datas: [],
      data: "",
    };
  },
  computed: {},
  methods: {
    ...mapActions(["getImage", "getTags"]),
    removeIconClicked(event) {
      this.$emit("clicked", this.index);
    },
    avatar(id) {
      return utils.blockies(id);
    },
    openNotificationSucess(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Success",
        text: "Successfuly added",
      });
    },
    openNotificationFailed(position = null, color) {
      const noti = this.$vs.notification({
        color,
        position,
        title: "Failed",
        text: "Already photo exists",
      });
    },
    details() {
      this.getTags(this.hash).then((tags) => {
        this.tags = tags;
        this.showDetails = true;
      });
    },
    showdataDialog() {
      this.refreshdatas();
      this.showdatas = true;
    },
    adddatas() {
      if (this.data !== "") {
        API.savedata({ name: this.data, hash: this.hash }).then((flag) => {
          if (flag) {
            this.openNotificationSucess("top-right", "success");
          } else {
            this.openNotificationFailed("top-right", "danger");
          }
          this.showdatas = false;
        });
      }
    },
    isUp(tag) {
      return tag.up_votes > tag.down_votes;
    },
    postComment() {
      API.addComment({ id: this.hash, comment: this.comment }).then(() => {
        this.refreshComments();
        this.comment = "";
      });
    },
    refreshComments() {
      API.comments(this.hash).then((comments) => {
        this.comments = comments;
      });
    },
    preview() {
      this.$viewerApi({
        images: [this.image],
      });
    },
    refreshdatas() {
      API.datas().then((datas) => {
        this.datas = datas;
      });
    },
  },
  mounted() {
    this.$vs.loading({
      target: this.$refs["loader"],
      text: "",
      type: "circles",
    });

    this.refreshComments();
    this.refreshdatas();

    this.getImage(this.hash).then((image) => {
      this.image = image;
    });
  },
};
</script>