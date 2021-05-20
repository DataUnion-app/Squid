import {Observer} from 'common/vm';
import {BASE_URL} from './api';
const blockies = require('ethereum-blockies-png')

class Auth {
    constructor() {
        this.auth = {
            accessToken: null,
            refreshToken: null
        };
        this.account = null;
        this.loaded = false;
    }

    setAuth(auth) {
        this.auth = auth;
        localStorage.setItem('auth', JSON.stringify(this.auth));
        localStorage.setItem('account', this.account);
        Observer.$emit('login', {account: this.account, blockies: this.blockies()});
    }

    blockies() {
        return blockies.createDataURL({ seed: this.account })
    }

    token() {
        return this.auth.accessToken;
    }

    refreshToken() {
        if (this.auth.refreshToken) {
            return RefreshTokens(this.auth.refreshToken).then(response => {
                if (response.access_token) {
                    this.auth.accessToken = response.access_token;
                    this.setAuth(this.auth);
                    return true;
                }
                return false;
            })
        }
        return false;
    }

    restoreToken() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        this.account = localStorage.getItem('account');
        if (auth && auth.accessToken && this.account && this.account != 'null') {
            this.setAuth(auth);
            return true;
        }
        return false;
    }

    fetchToken(account, isRefresh) {
        this.loaded = true;
        if (!isRefresh && this.restoreToken()) {
            return;
        }
        return Register(account).then(nonce => {
            GetTokens(account).then(result => {
                this.account = account;
                this.setAuth(result);
                return result;
            }).catch(err => {
            })
        }).catch(err => {
        })
    }

    login(isRefresh) {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            this.loaded = true;
            return Promise.reject();
        }
        try {
            // Request account access if needed
            return window.ethereum.enable().then(result => {
                web3.eth.getAccounts((error,result) => {
                if (error) {
                    this.loaded = true;
                    return Promise.reject();
                } else {
                    const account = result[0];
                    return this.fetchToken(account, isRefresh);
                }
                });
            });
        } catch (error) {
            // User denied account access...
            this.loaded = true;
            return Promise.reject();
        }
    }

    authenticate(accountId, isRefresh) {
        window.addEventListener("load", () => {
            // Modern dapp browsers...
            this.login(isRefresh);
        });
    }
}

const auth = new Auth();

export const Register = async (accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const obj = {
        "public_address": accountId
    }
    const addressObject = JSON.stringify(obj)
  
    const nonceRequest = await fetch(
        `${BASE_URL}/register`, {
          method: 'POST',
          headers: myHeaders,
          body: addressObject,
          redirect: 'follow'
      })
  
    const jsonResult = await nonceRequest.json()
    if (jsonResult["status"] != "failed") {
        const nonce = jsonResult["nonce"]
        return nonce
    }
    else {
        // console.log(`[auth.ts] Register ERROR\njsonResult = ${jsonResult["message"]}`)
        return 0
    }
  }
  
  
  export const Sign = async(nonce, accountId) => {
  
    return new Promise((resolve, reject) => { 
        const web3 = new Web3(Web3.givenProvider || `ws://${BASE_URL}`);
        web3.eth.personal.sign(
            web3.utils.utf8ToHex(nonce), 
            accountId,
            '',
            (err, signed) => {
                if (err) return reject(err)
                return resolve({accountId, signed})
            }
        ) 
    })
    
  }
  
  export const Login = async(accountId, signature) => {    
    const obj = {
      "public_address": accountId,
      "signature": signature
    }
  
    const loginObject = JSON.stringify(obj)
  
    const loginResult = await fetch(
        `${BASE_URL}/login`, 
        {
            method: 'POST',
            body: loginObject 
        })
  
    const jsonResult = await loginResult.json()
    const accessToken = jsonResult["access_token"]
    const refreshToken = jsonResult["refresh_token"]
    
    const tokens = { 
        accessToken: accessToken, 
        refreshToken: refreshToken
    }
  
    return tokens
  }
  
  
  export const GetNonce = async(accountId) => {
    const nonceRequest = await fetch(
        `${BASE_URL}/get-nonce?public_address=${accountId}`,
        {
            method: 'GET',
        }
    )
      
    const nonce = await nonceRequest.json()
    // console.log(`[Auth.ts] GetNonce nonce = ${nonce}`)
    return nonce
  }
  
  
  export const GetTokens = async(accountId) => {
    return new Promise((resolve, reject) => {
        GetNonce(accountId).then(nonceObject => {
            if (nonceObject["status"] != "not found") {
                const nonce = nonceObject["nonce"].toString()
                Sign(nonce, accountId).then(signObject => {
                
                    const signObjectString = JSON.stringify(signObject)
                    const signObjectJson = JSON.parse(signObjectString)
                    const signature = signObjectJson["signed"]
    
                    Login(accountId, signature).then((tokens) => {
                        resolve(tokens)
                    }).catch((err) => {
                        console.log(`[auth.ts] Login error = ${err}`)
                        return reject(err)
                    })
                }).catch((err) => {
                    console.log(`[Auth.ts] Sign ERROR = ${err}`)
                    return reject()
                })
            } else {
                console.log(`[auth.ts] GetNonce request: ${nonceObject["status"]}. Please register.`)
                return reject()
            }
        }).catch((err) => {
            console.log(`[auth.ts] GetNonce request ERROR = ${err}`)
            return reject()
        })
    })
  }
  
  
  export const RegisterTokens = async(accountId) => {
    return new Promise((resolve, reject) => {
        Register(accountId).then(nonceNumber => {
            const nonce = nonceNumber.toString() 
            Sign(nonce, accountId).then(signObject => {
            
                const signObjectString = JSON.stringify(signObject)
                const signObjectJson = JSON.parse(signObjectString)
                const signature = signObjectJson["signed"]
  
                Login(accountId, signature).then((tokens) => {
                    resolve(tokens)
                }).catch((err) => {
                    console.log(`[auth.ts] RegisterTokens error = ${err}`)
                    return reject(err)
                })
            })
        })
    })
  }
  
  
  export const RefreshTokens = async(refreshToken) => {
    const refreshHeaders = new Headers()
    refreshHeaders.append("Authorization", `Bearer ${refreshToken}`)
  
    const refreshResult = await fetch(
        `${BASE_URL}/refresh`, 
        {
            method: 'POST',
            headers: refreshHeaders
        })
  
    const jsonResult = await refreshResult.json()
    return jsonResult
  }

  export default auth;