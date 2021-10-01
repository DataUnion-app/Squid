<template>
    <vs-dialog 
        class="overwrite"
        v-model="display"
        v-on:close="handleClose"
    >
        <template #header>
            <h1 class="text-3xl not-margin">Wallet Options</h1>
        </template>
        
        <div v-if="!loggedIn" class="wallet-content">
            <button @click="connectWallet">Connect Wallet</button>
            <button @click="redirectToDownload">Download Metamask</button>
        </div>
        
        <div v-else-if="loggedIn" class="wallet-content">
            <p><i>Logged in as {{ account }}. Please log out through Metamask</i></p>
        </div>

        <div v-else class="smt-spinner-circle">
            <div class="smt-spinner"></div>
        </div>
    </vs-dialog>
</template>

<style>  

.overwrite {
    position: auto !important;
    background: none !important;
    width: auto !important;
    padding: 0 !important;
  }

  .overwrite .vs-dialog {
    background-color: RGB(244, 247, 248) !important;
    margin-bottom: none !important;
    border-radius: 0px !important;
    min-width: 255px !important;
    max-width: 255px !important;        /* var(--sidebar-width) */
    opacity: 55%;
    margin: none !important;
    top: 30% !important;
    left: 5px !important;
  }

  .overwrite .vs-dialog .vs-dialog-content {
    top: 30% !important;
    left: 5px !important;
  }

  .overwrite .vs-dialog .vs-dialog__header {
    padding: 2% !important;
    text-align: center;
  }

  .overwrite .vs-dialog .vs-dialog__content {
    padding: 0px !important;
    margin-bottom: 0px !important;
    top: 30% !important;
    left: 5px !important;
  }

  .wallet-content {
    display: grid;
    padding: 2%;
  }

  .wallet-content button {
    color: blueviolet;
  }
</style>

<script>
import Auth from "@/utils/auth";
import Observer from "@/utils/observer";

export default {
    name: "CMetamaskPopup",
    props: {
        display: Boolean,
        // loggedIn: Boolean
    },
    data() {
        return {
            loggedIn: false,
            account: ''
        }
    },
    watch: {
        // TS
        loggedIn(n, o) {
            console.log(`LOGGED IN CHANGED`)
            console.log(n);
        },
        account(n, o) {
            console.log(`ACCOUNT CHANGED`)
            console.log(n)
        }
    },
    methods: {
        setLoggedIn(newVal) {
            this.loggedIn = newVal;
        },
        setAccount(account) {
            this.account = account;
        },
        handleClose() {
            this.$emit(`closedMetamaskPopup`);
        },
        connectWallet() {
            Auth.connect();
        },
        redirectToDownload() {

        },
    },
    mounted() {
        if (Auth.getAccount() !== '' && Auth.getAccount() !== null) {
            this.account = Auth.getAccount();
            this.setLoggedIn(true);
        } 
        Observer.$on("login", ({ account }) => {
            console.log(`[METAMASK POPUP] login triggered`);
            console.log(`login account = ${account}`);
            this.setLoggedIn(true);
            this.setAccount(account);
        })
    }
}
</script>