export function showConfirmation() {
    document.querySelector("#confirmation-content").classList.add("show");
    document.querySelector("#confirmation-message").classList.add("show");

    setTimeout(() => {
        document.querySelector("#confirmation-content").classList.remove("show");
        document.querySelector("#confirmation-message").classList.remove("show");
    }, 1000);
}

export function closeModal(foodModal) {
    foodModal.classList.remove('open');
    foodModal.setAttribute('aria-hidden', 'true');
}

export function displayErrorMessage(location, message) {
        console.log(document.querySelector(".errorMessage"));
        location.textContent = message;
        location.classList.add("display");

}