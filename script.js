document.getElementById("search").addEventListener("click", searchCountry);

async function searchCountry() {
    const inputCountry = document.getElementById("input-box").value.trim();
    const countryInfo = document.getElementById("country-info");
    const borderingCountries = document.getElementById("bordering-countries");
    
    
    countryInfo.innerHTML = "";
    borderingCountries.innerHTML = "";

    if (!inputCountry) {
        alert("Input Country name");
        return;
    }

    const loadingMessage = document.createElement("p");
    loadingMessage.textContent = "Busy Loading data...please wait";
    countryInfo.appendChild(loadingMessage);

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${inputCountry}`);
        const data = await response.json();

        countryInfo.innerHTML = ""; 

        if (!Array.isArray(data) || data.status) {
            countryInfo.textContent = "Error: Invalid Country";
            return;
        }

        const country = data[0];

        
        const name = document.createElement("h2");
        name.textContent = country.name.common;

        const capital = document.createElement("p");
        capital.textContent = `Capital: ${country.capital?.[0] || "Nonexistent"}`;

        const population = document.createElement("p");
        population.textContent = `Population: ${country.population.toLocaleString()}`;

        const region = document.createElement("p");
        region.textContent = `Region: ${country.region}`;

        const flag = document.createElement("img");
        flag.src = country.flags.png;
        flag.alt = `Flag of ${country.name.common}`;
        flag.width = 200;

        
        countryInfo.append(name, capital, population, region, flag);

        if (country.borders?.length) {
            const nextTitle = document.createElement("h3");
            nextTitle.textContent = "Bordering Countries:";
            borderingCountries.appendChild(nextTitle);

            try {
                const nextData = await Promise.all(
                    country.borders.map(border =>
                        fetch(`https://restcountries.com/v3.1/alpha/${border}`).then(res => res.json())
                    )
                );

                nextData.forEach(nextArray => {
                    if (nextArray.length > 0) {
                        const next = nextArray[0];

                        const nextBlock = document.createElement("div");
                        nextBlock.classList.add("border");

                        const nextName = document.createElement("p");
                        nextName.textContent = next.name.common;

                        const nextFlag = document.createElement("img");
                        nextFlag.src = next.flags.png;
                        nextFlag.alt = `Flag of ${next.name.common}`;
                        nextFlag.width = 100;

                        nextBlock.append(nextName, nextFlag);
                        borderingCountries.appendChild(nextBlock);
                    }
                });
            } catch {
                const errorText = document.createElement("p");
                errorText.textContent = "Could not fetch neighbouring countries.";
                borderingCountries.appendChild(errorText);
            }
        } else {
            const nonexts = document.createElement("p");
            nonexts.textContent = "No neighbouring countries found.";
            borderingCountries.appendChild(nonexts);
        }
    } catch {
        countryInfo.textContent = "Please try again.";
    }
}