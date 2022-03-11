
const appId='wx98269f5154c4bb6f';
const appSecret='a53a0d49dce48d571d4d0ee0bb0f88b5';

const jwt = require('jsonwebtoken')

function getToken(openid){
	return jwt.sign({openid:openid},appSecret,{expiresIn:60*60*24});
}
function verifyToken(token){
	return jwt.verify(token,appSecret);
}

module.exports ={
	// 公用模块用法请参考 https://uniapp.dcloud.io/uniCloud/cf-common
	appId:appId,
	getToken:getToken,
	verifyToken:verifyToken,
	appSecret:appSecret,
	
}
