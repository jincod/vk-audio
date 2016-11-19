import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import _ from 'underscore';

const request = superagentPromise(superagent, Promise);

const getData = (url, skipFirst) => {
	const callbackName = `callback${new Date().getTime()}`;
	url = `${url}&callback=${callbackName}`;

	return new Promise((resolve, reject) => {
		window[callbackName] = (data) => {
			const posts = skipFirst ? data.response.slice(1) : data.response;

			const result = posts
				.filter(p => p.attachments)
				.map(p => p.attachments.filter(a => a.audio && a.audio.url))
				.reduce((result, attachments) => result.concat(attachments.map(a => a.audio)), []);

			resolve(result);
		};

		var script = document.createElement('script');
		script.src = url;
		document.head.appendChild(script);
	});
}

const getPrivateTracks = url => {
	const callbackName = `callback${new Date().getTime()}`;
	url = `${url}&callback=${callbackName}`;

	return new Promise((resolve, reject) => {
		window[callbackName] = data => resolve(data.response.slice(1));

		var script = document.createElement('script');
		script.src = url;
		document.head.appendChild(script);
	});
}

const loadTracks = (query, callback) => {
	const ids = query.split(',');

	const promises = ids.map((query) => {
	  if(query.startsWith('wall') && query.indexOf('_') === -1) {
			const url = `https://api.vk.com/method/wall.get?count=300&owner_id=${query.replace('wall', '')}`;
			return getData(url, true);
	  } else if(query.startsWith('wall') && query.indexOf('_') !== -1) {
	  	const url = `https://api.vk.com/method/wall.getById?count=300&posts=${query.replace('wall', '')}`;
	  	return getData(url);
	  } else if (query.startsWith('id') && window.accessToken) {
	  	const id = query.replace('id', '');
	  	const url = `https://api.vk.com/method/audio.get?access_token=${accessToken}&owner_id=${id}`;

	  	return getPrivateTracks(url);
	  } 
	  return Promise.resolve([]);
	});

	Promise.all(promises)
		.then((results) => {
			return [].concat.apply([], results);
		})
		.then(results => results.filter(item => item.url !== ''))
		.then(results => _.uniq(results, item => `${item.artist}${item.title}`))
		.then(results => results.map((item, id) => Object.assign(item, {id})))
		.then(results => callback(null, results))
		.catch(callback);
}

export default loadTracks;
