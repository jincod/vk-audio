import express from 'express'
import request from 'superagent'

const accessToken = process.env.ACCESS_TOKEN;

let app = express();
let apiRouter = express.Router();

let getAudioTracks = (id, callback) => {
	let url = 'https://api.vk.com/method/audio.get?access_token='
		+ accessToken + '&owner_id=' + id;
	request
		.get(url)
		.end((err, response) => {
			if(err) {
				return res.sendStatus(400, err);
			}
			response.body.response.splice(0, 1);
			callback(response.body.response);
		});
}

let getWallTracks = (id, callback) => {
	let url = 'https://api.vk.com/method/wall.get?count=300&owner_id=' + id;
	request
		.get(url)
		.end((err, response) => {
			if(err) {
				return res.sendStatus(400, err);
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
			callback(result);
		});
}

let getPostTracks = (id, callback) => {
	let url = 'https://api.vk.com/method/wall.getById?count=300&posts=' + id;
	request
		.get(url)
		.end((err, response) => {
			if(err) {
				return res.sendStatus(400, err);
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
			callback(result);
		});
}

apiRouter.get('/track', (req, res) => {
	let query = 'wall-26599838';
	if(req.query.query) {
		query = req.query.query.split(',')[0];
	}

	if(query.startsWith('id')) {
		let id = query.replace('id', '');
		getAudioTracks(id, (result) => {
			res.send(result);
		});
	} else if(query.startsWith('wall') && query.indexOf('_') === -1) {
		let id = query.replace('wall', '');
		getWallTracks(id, (result) => {
			res.send(result);
		});
	} else if(query.startsWith('wall') && query.indexOf('_') !== -1) {
		let id = query.replace('wall', '');
		getPostTracks(id, (result) => {
			res.send(result);
		});
	} else {
		res.send([]);
	}
});

app.use(express.static("public"));
app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000);