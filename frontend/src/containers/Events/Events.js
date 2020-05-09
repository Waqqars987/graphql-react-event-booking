import React, { Component } from 'react';

import Modal from '../../components/Modal/Modal';
import Backdrop from '../../components/Backdrop/Backdrop';
import AuthContext from '../../context/auth-context';
import Spinner from '../../components/Spinner/Spinner';
import EventList from '../../components/Events/EventList/EventList';
import Information from '../../components/Information/Information';
import Alert from '../../components/Alert/Alert';
import './Events.css';

class EventsPage extends Component {
	state = {
		creating      : false,
		events        : [],
		isLoading     : false,
		selectedEvent : null,
		message       : null,
		alert         : false
	};

	isActive = true;
	static contextType = AuthContext;

	constructor (props) {
		super(props);
		this.titleElRef = React.createRef();
		this.priceElRef = React.createRef();
		this.dateElRef = React.createRef();
		this.descriptionElRef = React.createRef();
	}

	componentDidMount () {
		this.fetchEvents();
	}

	startCreateEventHandler = () => {
		this.setState({ creating: true });
	};

	modalConfirmHandler = () => {
		const title = this.titleElRef.current.value;
		const price = +this.priceElRef.current.value;
		const date = this.dateElRef.current.value;
		const description = this.descriptionElRef.current.value;

		if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
			this.setState({ message: 'Please enter the required details!', alert: true });
			// return;
		} else {
			this.setState({ creating: false });
			const requestBody = {
				query     : `
					mutation CreateEvent ($title: String!, $description: String!, $price: Float!, $date: String!){
						createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
							_id
							title
							description
							date
							price
						}
					}
			  `,
				variables : {
					title       : title,
					description : description,
					price       : price,
					date        : date
				}
			};

			const token = this.context.token;

			fetch('http://localhost:8000/graphql', {
				method  : 'POST',
				body    : JSON.stringify(requestBody),
				headers : {
					'Content-Type' : 'application/json',
					Authorizaton   : 'Bearer ' + token
				}
			})
				.then(res => {
					if (res.status !== 200 && res.status !== 201) {
						throw new Error('Failed!');
					}
					return res.json();
				})
				.then(resData => {
					this.setState(prevState => {
						const updatedEvents = [ ...prevState.events ];
						updatedEvents.push({
							_id         : resData.data.createEvent._id,
							title       : resData.data.createEvent.title,
							description : resData.data.createEvent.description,
							date        : resData.data.createEvent.date,
							price       : resData.data.createEvent.price,
							creator     : {
								_id : this.context.userId
							}
						});
						return { events: updatedEvents };
					});
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	modalCancelHandler = () => {
		this.setState({ creating: false, selectedEvent: null });
	};

	fetchEvents = () => {
		this.setState({ isLoading: true });
		const requestBody = {
			query : `
			query {
				  events {
					_id
					title
					description
					date
					price
					creator {
						_id
						email
					}
				  }
			}
		  `
		};

		fetch('http://localhost:8000/graphql', {
			method  : 'POST',
			body    : JSON.stringify(requestBody),
			headers : {
				'Content-Type' : 'application/json'
			}
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then(resData => {
				const events = resData.data.events;
				if (this.isActive) {
					this.setState({ events: events, isLoading: false });
				}
			})
			.catch(err => {
				console.log(err);
				if (this.isActive) {
					this.setState({ isLoading: false });
				}
			});
	};

	showDetailHandler = eventId => {
		this.setState(prevState => {
			const selectedEvent = prevState.events.find(e => e._id === eventId);
			return { selectedEvent: selectedEvent };
		});
	};

	bookEventHandler = () => {
		if (!this.context.token) {
			this.setState({ selectedEvent: null });
			return;
		}
		const requestBody = {
			query     : `
				mutation BookEvent($id:ID!) {
					bookEvent(eventId: $id) {
						_id
						createdAt
						updatedAt
					}
				}
		  `,
			variables : {
				id : this.state.selectedEvent._id
			}
		};

		fetch('http://localhost:8000/graphql', {
			method  : 'POST',
			body    : JSON.stringify(requestBody),
			headers : {
				'Content-Type' : 'application/json',
				Authorizaton   : 'Bearer ' + this.context.token
			}
		})
			.then(res => {
				if (res.status !== 200 && res.status !== 201) {
					throw new Error('Failed!');
				}
				return res.json();
			})
			.then(resData => {
				this.setState({ selectedEvent: null, message: 'Booking Confirmed!', alert: true });
			})
			.catch(err => {
				console.log(err);
			});
	};

	alertDismissHandler = () => {
		this.setState({ message: null, alert: false });
	};

	componentWillUnmount () {
		this.isActive = false;
	}

	render () {
		let eventList = null;
		if (this.state.isLoading) {
			eventList = <Spinner />;
		} else if (!this.state.isLoading && this.state.events.length === 0) {
			eventList = (
				<Information>No events found, {!this.context.token ? 'Authenticate to' : ''} Create one!</Information>
			);
		} else {
			eventList = (
				<EventList
					events={this.state.events}
					userId={this.context.userId}
					onViewDetail={this.showDetailHandler}
				/>
			);
		}
		return (
			<React.Fragment>
				{(this.state.creating || this.state.selectedEvent) && <Backdrop />}
				{/*************************** For Creating a New Event ************************************/}
				{this.state.creating && (
					<Modal
						title='Add Event'
						canCancel
						canConfirm
						onCancel={this.modalCancelHandler}
						onConfirm={this.modalConfirmHandler}
						confirmText='Confirm'
					>
						<form>
							<div className='form-control'>
								<label htmlFor='title'>Title</label>
								<input type='text' id='title' ref={this.titleElRef} required />
							</div>
							<div className='form-control'>
								<label htmlFor='price'>Price</label>
								<input type='number' id='price' ref={this.priceElRef} required />
							</div>
							<div className='form-control'>
								<label htmlFor='date'>Date</label>
								<input type='datetime-local' id='date' ref={this.dateElRef} required />
							</div>
							<div className='form-control'>
								<label htmlFor='description'>Description</label>
								<textarea id='description' rows='4' ref={this.descriptionElRef} required />
							</div>
						</form>
					</Modal>
				)}
				{/***********************************************************************************************/}

				{this.state.alert ? (
					<Alert title='Alert' onConfirm={this.alertDismissHandler} confirmText='Okay'>
						<h2>{this.state.message}</h2>
					</Alert>
				) : null}

				{/********************************* For Showing Event Details************************************/}
				{this.state.selectedEvent && (
					<Modal
						title='Event Details'
						canCancel
						onCancel={this.modalCancelHandler}
						canConfirm
						onConfirm={this.bookEventHandler}
						confirmText={this.context.token ? 'Book' : 'Okay'}
					>
						<h1>{this.state.selectedEvent.title} </h1>
						<h2>
							${this.state.selectedEvent.price} -
							{new Date(this.state.selectedEvent.date).toLocaleDateString('en-GB')}
						</h2>
						<h3>{this.state.selectedEvent.description}</h3>
						{!this.context.token && (
							<em>
								<small>Authenticate to Book</small>
							</em>
						)}
					</Modal>
				)}
				{/***********************************************************************************************/}

				{this.context.token && (
					<div className='events-control'>
						<p>Share your own Events!</p>
						<button className='btn' onClick={this.startCreateEventHandler}>
							Create Event
						</button>
					</div>
				)}

				{eventList}
			</React.Fragment>
		);
	}
}

export default EventsPage;
