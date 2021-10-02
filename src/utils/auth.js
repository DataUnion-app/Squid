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
            if (err["code"] === 4001) {         // user cancelled
                return null;
            }
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
        // console.log(`CONNECTING TO ETHEREUM API...`);
        return new Promise((resolve, reject) => {
            window.ethereum.enable().then(result => {
                window.web3.eth.getAccounts((error, result) => {
                    if (error) {
                        console.log(error);
                        this.auth.loading = false;
                        reject();
                    } else {
                        const account = result[0];
                        resolve(account);
                    }
                });
            }).catch((error) => {
                // User denied account access...
                console.log(`connect denied`);
                console.log(error);
    
                if (error["code"] === -32002) {
                    // TODO: Put something interactive here
                    reject(`YOU HAVE A PENDING WINDOW. PLEASE LOG IN`);
                }

                if (error["code"] === 4001) {
                    reject(`YOU CANCELLED THE WINDOW.`);
                }
    
               
            });
        }) 
    }

    login() {
        // First, checks if there's an account already logged in. If yes, it ends the function instantly.
        // otherwise, if there's no account already logged in, we .connect()
        if (this.checkForAccount()) {
            this.loaded = false;
            return;
        } else {
            try {
                console.log(`[LOGIN FUNCTION] enabling ethereum...`);
                return this.connect().then(account => {
                    console.log(`fetching token for ${account}...`);
                    return this.fetchToken(account);
                }).catch(err => {
                    return Promise.reject()
                });
            } catch (error) {
                this.loaded = false;
                return Promise.reject(error);
            }
        }
    }

    // We need to set web3 variables before we do anything else. See main.js.
    setWeb3() {
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
    }
}

const auth = new Auth();

export default auth;