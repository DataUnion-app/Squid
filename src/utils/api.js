// export const BASE_URL = 'http://206.81.26.71:8081';
export const BASE_URL = 'https://alpha.dataunion.app:4430';
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

    const timestamp = (new Date()).getTime();
    // if (this.requests.length == 0) {
    //   this.loader = VM.$vs.loading({
    //     type: 'scale'
    //   });
    // }
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

  imageTag = (id, tagType) => {
    return this.call(`api/v1/metadata/query`, 'POST', {
      image_ids: id,
      annotations: [tagType] //['BoundingBox', 'GeoLocation']
    })
      .then(response => {
        return response.result[tagType];
      }).catch(err => {
        return Promise.reject(err);
      });
  }



  myImages = async ({
    page
  }) => {
    // TODO: Remove mockup data 
    // return Promise.resolve([{
    //     hash: "00fcff53017cf800"
    //   },
    //   {
    //     hash: "3f3f0000027fffff"
    //   },
    //   {
    //     hash: "7efdfffff6eeff3f"
    //   },
    //   {
    //     hash: "d7fe3e1014787c70"
    //   },
    //   {
    //     hash: "f8ec5e7c3c1c1810"
    //   },
    //   {
    //     hash: "fd980018141899ff"
    //   },
    //   {
    //     hash: "fff1c0808081c1fb"
    //   },
    //   {
    //     hash: "fffff9800181dbff"
    //   }
    // ]);
    return this.call(`api/v1/my-images?page=${page}`, 'GET')
      .then(async response => {
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
        return result;
      }).catch(err => {
        return Promise.reject(err);
      });
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
    page = page || 1;
    let real_page = page;
    page = Math.floor(real_page / 5) + 1;
    const callBothStatuses = status ? false : true      // if status has been passed as a parameter, we don't call both statuses. statuses are 'VERIFIED' and 'VERIFIABLE'
    const myTag = tag?.toString().split(' - ')[0];
    // console.log('myTag ', myTag);

    if (callBothStatuses) {
      status = 'VERIFIABLE'
      return this.call('api/v1/search-images', 'POST', {
        status,
        page,
        tag: myTag
      })
        .then(async verifiableResponse => {
          status = 'VERIFIED'
          return this.call('api/v1/search-images', 'POST', {
            status,
            page,
            tag: myTag
          }).then(verifiedResponse => {
            const result = [];
            if (verifiableResponse.result.length === 0 && verifiedResponse.result.length === 0)
              return result;

            let i;
            if (real_page % 5 != 0) {
              for (i = (real_page - 1) % 5 * 20; i < real_page % 5 * 20; i++) {
                const hash1 = verifiableResponse.result[i];
                const hash2 = verifiedResponse.result[i]
                if (hash1 == undefined && hash2 == undefined) break;
                if (hash1) result.push({ hash: hash1, status: 'VERIFIABLE' });
                if (hash2) result.push({ hash: hash2, status: 'VERIFIED' });
              }
            }
            else {
              const longest = verifiableResponse.result.length > verifiedResponse.length ? verifiableResponse.result.length : verifiedResponse.result.length
              for (i = 80; i < longest; i++) {
                const hash1 = verifiableResponse.result[i];
                const hash2 = verifiedResponse.result[i];
                if (hash1 == undefined && hash2 == undefined) break;
                if (hash1) result.push({ hash: hash1, status: 'VERIFIABLE' });
                if (hash2) result.push({ hash: hash2, status: 'VERIFIED' });
              }
            }
            return result;
          }).catch(err => {
            return Promise.reject(err);
          });
        })
    }

    else {
      status = status || 'VERIFIABLE';
      return this.call('api/v1/search-images', 'POST', {
        status,
        page,
        tag: myTag
      })
        .then(async verifiableResponse => {
          const result = [];
          if (verifiableResponse.result.length === 0)
            // TODO: Set "no VERIFIED results here."
            // 
            return result;
          let i;
          if (real_page % 5 != 0) {
            for (i = (real_page - 1) % 5 * 20; i < real_page % 5 * 20; i++) {
              const hash = verifiableResponse.result[i];
              if (hash == undefined) break;
              const photo = {
                hash
              };
              result.push(photo);
            }
          }
          else {
            for (i = 80; i < verifiableResponse.result.length; i++) {
              const hash = verifiableResponse.result[i];
              if (hash == undefined) break;
              const photo = {
                hash
              };
              result.push(photo);
            }
          }
          return result;
        }).catch(err => {
          return Promise.reject(err);
        });
    }

  }

  tags = (start_date, end_date) => {
    return this.call(`/api/v1/stats/overall-tags?start_date=${start_date}&end_date=${end_date}`, 'GET')
      .then(response => {
        // console.log('tags: ', response.result);
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