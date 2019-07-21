window.addEventListener('load', () => {
    let btn = document.querySelector("div[data-element='referral-button']");

    btn.addEventListener('click', (evt) => {
        if (evt.target.tagName === 'A') {
            evt.preventDefault();
        } 
    }, false);

    console.log(btn);
}, false);

