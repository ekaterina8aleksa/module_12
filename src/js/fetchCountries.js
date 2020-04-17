function fetchCountries(searchQuery) {
    if (searchQuery) {
        return fetch(
            `https://restcountries.eu/rest/v2/name/${searchQuery}?fields=name;population;flag;languages;capital`,
        )
            .then(response => response.json())
            .catch(error => console.log(error));
    }
}

export default fetchCountries;
