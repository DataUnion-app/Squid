import Observer from '@/utils/observer';
import {BASE_URL} from './api';
import Web3 from 'web3';
import utils from './index';

class Auth {
    constructor() {
        this.auth = {
            accessToken: null,
            refreshToken: null
        };
        this.account = null;
    }

    authenticate(account, auth) {
        this.auth = auth;
        this.account = account;
        localStorage.setItem('auth', JSON.stringify(this.auth));
        localStorage.setItem('account', this.account);
        Observer.$emit('login', {account: this.account});
    }

    blockies() {
        return utils.blockies(this.account)
    }

    token() {
        return this.auth.accessToken;
    }

    refreshToken() {
        if (this.auth.refreshToken) {
            return RefreshTokens(this.auth.refreshToken).then(response => {
                if (response.access_token) {
                    this.auth.accessToken = response.access_token;
                    this.authenticate(this.account, this.auth);
                    return true;
                }
                return false;
            })
        }
        return false;
    }

    restoreToken() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        const account = localStorage.getItem('account');
        if (auth && auth.accessToken && account && account != 'null') {
            this.authenticate(account, auth);
            return true;
        }
        return false;
    }

    fetchToken(account) {
        return Register(account).then(nonce => {
            GetTokens(account).then(result => {
                this.authenticate(account, result);
                return result;
            }).catch(err => {
            })
        }).catch(err => {
        })
    }

    login() {
        if (this.restoreToken()) {
            return;
        }
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            return Promise.reject();
        }
        try {
            // Request account access if needed
            return window.ethereum.enable().then(result => {
                window.web3.eth.getAccounts((error,result) => {
                if (error) {
                    return Promise.reject();
                } else {
                    const account = result[0];
                    return this.fetchToken(account);
                }
                });
            });
        } catch (error) {
            // User denied account access...
            return Promise.reject();
        }
    }
}

const auth = new Auth();

export const Register = async (accountId) => {
    console.log("register");
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const obj = {
        "public_address": accountId
    }
    const addressObject = JSON.stringify(obj)
    console.log(accountId);
    console.log("before register");
    const nonceRequest = await fetch(
        `${BASE_URL}/register`, {
          method: 'POST',
          headers: myHeaders,
          body: addressObject,
          redirect: 'follow'
      })

    console.log("after register");
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