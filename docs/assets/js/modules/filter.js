import { recomendSliderReset } from "../script.js"

const filter = (filterTargetSelector) => {
    const filterBtns = document.querySelectorAll('.filter-btn')
    const filterTarget = document.querySelector(filterTargetSelector)
    const filterTargetChildren = filterTarget.querySelectorAll(`${filterTargetSelector} > *`)
    
    let currentFilterValue = ''

    const resetActive = () => filterBtns.forEach(btn => btn.classList.remove('active'))

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnFilterValue = e.currentTarget.getAttribute('filter-btn-value')
            currentFilterValue = btnFilterValue

            if(e.currentTarget.classList.contains('active')) {
                resetActive()
                currentFilterValue = ''
            } else {
                resetActive()
                e.currentTarget.classList.add('active')
            }

            filterTarget.innerHTML = ''

            const filteredChilds = [...filterTargetChildren].filter(child => {
                if(currentFilterValue === '') return child
                if(child.getAttribute('filter-value') === currentFilterValue) return child
            })
        
            filteredChilds.forEach(child => filterTarget.append(child))
            recomendSliderReset()
        })
    })
    
}

export default filter