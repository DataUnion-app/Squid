import Observer from '@/utils/observer';
import Web3 from 'web3';
import utils from './index';
import { RegisterTokens, GetTokens, RefreshTokens } from './authapi'
class Auth {
    constructor() {
        // core data
        this.auth = {
            accessToken: null,
            refreshToken: null
        };
        this.account = null;
        this.loaded = false;
    }

    /** BEGIN GETTERS **/
    blockies() {
        return utils.blockies(this.account)
    }

    getAccount() {
        return this.account;
    }

    token() {
        return this.auth.accessToken;
    }

    isLoaded() {
        return this.loaded
    }
    /** END GETTERS **/

    // API call
    fetchToken(account) {
        console.log(`fetching token on account = ${account}`)
        return GetTokens(account).then(result => {
            console.log(result)
            const authObj = {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }
            this.authenticate(account, authObj);
        }).catch(err => {
            console.log(err)
            return RegisterTokens(account).then(result => {
                const authObj = {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                }
                this.authenticate(account, authObj);
            })
        })
    }

    clear() {
        const blankAuth = {
            accessToken: null,
            refreshToken: null
        };
        this.authenticate(null, blankAuth);
    }

    // Sets items in localStorage after they're retrieved from API call
    authenticate(account, auth) {
        // set core data
        console.log(auth);
        this.auth = auth;
        this.account = account;
        this.loaded = true;
        
        // set storage
        localStorage.setItem('auth', JSON.stringify(auth));
        localStorage.setItem('account', account);
        Observer.$emit('login', { account: account });
    }

    // API call
    refreshToken() {
        let signalVar = false
        if (this.auth.refreshToken) {
            let existingAccount = true;
            return RefreshTokens(this.auth.refreshToken).then(response => {
                if (response.access_token) {
                    this.auth.accessToken = response.access_token;
                    this.authenticate(this.account, this.auth);
                    return true;
                } else if (response.msg === "Token has expired") {
                    this.fetchToken(this.account, existingAccount).then(res => {
                        signalVar = true
                        return true;
                    });
                }
            })
        }
        if (signalVar == true) {
            return true;
        }
    }

    // Checks if auth data (accessToken, account) already exist in LocalStorage and then brings them into the code.
    checkForAccount() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        const account = localStorage.getItem('account');
        
        console.log(`=== DATA RETRIEVED FROM LOCALSTORAGE: ===`)
        console.log(auth);
        console.log(account);

        if (auth && auth.accessToken && auth.refreshToken && account && account != 'null') {
            this.authenticate(account, auth);
            return true;
        } else {
            return false;
        }
    }

    listenForAccountChange() {
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log(`window.ethereum accountsChanged event triggered. account changed to ${accounts[0]}`);
            if (accounts.length == 0) {
                Observer.$emit(`userLoggedOut`, { account: '' });
            } else if (accounts.length === 1) {
                Observer.$emit(`userSwitchedWallet`, { account: accounts[0] });
            }
        })
    }

    connect() {
        console.log(`CONNECTING TO ETHEREUM API...`);
        return window.ethereum.enable().then(result => {
            console.log(`window.ethereum.enable() SUCCEEDED. RESULT: `);
            console.log(result);
            return result[0]
        }).catch((error) => {
            // User denied account access...
            console.log(`connect denied`);
            console.log(error);

            if (error["code"] === -32002) {
                // TODO: Put something interactive here
                console.log(`YOU HAVE A PENDING WINDOW. PLEASE LOG IN`);
            }

            return Promise.reject();
        });
    }

    login() {
        // ts
        // console.log(`Logging in`);
        if (this.checkForAccount()) {
            // ts
            console.log(`restoring token: ${this.checkForAccount()}`);
            return;
        } else {
            console.log(`restoring token: ${this.checkForAccount()}`);
        }
        // new browsers where window.web3 is gone
        
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
        // Legacy dapp browsers which still use window.web3
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            console.log(`This is not a dApp Browser! Please use our app on a dapp browser.`);
            return Promise.reject();
        }

        try {
            console.log(`[LOGIN FUNCTION] enabling ethereum...`);
            return this.connect().then(account => {
                console.log(`fetching token for ${account}...`)
                return this.fetchToken(account)
            });
        } catch (error) {
            console.log(`rejected login.`);
            // User denied account access...
            return Promise.reject();
        }
    }
}

const auth = new Auth();

export default auth;