import React, { useEffect, useState } from 'react';
import Layout from '../Main/Layout';
import LayoutLoadingComponent from '../Main/LayoutLoading';
import Welcome from '../Welcome/welcomePage';

function Load() {
	const LayoutLoading = LayoutLoadingComponent(Layout);
	const [appState, setAppState] = useState({
		loading: false,
		layout: null,
	});
	// Checking for data from the backend on load. 
	useEffect(() => {
		setAppState({ loading: true });
		const apiUrl = `https://rahulsenguttuvan-xmeme-app.herokuapp.com/memes/`;
		fetch(apiUrl)
			.then((data) => data.json()) 
			.then((layout) => {
				// Setting state of loading to true if no data available in the backend, or if it's taking time
				setAppState({ loading: false, layout: layout });
			});
	}, [setAppState]);
	return (
		<div>
            <Welcome/>
			<LayoutLoading isLoading={appState.loading} layout={appState.layout} />
		</div>
	);
}
export default Load;