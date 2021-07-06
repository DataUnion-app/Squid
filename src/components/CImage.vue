<template>
  <div class="">
    <div class="w-full h-full cursor-pointer relative">
      <vs-card>
        <template #img>
          <img v-if="image" class="image" :src="image" @click="details" />
        </template>
        <template #interactions>
          <vs-button v-if="!flag" danger icon>
            <i class="bx bx-heart" @click="showDataDialog"></i>
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
        <div class="image-detail-left">
          <div class="relative w-full">
            <vs-card>
              <template #img>
                <img
                  v-if="image"
                  class="image-detail"
                  :src="image"
                  @click="preview"
                  alt=""
                />
              </template>
              <template #interactions>
                <vs-button v-if="!flag" danger icon>
                  <i class="bx bx-heart" @click="showDataDialog"></i>
                </vs-button>
                <vs-button v-else danger icon>
                  <i class="bx bx-trash" @click="removeIconClicked"></i>
                </vs-button>
              </template>
            </vs-card>
          </div>
          <div class="mt-3 flex flex-wrap">
            <div v-for="tag in tags" :key="tag.tag" class="flex">
              <vs-tooltip v-if="isUp(tag)" danger>
                <vs-button danger flat>
                  {{ tag.tag }}
                </vs-button>
                <template #tooltip>
                  <div>
                    <div><i class="bx bx-upvote"></i>:{{ tag.up_votes }}</div>
                    <div>
                      <i class="bx bx-downvote"></i>:{{ tag.down_votes }}
                    </div>
                  </div>
                </template>
              </vs-tooltip>
              <vs-tooltip v-else success>
                <vs-button success flat>
                  {{ tag.tag }}
                </vs-button>
                <template #tooltip>
                  <div>
                    <div><i class="bx bx-upvote"></i>:{{ tag.up_votes }}</div>
                    <div>
                      <i class="bx bx-downvote"></i>:{{ tag.down_votes }}
                    </div>
                  </div>
                </template>
              </vs-tooltip>
            </div>
          </div>
        </div>
        <div class="flex flex-col image-detail-right">
          <div class="relative w-full">
            <div class="comment">
              <div
                class="
                  w-full
                  h-full
                  absolute
                  p-1
                  object-contain
                  pr-5
                  comment-item
                "
              >
                <div v-if="comments.length > 0" class="h-full flex flex-col">
                  <div class="text-2xl text-center">Comments</div>
                  <div class="p-3 overflow-y-auto">
                    <div
                      v-for="(item, index) in comments"
                      :key="index"
                      class="flex items-center m-1"
                    >
                      <vs-avatar class="mr-3 comment-avatar">
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
    <vs-dialog v-model="showDataSet">
      <template #header>
        <h1 class="text-3xl not-margin">Add to Data Set</h1>
      </template>

      <div class="flex">
        <div class="flex flex-col add-dialog">
          <div v-if="datas.length > 0" class="p-3 flex justify-center">
            <vs-select
              v-if="datas.length > 0"
              placeholder="Select a Data Set"
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
            <vs-button @click="addDataSet"> Save </vs-button>
          </div>
          <div v-else class="p-3 flex justify-center">
            There is no data set yet, Please create one
            <vs-button @click="connectSidebar"> Create </vs-button>
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
      showDataSet: false,
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
    connectSidebar() {
      this.showDataSet = false;
      this.$root.$refs.Sidebar.createData();
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
    showDataDialog() {
      this.refreshDataSet();
      this.showDataSet = true;
    },
    addDataSet() {
      if (this.data !== "") {
        API.saveData({ name: this.data, hash: this.hash }).then((flag) => {
          if (flag) {
            this.openNotificationSucess("top-right", "success");
          } else {
            this.openNotificationFailed("top-right", "danger");
          }
          this.showDataSet = false;
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
    refreshDataSet() {
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
    this.refreshDataSet();

    this.getImage(this.hash).then((image) => {
      this.image = image;
    });
  },
};
</script>