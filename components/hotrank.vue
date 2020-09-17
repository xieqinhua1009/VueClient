<template>
	<view style="margin-top: 2px;">
		<view style="background-color: #0FAEFF88;height: 28px;padding: 5px 1;">
			<text style="color: #303133;padding-left: 12px;">名次</text>
			<text style="color: #303133;padding-left: 30px;">老师</text>
			<text style="color: #303133;padding-left: 60px;">人气</text>
		</view>
		<view class="uni-common-mt" v-if="update">
			<scroll-view :scroll-y="true" scroll-with-animation="true" style="width: 100%; height: 1120rpx;">
				<view v-for="(item,index) in userList" :key="index" style="border-bottom: solid 0.5px #555555;height: 60px;">
					<view v-if="index<3" class="Redcircle">
						<view class="textbox" style="text-align: center; padding: 8px;color: #FFFFFF;">
							{{index+1}}
						</view>
					</view>
					<view v-else class="Bluecircle">
						<view class="textbox" style="text-align: center; padding: 8px; color: #FFFFFF;">
							{{index+1}}
						</view>
					</view>
					<view style="margin-left: 70px;margin-top: -30px;">{{item}}</view>
					<view style="margin-left: 160px;margin-top: -22px;color: #007AFF;">人气:{{JFList[index]}}</view>
					<u-button style="margin-left: 265px;bottom: 25px;" type="warning" shape="circle" @tap='ClickGood(userid[index],index)'>👍点赞</u-button>
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
				userList: ['教师11111', '教师22222', '教师55555', '教师66666', '教师88888', '教师88888', '教师88888', '教师88888',
					'教师88888', '教师88888', '教师88888'
				],
				JFList: ['123', '345', '999', '666', '444', '338', '88888', '123888',
					'288', '2354', '123488'
				],
				userid:[],
				myname: '大佬',
				update:true
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
				    url: getApp().globalData.pageIndex.teacher_rank,
				    data: data2,
					method:"POST",
				}).then(res=>{
					console.log(res)
					if(res.data.code == '0')
					{
						this.$data.JFList =[]
						this.$data.userList = []
						this.$data.userid=[]
						for (let i = 0; i < res.data.data.list.length; i++) {
							let item = res.data.data.list[i]
							this.$data.JFList.push(item['votesSum'])
							this.$data.userList.push(item['realName'])
							this.$data.userid.push(item['id'])
						}
					}else{
						uni.showToast({
							title: "更新数据失败"
						});
					}
				}).catch(rej=>{
				})
			},
			ClickGood(tid,index){
				
				let data2 = JSON.stringify({id: tid})
				this.$myRequest({
				    url: getApp().globalData.pageIndex.sendLike,
				    data: data2,
					method:"POST",
				}).then(res=>{
					console.log(res)
					if(res.data.code == '0')
					{
						this.$data.update=false
						this.$data.JFList[index] = this.$data.JFList[index]+1
						console.log("给老师点赞",index,this.$data.JFList[index])
						this.$data.update=true
					}else{
						uni.showToast({
							title: "点赞失败"
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
