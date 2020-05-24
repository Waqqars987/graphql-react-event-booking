import React from 'react';
import './Components.css';

export default function quakeTile ({ id, magnitude, location, when }) {
	return (
		<div className='quakeTile'>
			<h3>Quake ID: {id}</h3>
			<hr />
			<p>Location: {location}</p>
			<p>Magnitude: {magnitude}</p>
			<p>When: {when}</p>
		</div>
	);
}
