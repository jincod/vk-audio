import express from 'express';
import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import _ from 'underscore';

const request = superagentPromise(superagent, Promise);

const accessToken = process.env.ACCESS_TOKEN;

let app = express();
let apiRouter = express.Router();

const getAudioTracks = id => {
	const url = `https://api.vk.com/method/audio.get?access_token=${accessToken}&owner_id=${id}`;
	return request
		.get(url)
		.end()
		.then(response => {
			response.body.response.splice(0, 1);
			return response.body.response;
		});
}

const getWallTracks = id => {
	const url = `https://api.vk.com/method/wall.get?count=300&owner_id=${id}`;
	return request
		.get(url)
		.end()
		.then(response => {
			const result = [];
			const posts = response.body.response.slice(1);

			for (var i = 0; i < posts.length; i++) {
				const attachments = posts[i].attachments;
				if(attachments) {
					for (var j = 0; j < attachments.length; j++) {
						const attachment = attachments[j];
						if(attachment.audio) {
							result.push(attachment.audio);
						}
					};
				}
			};
			return result;
		});
}

const getPostTracks = id => {
	const url = `https://api.vk.com/method/wall.getById?count=300&posts=${id}`;
	return request
		.get(url)
		.end()
		.then(response => {
			const result = [];
			const posts = response.body.response;

			for (var i = 0; i < posts.length; i++) {
				const attachments = posts[i].attachments;
				if(attachments) {
					for (var j = 0; j < attachments.length; j++) {
						const attachment = attachments[j];
						if(attachment.audio) {
							result.push(attachment.audio);
						}
					};
				}
			};
			return result;
		});
}

apiRouter.get('/track', (req, res) => {
	const query = req.query.query || '';
	const ids = query.split(',');

	const promises = ids.map((query) => {
		if(query.startsWith('id')) {
			return getAudioTracks(query.replace('id', ''));
		} else if(query.startsWith('wall') && query.indexOf('_') === -1) {
			return getWallTracks(query.replace('wall', ''));
		} else if(query.startsWith('wall') && query.indexOf('_') !== -1) {
			return getPostTracks(query.replace('wall', ''));
		}
		return Promise.resolve([]);
	});

	Promise.all(promises)
		.then(results => [].concat.apply([], results))
		.then(result => _.filter(result, (item) => { return item.url !== ''; }))
		.then(result => _.uniq(result, (item) => { return `${item.artist}${item.title}`; }))
		.then(result => res.send(result))
		.catch(err => res.sendStatus(400));
});


app.use(express.static('public'));
app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000);

module.exports = app