<template>
    <vs-dialog 
        v-on:close="handleClose"
    >
        <template #header>
            <h1 class="text-3xl not-margin">Wallet Options</h1>
        </template>
        
        <div>
            <button>Connect Wallet</button>
            <button>Download Metamask</button>
        </div>
    </vs-dialog>
</template>

<style>

</style>

<script>
export default {
    name: "CMetamaskPopup",
    props: {},
    data() {
        return {

        }
    },
    methods: {
        handleClose() {

        },
        mounted() {
            console.log(`CMetamaskPopup MOUNTED`);
        }
    }
}
</script>