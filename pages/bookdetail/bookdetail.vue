<template>
	<ezpage title="图书详情">
		<!-- <view slot="navigationSection">
			
		</view> -->
		<view slot="contentSection">
			<view class="content_center">
				
				<view
					style="margin-top: 30rpx; font-size: 16px;padding:5px 0px;width:500rpx;text-overflow: ellipsis;white-space: wrap;"
				>
				<text>书名：</text>
				<text style="font-size: 14px;color:#666;width:100%; background-color: #FF5A5F;">{{ bookInfo.title }}</text>
				
				</view>
				<image :src="bookInfo.cover_url" mode="widthFix" style="width:150px; margin-top: 50rpx; box-shadow: 5px 5px 5px #888888;"></image>
				<view style="margin-top: 30rpx; font-size: 16px;padding:5px 0px;width:500rpx;text-overflow: ellipsis;white-space: wrap;">
				<text>简介：</text>
				<text style=" font-size: 14px;color:#666;width:100%; background-color: #FF5A5F;">{{ bookInfo.abstract }}</text>
				</view>
			</view>
		</view>
		<!-- <view slot="tabSection">
			
		</view> -->
	</ezpage>
</template>

<script>
import ezpage from '../../components/ezpage.vue';
import cloudApi from '../../common/cloudApi.js';

export default {
	components: {
		ezpage
	},
	data() {
		return {
			bookInfo: null
		};
	},
	onLoad(options) {
		this.requestBookDetail(options.isbn);
	},
	methods: {
		requestBookDetail(isbn) {
			cloudApi.call({
				name: 'books',
				data: {
					action: 'get',
					isbn: isbn
				},
				success: res => {
					this.bookInfo = res.result;
				}
			});
		}
	}
};
</script>

<style>
.content_center {
	position: absolute;
	margin: auto;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 500rpx;
	height: 800rpx;
	text-align: center;
	background-color: #fff;
	border: 2rpx pink solid;
	/* box-shadow: 5px 5px 5px #888888; */
}
</style>
