<template>
	<ezpage :navigationHasBottomLine="false">
		
		<view slot="contentSection">
			<view @click="updateUserProfile" style="text-align: center;background-color: #fff;padding-bottom: 20px;">
				<uni-notice-bar  showIcon="true" text="这是 NoticeBar 通告栏"></uni-notice-bar>
				<image
					:src="userInfo.avatarUrl"
					mode="widthFix"
					style="width:100px;height:100px;border-radius: 50px;border: #00e5e5 1px solid; "
				></image>
				<view>{{ userInfo.nickName }}<uni-icons style="background-color: pink;" type="heart" size="20"/></view>
				<view><text class="dnms-tag" style="background-color: #3aa64e;">同步微信信息</text></view>
			</view>
			<view style="padding: 10px;">
				<view @click="btnCreateBookShelf" class="dnms-blockbutton" style="margin-bottom: 10px; background-color: #2979ff;"><uni-icons type="folder-add-filled" size="20"></uni-icons>新建书房</view>
				<view v-for="item in bookshelfs" style="margin-bottom: 10px;">
					<bookshelfcell @removeHandler="onRemoveHandler" :data="item"></bookshelfcell>
				</view>
			</view>
		</view>
	</ezpage>
</template>

<script>
import loginUser from '../../common/currentUser.js';
import cloudApi from '../../common/cloudApi.js';

import ezpage from '../../components/ezpage.vue';
import bookshelfcell from '../../components/dnms-ui/bookshelfcell.vue';

export default {
	components: {
		ezpage,
		bookshelfcell
	},
	data() {
		return {
			userInfo: {},
			bookshelfs: []
		};
	},
	async onLoad(options) {
		//登录获取用户信息
		// uni.login({
		// 	provider: 'weixin',
		// 	success: res => {
		// 		var code = res.code;
		// 		// console.log('res.code:' + res.code);
		// 		cloudApi.call({
		// 			name: 'login',
		// 			data: {
		// 				code: code
		// 			},
		// 			success: res => {
		// 				// console.log(res);
		// 				this.userInfo = res.result;
		// 				this.getBookshelfs();
		// 			},
		// 			fail: err => {
		// 				console.log('login-err:' + err);
		// 			}
		// 		});
		// 	}
		// });
		this.userInfo = await loginUser.login();
		this.getBookshelfs();
		if (options.scene) {
			this.getBookshelfs();
			var scene = unescape(options.scene);
			var params = scene.split('=');
			var key = params[0];

			uni.navigateTo({
				url: '../bookshelf/bookshelf?id=' + params[1]
			});
		}
	},
	onShow() {
		if (this.userInfo) {
			console.log('页面展示 getBookshelfs');
			this.getBookshelfs();
		}
	},
	methods: {
		btnCreateBookShelf() {
			uni.navigateTo({
				url: '../createbookshelf/createbookshelf'
			});
		},
		updateUserProfile() {
			uni.getUserProfile({
				desc: '用于完善会员资料',
				success: res => {
					this.userInfo = Object.assign(this.userInfo, res.userInfo);
					loginUser.updateuserinfo(this.userInfo);
					// cloudApi.call({
					// 	name: 'updateuserinfo',
					// 	data: {
					// 		userInfo: this.userInfo
					// 	},
					// 	fail: err => {
					// 		console.log('login-err:' + err);
					// 	}
					// });
				}
			});
		},
		onRemoveHandler() {
			console.log('已删除，刷新当前界面');
			this.getBookshelfs();
		},
		getBookshelfs() {
			cloudApi.call({
				name: 'bookshelfs',
				data: {
					action: 'listmy'
				},
				success: res => {
					console.log(res);
					this.bookshelfs = res.result;
				}
			});
		}
	}
};
</script>

<style></style>
