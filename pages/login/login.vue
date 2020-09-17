<template>
	<view class="content">
		<view>
			<image src="../../static/img/Logo.jpg" mode="scaleToFill" style="margin: auto;width: 100%;height:600rpx;"></image>
		</view>
		<view class="login-type">
			<view v-for="(item,index) in loginTypeList" :key="index" @click="loginType = index" :class="{act: loginType === index}"
			 class="login-type-btn">{{item}}</view>
		</view>
		<view class="input-group" v-if="loginType === 0">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="username" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="input-group" v-else>
			<view class="input-row border">
				<text class="title">手机：</text>
				<m-input class="m-input" type="text" clearable focus v-model="mobile" placeholder="请输入手机号码"></m-input>
			</view>
			<view class="input-row">
				<text class="title">验证码：</text>
				<m-input type="text" v-model="code" placeholder="请输入验证码"></m-input>
				<view class="send-code-btn" @click="sendSmsCode">{{codeDuration ? codeDuration + 's' : '发送验证码' }}</view>
			</view>
		</view>
		<view>
			<checkbox checked="true" v-model="rememberuser" style="margin-top: 15px;">保持15天自动登陆</checkbox>
		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="loginByPwd">登录</button>
		</view>
		<view class="action-row">
			<!-- <navigator url="../reg/reg">注册账号</navigator> -->
			<!-- <text>|</text>
			<navigator url="../pwd/pwd">忘记密码</navigator> -->
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
				<!-- #ifdef MP-WEIXIN -->
				<button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'
	import md5 from "../../store/md5.js"

	export default {
		components: {
			mInput
		},
		data() {
			return {
				loginType: 0,
				loginTypeList: ['密码登录', '免密登录'],
				mobile: '',
				code: '',
				providerList: [],
				hasProvider: false,
				username: '',
				password: '',
				positionTop: 0,
				isDevtools: false,
				codeDuration: 0,
				rememberuser:true
			}
		},
		computed: mapState(['forcedLogin']),
		methods: {
			...mapMutations(['login']),
			initProvider() {
				const filters = ['weixin', 'qq', 'sinaweibo'];
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if (res.provider && res.provider.length) {
							for (let i = 0; i < res.provider.length; i++) {
								if (~filters.indexOf(res.provider[i])) {
									this.providerList.push({
										value: res.provider[i],
										image: '../../static/img/' + res.provider[i] + '.png'
									});
								}
							}
							this.hasProvider = true;
						}
					},
					fail: (err) => {
						console.error('获取服务供应商失败：' + JSON.stringify(err));
					}
				});
			},
			initPosition() {
				/**
				 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
				 * 反向使用 top 进行定位，可以避免此问题。
				 */
				this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
			},
			sendSmsCode() {
				if(this.codeDuration) {
					uni.showModal({
						content: `请在${this.codeDuration}秒后重试`,
						showCancel: false
					})
				}
				if (!/^1\d{10}$/.test(this.mobile)) {
					uni.showModal({
						content: '手机号码填写错误',
						showCancel: false
					})
					return
				}
				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'sendSmsCode',
						params: {
							mobile: this.mobile
						}
					},
					success: (e) => {
						if (e.result.code == 0) {
							uni.showModal({
								content: '验证码发送成功，请注意查收',
								showCancel: false
							})
							this.codeDuration = 60
							this.codeInterVal = setInterval(() => {
								this.codeDuration--
								if (this.codeDuration === 0) {
									if (this.codeInterVal) {
										clearInterval(this.codeInterVal)
										this.codeInterVal = null
									}
								}
							}, 1000)
						} else {
							uni.showModal({
								content: '验证码发送失败：' + e.result.msg,
								showCancel: false
							})
						}

					},
					fail(e) {
						uni.showModal({
							content: '验证码发送失败',
							showCancel: false
						})
					}
				})
			},
			loginByPwd() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 */
				if (this.username.length < 3) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 3 个字符'
					});
					return;
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				const data = {
					username: this.username,
					password: this.password
				};
				
				let data2 = JSON.stringify({account: 'admina3', password: md5("123456"),googleCode:'123',roomName:'1000'})
				uni.showLoading({
					mask:true,
					title:"Loading..."
				})
				this.$myRequest({
				    url: getApp().globalData.pageIndex.login,
				    data: data2,
					method:"POST",
				}).then(res=>{
					uni.hideLoading()
					this.text = 'request success';
					if(res.data.code == '0')
					{
						uni.showToast({
							icon: 'none',
							title: '登陆成功'
						});
						//保存数据
						let data = res.data.data
						uni.setStorageSync('authToken', data.token)
						uni.setStorageSync('userName', data.userName)
						uni.setStorageSync('userId', data.userId)
						uni.setStorageSync('account', data.account)
						//"goEasy": "{\"chatChannel\":\"1000\",\"encryptKey\":\"1538663015386630\",\"goEasyAppKey\":\"BC-100d24a0f3c048a3b9b638148df35d18\",\"goEasyServerUrl\":\"https://rest-hangzhou.goeasy.io\",\"goEasyUrl\":\"hangzhou.goeasy.io\"}",
						uni.setStorageSync('login_type', 'online')
						this.getBaseInfo()
						//_self.toMain(_self.username);
					}else{
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						});
					}
				}).catch(rej=>{
					uni.hideLoading()
					uni.showToast({
						icon: 'none',
						title: '调用失败'
					});
					console.log(rej)
				})
			},
			loginBySms() {
				if (!/^1\d{10}$/.test(this.mobile)) {
					uni.showModal({
						content: '手机号码填写错误',
						showCancel: false
					})
					return
				}
				if (!/^\d{6}$/.test(this.code)) {
					uni.showModal({
						title: '验证码为6位纯数字',
						showCancel: false
					});
					return;
				}
				let _self = this;

				uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'loginBySms',
						params: {
							mobile: this.mobile,
							code: this.code
						}
					},
					success: (e) => {
						console.log('login success', e);
						if (e.result.code == 0) {
							const username = e.result.username || '新用户'
							uni.setStorageSync('uniIdToken', e.result.token)
							uni.setStorageSync('username', username)
							uni.setStorageSync('login_type', 'online')
							_self.toMain(username);
						} else {
							uni.showModal({
								content: e.result.msg,
								showCancel: false
							})
							console.log('登录失败', e);
						}

					},
					fail(e) {
						uni.showModal({
							content: JSON.stringify(e),
							showCancel: false
						})
					}
				})
			},
			getBaseInfo(){
				console.log("login 跳转main页面")
				this.toMain()
			},
			toMain(userName) {
				getApp().globalData.userName = uni.getStorageSync('userName')
				/**
				 * 强制登录时使用reLaunch方式跳转过来
				 * 返回首页也使用reLaunch方式
				 */
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../main/main',
					});
				} else {
					uni.navigateBack();
				}
			}
		},
		onReady() {
			this.initPosition();
			this.initProvider();
			// #ifdef MP-WEIXIN
			this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
			// #endif
		}
	}
</script>

<style>
	.login-type {
		display: flex;
		justify-content: center;
	}

	.login-type-btn {
		line-height: 30px;
		margin: 0px 15px;
	}

	.login-type-btn.act {
		color: #0FAEFF;
		border-bottom: solid 1px #0FAEFF;
	}

	.send-code-btn {
		width: 120px;
		text-align: center;
		background-color: #0FAEFF;
		color: #FFFFFF;
	}

	.action-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.action-row navigator {
		color: #007aff;
		padding: 0 10px;
	}

	.oauth-row {
		display: flex;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.oauth-image {
		position: relative;
		width: 50px;
		height: 50px;
		border: 1px solid #dddddd;
		border-radius: 50px;
		margin: 0 20px;
		background-color: #ffffff;
	}

	.oauth-image image {
		width: 30px;
		height: 30px;
		margin: 10px;
	}

	.oauth-image button {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
</style>
