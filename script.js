/** Funkcja wywoływana po załadowaniu całej strony*/
document.addEventListener("DOMContentLoaded", function () {
    const wynik = document.getElementById("wynik");
    const input_wpisz = document.getElementById("input_wpisz");
    const button = document.getElementById("licz");
    const wybor_waluty = document.getElementById("wybor_waluty");
    const error = document.getElementById("error");




    button.addEventListener("click", function () {
        przeliczanie();
    });



    updateCurrencyRates();
});



/**
 * Funkcja aktualizująca kursy walut.
 * Pobiera aktualne kursy walut z API NBP i aktualizuje tabelę na stronie.
 * @function
 * @returns {void}
 */
function updateCurrencyRates() {
    /**
     * Wywołanie API do pobrania kursów walut.
     * @type {Promise<AxiosResponse<any>>}
     */
    const apiCall = axios.get(`https://api.nbp.pl/api/exchangerates/tables/A/?format=json`);

    // Obsługa odpowiedzi z API NBP
    apiCall
        .then((response) => {
            /**
             * Tablica obiektów reprezentujących kursy walut.
             * @type {Array<{code: string, mid: number}>}
             */
            const rates = response.data[0].rates;

            /**
             * Element HTML reprezentujący ciało tabeli kursów walut.
             * @type {HTMLTableSectionElement}
             */
            const tableBody = document.querySelector("#currency-table tbody");

            /**
             * Słownik opisów walut.
             * Klucz to kod waluty, a wartość to opis.
             * @type {Object.<string, string>}
             */
            const currencyDescriptions = {
                USD: "Dolar Amerykański",
                EUR: "Euro",
                THB: "Bat",
                AUD: "Dolar australijski",
                HKD: "Dolar Hongkongu",
                CAD: "Dolar kanadyjski",
                NZD: "Dolar nowozelandzki",
                SGD: "Dolar singapurski",
                HUF: "Forint",
                CHF: "Frank szwajcarski",
                GBP: "Brytyjski funt szterling",
                UAH: "Hrywna",
                JPY: "Jen",
                CZK: "Korona czeska",
                DKK: "Korona duńska",
                ISK: "Korona islandzka",
                NOK: "Korona norweska",
                SEK: "Korona szwedzka",
                RON: "Lej rumuński",
                BGN: "Lew bułgarski",
                TRY: "Lira turecka",
                ILS: "Nowy izraelski",
                CLP: "Peso chilijskie",
                PHP: "Peso filipińskie",
                MXN: "Peso meksykańskie",
                ZAR: "Rand",
                BRL: "Real brazylijski",
                MYR: "Ringgit",
                IDR: "Rupia indonezyjska",
                INR: "Rupia indyjska",
                KRW: "Won południowokoreański",
                CNY: "Renminbi"
            };

            // Wyczyść istniejące kursy walut w tabeli
            tableBody.innerHTML = "";

            // Dodaj aktualne kursy walut do tabeli
            rates.forEach((rate) => {
                /**
                 * Wiersz tabeli reprezentujący pojedynczy kurs waluty.
                 * @type {HTMLTableRowElement}
                 */
                const row = document.createElement("tr");

                // Wypełnij komórki wiersza danymi
                row.innerHTML = `<td>${rate.code}</td><td>${currencyDescriptions[rate.code]}</td><td>${rate.mid.toFixed(4)}</td>`;

                // Dodaj wiersz do tabeli
                tableBody.appendChild(row);
            });
        })
        .catch((err) => {
            /**
             * Komunikat o błędzie zapytania do API.
             * @type {string}
             */
            const errorMessage = "Błąd podczas pobierania kursów walut.";

            // Wyświetl komunikat o błędzie w konsoli
            console.error(errorMessage);
        });
}

/**  Wywołanie funkcji aktualizującej kursy walut*/
updateCurrencyRates();
/**
* Asynchroniczna funkcja pobierająca dane dotyczące kursów walut z API NBP.
* @async
* @function
* @returns {Promise<Array<number>>} Promise z tablicą kursów walut.
* @throws {Error} Błąd, jeśli wystąpił problem podczas pobierania danych z API.
*/
async function pobierzDaneAPI() {
    try {
        /**
         * Odpowiedź z API NBP zawierająca aktualne kursy walut.
         * @type {AxiosResponse}
         */
        const response = await axios.get('https://api.nbp.pl/api/exchangerates/tables/A/?format=json');

        /**
         * Tablica kursów walut.
         * Każdy element reprezentuje kurs średni danej waluty.
         * @type {Array<number>}
         */
        const dane = response.data[0].rates.map(rate => rate.mid);

        // Zwróć tablicę kursów walut w ramach obiektu Promise
        return dane;
    } catch (error) {
        /**
         * Błąd rzucany, gdy wystąpi problem podczas pobierania danych z API.
         * @type {Error}
         */
        throw error;
    }
}
/**
* Funkcja aktualizująca i ustawiająca aktualny czas w elemencie HTML.
* @function
*/
function Time() {
    /**
     * Obiekt reprezentujący aktualny czas.
     * @type {Date}
     */
    const now = new Date();

    /**
     * Aktualna godzina w formacie dwucyfrowym.
     * @type {string}
     */
    const hours = now.getHours().toString().padStart(2, '0');

    /**
     * Aktualna minuta w formacie dwucyfrowym.
     * @type {string}
     */
    const minutes = now.getMinutes().toString().padStart(2, '0');

    /**
     * Aktualna sekunda w formacie dwucyfrowym.
     * @type {string}
     */
    const seconds = now.getSeconds().toString().padStart(2, '0');

    /**
     * Aktualny czas w formacie HH:MM:SS.
     * @type {string}
     */
    const currentTimeString = `${hours}:${minutes}:${seconds}`;

    /** 
     * Element HTML, w którym ustawiany jest aktualny czas.
     * @type {HTMLElement}
     */
    const currentTimeElement = document.getElementById("aktualny_czas");

    /** 
     * Ustawienie aktualnego czasu w elemencie HTML.
     */
    currentTimeElement.innerText = currentTimeString;
}
/** Uruchomienie funkcji Time i ustawienie interwału*/
setInterval(Time, 1000);

Time();

    /**
    * Funkcja przeliczająca kwotę na podstawie kursu waluty.
    * @function
    * @returns {void}
    */
    function przeliczanie() {
        /**
         * Pole, w którym wyświetlane są ewentualne błędy.
         * @type {HTMLParagraphElement}
         */
        error.innerText = "";

        /**
         * Pole, w którym wyświetlany jest wynik przeliczenia.
         * @type {HTMLSpanElement}
         */
        wynik.innerText = "";

        /**
         * Wartość wprowadzona do pola kwoty.
         * @type {number}
         */
        const kwota = parseFloat(input_wpisz.value);

        // Sprawdzenie, czy wartość jest liczbą dodatnią.
        if (!kwota || kwota <= 0) {
            /**
             * Komunikat o błędzie wyświetlany, gdy kwota jest nieprawidłowa.
             * @type {string}
             */
            const errorMessage = "Należy podać kwotę większą od 0";


            alert(errorMessage);


            return;
        }


        axios
            .get(`https://api.nbp.pl/api/exchangerates/rates/a/${wybor_waluty.value}/?format=json`)
            .then((response) => {
                /**
                 * Kurs waluty pobrany z odpowiedzi API.
                 * @type {number}
                 */
                const rate = response.data?.rates?.[0]?.mid;


                if (rate) {
                    /**
                     * Wynik przeliczenia kwoty na podstawie kursu.
                     * @type {string}
                     */
                    const result = `to ${(kwota * rate).toFixed(2)} ZŁ`;


                    wynik.innerText = result;
                } else {
                    /**
                     * Komunikat o braku informacji o kursie.
                     * @type {string}
                     */
                    const noInfoMessage = "brak informacji";

                    // Wyświetlenie komunikatu o braku informacji.
                    error.innerText = noInfoMessage;
                }
            })
            .catch((err) => {

                console.error(err);
            });
    }