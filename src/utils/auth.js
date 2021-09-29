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

    /** BEGIN LOGIN MANAGEMENT: Logging in, logging out, switching wallet **/
    
    // this function runs when the user switches wallet via the Metamask app.
    switchWallet(account) {
        console.log(`Switching wallet in auth...`);
        const existing = false;                     // assuming the default option.
        const changingWallet = true;
        this.fetchToken(account, existing, changingWallet); 
    }

    logOut() {
        console.log(`logging out in auth...`);
        const blankAuth = {
            accessToken: null,
            refreshToken: null
        };
        this.authenticate(null, blankAuth);
    }

    logOutButton() {
        window.ethereum.logout();
    }
    /** END LOGIN MANAGEMENT **/

    // API call
    fetchToken(account, existing=false, changingWallet=false) {
        if (!existing) {
            return RegisterTokens(account).then(result => {
                console.log(`REGISTER TOKENS result`);
                console.log(result);
                this.auth.accessToken = result.accessToken;
                this.auth.refreshToken = result.refreshToken;
                this.authenticate(this.account, this.auth, changingWallet);
            }).catch(err => {
                console.log(err)
                return GetTokens(account).then(result => {
                    this.auth.accessToken = result.accessToken;
                    this.auth.refreshToken = result.refreshToken;
                    this.authenticate(this.account, this.auth, changingWallet);
                })
            }) 
        } else {
            return GetTokens(account).then(result => {
                this.auth.accessToken = result.accessToken;
                this.auth.refreshToken = result.refreshToken;
                this.authenticate(this.account, this.auth, changingWallet);
            }).catch(err => {
                console.log(err)
                return RegisterTokens(account).then(result => {
                    console.log(`REGISTER TOKENS result`);
                    console.log(result);
                    this.auth.accessToken = result.accessToken;
                    this.auth.refreshToken = result.refreshToken;
                    this.authenticate(this.account, this.auth, changingWallet);
                })
            });
        }
    }

    // Sets items in localStorage after they're retrieved from API call
    authenticate(account, auth, changingWallet=false) {
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
        if (changingWallet) {
            Observer.$emit("blockiesChanged");
        }
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
            console.log(`window.ethereum accountsChanged event triggered. account changed to ${accounts[0]}`);
            if (accounts.length == 0) {
                Observer.$emit(`userLoggedOut`, { account: '' });
            } else if (accounts.length === 1) {
                Observer.$emit(`userSwitchedWallet`, { account: accounts[0] });
            }
        })

        return window.ethereum.enable().then(result => {
            return result[0]
        }).catch((error) => {
            // User denied account access...
            console.log(`checkforAccount denied`);
            console.log(error);

            if (error["code"] === -32002) {
                // TODO: Put something interactive here
                console.log(`YOU HAVE A PENDING WINDOW. PLEASE LOG IN`);
            }

            this.auth.loading = false;
            return Promise.reject();
        });
    }

    login() {
        // ts
        console.log(`Logging in`);
        if (this.restoreToken()) {
            // ts
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
                // console.log(`[LOGIN FUNCTION] checking if logged in`);
                // console.log(result);
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

    connect() {
        window.ethereum.request({ method: 'eth_requestAccounts' })
    }
}

const auth = new Auth();

export default auth;