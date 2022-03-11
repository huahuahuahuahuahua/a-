'use strict';

const {
	appId,
	appSecret,
	getToken,
} = require('wx-common')
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	//jscode2session
	const {
		code
	} = event;
	const res = await uniCloud.httpclient.request(
		"https://api.weixin.qq.com/sns/jscode2session?appid=" + appId + "&secret=" + appSecret +
		"&js_code=" + code + "&grant_type=authorization_code", {
			dataType: "json"
		},
	)

	const openid = res.data.openid
	let dbRes = await db.collection("users").where({
		openid: openid
	}).limit(1).get();
	let userData = {};
	const token = getToken(openid)
	if (dbRes.affectedDocs <= 0) {
		userData = {
			nickName: "微信用户",
			avatarUrl: "",
			gender: 0,
			country: "",
			province: "",
			city: ""
		}
		await db.collection("users").add({
			openid: openid,
			...userData
		})
	} else {
		userData = dbRes.data[0]
		delete userData["openid"]
	}
	userData["token"] = token;

	//返回数据给客户端
	return userData
};
