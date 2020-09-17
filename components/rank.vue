<template>
	<view style="margin-top: 2px;">
		<view style="background-color: #0FAEFF88;height: 28px;padding: 5px 1;">
			<text style="color: #303133;padding-left: 12px;">名次</text>
			<text style="color: #303133;padding-left: 60px;">昵称</text>
			<text style="color: #303133;padding-left:130px;">总积分</text>
		</view>
		<view class="uni-common-mt">
			<scroll-view :scroll-y="true" scroll-with-animation="true" style="width: 100%; height: 1120rpx;">
				<view v-for="(item,index) in userList" :key="index" style="border-bottom: solid 0.5px #555555;height: 60px;">
					<view v-if="index<3" class="Redcircle">
						<view class="textbox" style="text-align: center; padding: 7px;">
							{{index+1}}
						</view>
					</view>
					<view v-else class="Bluecircle">
						<view class="textbox" style="text-align: center; padding: 7px;">
							{{index+1}}
						</view>
					</view>
					<view style="margin-left: 70px;margin-top: -30px; text-align: center; width: 200upx;">{{item}}</view>
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
				userList: [
				],
				JFList: [
				],
				myname: '大佬',
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				let data2 = JSON.stringify({rankType: 1})
				console.log("获取排行榜数据")
				this.$myRequest({
				    url: getApp().globalData.pageIndex.rank,
				    data: data2,
					method:"POST",
				}).then(res=>{
					console.log(res)
					if(res.data.code == '0')
					{
						this.$data.JFList =[]
						this.$data.userList = []
						for (let i = 0; i < res.data.data.lists.length; i++) {
							let item = res.data.data.lists[i]
							this.$data.JFList.push(item['score'])
							this.$data.userList.push(item['name'])
						}
					}else{
						uni.showToast({
							title: "更新数据失败"
						});
					}
				}).catch(rej=>{
				})
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
	 .Redcircle {
	     width: 40px;
	     height: 40px;
	     background: red;
	     border-radius: 30px;
		 margin-top: 10px;
		 margin-left: 10px;
	 }
	 .Bluecircle {
	     width: 40px;
	     height: 40px;
	     background: #007AFF;
	     border-radius: 30px;
		 margin-top: 10px;
		 margin-left: 10px;
	 }
</style>
