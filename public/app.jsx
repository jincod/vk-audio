"use strict";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tracks: [],
			currentTrack: 0
		}
	}
	componentDidMount() {
		var self = this;
		this.playNextTrack = this.playNextTrack.bind(this);
		this.playTrack = this.playTrack.bind(this);
		this.pauseTrack = this.pauseTrack.bind(this);
		this.audio = audiojs.createAll({
			trackEnded: function() {
				playNextTrack();
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
				<ul className="list-group">
				{
					this.state.tracks.map((track, index) => {
						let currentClass = index === this.state.currentTrack ? "list-group-item active" : "list-group-item";
						return (
							<li key={index} className={currentClass}>{index+1}. {track.artist} - {track.title}</li>
						)
					})
				}
				</ul>
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