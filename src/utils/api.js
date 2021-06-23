export const BASE_URL = 'http://206.81.26.71:8081';
// export const BASE_URL = 'https://alpha.dataunion.app:4430';
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
    if (this.requests.length == 0) {
      this.loader = VM.$vs.loading({type: 'scale'});
    }
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
      if (this.requests.length == 0) {
        this.loader.close();
        this.loader = null;
      }
    });
  }

  thumbnail = async(id) => {
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

  myImages = async() => {
    // TODO: Remove mockup data
    return Promise.resolve([
      {hash: "002008000890109c"},
      {hash: "0280001b0420a111"},
      {hash: "7efdfffff6eeff3f"},
      {hash: "d7fe3e1014787c70"},
      {hash: "f8ec5e7c3c1c1810"},
      {hash: "fd980018141899ff"},
      {hash: "fff1c0808081c1fb"},
      {hash: "fffff9800181dbff"}
    ]);
    return this.call('api/v1/my-images', 'GET')
    .then(async response => {
      const result = [];
      for(let i = 0; i < response.result.length; i++) {
        const hash = response.result[i].hash;
        const photo = { hash };
        result.push(photo);
      }
      return result;
    }).catch(err => {
      return Promise.reject(err);
    });
  }

  addComment = async({id, comment}) => {
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
  
  comments = async(id) => {
    const comments = JSON.parse(localStorage.getItem('comments'));
    if (!comments) {
      return [];
    }
    return comments[id] || [];
  }

  photos = async({status, tag, page}) => {
    if (!tag) {
      return Promise.resolve([]);
    }
    page = page || 1;
    status = status || 'VERIFIABLE';
    return this.call('api/v1/search-images', 'POST', {status, page, tag})
    .then(async response => {
      const result = [];
      for(let i = 0; i < response.result.length; i++) {
        const hash = response.result[i];
        const photo = { hash };
        result.push(photo);
      }
      return result;
    }).catch(err => {
      return Promise.reject(err);
    });
  }
  
  tags = (type) => {
    // return Promise.resolve([
    //   'food bounty'
    // ]);
    type = type || 'RECOMMENDED_WORDS';
    return this.call(`staticdata/tags?type=${type}`, 'GET')
    .then(response => {
      response.result.unshift('food bounty');
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