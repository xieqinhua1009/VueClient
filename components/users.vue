<template>
	<view style="margin-top: 2px;">
		<view style="background-color: #0FAEFF88;height: 24px;padding: 4px 0;">
			在线用户数：
			<text style="color: #FF9900;font-weight: bold;">{{totalUser}}</text>
		</view>
		<view class="uni-common-mt">
			<scroll-view :scroll-y="true" scroll-with-animation="true" style="width: 100%; height: 1120rpx;">
				<view v-for="(item,index) in userList" :key="index" style="border-bottom: solid 0.5px #555555;height: 60px;">
					<image src="../static/img/emoji/102.gif" style="left: 10px;top: 10px; width: 50px;height: 50px;">
					</image>
					<view style="margin-left: 70px;margin-top: -30px;">{{item}}</view>
					<view style="margin-left: 260px;margin-top: -22px;color: #007AFF;">积分:{{JFList[index]}}</view>
				</view>
			</scroll-view>
		</view>
	</view>

</template>

<script>
	export default {
		components: {},
		data() {
			return {
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				totalUser: 99999,
				userList: ['用户11111', '用户22222', '用户55555', '用户66666', '用户88888', '用户88888', '用户88888', '用户88888',
					'用户88888', '用户88888', '用户88888'
				],
				JFList: ['123', '345', '999', '666', '444', '338', '88888', '123888',
					'288', '2354', '123488'
				],
				myname: '大佬',
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {

			},
			upper: function(e) {
				console.log(e)
			},
			lower: function(e) {
				console.log(e)
			},
			scroll: function(e) {
				console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			goTop: function(e) {
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop = 0
				});
				uni.showToast({
					icon: "none",
					title: "纵向滚动 scrollTop 值已被修改为 0"
				})
			}
		},
	}
</script>

<style>
	.uni-common-mt {
		color: #00000;
		width: 100%;
		height: 100%;
		text-align: left;
		bottom: 10px;
	}
</style>
