<template>
	<view class="content">
		<view v-if="hasLogin" class="hello">
			<video src="rtmp://202.69.69.180:443/webcast/bshdlive-pc" style="width: 100%;height: 400rpx;align-self: center;" :autoplay="true"
			 controls></video>
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
		</view>
		<view v-if="!hasLogin" class="hello">
			<!-- <live-player
			  src="rtmp://202.69.69.180:443/webcast/bshdlive-pc"
			  autoplay
			  @statechange="statechange"
			  @error="error"
			  style="width: 300px; height: 225px;"
			/> -->
			<view class="title">
				您好，请您先登陆后观看。
			</view>
			<view class="ul">
				<view>这是 uni-app 带登录模板的示例App首页。</view>
				<view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
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
				]
			}
		},
		onLoad() {
			const loginType = uni.getStorageSync('login_type')
			if (loginType === 'local') {
				this.login(uni.getStorageSync('username'))
				return
			}
			let uniIdToken = uni.getStorageSync('uniIdToken')
			if (uniIdToken) {
				this.username = uni.getStorageSync('username')
				this.login(this.username)
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'checkToken',
					},
					success: (e) => {

						console.log('checkToken success', e);

						if (e.result.code > 0) {
							//token过期或token不合法，重新登录
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			} else {
				this.guideToLogin()
			}
		},
		methods: {
			...mapMutations(['login']),
			statechange(e) {
				console.log('live-player code:', e.detail.code)
			},
			error(e) {
				console.error('live-player error:', e.detail.errMsg)
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
			guideToLogin() {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					}
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
