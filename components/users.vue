<template>
	<view style="margin-top: 2px;" v-if="update">
		<view style="background-color: #0FAEFF88;height: 28px;padding: 4px 0;">
			在线用户数：
			<text style="color: #FFFFFF;font-weight: bold;">{{totalUser}}</text>
		</view>
		<view class="uni-common-mt">
			<scroll-view :scroll-y="true" scroll-with-animation="true" style="width: 100%; height: 1120rpx;">
				<view v-for="(item,index) in userList" :key="index" style="border-bottom: solid 0.5px #555555;height: 60px;">
					<image :src="headimagelist[index]" style="left: 10px;top: 5px; width: 50px;height: 50px; border-radius: 100upx;"/>
					<image v-if="isAdmin[index]" src="../static/img/admin.png" style="left: 240px;top: 5px; width: 50px;height: 50px; border-radius: 100upx;"/>
					<view style="margin-left: 70px;margin-top: -35px; width: 100upx;">{{item}}</view>
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
				isAdmin:[],
				headimagelist:[],
				
				myname: '大佬',
				update:true,
			}
		},
		mounted() {
			this.init()
		},
		methods: {
			init() {
				console.log("获取在线用户列表")
				this.$myRequest({
				    url: getApp().globalData.pageIndex.online,
					method:"GET",
				}).then(res=>{
					console.log(res)
					if(res.data.code == '0')
					{
						this.$data.update=false
						this.$data.userList =[]
						this.$data.headimagelist=[]
						this.$data.isAdmin=[]
						let data2 = res.data.data
						console.log(data2.onlineList,data2.onlineList.length)
						for (let i = 0; i < data2.onlineList.length; i++) {
							let item = data2.onlineList[i]
							if(item.roleId<=2)
							{
								this.$data.isAdmin.push(true)
							}else{
								this.$data.isAdmin.push(false)
							}
							this.$data.userList.push(item['userName'])
							this.$data.headimagelist.push(item['headImg'])
						}
						this.$data.totalUser = data2.totalOnlineNum
						this.$data.update=true
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
</style>
