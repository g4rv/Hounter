const triggerClickFromOut = () => {
    const triggers = document.querySelectorAll('[outer-trigger]')

    triggers.forEach(trigger => {
        trigger.addEventListener('click', e => {
            const triggerTargetSelector = e.currentTarget.getAttribute('outer-trigger')
            const triggerTargets = document.querySelectorAll(triggerTargetSelector)

            triggerTargets.forEach(target => target.click())
        })
    })
}

export default triggerClickFromOut