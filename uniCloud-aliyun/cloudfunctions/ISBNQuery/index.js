'use strict';

let doubanbook = require("doubanbook");
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database()
	let {
		isbn
	} = event;
	let res = await uniCloud.httpclient.request("https://search.douban.com/book/subject_search?search_text=" +
		isbn + "&cat=1001")
	// 这个不能失去空格，否则无法匹配
	let reg = /window\.__DATA__ = "(.*)"/
	let regdata = reg.test(res.data)
	if (reg.test(res.data)) {
		let bookdata = RegExp.$1
		let data = doubanbook(bookdata)[0];
		let dbResult = await db.collection("isbnlib").limit(1).where({
			isbn: isbn
		}).get();
		if (dbResult.affectedDocs > 0) {
			return dbResult.data[0]
		}
		let coverImage = await uniCloud.httpclient.request(data.cover_url)

		let uploadResult = await uniCloud.uploadFile({
			cloudPath: isbn + ".jpg",
			fileContent: coverImage.data
		})
		let resData = {
			isbn: isbn,
			title: data.title,
			cover_url: uploadResult.fileID,
			abstract: data.abstract,
			date: new Date()
		}
		dbResult = await db.collection("isbnlib").add(resData)
		resData["_id"] = dbResult["id"];
		return resData
	}


	//返回数据给客户端
	return event
};
