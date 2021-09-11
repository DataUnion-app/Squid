<template>
        <div class="smt-spinner-circle loading-grid">
            <div class="smt-spinner"></div>
            <p>{{ message }}</p>
        </div>
</template>

<style>
    .loading-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 50px;
    }

    .loading-grid p {
        text-align: center;
    }
</style>

<script>
export default {
    name: "CLoader",
    props: {
        message: String
    },
    data() {
        return {};
    }
}
</script>