<template>
	<ezpage title="说明">
		<view slot="contentSection">
			<view class="content_about">
				关于此项目：此项目参考，暂时为非完整项目
				<p>路径源地址：	</p>
			</view>
		</view>
	</ezpage>
	
</template>

<script>
	import ezpage from "../../components/ezpage.vue"
	export default {
		components:{
			ezpage
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.content_about{
		background-color: #fff,
		
	}
</style>
