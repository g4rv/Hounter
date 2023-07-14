import burgerMenu from './modules/burgerMenu.js';
import headerSticking from './modules/headerSticking.js';
import dropdownMenu from './modules/dropdownMenu.js';
import slider from './modules/customSlider.js';
import filter from './modules/filter.js';
import triggerClickFromOut from './modules/triggerClickFromOut.js';
import customFancyBox from './modules/customFancyBox.js';

burgerMenu();
headerSticking();
dropdownMenu('.header__dropdown');
filter('.recommend-slider__slides');
triggerClickFromOut();
customFancyBox();

const recommendSlider = new slider('.recommend-slider', {
	slidesPerPage: 3.5,
    breakpoints: [
		[
			991,
			{
				slidesPerPage: 3,
			},
		],
		[
			768,
			{
				slidesPerPage: 2,
			},
		],
        [
			576,
			{
				slidesPerPage: 1.5,
			},
		],
        [
			430,
			{
				slidesPerPage: 1,
			},
		],
	],
});
const testimonialsSlider = new slider('.testimonials-slider', {
	slidesPerPage: 1.5,
	activeSlideCenter: true,
	pagination: true,
	breakpoints: [
		[
			991,
			{
				slidesPerPage: 1.25,
			},
		],
		[
			768,
			{
				slidesPerPage: 1,
			},
		],
	],
});

export const recomendSliderReset = () => recommendSlider.reInitSlider();
