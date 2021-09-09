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

            <!-- SELECT DATASET -->
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
                  <!-- <p>Are you sure you want to add this image in that Data Set?</p> -->
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
                  You haven't created any datasets yet. Please create one.
                  <footer class="flex">
                    <vs-button @click="connectSidebar"> Create </vs-button>
                  </footer>
                </div>
              </div>
            </template>
            <!-- SELECT DATASET -->
          
          </vs-tooltip>
          <vs-tooltip v-else shadow not-hover v-model="removeImage">
            <vs-button danger icon @click="removeImage = !removeImage">
              <i class="bx bx-trash"></i>
            </vs-button>
            <template #tooltip>
              <div class="content-tooltip">
                <h4 class="center">Confirm</h4>
                <p>Are you sure you want to remove this image?</p>
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
          <vs-checkbox success v-model="option"> </vs-checkbox>
        </template>      
      </vs-card>
      <div v-show="!image" ref="loader" class="relative w-full h-full"></div>
    </div>

    <vs-dialog v-model="showDetails">
      <template #header>
        <h1 class="text-3xl not-margin">Details</h1>
      </template>

      <div class="flex position-relative">
        <div v-show="!tagsLoaded" class="smt-spinner-circle">
          <div class="smt-spinner"></div>
        </div>
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
                  
                  <!-- SELECT DATASET -->
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
                        <!-- <p>Are you sure you want to add this image in that Data Set?</p> -->
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
                        You haven't created any datasets yet. Please create one.
                        <footer class="flex">
                          <vs-button @click="connectSidebar">
                            Create
                          </vs-button>
                        </footer>
                      </div>
                    </div>
                  </template>
                  <!-- SELECT DATASET -->
                
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
                      <p>Are you sure you want to remove this image?</p>
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
          <div class="mt-3 h-40 overflow-auto">
            <div class="mt-3 flex flex-wrap">
              <div v-for="(tag, index) in tags" :key="index" class="flex">
                <vs-button v-bind:style="styleObject[index]">
                  {{ tag.tag }}
                </vs-button>
                <!-- <vs-tooltip v-if="isUp(tag)" success>
                  <vs-button success flat>
                    {{ tag.tag}}  <i class="bx bx-upvote"></i>: {{tag.up_votes }}
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
                </vs-tooltip> -->
              </div>
            </div>
          </div>
        </div>
        <div class="flex image-detail-right">
          <div class="relative w-full">
            <div class="comment">
              <div
                class="
                  w-full
                  h-full
                  absolute
                  p-2
                  object-contain
                  pl-4
                  pr-2
                  comment-item
                "
              >
                <vs-table>
                  <template #thead>
                    <vs-tr>
                      <vs-th> Tag Name </vs-th>
                      <vs-th> Upvotes </vs-th>
                      <vs-th> Downvotes </vs-th>
                      <vs-th> Boxes </vs-th>
                    </vs-tr>
                  </template>
                  <template #tbody>
                    <p v-show="!tagsLoaded"></p>
                    <vs-tr :key="i" v-for="(tr, i) in tags" :data="tr">
                      <vs-td>
                        {{ tr.tag }}
                      </vs-td>
                      <vs-td>
                        {{ tr.up_votes }}
                      </vs-td>
                      <vs-td>
                        {{ tr.down_votes }}
                      </vs-td>
                      <vs-td>
                        {{
                          groupedImages[tr.tag]
                            ? groupedImages[tr.tag].length
                            : 0
                        }}
                      </vs-td>
                    </vs-tr>
                  </template>
                </vs-table>
              </div>
            </div>
          </div>
          <!-- <div class="p-3 flex justify-center">
            <vs-input v-model="comment" placeholder="Input your feedback" />
            <vs-button @click="postComment"> Comment </vs-button>
          </div> -->
        </div>
      </div>
      <template #footer>
        <div class="flex flex-col rounded-xl border-gray-500 border mt-4 p-3">
          <div class="coming-soon">Sales, Price & Usage Information: COMING SOON</div>
        </div>
      </template>
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
.vs-table table {
  min-width: 0% !important;
}
.vs-table-content {
  height: 100%;
  overflow: auto;
  border: 1px solid gray;
}
.vs-card {
  max-width: auto;
}
.vs-table tr {
  border-bottom: 1px;
  border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  border-style: solid;
}
.smt-spinner-circle {
  width: 50px;
  height: 50px;
  position: absolute;
  left: calc(50% - 25px);
  top: calc(40% - 25px);
}
.smt-spinner {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  border-right: 2px solid rgba(255, 255, 255, 0.6);
  border-top: 2px solid grey;
  border-left: 2px solid grey;
  border-bottom: 2px solid grey;
  animation: rotate--spinner 1.6s infinite;
}

.flex {
  flex: none !important;
}

@keyframes rotate--spinner {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
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
  computed: {
    ...mapState(["select_all"]),
  },
  watch: {
    option: function (newValue, oldValue) {
      if (newValue) {
        this.setClickImage({ hash: this.hash });
      } else {
        this.removeClickImage({ hash: this.hash });
      }
    },
    select_all(newVal, oldVal) {
      this.option = newVal;
    },
  },
  data() {
    return {
      image: null,
      showDetails: false,
      showDataSet: false,
      tagsLoaded: false,
      option: false,
      tags: [],
      groupedImages: [],
      color_rank: [],
      comment: "",
      comments: [],
      datas: [],
      data: "",
      addDataTooltip: false,
      addDataDetailTooltip: false,
      removeImage: false,
      removeImageDetail: false,
      styleObject: [],
    };
  },
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
        text: `Photo already exists in this dataset.`,
      });
    },
    groupBy(dataArray, key) {
      return dataArray.reduce(function (data, x) {
        (data[x["value"][key]] = data[x["value"][key]] || []).push(x);
        return data;
      }, {});
    },
    details() {
      this.getTags(this.hash)
        .then((tags) => {
          this.tags = tags;
          let i;
          this.color_rank = [];
          let up_max = 0,
            down_max = 0;
          for (i = 0; i < tags.length; i++) {
            if (up_max < tags[i].up_votes) up_max = tags[i].up_votes;
            if (down_max < tags[i].down_votes) down_max = tags[i].down_votes;
          }

          for (i = 0; i < tags.length; i++) {
            if (tags[i].up_votes > tags[i].down_votes) {
              let d_green = 128 + (64 / up_max) * (up_max - tags[i].up_votes);
              this.styleObject[i] = {
                backgroundColor: `rgb(0, ${d_green}, 0)`,
                color: "white",
              };
            } else if (tags[i].up_votes == tags[i].down_votes) {
              this.styleObject[i] = {
                backgroundColor: "rgb(204, 204, 0)",
                color: "white",
              };
            } else {
              let d_red =
                128 + (64 / down_max) * (down_max - tags[i].down_votes);
              this.styleObject[i] = {
                backgroundColor: `rgb(${d_red}, 0, 0)`,
                color: "white",
              };
            }
          }
          this.tagsLoaded = true;
        })
        .catch((error) => {
          console.error(error);
        });
      API.imageGeoloc(this.hash, "BoundingBox").then((images) => {
        this.groupedImages = this.groupBy(images, "tag");
      });
      this.showDetails = true;
      this.tagsLoaded = true;
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
