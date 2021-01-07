const iconName = document.querySelector(".form__input--text");
const iconWeight = document.querySelector(".form__input--weight");
const iconAge = document.querySelector(".form__input--age");
const iconEmail = document.querySelector(".form__input--email");
const iconMobile = document.querySelector(".form__input--mobile");
const textArea = document.querySelector(".form__input--textarea");
const button = document.querySelector(".form__button");

function checkName(value) {
    if (!value || value.length < 0) {
        iconName.classList.add("modal-error");
        return false;
    }
    return true;
}
button.addEventListener("click", function(evt) {
    if (checkName(iconName.value) && iconEmail.value && iconWeight.value && iconMobile.value) {
        localStorage.setItem("login", iconEmail.value);
        return;
    }
    if (!iconEmail.value) {
        iconEmail.classList.add("modal-error");
    }
    if (!iconWeight.value) {
        iconWeight.classList.add("modal-error");
    }
    if (!iconMobile.value) {
        iconMobile.classList.add("modal-error");
    }
    setTimeout(function() {
        iconName.classList.remove("modal-error");
        iconEmail.classList.remove("modal-error");
        iconWeight.classList.remove("modal-error");
        iconMobile.classList.remove("modal-error");
    }, 650);
});
