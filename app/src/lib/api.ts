interface FetchOptions extends RequestInit {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	headers: HeadersInit;
	body?: string;
}

interface ApiRes<T> {
	data: T;
	error?: string;
}

/**
 * Generic helper function to send API requests and handle responses.
 * @param url - The URL to send the request to.
 * @param options - The fetch options including method, headers, and body.
 * @returns A promise that resolves to the parsed JSON data or rejects with an error message.
 */
async function fetchAPI<T>(url: string, options: FetchOptions): Promise<ApiRes<T>> {
	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const errorData: any = await response.json();
			throw new Error(`API Error: ${errorData.message || 'Unknown error'}`);
		}
		const data = await response.json();
		return { data };
	} catch (error) {
		if (error instanceof Error) {
			return { data: null, error: error.message };
		}
		return { data: null, error: 'Unexpected error' };
	}
}

/**
 * Function to post data to a specified endpoint.
 * @param path - The endpoint path.
 * @param data - The data to send in the request.
 * @returns A promise that resolves to the response data.
 */
export function postApi<T>(path: string, data: object): Promise<ApiRes<T>> {
	return fetchAPI<T>(`/api/${path}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
}
