import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import './Alert.css';

const alert = props => {
	return (
		<React.Fragment>
			<Backdrop show />
			<div className='alert'>
				<header className='alert__header'>
					<h1>{props.title}</h1>
				</header>
				<section className='alert__content'>
					<h3>{props.children}</h3>
				</section>
				<section className='alert__actions'>
					<button className='btn' onClick={props.onConfirm}>
						{props.confirmText}
					</button>
				</section>
			</div>
		</React.Fragment>
	);
};

export default alert;
