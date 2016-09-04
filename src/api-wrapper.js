import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import _ from 'underscore';

const request = superagentPromise(superagent, Promise);

const getData = (url, skipFirst) => {
	const callbackName = `callback${new Date().getTime()}`;
	url = `${url}&callback=${callbackName}`;

	return new Promise((resolve, reject) => {
		window[callbackName] = (data) => {
			const result = [];
			const posts = skipFirst ? data.response.slice(1) : data.response;

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
	  .then((result) => {
	    return _.filter(result, (item) => { return item.url !== ''; });
	  })
	  .then((result) => {
	    return _.uniq(result, (item) => { return `${item.artist}${item.title}`; });
	  })
	  .then((result) => {
	    return callback(null, result);
	  })
	  .catch(callback);
}

export { loadTracks };