"use strict";

import request from 'superagent'
import React from 'react'
import { Router, Route, Link, IndexRoute, DefaultRoute, RouteHandler } from 'react-router'
import createHistory from 'history/lib/createHashHistory'

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
		document.addEventListener('keydown', (e) => {
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
		document.querySelector('.play-pause').addEventListener('click', (e) => {
			let isPlaying = localStorage.getItem("isPlaying-" + this.state.id) === 'true';
			localStorage.setItem("isPlaying-" + this.state.id, !isPlaying);
		});
	}
	loadTracks() {
		var self = this,
			query = this.props.params.query;

		if(!query) {
			this.setState({tracks: [], currentTrack: -1});
			return;
		}

		window.document.title = query ? 'VK Audio - ' +  this.props.params.query : 'VK Audio';
		request
			.get('/api/track')
			.query({query: this.props.params.query})
			.end(function(err, res) {
				if(err) {
					return alert('Can\' load traks');
				}
				var tracks = res.body,
					currentTrack = localStorage.getItem("currentTrack-" + self.state.id) && parseInt(localStorage.getItem("currentTrack-" + self.state.id), 10) || 0;
				self.setState({tracks: tracks, currentTrack: currentTrack, loading: false});

				if(tracks.length) {
					self.audio.load(tracks[currentTrack].url);
				}
				if(localStorage.getItem("isPlaying-" + self.state.id) === 'true') {
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
		if(this.state.tracks.length > 1) {
			if(this.state.currentTrack > 1) {
				document.querySelector('li.active').previousElementSibling.scrollIntoView();
			} else {
				document.body.scrollIntoView();
			}
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
		this.playTrack();
	}
	playPrevTrack() {
		var self = this;
		let nextTrack = this.state.currentTrack - 1;

		if(this.state.currentTrack === 0) {
			nextTrack = this.state.tracks.length - 1;
		}
		this.setState({currentTrack: nextTrack}, () => {
			self._playCurrentTrack();
		});
	}
	playNextTrack() {
		var self = this;
		let nextTrack = this.state.currentTrack + 1;

		if(this.state.currentTrack === (this.state.tracks.length - 1)) {
			nextTrack = 0;
		}
		this.setState({currentTrack: nextTrack}, () => {
			self._playCurrentTrack();
		});
	}
	playTrack() {
		this.audio.play();
		localStorage.setItem("isPlaying-" + this.state.id, true);
	}
	pauseTrack() {
		this.audio.pause();		
		localStorage.setItem("isPlaying-" + this.state.id, false);
	}
	playPauseTrack() {
		let isPlaying = localStorage.getItem("isPlaying-" + this.state.id) === 'true';
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
				{this.props.children}
			</div>
		)
	}
}

let history = createHistory({
	queryKey: false
});

var routes = (
	<Router history={history}>
		<Route path="/" component={App}>
			<IndexRoute component={Player} />
			<Route path="/:query" component={Player} />
		</Route>
	</Router>
);

React.render(routes, document.getElementById('content'));