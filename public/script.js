export function likeButton() {
    let heart = document.querySelector('#heart')
    heart.addEventListener('click', (e) => {
        e.preventDefault()
        console.log("heart")

    })
}