import express from 'express'
import request from 'superagent'

let app = express();

let apiRouter = express.Router();

const userId = '-20833574';
const accessToken = process.env.access_token;
const url = 'https://api.vk.com/method/audio.get?access_token=' + access_token + '&count=100&owner_id=' + userId;

apiRouter.get('/track', (req, res) => {
	request
		.get(url)
		.end((err, response) => {
			if(err) {
				return res.sendStatus(400, err);
			}
			response.body.response.splice(0, 1);
			res.send(response.body.response);
		});
});

app.use(express.static("public"));
app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000);