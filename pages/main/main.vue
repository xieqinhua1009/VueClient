<template>
	<view class="content">
		<view v-if="hasLogin" class="hello">
			<video src="rtmp://202.69.69.180:443/webcast/bshdlive-pc" style="width: 100%;height: 400rpx;align-self: center;" :autoplay="true"></video>
			 <view class="title" style="position: absolute;top: -2%;color: #FFFFFF;font-weight: bold;">
			 	{{currentTC}}
			 </view>
			 <view class="login-type">
			 	<view v-for="(item,index) in chattypeList" :key="index" @click="chatTypeClick(index)" :class="{act: chattype === index}"
			 	 class="login-type-btn">{{item}}</view>
				 <u-image src="../../static/img/face.jpg" style="width: 40px;height: 40px; border-radius: 50%;left: 10px;" @tap="OpenMyData"></u-image>
			 </view>
			 <hmchat :datas="chatlist" ref="hmchat" v-if="chattype===0"></hmchat>
			 <privatechat :datas="privatechatlist" ref="privatechat" v-else-if ="chattype===1"></privatechat>
			 <users ref="users" v-else-if ="chattype===2"></users>
			 <hotrank ref="hotrank" v-else-if ="chattype===3"></hotrank>
			 <rank ref="rank" v-else-if ="chattype===4"></rank>
			 <canvas style="width: 100%;" v-if="chattype===0||chattype===1">
				 <u-notice-bar type="warning" :list="noticeList" :is-circular="true" :duration="5000" close-icon="true" @end="niticeEnd"></u-notice-bar>
			 </canvas>
			 
			 
		</view>
		<view v-if="!hasLogin">
			<!-- <live-player
			  src="rtmp://202.69.69.180:443/webcast/bshdlive-pc"
			  autoplay
			  @statechange="statechange"
			  @error="error"
			  style="width: 300px; height: 225px;"
			/> -->
			<image src="../../static/img/Logo.jpg" style="width: 100%;"></image>
			<view class="title">
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import hmchat from '../../components/hm-chat.vue'
	import privatechat from '../../components/privatechat.vue'
	import users from '../../components/users.vue'
	import hotrank from '../../components/hotrank.vue'
	import rank from '../../components/rank.vue'
	export default {
		components: {
			hmchat,
			privatechat,
			rank,
			hotrank,
			users
		},
		computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data() {
			return {
				chattype: 0,
				chattypeList: ['公聊', '私聊','用户','人气榜','排行榜'],
				username: '',
				currentTC:"当前老师：麻总",
				chatlist:[
					{type:"system",msg:{id:0,type:"text",content:{text:"欢迎进入‘发财主播间’"}}},
					{type:"user",msg:{id:1,type:"text",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{text:"为什么温度会相差那么大？"}}},
					{type:"user",msg:{id:2,type:"text",time:"12:57",userinfo:{uid:1,username:"大佬客服008",face:"/static/img/im/face/face_2.jpg"},content:{text:"这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。"}}},
					{type:"user",msg:{id:3,type:"voice",time:"12:59",userinfo:{uid:1,username:"王老师008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/voice/1.mp3",length:"00:06"}}},
					{type:"user",msg:{id:4,type:"voice",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/voice/2.mp3",length:"00:06"}}},
					{type:"user",msg:{id:5,type:"img",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/img/p10.jpg",w:200,h:200}}},
					{type:"user",msg:{id:6,type:"img",time:"12:59",userinfo:{uid:1,username:"李老师109",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/img/q.jpg",w:1920,h:1080}}},
					{type:"system",msg:{id:7,type:"text",content:{text:"欢迎进入‘发财主播间’"}}},
					
					// {type:"system",msg:{id:9,type:"redEnvelope",content:{text:"售后客服008领取了你的红包"}}},
					// {type:"user",msg:{id:10,type:"redEnvelope",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{blessing:"恭喜发财，大吉大利，万事如意",rid:0,isReceived:false}}},
					// {type:"user",msg:{id:11,type:"redEnvelope",time:"12:56",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{blessing:"恭喜发财",rid:1,isReceived:false}}},
				],
				privatechatlist:[
					{type:"system",msg:{id:0,type:"text",content:{text:"请注意私聊谨防受骗"}}},
					{type:"user",msg:{id:1,type:"text",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{text:"想要发财吗？冲100万，送1个亿~快来吧"}}},
					{type:"user",msg:{id:6,type:"text",time:"12:59",userinfo:{uid:1,username:"李老师109",face:"/static/img/im/face/face_2.jpg"},content:{text:"好的，马上打钱~"}}},
				],
				//公告滚动数组
				noticeList:[
					]
			}
		},
		onShow() {
			this.GetMainInfo()
		},
		onLoad() {
			
		},
		methods: {
			...mapMutations(['login']),
			statechange(e) {
				console.log('live-player code:', e.detail.code)
			},
			error(e) {
				console.error('live-player error:', e.detail.errMsg)
			},
			GetMainInfo(){
				uni.showLoading({
					title:"正在加载中"
				})
				let authToken = uni.getStorageSync('authToken')
				console.log("token:",authToken)
				if (authToken && authToken!="") {
					//获取主界面信息
					this.$myRequest({
						url: getApp().globalData.pageIndex.base_room_config
					}).then(res=>{
						console.log("获取主界面信息",res);
						if(res.data.code == '0')
						{
							uni.hideLoading()
							getApp().globalData.basedata = res.data.data.list //.list  {chatBottomMsg 免责声明  noticeMsg公告}
							
							this.$data.noticeList = [res.data.data.list.noticeMsg]
							this.login(true,uni.getStorageSync('userName'))
							this.GetUserInfo()
						}else{
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: "已过期，请重新登陆"
							});
							this.guideToLogin()
						}
					}).catch(rej=>{
						uni.hideLoading()
						this.guideToLogin()
					})
				}else{
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: "已过期，请重新登陆"
					});
					this.guideToLogin()
				}
			},
			GetUserInfo(){
				uni.showLoading({
					title:"正在加载中"
				})
				let authToken = uni.getStorageSync('authToken')
				if (authToken && authToken!="") {
					//玩家信息
					this.$myRequest({
						url: getApp().globalData.pageIndex.getCurrentUserInfo
					}).then(res=>{
						console.log("玩家信息",res);
						if(res.data.code == '0')
						{
							uni.hideLoading()
							getApp().globalData.userInfo = res.data.data.list
							getApp().globalData.userName = res.data.data.list.userName
						}else{
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: "已过期，请重新登陆"
							});
							uni.setStorageSync('authToken', "")
							this.guideToLogin()
						}
					}).catch(rej=>{
						uni.hideLoading()
						this.guideToLogin()
					})
				}else{
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: "已过期，请重新登陆"
					});
					this.guideToLogin()
				}
			},
			//选择聊天分类
			chatTypeClick(index){
				this.chattype = index
			},
			OpenMyData(){
				uni.navigateTo({
					url:"../user/user",
					animationType: 'pop-in',
					    animationDuration: 500
				})
			},
			//公告滚动完毕 is-circular="true"时无法生效··辣鸡
			niticeEnd(){
				console.log("123123")
			},
			guideToLogin() {
				uni.reLaunch({
					url: '../login/login'
				});
			}
		}

	}
</script>

<style>
	.login-type {
		display: flex;
		justify-content: left;
		background-color: #0FAEFF;
	}
	
	.login-type-btn {
		line-height: 30px;
		width: 17%;
		text-align: center;
		font-weight: bold;
	}
	
	.login-type-btn.act {
		color: #0FAEFF;
		border-bottom: solid 1px #ff9900;
		background-color: #FFFFFF;
		width:17%;
		text-align: center;
	}
	
	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #8f8f94;
		margin-top: 25px;
	}

	.ul {
		font-size: 15px;
		color: #8f8f94;
		margin-top: 25px;
	}

	.ul>view {
		line-height: 25px;
	}
</style>
