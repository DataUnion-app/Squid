/*

Copyright (c) 2018 - 2021 Michael Mayer <hello@photoprism.org>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    PhotoPrism® is a registered trademark of Michael Mayer.  You may use it as required
    to describe our software, run your own server, for educational purposes, but not for
    offering commercial goods, products, or services without prior written permission.
    In other words, please ask.

Feel free to send an e-mail to hello@photoprism.org if you have questions,
want to support our work, or just want to say hello.

Additional information can be found in our Developer Guide:
https://docs.photoprism.org/developer-guide/

*/

import Event from "pubsub-js";
import themes from "options/themes.json";
import translations from "locales/translations.json";
import Api from "./api";

const config = {"mode":"user","name":"PhotoPrism","version":"210501-d8322a59-Linux-x86_64","copyright":"(c) 2018-2021 Michael Mayer \u003chello@photoprism.org\u003e","flags":"public experimental settings","siteUrl":"https://demo.photoprism.org/","sitePreview":"https://dl.photoprism.org/assets/img/preview.jpg","siteTitle":"PhotoPrism","siteCaption":"Demo","siteDescription":"Open-Source Personal Photo Management. Say goodbye to solutions that force you to upload your visual memories to the cloud.","siteAuthor":"PhotoPrism.org","debug":false,"test":false,"demo":true,"sponsor":true,"readonly":false,"uploadNSFW":false,"public":true,"experimental":true,"albumCategories":["Country","USA State"],"albums":[{"ID":63,"UID":"aqowero1ocr4ttes","CoverUID":"","FolderUID":"","Slug":"california-usa","Path":"","Type":"state","Title":"California / USA","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true country:us state:California","Order":"newest","Template":"","Country":"us","Year":0,"Month":0,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":15,"UID":"aqowero3ucfhadnb","CoverUID":"","FolderUID":"","Slug":"canada-2012","Path":"","Type":"moment","Title":"Canada 2012","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true country:ca year:2012","Order":"oldest","Template":"","Country":"ca","Year":2012,"Month":0,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":46,"UID":"aqowero39gi4lntj","CoverUID":"","FolderUID":"","Slug":"december-2017","Path":"","Type":"month","Title":"December 2017","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true year:2017 month:12","Order":"oldest","Template":"","Country":"zz","Year":2017,"Month":12,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":35,"UID":"aqowero2k4v752jg","CoverUID":"","FolderUID":"","Slug":"june-2013","Path":"","Type":"month","Title":"June 2013","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true year:2013 month:6","Order":"oldest","Template":"","Country":"zz","Year":2013,"Month":6,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":69,"UID":"aqowero3es01unid","CoverUID":"","FolderUID":"","Slug":"la-reunion-france","Path":"","Type":"state","Title":"La Réunion / France","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true country:fr state:\"La Réunion\"","Order":"newest","Template":"","Country":"fr","Year":0,"Month":0,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":14,"UID":"aqowero3jznmz5ba","CoverUID":"","FolderUID":"","Slug":"nature-and-landscape","Path":"","Type":"moment","Title":"Nature \u0026 Landscape","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true label:flower|landscape|nature","Order":"oldest","Template":"","Country":"zz","Year":0,"Month":0,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":75,"UID":"aqoweron821bm3bh","CoverUID":"","FolderUID":"","Slug":"north-west-district-botswana","Path":"","Type":"state","Title":"North-West District / Botswana","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true country:bw state:\"North-West District\"","Order":"newest","Template":"","Country":"bw","Year":0,"Month":0,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":44,"UID":"aqowero2zw2r13r8","CoverUID":"","FolderUID":"","Slug":"october-2019","Path":"","Type":"month","Title":"October 2019","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true year:2019 month:10","Order":"oldest","Template":"","Country":"zz","Year":2019,"Month":10,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null},{"ID":16,"UID":"aqowerop3jf5n3dr","CoverUID":"","FolderUID":"","Slug":"parks-and-gardens","Path":"","Type":"moment","Title":"Parks \u0026 Gardens","Location":"","Category":"","Caption":"","Description":"","Notes":"","Filter":"public:true label:\"botanical-garden\"","Order":"oldest","Template":"","Country":"zz","Year":0,"Month":0,"Day":0,"Favorite":true,"Private":false,"CreatedAt":"2021-02-21T21:38:12Z","UpdatedAt":"2021-02-21T21:38:12Z","DeletedAt":null}],"cameras":[{"ID":6,"Slug":"apple-iphone-4s","Name":"Apple iPhone 4S","Make":"Apple","Model":"iPhone 4S"},{"ID":7,"Slug":"apple-iphone-5s","Name":"Apple iPhone 5s","Make":"Apple","Model":"iPhone 5s"},{"ID":8,"Slug":"apple-iphone-6","Name":"Apple iPhone 6","Make":"Apple","Model":"iPhone 6"},{"ID":9,"Slug":"apple-iphone-se","Name":"Apple iPhone SE","Make":"Apple","Model":"iPhone SE"},{"ID":3,"Slug":"canon-eos-5d","Name":"Canon EOS 5D","Make":"Canon","Model":"EOS 5D"},{"ID":5,"Slug":"canon-eos-6d","Name":"Canon EOS 6D","Make":"Canon","Model":"EOS 6D"},{"ID":4,"Slug":"canon-eos-7d","Name":"Canon EOS 7D","Make":"Canon","Model":"EOS 7D"},{"ID":13,"Slug":"fujifilm-x-t2","Name":"FUJIFILM X-T2","Make":"FUJIFILM","Model":"X-T2"},{"ID":14,"Slug":"google-pixel-3-xl","Name":"Google Pixel 3 XL","Make":"Google","Model":"Pixel 3 XL"},{"ID":10,"Slug":"huawei-p30","Name":"HUAWEI P30","Make":"HUAWEI","Model":"P30"},{"ID":2,"Slug":"olympus-c2500l","Name":"Olympus C2500L","Make":"Olympus","Model":"C2500L"},{"ID":1,"Slug":"zz","Name":"Unknown","Make":"","Model":"Unknown"}],"lenses":[{"ID":6,"Slug":"100-0-mm","Name":"100.0 mm","Make":"","Model":"100.0 mm","Type":""},{"ID":2,"Slug":"24-0-105-0-mm","Name":"24.0 - 105.0 mm","Make":"","Model":"24.0 - 105.0 mm","Type":""},{"ID":8,"Slug":"apple-iphone-5s-back-camera-4-12mm-f-2-2","Name":"Apple iPhone 5s back camera 4.12mm f/2.2","Make":"Apple","Model":"iPhone 5s back camera 4.12mm f/2.2","Type":""},{"ID":10,"Slug":"apple-iphone-6-back-camera-4-15mm-f-2-2","Name":"Apple iPhone 6 back camera 4.15mm f/2.2","Make":"Apple","Model":"iPhone 6 back camera 4.15mm f/2.2","Type":""},{"ID":11,"Slug":"apple-iphone-se-back-camera-4-15mm-f-2-2","Name":"Apple iPhone SE back camera 4.15mm f/2.2","Make":"Apple","Model":"iPhone SE back camera 4.15mm f/2.2","Type":""},{"ID":4,"Slug":"ef100mm-f-2-8l-macro-is-usm","Name":"EF100mm f/2.8L Macro IS USM","Make":"","Model":"EF100mm f/2.8L Macro IS USM","Type":""},{"ID":7,"Slug":"ef16-35mm-f-2-8l-ii-usm","Name":"EF16-35mm f/2.8L II USM","Make":"","Model":"EF16-35mm f/2.8L II USM","Type":""},{"ID":3,"Slug":"ef24-105mm-f-4l-is-usm","Name":"EF24-105mm f/4L IS USM","Make":"","Model":"EF24-105mm f/4L IS USM","Type":""},{"ID":9,"Slug":"ef35mm-f-2-is-usm","Name":"EF35mm f/2 IS USM","Make":"","Model":"EF35mm f/2 IS USM","Type":""},{"ID":5,"Slug":"ef70-200mm-f-4l-is-usm","Name":"EF70-200mm f/4L IS USM","Make":"","Model":"EF70-200mm f/4L IS USM","Type":""},{"ID":13,"Slug":"fujifilm-xf35mmf1-4-r","Name":"FUJIFILM XF35mmF1.4 R","Make":"FUJIFILM","Model":"XF35mmF1.4 R","Type":""},{"ID":1,"Slug":"zz","Name":"Unknown","Make":"","Model":"Unknown","Type":""}],"countries":[{"ID":"at","Slug":"austria","Name":"Austria"},{"ID":"bw","Slug":"botswana","Name":"Botswana"},{"ID":"ca","Slug":"canada","Name":"Canada"},{"ID":"cu","Slug":"cuba","Name":"Cuba"},{"ID":"fr","Slug":"france","Name":"France"},{"ID":"de","Slug":"germany","Name":"Germany"},{"ID":"gr","Slug":"greece","Name":"Greece"},{"ID":"it","Slug":"italy","Name":"Italy"},{"ID":"za","Slug":"south-africa","Name":"South Africa"},{"ID":"ch","Slug":"switzerland","Name":"Switzerland"},{"ID":"gb","Slug":"united-kingdom","Name":"United Kingdom"},{"ID":"us","Slug":"usa","Name":"USA"},{"ID":"zz","Slug":"zz","Name":"Unknown"}],"thumbs":[{"size":"fit_720","use":"Mobile, TV","w":720,"h":720},{"size":"fit_1280","use":"Mobile, HD Ready TV","w":1280,"h":1024},{"size":"fit_1920","use":"Mobile, Full HD TV","w":1920,"h":1200},{"size":"fit_2048","use":"Tablets, Cinema 2K","w":2048,"h":2048},{"size":"fit_2560","use":"Quad HD, Retina Display","w":2560,"h":1600},{"size":"fit_4096","use":"Ultra HD, Retina 4K","w":4096,"h":4096},{"size":"fit_7680","use":"8K Ultra HD 2, Retina 6K","w":7680,"h":4320}],"status":"unregistered","mapKey":"D9ve6edlcVR2mEsNvCVs","downloadToken":"34urnjzs","previewToken":"public","jsHash":"a643ee09","cssHash":"72eb90e8","manifestHash":"e7095a4c","settings":{"ui":{"scrollbar":true,"zoom":false,"theme":"default","language":"en"},"templates":{"default":"index.tmpl"},"maps":{"animate":0,"style":"streets"},"features":{"upload":true,"download":true,"private":true,"review":true,"files":true,"videos":true,"folders":true,"albums":true,"moments":true,"estimates":true,"people":true,"labels":true,"places":true,"edit":true,"archive":true,"delete":true,"share":true,"library":true,"import":true,"logs":true},"import":{"path":"upload","move":false},"index":{"path":"/","convert":true,"rescan":true},"stack":{"uuid":true,"meta":true,"name":false},"share":{"title":""},"download":{"name":"file"}},"disable":{"backups":false,"webdav":true,"settings":false,"places":false,"exiftool":false,"darktable":false,"rawtherapee":false,"sips":true,"heifconvert":false,"ffmpeg":false,"tensorflow":false},"count":{"all":125,"photos":125,"videos":0,"cameras":11,"lenses":11,"countries":12,"hidden":0,"favorites":26,"private":8,"review":11,"stories":0,"albums":6,"moments":10,"months":48,"folders":7,"files":267,"places":44,"states":21,"labels":39,"labelMaxPhotos":11},"pos":{"uid":"pqowerb1t0snpa9n","cid":"s2:47a85a624184","utc":"2020-08-31T16:03:10Z","lat":52.45254898071289,"lng":13.309226989746094},"years":[2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2002],"colors":[{"Example":"#AB47BC","Name":"Purple","Slug":"purple"},{"Example":"#FF00FF","Name":"Magenta","Slug":"magenta"},{"Example":"#EC407A","Name":"Pink","Slug":"pink"},{"Example":"#EF5350","Name":"Red","Slug":"red"},{"Example":"#FFA726","Name":"Orange","Slug":"orange"},{"Example":"#D4AF37","Name":"Gold","Slug":"gold"},{"Example":"#FDD835","Name":"Yellow","Slug":"yellow"},{"Example":"#CDDC39","Name":"Lime","Slug":"lime"},{"Example":"#66BB6A","Name":"Green","Slug":"green"},{"Example":"#009688","Name":"Teal","Slug":"teal"},{"Example":"#00BCD4","Name":"Cyan","Slug":"cyan"},{"Example":"#2196F3","Name":"Blue","Slug":"blue"},{"Example":"#A1887F","Name":"Brown","Slug":"brown"},{"Example":"#F5F5F5","Name":"White","Slug":"white"},{"Example":"#9E9E9E","Name":"Grey","Slug":"grey"},{"Example":"#212121","Name":"Black","Slug":"black"}],"categories":[{"UID":"lqsfqwn1in8wtdj8","Slug":"animal","Name":"Animal"},{"UID":"lqsfqwhxmyf414d8","Slug":"architecture","Name":"Architecture"},{"UID":"lqsfqxkmilt5oztv","Slug":"beetle","Name":"Beetle"},{"UID":"lqsfqwxrewbyehbw","Slug":"bird","Name":"Bird"},{"UID":"lqsfqwsr2snmoo7w","Slug":"building","Name":"Building"},{"UID":"lqsfqwd3d7j7o0sm","Slug":"car","Name":"Car"},{"UID":"lqsfqwu242a51ph1","Slug":"cat","Name":"Cat"},{"UID":"lqsfqxu2lxcgy4ah","Slug":"farm","Name":"Farm"},{"UID":"lqsfr0e2gj3z2ky6","Slug":"food","Name":"Food"},{"UID":"lqsfqwwki9e74s7z","Slug":"insect","Name":"Insect"},{"UID":"lqsfqwh15zk8kbfh","Slug":"landscape","Name":"Landscape"},{"UID":"lqsfqxy350l6r57v","Slug":"monkey","Name":"Monkey"},{"UID":"lqsfqwh24k8kuxw3","Slug":"mountain","Name":"Mountain"},{"UID":"lqsfqwd1k01cr3vs","Slug":"nature","Name":"Nature"},{"UID":"lqsfqwd3owueaj1a","Slug":"plant","Name":"Plant"},{"UID":"lqshs1z1o7b7iy8m","Slug":"portrait","Name":"Portrait"},{"UID":"lqsfqyn2007fqj51","Slug":"reptile","Name":"Reptile"},{"UID":"lqsfqwf3mubulu0a","Slug":"shop","Name":"Shop"},{"UID":"lqsfqy121obzm6dh","Slug":"snow","Name":"Snow"},{"UID":"lqsfqye3ard8u9g1","Slug":"tower","Name":"Tower"},{"UID":"lqsfqwd3r597byw7","Slug":"vehicle","Name":"Vehicle"},{"UID":"lqsfqws2i0111n0w","Slug":"water","Name":"Water"},{"UID":"lqsfqxh3m6plfkfv","Slug":"wildlife","Name":"Wildlife"}],"clip":160,"server":{"cores":6,"routines":83,"memory":{"used":50743176,"reserved":429326424,"info":"Used 51 MB / Reserved 429 MB"}}};

window.__CONFIG__ = config;

export default class Config {
  /**
   * @param {Storage} storage
   * @param {object} values
   */
  constructor(storage, values) {
    this.disconnected = false;
    this.storage = storage;
    this.storage_key = "config";

    this.$vuetify = null;
    this.translations = translations;

    if (!values || !values.siteTitle) {
      console.warn("config: values are empty");
      this.debug = true;
      this.test = true;
      this.demo = false;
      this.themeName = "";
      this.values = {};
      this.page = {
        title: "PhotoPrism",
        caption: "Browse Your Life",
      };
      return;
    }

    this.page = {
      title: values.siteTitle,
      caption: values.siteCaption,
    };

    this.values = values;
    this.debug = !!values.debug;
    this.test = !!values.test;
    this.demo = !!values.demo;

    Event.subscribe("config.updated", (ev, data) => this.setValues(data.config));
    Event.subscribe("count", (ev, data) => this.onCount(ev, data));

    if (this.has("settings")) {
      this.setTheme(this.get("settings").ui.theme);
    } else {
      this.setTheme("default");
    }
  }

  loading() {
    return !this.values.mode || this.values.mode === "public";
  }

  load() {
    if (this.loading()) {
      return this.update();
    }

    return Promise.resolve();
  }

  update() {
    return Api.get("config")
      .then(
        (response) => this.setValues(response.data),
        () => console.warn("failed pulling updated client config")
      )
      .finally(() => Promise.resolve());
  }

  setValues(values) {
    if (!values) return;

    if (this.debug) {
      console.log("config: new values", values);
    }

    if (values.jsHash && this.values.jsHash !== values.jsHash) {
      Event.publish("dialog.reload", { values });
    }

    for (let key in values) {
      if (values.hasOwnProperty(key)) {
        this.set(key, values[key]);
      }
    }

    if (values.settings) {
      this.setTheme(values.settings.ui.theme);
    }

    return this;
  }

  onCount(ev, data) {
    const type = ev.split(".")[1];

    switch (type) {
      case "photos":
        this.values.count.all += data.count;
        this.values.count.photos += data.count;
        break;
      case "videos":
        this.values.count.all += data.count;
        this.values.count.videos += data.count;
        break;
      case "cameras":
        this.values.count.cameras += data.count;
        this.update();
        break;
      case "lenses":
        this.values.count.lenses += data.count;
        break;
      case "countries":
        this.values.count.countries += data.count;
        this.update();
        break;
      case "states":
        this.values.count.states += data.count;
        break;
      case "places":
        this.values.count.places += data.count;
        break;
      case "labels":
        this.values.count.labels += data.count;
        break;
      case "albums":
        this.values.count.albums += data.count;
        break;
      case "moments":
        this.values.count.moments += data.count;
        break;
      case "months":
        this.values.count.months += data.count;
        break;
      case "folders":
        this.values.count.folders += data.count;
        break;
      case "files":
        this.values.count.files += data.count;
        break;
      case "favorites":
        this.values.count.favorites += data.count;
        break;
      case "review":
        this.values.count.review += data.count;
        break;
      case "private":
        this.values.count.private += data.count;
        break;
      default:
        console.warn("unknown count type", ev, data);
    }

    this.values.count;
  }

  setVuetify(instance) {
    this.$vuetify = instance;
  }

  setTheme(name) {
    this.themeName = name;

    const el = document.getElementById("photoprism");

    if (el) {
      el.className = "theme-" + name;
    }

    this.theme = themes[name] ? themes[name] : themes["default"];

    if (this.theme.dark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    if (this.$vuetify) {
      this.$vuetify.theme = this.theme.colors;
    }

    return this;
  }

  getValues() {
    return this.values;
  }

  storeValues() {
    this.storage.setItem(this.storage_key, JSON.stringify(this.getValues()));
    return this;
  }

  set(key, value) {
    this.values[key] = value;
    return this;
  }

  has(key) {
    return !!this.values[key];
  }

  get(key) {
    return this.values[key];
  }

  feature(name) {
    return this.values.settings.features[name];
  }

  settings() {
    return this.values.settings;
  }

  downloadToken() {
    return this.values["downloadToken"];
  }

  previewToken() {
    return this.values["previewToken"];
  }

  albumCategories() {
    if (this.values["albumCategories"]) {
      return this.values["albumCategories"];
    }

    return [];
  }
}
