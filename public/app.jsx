"use strict";

class App extends React.Component {
	componentDidMount() {
		var self = this;
		this.playNextTrack = this.playNextTrack.bind(this);
		this.playTrack = this.playTrack.bind(this);
		this.pauseTrack = this.pauseTrack.bind(this);
		this.state = {
			tracks: [],
			currentTrack: 0
		}
		this.audio = audiojs.createAll({
			trackEnded: function() {
				currentTrack++;
				playCurrentTrack();
			}
		})[0];
		superagent
			.get('/api/track')
			.withCredentials()
			.end(function(err, res) {
				let currentTrack = localStorage.getItem("currentTrack") && parseInt(localStorage.getItem("currentTrack"), 10) || 0;
				self.setState({tracks: res.body, currentTrack: currentTrack}, function() {
					self._playCurrentTrack();
				});
			});
	}
	render() {
		return (
			<div>
				<div>
					<audio />
				</div>
				<div>
					<a onClick={this.pauseTrack} className="btn btn-default">Pause</a>
					<a onClick={this.playTrack} className="btn btn-default">Play</a>
					<a onClick={this.playNextTrack} className="btn btn-default">Next</a>
				</div>

			</div>
		);
	}
	_playCurrentTrack() {
		localStorage.setItem("currentTrack", this.state.currentTrack);
		this.audio.load(this.state.tracks[this.state.currentTrack].url);
		this.audio.play();
	}

	playNextTrack() {
		var self = this;
		this.setState({currentTrack: this.state.currentTrack + 1}, () => {
			self._playCurrentTrack();
		});
	}
	playTrack() {
		this.audio.play();
	}
	pauseTrack() {
		this.audio.pause();
	};
}

React.render(<App/>, document.getElementById('content'));