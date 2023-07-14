import { isTouchDevice } from './utils.js';
import { setBurgerIgnore, removeBurgerIgnore } from './burgerMenu.js';

const dropdownMenu = (selector) => {
	const dropdown = document.querySelector(selector);
	if (!dropdown) throw new Error(`Dropdown menu with '${selector}' class is NOT found!`);

	const dropdownBtn = dropdown.querySelector('.dropdown__btn');
	if (!dropdown) throw new Error('Dropdown button is not found!');

	const dropdownAddActive = () => {
		dropdown.classList.add('active');
	};

	const dropdownRemoveActive = () => {
		dropdown.classList.remove('active');
	};

	// prevents mouse events from running on touchscreen devices
	if (!isTouchDevice()) {
		dropdown.addEventListener('mouseover', dropdownAddActive);
		dropdown.addEventListener('mouseout', dropdownRemoveActive);
	}

    // runs only on touchscreen devices
	if(isTouchDevice()) {
        dropdown.addEventListener('click', (e) => {
            const isDropdownActive = dropdown.classList.contains('active')
            console.log(isDropdownActive)
    
            if (isDropdownActive) {
                dropdownRemoveActive();
                removeBurgerIgnore(dropdownBtn)
            } else {
                e.preventDefault()
                dropdownAddActive();
                setBurgerIgnore(dropdownBtn)
            }
        });
    }
};
export default dropdownMenu;
