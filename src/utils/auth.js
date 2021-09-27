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

    // Checks if auth data (accessToken, account) already exist
    restoreToken() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        const account = localStorage.getItem('account');
        if (auth && auth.accessToken && account && account != 'null') {
            this.authenticate(account, auth);
            return true;
        }
        return false;
    }

    checkForAccount() {
        console.log(`checking for account`)

        window.ethereum.on('accountsChanged', function (accounts) {
            // ts
            // console.log(`ACCOUNTS CHANGED.`);
            // console.log(accounts);

            if (accounts.length == 0) {
                Observer.$emit(`userLoggedOut`);
            } else {
                Observer.$emit(`userSwitchedWallet`, { account: this.account });
            }
        })

        return window.ethereum.enable().then(result => {
            // ts
            // console.log(`checking if logged in to Metamask externally...`);
            // console.log(result);
            // console.log(`returning ${result[0]}`);
            return result[0]
        }).catch((error) => {
            // User denied account access...
            console.log(`checkforAccount denied`);
            console.log(error);

            if (error["code"] === -32002) {
                // TODO: Put something interactive here
                console.log(`PLEASE LOG IN`);
            }

            this.auth.loading = false;
            return Promise.reject();
        });
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
        console.log(`logging in`);
        if (this.restoreToken()) {
            console.log(`restoring token`);
            this.auth.loading = false;
            return;
        }
        // new browsers where window.web3 is gone
        else if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
        // Legacy dapp browsers which still use window.web3
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            console.log(`This is not a dApp Browser! Please use our app on a dapp browser.`);
            this.auth.loading = false;
            return Promise.reject();
        }

        try {
            console.log(`[LOGIN FUNCTION] enabling ethereum...`);
            // Request account access if needed
            return window.ethereum.enable().then(result => {
                // ts
                console.log(`[LOGIN FUNCTION] checking if logged in`);
                console.log(result);
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