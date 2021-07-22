<template>
  <div class="">
    <div class="w-full h-full cursor-pointer relative">
      <vs-card>
        <template #img>
          <img v-if="image" class="image" :src="image" @click="preview" />
        </template>
        <template #interactions>
          <vs-tooltip
            ref="tooltip"
            v-if="!flag"
            shadow
            :not-hover="true"
            v-model="addDataTooltip"
          >
            <vs-button danger icon @click="showDataTooltip">
              <i class="bx bx-heart"></i>
            </vs-button>
            <template #tooltip>
              <div class="content-tooltip" v-click-outside="onTooltipOutside">
                <div v-if="datas.length > 0">
                  <h4 class="center">Please select a Data Set</h4>
                  <vs-select
                    class="vs-body"
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
                  <p>You are sure to add this image in that Data Set?</p>
                  <footer class="flex">
                    <vs-button @click="addDataSet" danger block>
                      Yes
                    </vs-button>
                    <vs-button
                      @click="addDataTooltip = false"
                      transparent
                      dark
                      block
                    >
                      No
                    </vs-button>
                  </footer>
                </div>
                <div v-else class="p-3 flex justify-center">
                  There is no data set yet, Please create one
                  <footer class="flex">
                    <vs-button @click="connectSidebar"> Create </vs-button>
                  </footer>
                </div>
              </div>
            </template>
          </vs-tooltip>
          <vs-tooltip v-else shadow not-hover v-model="removeImage">
            <vs-button danger icon @click="removeImage = !removeImage">
              <i class="bx bx-trash"></i>
            </vs-button>
            <template #tooltip>
              <div class="content-tooltip">
                <h4 class="center">Confirm</h4>
                <p>You are sure to remove this image?</p>
                <footer class="flex">
                  <vs-button @click="removeIconClicked" danger block>
                    Remove
                  </vs-button>
                  <vs-button
                    @click="removeImage = false"
                    transparent
                    dark
                    block
                  >
                    Cancel
                  </vs-button>
                </footer>
              </div>
            </template>
          </vs-tooltip>
          <vs-button danger icon @click="goWorldMap">
            <i class="bx bx-world"></i>
          </vs-button>
          <vs-button danger icon @click="details()" class="icon-detail">
            <i class="bx bx-detail"></i>
          </vs-button>
          <vs-checkbox success v-model="option">
          </vs-checkbox>
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
                <vs-tooltip
                  ref="tooltipdetail"
                  v-if="!flag"
                  bottom
                  shadow
                  not-hover
                  v-model="addDataDetailTooltip"
                >
                  <vs-button danger icon @click="showDataDetailTooltip">
                    <i class="bx bx-heart"></i>
                  </vs-button>
                  <template #tooltip>
                    <div
                      class="content-tooltip"
                      v-click-outside="onTooltipOutside"
                    >
                      <div v-if="datas.length > 0">
                        <h4>Please select a Data Set</h4>
                        <vs-select
                          class="vs-body"
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
                        <p>You are sure to add this image in that Data Set?</p>
                        <footer class="flex">
                          <vs-button @click="addDataSet" danger block>
                            Yes
                          </vs-button>
                          <vs-button
                            @click="addDataDetailTooltip = false"
                            transparent
                            dark
                            block
                          >
                            No
                          </vs-button>
                        </footer>
                      </div>
                      <div v-else class="p-3 flex justify-center">
                        There is no data set yet, Please create one
                        <footer class="flex">
                          <vs-button @click="connectSidebar">
                            Create
                          </vs-button>
                        </footer>
                      </div>
                    </div>
                  </template>
                </vs-tooltip>
                <vs-tooltip
                  v-else
                  bottom
                  shadow
                  not-hover
                  v-model="removeImageDetail"
                >
                  <vs-button
                    danger
                    icon
                    @click="removeImageDetail = !removeImageDetail"
                  >
                    <i class="bx bx-trash"></i>
                  </vs-button>
                  <template #tooltip>
                    <div class="content-tooltip">
                      <h4 class="center">Confirm</h4>
                      <p>You are sure to remove this image?</p>
                      <footer class="flex">
                        <vs-button @click="removeIconClicked" danger block>
                          Remove
                        </vs-button>
                        <vs-button
                          @click="removeImageDetail = false"
                          transparent
                          dark
                          block
                        >
                          Cancel
                        </vs-button>
                      </footer>
                    </div>
                  </template>
                </vs-tooltip>

                <vs-button danger icon @click="goWorldMap">
                  <i class="bx bx-world"></i>
                </vs-button>
              </template>
            </vs-card>
          </div>
          <div class="mt-3 flex flex-wrap">
            <div v-for="tag in tags" :key="tag.tag" class="flex">
              <vs-tooltip v-if="isUp(tag)" success>
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
              <vs-tooltip v-else danger>
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
  </div>
</template>
<style>
.vs-select__options {
  z-index: 9999999 !important;
}
.vs-checkbox-con {
  width: 32px !important;
  height: 32px !important;
}
</style>
<script>
import { mapActions, mapState } from "vuex";
import utils from "@/utils";
import API from "@/utils/api";

export default {
  name: "CImage",
  props: {
    hash: String,
    flag: Boolean,
    index: Number,
  },
  watch: {
    option: function(newValue, oldValue) {
      if(newValue) {
        this.setClickImage({hash:this.hash});
      }
      else {
        this.removeClickImage({hash:this.hash});
      }
    }
  },
  data() {
    return {
      image: null,
      showDetails: false,
      showDataSet: false,
      option: false,
      tags: [],
      comment: "",
      comments: [],
      datas: [],
      data: "",
      addDataTooltip: false,
      addDataDetailTooltip: false,
      removeImage: false,
      removeImageDetail: false,
    };
  },
  computed: {},
  methods: {
    ...mapActions(["getImage", "getTags", "setClickImage", "removeClickImage"]),
    onTooltipOutside(e) {
      if (
        this.addDataTooltip &&
        e.srcElement.className != "vs-select__options__content"
      ) {
        this.addDataTooltip = false;
      }
      if (
        this.addDataDetailTooltip &&
        e.srcElement.className != "vs-select__options__content"
      ) {
        this.addDataDetailTooltip = false;
      }
    },
    removeIconClicked(event) {
      this.removeImage = false;
      this.removeImageDetail = false;
      this.$emit("onClickChild", this.index);
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
      this.addDataTooltip = false;
      this.addDataDetailTooltip = false;
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
          this.addDataTooltip = false;
          this.addDataDetailTooltip = false;
        });
      }
    },
    isUp(tag) {
      return tag.up_votes >= tag.down_votes;
    },
    postComment() {
      if (this.comment !== "") {
        API.addComment({ id: this.hash, comment: this.comment }).then(() => {
          this.refreshComments();
          this.comment = "";
        });
      }
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
    goWorldMap() {
      this.$store.dispatch("setImageWorld", this.hash);
      this.$router.push({ name: "Map" }).catch(() => {});
    },
    showDataTooltip() {
      this.addDataTooltip = true;
      this.refreshDataSet();
    },
    showDataDetailTooltip() {
      this.addDataDetailTooltip = true;
      this.refreshDataSet();
    },
  },
  updated() {
    if (this.$refs.tooltip) {
      this.$refs.tooltip.removeTooltip = () => {};
    }
    if (this.$refs.tooltipdetail) {
      this.$refs.tooltipdetail.removeTooltip = () => {};
    }
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
