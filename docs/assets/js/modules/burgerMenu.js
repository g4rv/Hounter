export const setBurgerIgnore = (element) => {
    element.setAttribute('burger-ignore', 'true')
}

export const removeBurgerIgnore = (element) => {
    element.setAttribute('burger-ignore', 'false')
}

const burgerMenu = () => {
    const burger = document.querySelector('.burger')
    if(!burger) throw new Error('Burger menu element not found!')

    const burgerBtn = burger.querySelector('.burger__btn')
    if(!burgerBtn) throw new Error('Burger button not found!')
    
    const removeBurgerActive = ({target}) => {
        // ignore element if it has 'burger-ignore' attribute
        if(target.getAttribute('burger-ignore') === 'true') {
            return
        }
        // close burger if click on 'a' tag
        if(target.localName === 'a') {
            burger.classList.remove('active')
            document.body.removeAttribute('style');
        }
    }

    const handleBurgerBtnClick = () => {
        burger.classList.toggle('active')

        if(burger.classList.contains('active')) {
            document.body.style.overflow = 'hidden'
            document.addEventListener('click', removeBurgerActive)
        } else {
            document.body.removeAttribute('style');
            document.removeEventListener('click', removeBurgerActive)
        }
    }

    burgerBtn.addEventListener('click', handleBurgerBtnClick)
}

export default burgerMenu