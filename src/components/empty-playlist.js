import React from 'react';
import {Link} from 'react-router';

const EmptyPlayList = () => (
	<div className="hello-block">
		<h4 className="hello-block__title">Take wall id or user id in search form or choose examples</h4>
		<Link to="/wall-20833574" className="hello-block__link">BBC Radio 1 / 1Xtra</Link>
	</div>
)

export default EmptyPlayList;
