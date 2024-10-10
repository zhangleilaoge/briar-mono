export async function getServerSideProps() {
	// Fetch data from external API
	const data = 123;

	console.log('getServerSideProps');

	// Pass data to the page via props
	return { props: { data } };
}

export default function Home({ data }) {
	console.log('Home');
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			fuck
		</div>
	);
}
