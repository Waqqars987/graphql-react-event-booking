import React from 'react';
import './BookingList.css';

const bookingList = props => {
	return (
		<ul className='bookings__list'>
			{props.bookings.map(booking => {
				return (
					<li className='bookings__item' key={booking._id}>
						<div className='bookings__item-data'>
							<strong>
								{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString('en-GB')}
							</strong>
						</div>
						<div className='bookings__item-action'>
							<button className='btn' onClick={props.onDelete.bind(this, booking._id)}>
								Cancel
							</button>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default bookingList;
