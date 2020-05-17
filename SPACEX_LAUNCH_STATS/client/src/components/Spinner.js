import React from 'react';

export default function Spinner () {
	return (
		<div class='d-flex justify-content-center'>
			<div class='spinner-border' style={{ width: '4rem', height: '4rem' }} role='status'>
				<span class='sr-only'>Loading...</span>
			</div>
		</div>
	);
}
