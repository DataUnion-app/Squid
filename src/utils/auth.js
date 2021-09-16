import Observer from '@/utils/observer';
import Web3 from 'web3';
import utils from './index';
import { Register, GetTokens, RefreshTokens } from './authapi'
class Auth {
    constructor() {
        // core data
        this.auth = {
            accessToken: null,
            refreshToken: null
        };
        this.account = null;

        // app signals
        this.isLoading = false;
        this.isLoaded = false;
    }

    /** BEGIN GETTERS **/
    blockies() {
        return utils.blockies(this.account)
    }

    token() {
        return this.auth.accessToken;
    }

    loaded() {
        return this.isLoaded;
    }

    loading() {
        return this.isLoading;
    }
    /** END GETTERS **/

    // Sets items retrieved from API call
    authenticate(account, auth) {
        // set core data
        this.auth = auth;
        this.account = account;

        // set signals
        this.isLoaded = true;
        this.isLoading = false;
        
        // set storage
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

    // execute=false by default, because otherwise it will run infinitely.
    checkIfLoggedIn() {
        console.log(`executing checkIfLoggedIn`);
        try { 
            return window.ethereum.enable().then(result => {
                window.web3.eth.getAccounts((error, result) => {
                    if (error) {
                        this.auth.loading = false;
                        return Promise.reject();
                    } else {
                        const account = result[0];
                        return this.fetchToken(account);
                    }
                })
            }) 
        } catch {
            return Promise.reject();
        }
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