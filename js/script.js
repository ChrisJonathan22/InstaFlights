window.addEventListener('load', () => {

        document.addEventListener('click', (evt) => {
            console.log(evt.target);
            if (evt.target.className === '_2Yxt0UffkEUTzOmXYgxn2s' || evt.target.className === '_3X6DkTXBbM_wHPdMHR0KaU' || evt.target.tagName === 'A' || evt.target.tagName === 'DIV' || evt.target.parentElement.tagName === 'SVG') {
                evt.preventDefault();
                console.log(evt.target);
                
            } 
            // evt.preventDefault();
            // console.log(evt.target);
        }, false);
}, false);

document.querySelector('SVG').addEventListener('mouseenter', (evt) => {
    evt.preventDefault();
}, false);

axios.get('http://localhost:3000/flights').then((res) => {
    console.log(res);
}).catch((err) => {
    console.log(err);
});

// let apiKey = 'prtl6749387986743898559646983194';
// let url = `http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/
// ${originPlace}/
// ${destinationPlace}/
// ${outboundPartialDate}/
// ${inboundPartialDate}?
// apiKey=${apiKey}`;

/*
    I may need fetch a list of currencies etc... so users know what to enter.
    https://skyscanner.github.io/slate/?_ga=1.104705984.172843296.1446781555#flights-browse-prices
*/


