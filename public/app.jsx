"use strict";

var Router = ReactRouter;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

class Player extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			id: props.params.query,
			tracks: [],
			currentTrack: 0,
			loading: true
		}
	}
	componentDidMount() {
		var self = this;
		this.playNextTrack = this.playNextTrack.bind(this);
		this.playTrack = this.playTrack.bind(this);
		this.pauseTrack = this.pauseTrack.bind(this);
		this.playThisTrack = this.playThisTrack.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.scrollToCurrentTrack = this.scrollToCurrentTrack.bind(this);

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
		this.loadTracks()
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
				this.playPauseTrack();
				e.preventDefault();
			}
		});
		$('.play-pause').on('click', (e) => {
			let isPlaying = localStorage.getItem("isPlaying") === 'true';
			localStorage.setItem("isPlaying", !isPlaying);
		});
	}
	loadTracks() {
		var self = this;
		superagent
			.get('/api/track')
			.query({query: this.props.params.query})
			.end(function(err, res) {
				var tracks = res.body,
					currentTrack = localStorage.getItem("currentTrack-" + self.state.id) && parseInt(localStorage.getItem("currentTrack-" + self.state.id), 10) || 0;
				self.setState({tracks: tracks, currentTrack: currentTrack, loading: false});

				if(tracks.length) {
					self.audio.load(tracks[currentTrack].url);
				}
				if(localStorage.getItem("isPlaying") === 'true') {
					self.playTrack();
				}
			});
	}
	componentDidUpdate() {
		if(!this.onceScroll) {
			this.scrollToCurrentTrack();
			this.onceScroll = true;
		}
	}
	scrollToCurrentTrack() {
		if(this.state.currentTrack > 0) {
			$('li.active').prev().get(0).scrollIntoView();
		}
	}
	componentWillReceiveProps(props) {
		this.setState({id: this.props.params.query}, this.loadTracks);		
	}
	handleSubmit(e) {
		e.preventDefault();
		var id = React.findDOMNode(this.refs.id).value.trim();
		if(id) {
			window.location.hash = id;
		}
		React.findDOMNode(this.refs.id).value = '';
	}
	render() {
		return (
			<div>
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container">
						<div className="navbar-btn navbar-left">
							<audio/>
						</div>
						<form className="navbar-form navbar-left" onSubmit={this.handleSubmit}>
							<div className="form-group">
								<input type="text" className="form-control" ref="id" placeholder="id or wall" style={{marginRight: '2px'}} />
							</div>
							<input type="submit" className="btn btn-default" value="Go" />
						</form>
						<div className="navbar-left" style={{maxWidth: '390px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
						{
							this.state.tracks && this.state.tracks.length > 0 &&
							<span onClick={this.scrollToCurrentTrack} style={{cursor: 'pointer'}} className="navbar-text">
								{this.state.currentTrack+1}. <span dangerouslySetInnerHTML={{__html: this.state.tracks[this.state.currentTrack].artist}}></span> - <span dangerouslySetInnerHTML={{__html: this.state.tracks[this.state.currentTrack].title}}></span>
							</span>
						}
						</div>
					</div>
				</nav>
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
		localStorage.setItem("currentTrack-" + this.state.id, this.state.currentTrack);
		this.audio.load(this.state.tracks[this.state.currentTrack].url);
		this.audio.play();
		localStorage.setItem("isPlaying", true);
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
		localStorage.setItem("isPlaying", true);
	}
	pauseTrack() {
		this.audio.pause();
		localStorage.setItem("isPlaying", false);
	}
	playPauseTrack() {
		let isPlaying = localStorage.getItem("isPlaying") === 'true';
		if(isPlaying) {
			this.pauseTrack();
		} else {
			this.playTrack();
		}
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<RouteHandler/>
			</div>
		)
	}
}

var routes = (
	<Route handler={App}>
		<Route name="/:query?" handler={Player} />
	</Route>
);

Router.run(routes, (Handler) => { // Router.HistoryLocation
	React.render(<Handler/>, document.getElementById('content'));
});