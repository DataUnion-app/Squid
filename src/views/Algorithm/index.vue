<template>
	<div class="algorithm-body">
		<CHeader title="Algorithm" />
		<CPopMenu :flag="1" />
		<div class="article-body">
			<CArticleCard
				v-for="articleOne in articleData"
				:key="articleOne.hash"
				:articleData="articleOne"
			/>
		</div>
	</div>
</template>

<style>
	@media (min-width: 1500px) {
		.article-body {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
	@media (max-width: 1500px) {
		.article-body {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media (max-width: 1000px) {
		.article-body {
			grid-template-columns: 1fr;
		}
	}
	.algorithm-body {
		background-color: black;
	}

	.article-body {
		display: grid;
		justify-content: stretch;
		padding: 2rem;
	}
</style>

<script>
	import { mapState, mapActions } from "vuex";
	import API from "@/utils/api";
	import { articleData } from "./mockdata";

	export default {
		name: "Algorithm",
		components: {},
		computed: {},
		methods: {},
		data() {
			return {
				articleData: articleData,
			};
		},
		watch: {},
		mounted() {},
	};
</script>
