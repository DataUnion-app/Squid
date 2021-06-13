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

// import Axios from "axios";
// import Notify from "common/notify";
// import { $gettext } from "./vm";
// import Event from "pubsub-js";
import Vue from 'vue';

export const BASE_URL = 'http://206.81.26.71:8081';
// export const BASE_URL = 'https://alpha.dataunion.app:4430';
import Auth from './auth';

import photos from "../../static/photos/sample.json";

class API {
  call = (path, method, data, headers, isPure) => {
    const apiHeaders = new Headers()
    apiHeaders.append("Authorization", `Bearer ${Auth.token()}`)
    if (headers) {
      Object.keys(headers).map(key => {
        apiHeaders[key] = headers[key];
      })
    }
    const param = {
      method: method,
      headers: apiHeaders,
      // mode: 'no-cors'
    }
    if (data) {
      param.body = JSON.stringify(data);
    }
    return fetch(
      `${BASE_URL}/${path}`, param
    ).then(response => {
      if (isPure) {
        return response;
      }
      if (response.ok) {
        return response.json();
      }
      const status = response.status;
      return response.json().then(response => {
        if (response.msg == 'Token has expired') {
          return Auth.refreshToken().then(result => {
            if (result) {
              return this.call(path, method, data, headers);
            }
          });
        }
        return Promise.reject({
          status: status,
          response: response
        })
      })
    })
  }
  streamToBase64 = (stream) => {
    const concat = require('concat-stream')
    const { Base64Encode } = require('base64-stream')
  
    return new Promise((resolve, reject) => {
      const base64 = new Base64Encode()
  
      const cbConcat = (base64) => {
        resolve(base64)
      }
  
      stream
        .pipe(base64)
        .pipe(concat(cbConcat))
        .on('error', (error) => {
          reject(error)
        })
    })
  }  
  getDataUrl = async function (blob) {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    return;
    const encoder = require('fast-png');
    const img = encoder.decode(data);

    return URL.createObjectURL(
      new Blob([img.data.buffer], { type: 'image/png' } /* (1) */)
    )

    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
  
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img.data, 0, 0)
  
    // If the image is not png, the format
    // must be specified here
    return canvas.toDataURL()
  }
  thumbnail = async(id) => {
    return this.call(`api/v1/image/thumbnail?image_id=${id}`, 'GET', null, null, true)
    .then(response => {
      return response.blob();      
    }).catch(err => {
      return Promise.reject(err);
    });
  }
  photos = async({status, tag, page}) => {
    page = page || 1;
    status = status || 'VERIFIABLE';
    return this.call('api/v1/search-images', 'POST', {status, page, tag})
    .then(async response => {
      const result = [];
      for(let i = 0; i < response.result.length; i++) {
        const item = response.result[i];
        const photo = JSON.parse(JSON.stringify(photos[0]))
        photo.Hash = item;
        // const binaryData = await this.thumbnail(item)
          this.thumbnail(item).then(binaryData => {
            this.getDataUrl(binaryData).then(data => {
              Vue.set(photo, 'imageData', data);
            })
          })
          // const data = await this.getDataUrl(binaryData)
          // console.log(data);
          // const dataUrl = data;
          // photo.imageData = dataUrl;
        result.push(photo);
      }
      console.log('REFINED RESULT', result);
      return result;
    }).catch(err => {
      return Promise.reject(err);
    });
    return photos;
  }
  overallTags = async() => {
    return this.call(`api/v1/stats/overall-tags?start_date=01-01-2018&end_date=06-06-2021`, 'GET')
    .then(response => {
      return response;
    }).catch(err => {
      return Promise.reject(err);
    });
  }
  tags = async(type) => {
    type = type || 'RECOMMENDED_WORDS';
    status = 'VERIFIABLE';
    return this.call(`staticdata/tags?type=${type}`, 'GET')
    // return this.call(`api/v1/tags?status=${status}`, 'GET')
    .then(response => {
      response.result.unshift('food bounty');
      response.result.unshift('hey');
      return response;
    }).catch(err => {
      return Promise.reject(err);
    });
  }
}

export default new API();
// const testConfig = { jsHash: "48019917", cssHash: "2b327230", version: "test" };
// const config = window.__CONFIG__ ? window.__CONFIG__ : testConfig;

// const Api = Axios.create({
//   baseURL: "/api/v1",
//   headers: {
//     common: {
//       "X-Session-ID": window.localStorage.getItem("session_id"),
//       "X-Client-Hash": config.jsHash,
//       "X-Client-Version": config.version,
//     },
//   },
// });

// Api.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     Notify.ajaxStart();
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// Api.interceptors.response.use(
//   function (resp) {
//     Notify.ajaxEnd();

//     if (typeof resp.data == "string") {
//       Notify.error($gettext("Request failed - invalid response"));
//       console.warn("WARNING: Server returned HTML instead of JSON - API not implemented?");
//     }

//     // Update preview token.
//     if (resp.headers && resp.headers["x-preview-token"]) {
//       const previewToken = resp.headers["x-preview-token"];
//       if (config.previewToken !== previewToken) {
//         config.previewToken = previewToken;
//         Event.publish("config.updated", { config: { previewToken } });
//       }
//     }

//     return resp;
//   },
//   function (error) {
//     Notify.ajaxEnd();

//     if (Axios.isCancel(error)) {
//       return Promise.reject(error);
//     }

//     if (console && console.log) {
//       console.log(error);
//     }

//     let errorMessage = $gettext("An error occurred - are you offline?");
//     let code = error.code;

//     if (error.response && error.response.data) {
//       let data = error.response.data;
//       code = data.code;
//       errorMessage = data.message ? data.message : data.error;
//     }

//     if (code === 401) {
//       Notify.logout(errorMessage);
//     } else {
//       Notify.error(errorMessage);
//     }

//     return Promise.reject(error);
//   }
// );

// export default Api;