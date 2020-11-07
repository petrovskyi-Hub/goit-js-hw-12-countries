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

function onSearch() {
    const query = refs.searchForm.elements.query.value;
    if (query === '') {
        clearMarkup();
        return
    }

    API.fetchCountries(query)
    .then(countriesListRender)
    .catch(onFetchError)
}

function countriesListRender(countries) {
    console.dir(countries);
    if (countries.status === 404) {
        clearMarkup();
        noResult();
    }

    if (countries.length > 10) {
        alert({
            text: "Too many matches found. Please enter a more specific quuery!",
            autoOpen: true,
            styling: 'brighttheme',
            delay: 1800,
            width: '400px',
            maxTextHeight: null,
            sticker: false,
        });
        return
    } else if (countries.length === 1) {
        refs.cardContainer.innerHTML = countryCardTmp(countries[0]);
    } else if (countries.length > 1) {
        refs.cardContainer.innerHTML = countriesListTmp(countries);
    }
}

function clearMarkup() {
  refs.cardContainer.innerHTML = '';
}

function noResult() {
  alert({
    title: 'Uh Oh!',
    text: 'No matches found!',
    delay: 1800,
    styling: 'brighttheme',
    type: 'error',
    maxTextHeight: null,
  });
}

function onFetchError(error) {
  clearMarkup();

  console.log(error);
}