import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import './App.css';
import Header from './components/Header';
import QuakeTile from './components/QuakeTile';

const GET_QUAKES = gql`
	query quakeList($after: String) {
		quakes(after: $after) {
			cursor
			hasMore
			quakes {
				id
				magnitude
				location
				when
				cursor
			}
		}
	}
`;

const App = () => {
	const { data, loading, error, fetchMore } = useQuery(GET_QUAKES);

	if (loading) return <p>Loading, Yo!</p>;
	if (error) return <p>ERROR</p>;
	if (!data) return <p>Not found</p>;

	return (
		<Fragment>
			<Header />
			<div className='main'>
				{data.quakes &&
					data.quakes.quakes &&
					data.quakes.quakes.map(quake => (
						<QuakeTile
							key={quake.id}
							id={quake.id}
							magnitude={quake.magnitude}
							location={quake.location}
							when={quake.when}
						/>
					))}
				{data.quakes &&
				data.quakes.hasMore && (
					<button
						onClick={() =>
							fetchMore({
								variables   : {
									after : data.quakes.cursor
								},
								updateQuery : (prev, { fetchMoreResult, ...rest }) => {
									if (!fetchMoreResult) return prev;
									return {
										...fetchMoreResult,
										quakes : {
											...fetchMoreResult.quakes,
											quakes : [ ...prev.quakes.quakes, ...fetchMoreResult.quakes.quakes ]
										}
									};
								}
							})}
					>
						Load More
					</button>
				)}
			</div>
		</Fragment>
	);
};

export default App;
