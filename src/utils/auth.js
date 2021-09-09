import Observer from '@/utils/observer';
import Web3 from 'web3';
import utils from './index';
import { Register, GetTokens, RefreshTokens } from './authapi'
class Auth {
    constructor() {
        this.auth = {
            loaded: false,
            accessToken: null,
            refreshToken: null
        };
        this.account = null;
    }

    /** BEGIN GETTERS **/
    blockies() {
        return utils.blockies(this.account)
    }

    token() {
        return this.auth.accessToken;
    }

    loaded() {
        return this.auth.loaded;
    }
    /** END GETTERS **/

    // Sets items retrieved from API call
    authenticate(account, auth) {
        this.auth = auth;
        this.account = account;
        localStorage.setItem('auth', JSON.stringify(this.auth));
        localStorage.setItem('account', this.account);
        Observer.$emit('login', { account: this.account });
    }

    // API call
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

    // API call
    restoreToken() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        const account = localStorage.getItem('account');
        if (auth && auth.accessToken && account && account != 'null') {
            this.authenticate(account, auth);
            return true;
        }
        return false;
    }

    // API call
    fetchToken(account) {
        return Register(account).then(nonce => {
            GetTokens(account).then(result => {
                this.authenticate(account, result);
                this.auth.loading = false;
                return result;
            }).catch(err => {
            })
        }).catch(err => {
        })
    }

    login() {
        if (this.restoreToken()) {
            this.auth.loading = false;
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
            this.auth.loading = false;
            return Promise.reject();
        }
        try {
            // Request account access if needed
            return window.ethereum.enable().then(result => {
                window.web3.eth.getAccounts((error, result) => {
                    if (error) {
                        this.auth.loading = false;
                        return Promise.reject();
                    } else {
                        const account = result[0];
                        return this.fetchToken(account);
                    }
                });
            });
        } catch (error) {
            // User denied account access...
            this.auth.loading = false;
            return Promise.reject();
        }
    }
}

const auth = new Auth();

export default auth;