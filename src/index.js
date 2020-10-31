import './styles.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import API from './js/fetchCountries';
import getRefs from './js/getRefs';
import countriesListTmp from './templates/countriesList.hbs';
import countryCardTmp from './templates/countryCard.hbs';
import { alert, error } from '@pnotify/core';


const refs = getRefs();
const debounce = require('lodash.debounce');

refs.searchForm.addEventListener('input', debounce(onSearch, 500));

function onSearch () {
    const query = refs.searchForm.elements.query.value
    API.fetchCountries(query)
    .then(countriesListRender)
    // .catch(onFetchError)
}

function countriesListRender(countries) {
    // console.log("countriesListRender -> countries", countries)
    if (countries.length > 10) { 
        const my = alert({
            text: "Too many matches found. Please enter a more specific quuery!",
            type: 'error',
            autoOpen: true,
            styling: 'brighttheme',
            delay: 3000,
            width: '400px',
            maxTextHeight: null,
            sticker: false,
        });
        console.log("countriesListRender -> my", my)
        
        return
    }

    if (countries.length === 1) {
       refs.cardContainer.innerHTML = countryCardTmp(countries[0]); 
    } else {
        refs.cardContainer.innerHTML = countriesListTmp(countries);
    }
    
}

function onFetchError() {
    error({
        text: 'Упс, что-то пошло не так и мы не нашли вашу страну!',
    });
}