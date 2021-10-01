import { BASE_URL } from './api';
import Web3 from 'web3';

export const Sign = async (nonce, accountId) => {
    return new Promise((resolve, reject) => {
        const web3 = new Web3(Web3.givenProvider || `ws://${BASE_URL}`);
        web3.eth.personal.sign(
            web3.utils.utf8ToHex(nonce),
            accountId,
            '',
            (err, signed) => {
                if (err) return reject(err)
                return resolve({ accountId, signed })
            }
        )
    })

}

export const Login = async (accountId, signature) => {
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

/*************************/
/***** NONCE GETTERS *****/
/*************************/

// Which nonce-getter you use depends on whether the accountId is already in the database 
    // if accountId is already in the db, we use GetNonce
    // if it isn't, we use Register

export const GetNonce = async (accountId) => {
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

/******************************************************************************/
/***** TWO FUNCTIONS TO RETRIEVE AUTHENTICATION TOKENS FROM THE BACK-END. *****/
/******************************************************************************/
export const GetTokens = async (accountId) => {
    console.log(`[authapi.js] running GetTokens on ${accountId}`);
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

export const RegisterTokens = async (accountId) => {
    console.log(`[authapi.js] running RegisterTokens`);
    return new Promise((resolve, reject) => {
        Register(accountId).then(nonceNumber => {
            if (nonceNumber !== 0) {
                const nonce = nonceNumber.toString()
                Sign(nonce, accountId).then(signObject => {
                    console.log(signObject)
                    const signObjectString = JSON.stringify(signObject)
                    const signObjectJson = JSON.parse(signObjectString)
                    const signature = signObjectJson["signed"]
                    console.log(`signature = ${signature}`);

                    Login(accountId, signature).then((tokens) => {
                        if (tokens.accessToken !== undefined && tokens.refreshToken !== undefined) {
                            return resolve(tokens)
                        }
                        else {
                            return reject(`Signature invalid.`)
                        }
                        
                    }).catch((err) => {
                        console.log(`[auth.ts] RegisterTokens error = ${err}`)
                        return reject(err)
                    })
                })
            } else {
                return reject(`nonce === 0. Try another login method.`)
            }
        })
    })
}

/****************************************/
/****** FUNCTION TO REFRESH TOKENS ******/
/****************************************/
export const RefreshTokens = async (refreshToken) => {
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