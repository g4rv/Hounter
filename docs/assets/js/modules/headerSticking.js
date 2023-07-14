const headerSticking = () => {
    const header = document.querySelector('.header');
	const scrollWatcher = document.createElement('div');

	scrollWatcher.setAttribute('data-scroll-watcher', '');
	header.before(scrollWatcher);

	const navObserver = new IntersectionObserver(
		(entries) => {
			header.toggleAttribute(
				'sticking',
				!entries[0].isIntersecting
			);
		},
		{ rootMargin: '50px 0px 0px 0px' }
	);

	navObserver.observe(scrollWatcher);
}

export default headerSticking