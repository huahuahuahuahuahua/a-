'use strict';

const {
	verifyToken
} = require('wx-common')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database()
	const dbCmd = db.command;
	const payload = event.token ? verifyToken(event.token) : null
	const action = event.action;
	// console.log("payload.openid"+payload);
	if(payload==null)return 
	let dbRes;
	if (action == "create") {
		console.log("create payload.openid" + payload.openid);
		dbRes = await db.collection("bookshelfs").add({
			owner: payload.openid,
			name: event.name,
			address: event.address,
			geopoint: new db.Geo.Point(event.longitude, event.latitude),
			totalbook: 0
		})
	} else if (action == "update") {
		const res = await msgSecCheck(payload.openid, event.name);

		if (res.result.suggest != "pass") {
			return {
				err: 1,
				msg: "内容不安全"
			};
		}

		dbRes = await db
			.collection("bookshelfs")
			.where({
				_id: dbCmd.eq(event._id),
				owner: dbCmd.eq(payload.openid),
			})
			.limit(1)
			.update({
				name: event.name,
				address: event.address,
				geopoint: new db.Geo.Point(event.longitude, event.latitude),
			});
		return dbRes;
	} else if (action == "listmy") {
		console.log("payload.openid" + payload.openid);
		dbRes = await db
			.collection("bookshelfs")
			.where({
				owner: dbCmd.eq(payload.openid),
			})
			.orderBy("_id", "desc")
			.limit(10)
			.get();
		return dbRes.data
	} else if(action=="get"){
		dbRes=await db.collection("bookshelfs").where({
			_id:dbCmd.eq(event._id)
		}).limit(1).get()
		const owner = dbRes.data[0]["owner"];
		    delete dbRes.data[0]["owner"];
		
		    dbRes.data[0]["isowner"] = payload ? owner == payload.openid : false;
		
		    const ownerinfo = await db
		      .collection("users")
		      .field({ openid: false })
		      .where({
		        openid: dbCmd.eq(owner),
		      })
		      .get();
		
		    dbRes.data[0]["ownerinfo"] = ownerinfo.data[0];
		
		    return dbRes.data[0];
	}
	else if (action == "delete") {
    dbRes = await db
      .collection("bookshelfs")
      .where({
        _id: dbCmd.eq(event._id),
        owner: dbCmd.eq(payload.openid),
      })
      .remove();
  }else if(action=="listbygeo"){
	  dbRes = await db
	    .collection("bookshelfs")
	    .field({ owner: false })
      .where({
        geopoint: dbCmd.geoNear({
          geometry: new db.Geo.Point(event.longitude, event.latitude),
          maxDistance: 3000,
          minDistance: 0,
        }),
      })
      .limit(100).get()
  }
	//返回数据给客户端
	return dbRes?dbRes.data:null
};
