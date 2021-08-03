<template>
	<div class="article-card-container">
		<div class="article-card-wrapper">
			<div class="article-type-detail">
				<div class="type-detail-icon"><i class="bx bx-down-arrow-alt" /></div>
				<div class="type-detail-text">{{ articleData.typeDetail }}</div>
			</div>
			<div class="article-card-header">
				<div class="article-header-symbol">{{ articleData.symbol }}</div>
				<div class="article-header-title">
					{{ articleData.title }}
				</div>
				<div class="article-header-publishier">
					{{ articleData.publishier }}
				</div>
			</div>
			<div class="article-card-content">
				{{ articleData.content }}
			</div>
			<div class="article-card-footer">
				<div class="article-footer-price">
					<div class="article-price-value">{{ articleData.price }}</div>
					<div class="article-price-ocean">OCEAN</div>
					<div class="article-price-pool">POOL</div>
				</div>
				<div class="article-footer-network">
					<img src="@/assets/networkicon.svg" class="filter-color" />{{
						articleData.network
					}}
				</div>
			</div>
		</div>
	</div>
</template>

<style>
	.article-card-container {
		margin: 1rem;
		display: flex;
		cursor: pointer;
	}

	.article-card-container:hover {
		transform: translate(0, -2px);
		transition: all ease 0.5s;
	}

	.article-card-wrapper {
		background-color: #141414;
		border: 1px solid #303030;
		border-radius: 5px;
		padding: 2rem;
		position: relative;
	}

	.article-type-detail {
		position: absolute;
		top: 0.7rem;
		right: 0.7rem;
		display: flex;
	}

	.type-detail-icon {
		color: #8b98a9;
		font-size: 0.7rem;
		padding-right: 0.5rem;
		transform: scale(150%);
	}

	.type-detail-text {
		color: #8b98a9;
		font-size: 0.7rem;
		border-left: 1px solid #3b3839;
		padding-left: 0.5rem;
	}

	.article-card-header {
		display: block;
	}

	.article-header-symbol {
		font-size: 0.8rem;
		color: #8b98a9;
	}

	.article-header-title {
		font-size: 1.2rem;
		color: white;
		font-weight: 600;
	}

	.article-header-publishier {
		color: #8b98a9;
	}

	.article-card-content {
		font-size: 0.85rem;
		color: #8b98a9;
		padding: 1rem 0;
	}

	.article-card-footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}

	.article-footer-price {
		display: flex;
		align-items: center;
	}

	.article-price-value {
		color: white;
		font-weight: 600;
	}

	.article-price-ocean {
		font-size: 0.85rem;
		color: #8b98a9;
		margin: 0 0.5rem;
	}

	.article-price-pool {
		background-color: #8b98a9;
		border-radius: 5px;
		color: white;
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0 4px;
	}

	.article-footer-network {
		font-size: 0.6rem;
		color: #8b98a9;
		position: absolute;
		bottom: 0.7rem;
		right: 0.7rem;
		display: flex;
	}
	.filter-color {
		height: 15px;
		padding-right: 5px;
		filter: invert(100%) sepia(0%) saturate(7443%) hue-rotate(198deg)
			brightness(50%) contrast(112%);
	}
</style>

<script>
	export default {
		name: "Algorithm",
		props: {
			articleData: {
				type: Object,
				required: true,
			},
		},
		components: {},
		computed: {},
		methods: {},
		data() {
			return {};
		},
		watch: {},
		mounted() {},
	};
</script>
