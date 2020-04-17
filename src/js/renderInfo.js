import debounce from 'lodash.debounce';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import 'pnotify/dist/es/PNotifyStyleMaterial.js';
import 'material-design-icons/iconfont/material-icons.css';
PNotify.defaults.styling = 'material';
PNotify.defaults.icons = 'material';

import { dropdown, inputSearch, infoContainer } from './refs';

import fetchCountries from '../js/fetchCountries';

import countryInfo from '../tmpl/countryInfo.hbs';
import dropdownItem from '../tmpl/dropdown.hbs';

dropdown.classList.add('hidden');

function resetRequest() {
    dropdown.innerHTML = '';
    infoContainer.innerHTML = '';
    PNotify.removeAll();
}

function renderInfo(event) {
    event.preventDefault();
    resetRequest();

    const userInfo = event.target.value;
    inputSearch.innerHTML = '';

    if (userInfo.length >= 1) {
        fetchCountries(userInfo).then(data => {
            if (data.length >= 2 && data.length <= 10) {
                dropdown.classList.remove('hidden');
                const markup = data.reduce((acc, country) => acc + dropdownItem(country), '');
                return dropdown.insertAdjacentHTML('beforeend', markup);
            }

            if (data.length === 1) {
                dropdown.classList.add('hidden');
                dropdown.textContent = '';
                inputSearch.innerHTML = '';
                PNotify.success({
                    title: 'Found!',
                    text: 'Super!',
                });
                return (infoContainer.innerHTML = countryInfo(...data));
            }

            PNotify.error({
                title: 'Oh No!',
                text: 'Too many matches found. Please enter a more specific query',
            });
        });
    }
}

function countryInList(event, input, list) {
    if (event.target.nodeName === 'LI') {
        input.value = event.target.textContent;
        list.innerHTML = '';
        list.classList.add('hidden');

        fetchCountries(input.value).then(data => {
            input.value = '';
            return (infoContainer.innerHTML = countryInfo(...data));
        });
    }
}

inputSearch.addEventListener('input', debounce(renderInfo, 500));
dropdown.addEventListener('click', event => countryInList(event, inputSearch, dropdown));
