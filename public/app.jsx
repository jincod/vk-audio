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
		this.playThisTrack = this.playThisTrack.bind(this);

		this.audio = audiojs.createAll({
			trackEnded: function() {
				if(self.state.currentTrack === (self.state.tracks.length - 1)) {
					self.setState({currentTrack: 0}, () => {
						self._playCurrentTrack();
					});
				} else {
					self.playNextTrack();
				}
			}
		})[0];
		superagent
			.get('/api/track')
			.query({query: window.location.hash.replace('#/', '')})
			.end(function(err, res) {
				let currentTrack = localStorage.getItem("currentTrack") && parseInt(localStorage.getItem("currentTrack"), 10) || 0;
				self.setState({tracks: res.body, currentTrack: currentTrack}, function() {
					this.audio.load(this.state.tracks[this.state.currentTrack].url);
				});
			});
		$(document).keydown((e) => {
			let unicode = e.charCode ? e.charCode : e.keyCode;
			// right arrow
			if (unicode == 39) {
				this.playNextTrack();
				// back arrow
			} else if (unicode == 37) {
				this.playPrevTrack();
				// spacebar
			} else if (unicode == 32) {
				this.audio.playPause();
				e.preventDefault();
			}
		})
	}
	render() {
		return (
			<div style={{width: 'inherit'}}>
				<div className="wrapper">
					<div className>
						<audio/>
					</div>
				</div>
				<ul className="list-group track-list">
				{
					this.state.tracks.map((track, index) => {
						let currentClass = index === this.state.currentTrack ? "list-group-item active" : "list-group-item";
						return (
							<li key={index} onClick={this.playThisTrack.bind(this, index)} className={currentClass}>
								{index+1}. <span dangerouslySetInnerHTML={{__html: track.artist}}></span> - <span dangerouslySetInnerHTML={{__html: track.title}}></span>
							</li>
						)
					})
				}
				</ul>
			</div>
		);
	}
	playThisTrack(index) {
		this.setState({currentTrack: index}, () => {
			this._playCurrentTrack();
		});
	}
	_playCurrentTrack() {
		localStorage.setItem("currentTrack", this.state.currentTrack);
		this.audio.load(this.state.tracks[this.state.currentTrack].url);
		this.audio.play();
	}
	playPrevTrack() {
		var self = this;
		this.setState({currentTrack: this.state.currentTrack - 1}, () => {
			self._playCurrentTrack();
		});
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