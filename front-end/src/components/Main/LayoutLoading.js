import React from 'react';
// The purpose of this component is to display that data is loading, so user doesn't see blank screen
function LayoutLoading(Component) {
	return function LayoutLoading({ isLoading, ...props }) {
        if (!isLoading) return <Component {...props} />;
		return (
			<p style={{ fontSize: '25px' }}>
				We are waiting for the data to load!...
			</p>
		);
	};
}
export default LayoutLoading;
