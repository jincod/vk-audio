import express from 'express'
import request from 'superagent'
import _ from 'underscore'

const accessToken = process.env.ACCESS_TOKEN;

let app = express();
let apiRouter = express.Router();

let getAudioTracks = (id, callback) => {
	let url = 'https://api.vk.com/method/audio.get?access_token='
		+ accessToken + '&owner_id=' + id;
	request
		.get(url)
		.end((err, response) => {
			if(err || response.body.error) {
				return callback(err || response.body.error);
			}
			response.body.response.splice(0, 1);
			callback(null, response.body.response);
		});
}

let getWallTracks = (id, callback) => {
	let url = 'https://api.vk.com/method/wall.get?count=300&owner_id=' + id;
	request
		.get(url)
		.end((err, response) => {
			if(err) {
				return callback(err);
			}

			var result = [],
				posts = response.body.response.slice(1);
			for (var i = 0; i < posts.length; i++) {
				var attachments = posts[i].attachments;
				if(attachments) {
					for (var j = 0; j < attachments.length; j++) {
						var attachment = attachments[j];
						if(attachment.audio) {
							result.push(attachment.audio);
						}
					};
				}
			};
			callback(null, result);
		});
}

let getPostTracks = (id, callback) => {
	let url = 'https://api.vk.com/method/wall.getById?count=300&posts=' + id;
	request
		.get(url)
		.end((err, response) => {
			if(err) {
				return callback(err);
			}

			var result = [],
				posts = response.body.response;
			for (var i = 0; i < posts.length; i++) {
				var attachments = posts[i].attachments;
				if(attachments) {
					for (var j = 0; j < attachments.length; j++) {
						var attachment = attachments[j];
						if(attachment.audio) {
							result.push(attachment.audio);
						}
					};
				}
			};
			callback(null, result);
		});
}

let sendResult = (res, tracks) => {
	res.send(_.filter(tracks, (track) => { return track.url !== ""; }));
}

apiRouter.get('/track', (req, res) => {
	var query = '';
	
	if(req.query.query) {
		query = req.query.query.split(',')[0];
	}

	if(query.startsWith('id')) {
		let id = query.replace('id', '');
		getAudioTracks(id, (err, result) => {
			if(err) {
				return res.sendStatus(400);
			}
			sendResult(res, result);
		});
	} else if(query.startsWith('wall') && query.indexOf('_') === -1) {
		let id = query.replace('wall', '');
		getWallTracks(id, (err, result) => {
			if(err) {
				return res.sendStatus(400);
			}
			sendResult(res, result);
		});
	} else if(query.startsWith('wall') && query.indexOf('_') !== -1) {
		let id = query.replace('wall', '');
		getPostTracks(id, (err, result) => {
			if(err) {
				return res.sendStatus(400);
			}
			sendResult(res, result);
		});
	} else {
		res.send([]);
	}
});

app.use(express.static("public"));
app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000);

module.exports = app