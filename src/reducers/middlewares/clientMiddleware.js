/* eslint-disable no-console */

/* This middleware directly provides http client object to store actions */
export default ({ dispatch, getState }) => next => action => {
	// Handles thunk like functionality-1
	if (typeof action === 'function') {
		return action(dispatch, getState);
	}

	const { payload, type, ...rest } = action; // eslint-disable-line no-redeclare

	// Handles thunk like functionality-2
	if (!payload || typeof payload.then !== 'function') {
		return next(action);
	}

	const REQUEST = type;

	next({
		type: `${REQUEST}::PENDING`,
		...rest,
	});


	const actionPromise = payload;

	actionPromise.then(
			response => next({ ...rest, response, type: `${REQUEST}::SUCCESS` }),
			error => next({ ...rest, error, type: `${REQUEST}::ERROR` })
		).catch(error => {
			console.error('MIDDLEWARE ERROR:', error);
			next({ ...rest, error, type: `${REQUEST}::ERROR` });
		});

	return actionPromise;
};
