let baseURL="http://192.168.0.154:6700/logic/";
function myRequest(options){
	let headers={}
	var Token =uni.getStorageSync('authToken');
	var UserId =uni.getStorageSync('userId');
	//var sign=date_hao+UserId;
	//var hash=hex_md5(sign);
	
	//headers['HBWS-Client-DateTime'] = date_d;
	//headers['HBWS-Client-Timestamp'] = date_hao;
	headers['authToken'] = Token;
	//headers['HBWS-Client-Sign'] = hash;
	headers['userId'] = UserId;
	//headers["Content-Type"] = "application/json";
	console.log("Request:",baseURL + options.url)
	return new Promise((res,rej)=>{
		uni.request({
			url:baseURL + options.url,
			method:options.method || 'GET',
			data:options.data,
			header:headers,
			timeout:5,
			success(data) {
				res(data)
			},
			fail(data) {
				rej(data)
			}
		})
	})
	
}
export default myRequest;