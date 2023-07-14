class slider {
	constructor(sliderID, settings) {
		this.sliderID = sliderID;
		this.activeSlide = 0;
		this.sliderPosition = 0;
		this.updateSettings(settings);
		this.setInitialValues();
		this.initSlider();
	}

	// assign and overwrite default settings
	updateSettings(newSettings) {
		this.settings = {
			breakpoints: null,
			slidesPerPage: null,
			adaptive: true,
			gapBetweenSlides: null,
			animationTime: 500,
			activeSlideCenter: false,
			pagination: false,
			...newSettings,
		};
	}

	// creating initial values
	setInitialValues() {
		this.values = {
			gapWidth: null,
			slideWidth: null,
			allGapsWidth: null,
			allSlidesWidth: null,
			sliderWrapperWidth: null,
			slidesPerPageCount: null,
		};

		this.updateInitialValues();
	}

	updateInitialValues() {
		this.setWrapperWidth();
		this.setAllSlidesWidth();
		this.setSlidesPerPageCount();
		this.setGapWidth();
		this.setAllGapsWidth();
		this.setSlideWidth();
	}

	reInitSlider() {
		const { allBtnsNext, allBtnsPrev, slides } = this.findSliderElems();
		this.disableIfEdge(allBtnsPrev, this.activeSlide <= 0);
		this.disableIfEdge(
			allBtnsNext,
			this.activeSlide >= slides.length - 1 ||
				slides.length < this.values.slidesPerPageCount
		);

		const { pagination } = this.settings;
		this.activeSlide = 0;
		this.sliderPosition = 0;
		this.updateInitialValues();
		this.setSlidesIndices();
		this.updateSliderStyles();
		this.updateActiveSlide();

		if (pagination) {
			this.createPagination();
			this.updateActivePaginationDot();
		}
	}

	initSlider() {
		const { activeSlideCenter, pagination, breakpoints, adaptive } =
			this.settings;
		const { allBtnsPrev, allBtnsNext } = this.findSliderElems();

		if (adaptive) {
			const originalSettings = JSON.parse(JSON.stringify(this.settings));

			this.updateSettingsByBreakpoints(originalSettings);

			window.addEventListener('resize', () => {
				if (breakpoints)
					this.updateSettingsByBreakpoints(originalSettings);
				if (activeSlideCenter) {
					this.placeSlideCenter();
				}
				this.setInitialValues();
				this.updateSliderStyles();
			});
		}

		if (activeSlideCenter) {
			this.placeSlideCenter();
		}
		if (pagination) {
			this.createPagination();
			this.updateActivePaginationDot();
		}

		this.setSlidesIndices();
		this.updateSliderStyles();

		if (this.activeSlide === 0) {
			allBtnsPrev.forEach((btn) => (btn.disabled = true));
		}

		this.updateActiveSlide();

		allBtnsNext.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.moveSlider('next');
			});
		});

		allBtnsPrev.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.moveSlider('prev');
			});
		});
	}

	updateSettingsByBreakpoints(defSettings) {
		const { breakpoints } = this.settings;
		if (!breakpoints) return;

		const viewportWidth = window.innerWidth;

		const breakpointsBiggerThenViewport = breakpoints.filter(
			(breakpoint) => {
				const breakpointWidth = breakpoint[0];
				if (viewportWidth <= breakpointWidth) return breakpoint;
			}
		);

		let smallestBreakpointBiiggerThenViewport =
			breakpointsBiggerThenViewport.reduce((acum, num) => {
				return Math.min(acum, num[0]);
			}, Infinity);

		if (breakpointsBiggerThenViewport.length === 0) {
			this.settings = defSettings;
		} else {
			const smallestBreakpoint = breakpoints.find(
				(breakpoint) =>
					breakpoint[0] === smallestBreakpointBiiggerThenViewport
			);
			const breakpointParameters = smallestBreakpoint[1];
			this.settings = { ...this.settings, ...breakpointParameters };
		}
		this.setInitialValues();
		this.updateSliderStyles();
	}

	findSliderElems() {
		// slider elements
		const slider = document.querySelector(`.slider${this.sliderID}`);
		if (!slider)
			throw new Error(
				`Slider with '${this.sliderID}' class name is not found!`
			);

		const sliderWrapper = slider.querySelector('.slider__wrapper');
		const sliderList = sliderWrapper.querySelector('.slider__list');
		const slides = sliderList.children;

		// btns
		const allBtnsPrev = document.querySelectorAll(
			`.slider__btn--prev${this.sliderID}__btn`
		);
		const allBtnsNext = document.querySelectorAll(
			`.slider__btn--next${this.sliderID}__btn`
		);

		return {
			slider,
			sliderWrapper,
			sliderList,
			slides,
			allBtnsPrev,
			allBtnsNext,
		};
	}

	setSlidesIndices() {
		const { slides } = this.findSliderElems();
		Array.from(slides).forEach((slide, idx) =>
			slide.setAttribute('slider-slide-index', idx)
		);
	}

	updateSliderStyles() {
		const { sliderList, slides } = this.findSliderElems();
		const { gapBetweenSlides } = this.settings;

		const { slideWidth } = this.values;

		sliderList.style.transform = `translate(${this.sliderPosition}px)`;
		sliderList.style.display = 'grid';
		sliderList.style.gridTemplateColumns = `repeat(${slides.length}, ${slideWidth}px)`;
		sliderList.style.gridAutoFlow = `column`;
		sliderList.style.transition = `transform ${this.settings.animationTime}ms`;

		if (gapBetweenSlides !== null) {
			sliderList.style.gap = gapBetweenSlides + 'px';
		}

		Array.from(slides).forEach(
			(slide) => (slide.style.width = `${slideWidth}px`)
		);
	}

	updateActiveSlide() {
		const { slides } = this.findSliderElems();
		Array.from(slides).forEach((slide) => {
			const slideIdx = Number(slide.getAttribute('slider-slide-index'));

			slide.removeAttribute('slider-slide');

			if (slideIdx === this.activeSlide) {
				slide.setAttribute('slider-slide', 'active');
			}

			if (
				slideIdx === this.activeSlide - 1 &&
				this.activeSlide - 1 >= 0
			) {
				slide.setAttribute('slider-slide', 'prev');
			}

			if (
				slideIdx === this.activeSlide + 1 &&
				this.activeSlide + 1 <= slides.length - 1
			) {
				slide.setAttribute('slider-slide', 'next');
			}
		});
	}

	moveSlider(direction) {
		const { allBtnsPrev, allBtnsNext, sliderList, slides } =
			this.findSliderElems();

		const {
			gapWidth,
			slideWidth,
			allGapsWidth,
			slidesPerPageCount,
			sliderWrapperWidth,
		} = this.values;

		const { activeSlideCenter, pagination } = this.settings;

		if (direction === 'next') {
			this.activeSlide++;
		}

		if (direction === 'prev') {
			this.activeSlide--;
		}

		if (pagination) {
			this.updateActivePaginationDot();
		}

		this.updateActiveSlide();

		this.disableIfEdge(allBtnsPrev, this.activeSlide <= 0);
		this.disableIfEdge(allBtnsNext, this.activeSlide >= slides.length - 1);

		let activeSlideCenterFormula = 0;
		if (activeSlideCenter) {
			activeSlideCenterFormula = sliderWrapperWidth / 2 - slideWidth / 2;
		}

		this.sliderPosition =
			-(this.activeSlide * (slideWidth + gapWidth)) +
			activeSlideCenterFormula;

		const maxPosition =
			(slides.length * slideWidth +
			(slides.length - 1) * gapWidth) - (slidesPerPageCount * slideWidth + (slidesPerPageCount - 1) * gapWidth);

            console.log(slidesPerPageCount * slideWidth)

		const minMaxSliderListPosition = Math.min(
			0,
			Math.max(this.sliderPosition, -maxPosition)
		);

		this.disableIfEdge(allBtnsPrev, minMaxSliderListPosition === 0);
		this.disableIfEdge(
			allBtnsNext,
			minMaxSliderListPosition === -maxPosition
		);

		const positionValue = activeSlideCenter
			? this.sliderPosition
			: minMaxSliderListPosition;

		sliderList.style.transform = `translate(${positionValue}px)`;
	}

	disableIfEdge(buttons, statement) {
		buttons.forEach((btn) => {
			if (statement) {
				btn.disabled = true;
			} else {
				btn.disabled = false;
			}
		});
	}

	placeSlideCenter() {
		const { slideWidth, sliderWrapperWidth } = this.values;
		this.sliderPosition = sliderWrapperWidth / 2 - slideWidth / 2;
	}

	createPagination() {
		const { slider, slides } = this.findSliderElems();
		const paginationElem = slider.querySelector('.slider__pagination');
		if (!paginationElem)
			throw new Error(
				`Pagination element in '${this.sliderID}' slider is not found!`
			);
		paginationElem.innerHTML = '';
		Array.from(slides).forEach((_) => {
			const paginationDot = document.createElement('div');
			paginationDot.classList.add('slider__pagination-dot');
			paginationElem.append(paginationDot);
		});
	}

	updateActivePaginationDot() {
		const { slider } = this.findSliderElems();
		const paginationParent = slider.querySelector('.slider__pagination');
		if (!paginationParent)
			throw new Error(
				`Pagination element in '${this.sliderID}' slider is not found!`
			);

		const paginationDots = paginationParent.children;

		let activeDot = paginationParent.querySelector(
			'[slider-pagination-dot="active"]'
		);
		if (!activeDot) {
			activeDot = paginationDots[this.activeSlide];
			activeDot.setAttribute('slider-pagination-dot', 'active');
		} else {
			activeDot.removeAttribute('slider-pagination-dot');
			paginationDots[this.activeSlide].setAttribute(
				'slider-pagination-dot',
				'active'
			);
		}
	}

	// setter functions for initial values

	setWrapperWidth() {
		const { sliderWrapper } = this.findSliderElems();
		this.values.sliderWrapperWidth =
			sliderWrapper.getBoundingClientRect().width;
	}

	setAllGapsWidth() {
		const { slides } = this.findSliderElems();
		const { gapWidth } = this.values;
		this.values.allGapsWidth = gapWidth * (slides.length - 1);
	}

	setSlidesPerPageCount() {
		const { slidesPerPage } = this.settings;
		const { slideWidth, sliderWrapperWidth, allGapsWidth } = this.values;

		this.values.slidesPerPageCount =
			slidesPerPage !== null
				? slidesPerPage
				: (sliderWrapperWidth - allGapsWidth) / slideWidth;
	}

	setGapWidth() {
		const { gapBetweenSlides } = this.settings;
		if (gapBetweenSlides !== null) return gapBetweenSlides;

		const { sliderList } = this.findSliderElems();
		const listCssGap = getComputedStyle(sliderList)
			.getPropertyValue('gap')
			.match(/\d+(?=px)/g);
		const listCssGapValue = listCssGap ? Number(listCssGap[0]) : 0;

		this.values.gapWidth = listCssGapValue;
	}

	setSlideWidth() {
		const { slidesPerPage } = this.settings;
		const { slides } = this.findSliderElems();
		const { sliderWrapperWidth, gapWidth } = this.values;

		const slideSizes = slides[0].getBoundingClientRect().width;

		const sliderWrapperWidthWithoutGaps =
			sliderWrapperWidth - (slidesPerPage - 1) * gapWidth;

		this.values.slideWidth =
			slidesPerPage !== null
				? sliderWrapperWidthWithoutGaps / slidesPerPage
				: slideSizes;
	}

	setAllSlidesWidth() {
		const { slides } = this.findSliderElems();
		this.values.allSlidesWidth = this.values.slideWidth * slides.length;
	}
}

export default slider;
