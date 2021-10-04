// export const BASE_URL = 'http://206.81.26.71:8081';
// export const BASE_URL = 'https://alpha.dataunion.app:4430';
export const BASE_URL = 'https://crab.dataunion.app/';
// export const BASE_URL = 'https://dev.dataunion.app:8082';
import Auth from './auth';
import VM from '../main';

class API {
  constructor() {
    this.requests = [];
    this.loader = null;
  }

  call = (path, method, data, headers, isPure) => {
    const apiHeaders = new Headers()
    apiHeaders.append("Authorization", `Bearer ${Auth.token()}`);

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

    const timestamp = (new Date()).getTime();
    this.requests.push(timestamp);
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

      // Handling token expiry, automatic refreshing
      return response.json().then(response => {
        if (response.msg == 'Token has expired') {
          return Auth.refreshToken().then(result => {
            // ts
            // console.log(`refreshToken result = `);
            // console.log(result);
            if (result) {
              // ts
              // console.log(`doing recursion`);
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
      .finally(() => {
        this.requests = this.requests.filter((request) => request != timestamp);
        // if (this.requests.length == 0) {
        //   this.loader.close();
        //   this.loader = null;
        // }
      });
  }

  thumbnail = async (id) => {
    return this.call(`api/v1/image/thumbnail?image_id=${id}`, 'GET', null, null, true)
      .then(response => {
        return response.blob().then(binaryData => {
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(binaryData);
          });
        });
      }).catch(err => {
        return Promise.reject(err);
      });
  }

  imageGeoloc = (id, tagType) => {
    return this.call(`api/v1/metadata/query`, 'POST', {
      image_ids: id,
      annotations: [tagType] // ['BoundingBox', 'GeoLocation']
    })
      .then(response => {
        // ts
        // console.log(`metadata/query response: `);
        // console.log(response);
        return response.result[tagType];
      }).catch(err => {
        return Promise.reject(err);
      });
  }



  myImages = async ({
    page,
  }) => {
    if (Auth.token() !== null) {
      // ts
      // console.log(`Auth.token() set`)
      // console.log(Auth.token())

      return this.call(`api/v1/my-images?page=${page}`, 'GET').then(response => {
        // ts
        // console.log(`myImages response = `);
        // console.log(response);
        const result = [];
        for (let i = 0; i < response.result.length; i++) {
          const hash = response.result[i].hash;
          if (hash != undefined) {
            const photo = {
              hash
            };
            result.push(photo);
          }
        }
        return Promise.resolve(result);
      }).catch(err => {
        return Promise.reject(err);
      });
    } else {
      return "AUTH TOKEN NOT SET"
    }
  }

  addComment = async ({
    id,
    comment
  }) => {
    const comments = JSON.parse(localStorage.getItem('comments')) || {};
    if (!comments[id]) {
      comments[id] = [];
    }
    comments[id].push({
      from: Auth.account,
      comment
    });
    localStorage.setItem('comments', JSON.stringify(comments));
    return Promise.resolve(true);
  }

  comments = async (id) => {
    const comments = JSON.parse(localStorage.getItem('comments'));
    if (!comments) {
      return [];
    }
    return comments[id] || [];
  }

  createData = async ({
    name
  }) => {
    const datas = JSON.parse(localStorage.getItem('datas')) || [];
    const index = datas.findIndex(item => item.name === name);
    if (index < 0) {
      const data = {};
      data.name = name;
      data.photos = [];
      datas.push(data);
      localStorage.setItem('datas', JSON.stringify(datas));
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  removeDataSet = async ({
    index
  }) => {
    const datas = JSON.parse(localStorage.getItem('datas')) || [];
    datas.splice(index, 1);
    localStorage.setItem('datas', JSON.stringify(datas));
    return Promise.resolve(true);
  }

  saveData = async ({
    name,
    hash
  }) => {
    const datas = JSON.parse(localStorage.getItem('datas')) || [];
    const index = datas.findIndex(item => item.name === name);
    if (datas[index].photos.findIndex(item => item == hash) < 0) {
      datas[index].photos.push(hash);
      localStorage.setItem('datas', JSON.stringify(datas));
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  changeDataSetName = async ({
    oldname,
    newname
  }) => {
    const datas = JSON.parse(localStorage.getItem('datas')) || [];
    const index = datas.findIndex(item => item.name === oldname);
    datas[index].name = newname;
    localStorage.setItem('datas', JSON.stringify(datas));
    return datas[index].photos;
  }

  removeData = async ({
    name,
    index
  }) => {
    const datas = JSON.parse(localStorage.getItem('datas')) || [];
    const a_index = datas.findIndex(item => item.name === name);
    datas[a_index].photos.splice(index, 1);
    localStorage.setItem('datas', JSON.stringify(datas));
    return datas[a_index].photos;
  }

  removeSelectDatas = async ({
    name,
    images
  }) => {
    const datas = JSON.parse(localStorage.getItem('datas')) || [];
    const a_index = datas.findIndex(item => item.name === name);
    let i;
    for (i = 0; i < images.length; i++) {
      const index = datas[a_index].photos.findIndex(item => item === images[i].hash);
      datas[a_index].photos.splice(index, 1);
    }
    localStorage.setItem('datas', JSON.stringify(datas));
    return true;
  }

  datas = async () => {
    const datas = JSON.parse(localStorage.getItem('datas'));
    if (!datas) {
      return [];
    }
    return datas;
  }

  getData = async ({
    name
  }) => {
    const datas = JSON.parse(localStorage.getItem('datas')) || [];
    const index = datas.findIndex(item => item.name === name);
    return datas[index].photos;
  }

  photos = async ({
    status,
    tag,
    page
  }) => {
    if (!tag) {
      return Promise.resolve([]);
    }

    const myTag = tag?.toString().split(' - (')[0];
    page = page || 1;

    return this.call('api/v1/search-images', 'POST', {
      status: status || "VERIFIABLE",
      page,
      tag: myTag
    }).then((verifiableResult) => {
      const result = [];

      verifiableResult.result.map((hash) => {
        result.push({ hash, status: status || "VERIFIABLE" });
      });

      if (!status) {
        this.call('api/v1/search-images', 'POST', {
          status: "VERIFIED",
          page,
          tag: myTag
        }).then((verifiedResult) => {
          verifiedResult.result.map((item) => {
            result.push({ hash: item, status: "VERIFIED" });
          });
        }).catch((err) => console.log(err));
      }
      return result;
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  tags = (start_date, end_date) => {
    return this.call(`/api/v1/stats/overall-tags?start_date=${start_date}&end_date=${end_date}`, 'GET')
      .then(response => {
        const list_of_removed_tags = ['women', 'woman', 'MAN', 'WOMEN', 'WOMAN',
         'a woman', 'asian woman', 'asian women', 'old women', 'Man', 'children', 'child', 'Child', 'anonymization challenge',
          'anonymization bounty', 'biometric', 'PII - faces', 'PII - non faces',
           'Anonymization bounty'];
        for (let i = 0; i < list_of_removed_tags.length; i++) {
          delete response.result[list_of_removed_tags[i]];
        }
        return response.result;
      }).catch(err => {
        return Promise.reject(err);
      });
  }

  queryTags = (id) => {
    return this.call(`api/v1/query-tags`, 'POST', {
      image_ids: [id]
    })
      .then(response => {
        return response.result[0].value;
      }).catch(err => {
        return Promise.reject(err);
      });
  }
}

export default new API();
