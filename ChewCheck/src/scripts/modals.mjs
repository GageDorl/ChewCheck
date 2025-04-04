export function showConfirmation() {
    document.querySelector("#confirmation-content").classList.add("show");
    document.querySelector("#confirmation-message").classList.add("show");

    setTimeout(() => {
        document.querySelector("#confirmation-content").classList.remove("show");
        document.querySelector("#confirmation-message").classList.remove("show");
    }, 1000);
}

export function closeModal() {
    addFoodModal.classList.remove('open');
    addFoodModal.setAttribute('aria-hidden', 'true');
}