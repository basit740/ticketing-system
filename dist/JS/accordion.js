const accordionHeader = document.querySelectorAll('.accordion-header')

const menuBtn = document.querySelector('#menu-btn')
const dropdown = document.querySelector('#dropdown')

accordionHeader.forEach(accordionHeader => {
    accordionHeader.addEventListener("click", event => {
        accordionHeader.classList.toggle("active")
        const accordionBody = accordionHeader.nextElementSibling
        if(accordionHeader.classList.contains("active")){
            accordionBody.style.maxHeight = accordionBody.scrollHeight + "px"
        }
        else{
            accordionBody.style.maxHeight = 0
        }
    })
})


menuBtn.addEventListener('click', () => {
    dropdown.classList.toggle('hidden')
    dropdown.classList.toggle('flex')
})

