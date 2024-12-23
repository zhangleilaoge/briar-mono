const useQuery = () => {
	const queryParams = new URLSearchParams(location.search);
	const query = Object.fromEntries(queryParams.entries());
	return query;
};

export default useQuery;
