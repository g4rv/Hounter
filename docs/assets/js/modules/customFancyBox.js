const customFancyBox = () => {
	const fancyElems = document.querySelectorAll('[custom-fancy]');
	if (fancyElems.length === 0) throw new Error('No fancy element found');

	const createFancyElement = (fancyBoxType, attrValue) => {
		let tag = '';
		if (fancyBoxType === 'video') {
			tag = 'iframe';
		} else if (fancyBoxType === 'img') {
			tag = 'img';
		}

		const newFancyElem = document.createElement(tag);
		newFancyElem.setAttribute('src', attrValue);
		newFancyElem.setAttribute('width', '900');
		newFancyElem.setAttribute('height', '600');
		newFancyElem.setAttribute('allow', 'autoplay; fullscreen');
        newFancyElem.setAttribute('custom-fancy-viewport', '')

		return newFancyElem;
	};

	const createDialog = (fancyElement) => {
		const dialog = document.createElement('dialog');
		dialog.classList.add('fancy-box');
		dialog.appendChild(fancyElement);
		document.body.appendChild(dialog);

		return dialog;
	};

	const handleFancyVideoOpen = (event) => {
		const fancyBoxType = event.currentTarget.getAttribute('custom-fancy');
		const attrValue =
			fancyBoxType === 'video'
				? event.currentTarget.getAttribute('href')
				: event.currentTarget.getAttribute('src');

		const newFancyElem = createFancyElement(fancyBoxType, attrValue);
		const dialog = createDialog(newFancyElem);
		dialog.showModal();

		const scrollWidth =
			window.innerWidth - document.documentElement.clientWidth;
		document.body.style.paddingRight = `${scrollWidth}px`;
		document.body.style.overflow = 'hidden';

		dialog.addEventListener('click', (e) => {
			const dialogBoundaries = dialog.getBoundingClientRect();
			if (
				e.clientX > dialogBoundaries.right ||
				e.clientX < dialogBoundaries.left ||
				e.clientY < dialogBoundaries.top ||
				e.clientY > dialogBoundaries.bottom
			) {
				const timing = 500;
				dialog.classList.add('fancy-box--out');
				setTimeout(() => {
					dialog.remove();
					document.body.removeAttribute('style');
				}, timing);
			}
		});
	};

	fancyElems.forEach((elem) => {
		elem.addEventListener('click', (event) => {
			event.preventDefault();
			handleFancyVideoOpen(event);
		});
	});
};

export default customFancyBox;
