/*
* Helper function to handle fetch api response
*/

// Check response status
const _checkStatus = response => {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		const error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
};

/*
* Helper function to create valid response
*/

//1. Replaces consecutive & trailing slashes from the URL
const _normalizeUrl = url => {
	return url.replace(/([^:]\/)\/+/g, '$1').replace(/\/$/, '');
};

//2. Constructing url with query string for fetch requests
const _constructURL = (url, queryParams) => {
	return url + '?' + _flattenSearchParams(queryParams).join('&');
};


//3. This fn. takes args by reference
const _setContentType = (headers, rest) => {
	// FormData type request doesn't need Content-Type key to be sent in fetch request
	if (rest.multipart) {
		delete headers['Content-Type'];
		delete rest.multipart; // removing extra key from rest
	} else if (!headers['Content-Type']) {
		// headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; // Set default content type
	}
};


export default (url, params = {}) => {
	let { headers = {}, ...rest } = params;

	if (rest.queryParams) {
		url = _constructURL(url, rest.queryParams);
		delete rest.queryParams;
	}

	url = _normalizeUrl(url);

/*
	// File upload (where rest.multipart = true) must not flattenSearchParams otherwise fetch api won't autoset Content-Type as multipart
	if (rest.body && !rest.multipart) {
		rest.body = _flattenSearchParams(rest.body).join('&');
	}
*/
	_setContentType(headers, rest);

	headers['Accept'] = 'application/json, text/plain, */*';

	rest = { headers, ...rest };

	return fetch(url, rest)
		.then(_checkStatus)
			.then(res => res.json())
		.then(response => {
			// Assumes that API must be sending success as true/false
			if (response.success) {
				return response;
			} else {
				throw {
					errors: response.errors,
				};
			}
		})
		.catch(err => {
			if (typeof err === 'object') {
				throw err;
			}

			let message = '';
			if (err.status === 401) {
				message = 'Unauthorized';
			}

			throw {
				code: err.status,
				errors: [message],
				...err.responseJSON,
			};
		});
};

function _safeCheckNull(value) {
	return value === null ? '' : value;
}


// Current not being used. To be used on rest.body when Content-Type = application/x-www-form-urlencoded;charset=UTF-8
// Flatten Search Params to encodeURIComponent format
function _flattenSearchParams(data) {
	const searchParams = [];

	function flattenObj(data, parentKey) {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				if (data[key] instanceof Object) {
					if (parentKey) {
						flattenObj(data[key], parentKey + '[' + key + ']');
					} else {
						flattenObj(data[key], key);
					}
				} else {
					if (parentKey) {
						searchParams.push(
							encodeURIComponent(parentKey + '[' + key + ']') +
							'=' +
							encodeURIComponent(_safeCheckNull(data[key]))
						);
					} else {
						searchParams.push(
							encodeURIComponent(key) +
							'=' +
							encodeURIComponent(_safeCheckNull(data[key]))
						);
					}
				}
			}
		}
	}

	flattenObj(data);
	return searchParams;
}
