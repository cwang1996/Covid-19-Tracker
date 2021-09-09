const country_name_element = document.querySelector('.country-name');
const total_cases_element = document.querySelector('.cases .value');
const new_cases_element = document.querySelector('.cases .new-value');
const recovered_element = document.querySelector('.recovered .value');
const new_recovered_element = document.querySelector('.recovered .new-value');
const deaths_element = document.querySelector('.deaths .value');
const new_deaths_element = document.querySelector('.deaths .new-value');

const chart = document.getElementById('axes_line_chart').getContext('2d');

// VARIABLES

let app_data = [],
    cases_list = [],
    recovered_list = [],
    deaths_list = [],
    dates = [];

// USER COUNTRY CODE GEOLOCATION

fetch("https://api.ipgeolocation.io/ipgeo?apiKey=14c7928d2aef416287e034ee91cd360d")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    let country_code = data.country_code2;
    let user_country;
    country_list.forEach((country) => {
      if (country.code == country_code) {
        user_country = country.name;
      }
    });
    fetchData(user_country);
  });

  // FETCH API

  function fetchData(country) {
    user_country = country;
    country_name_element.innerHTML = "Loading...";
  
      (cases_list = []),
      (recovered_list = []),
      (deaths_list = []),
      (dates = []),
      (formatedDates = []);
  
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
  
    const api_fetch = async (country) => {
      await fetch(
        "https://api.covid19api.com/total/country/" + country + "/status/confirmed",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            dates.push(entry.Date);
            cases_list.push(entry.Cases);
          });
        });
  
      await fetch(
        "https://api.covid19api.com/total/country/" + country + "/status/recovered",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            recovered_list.push(entry.Cases);
          });
        });
  
      await fetch(
        "https://api.covid19api.com/total/country/" + country + "/status/deaths",
        requestOptions
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          data.forEach((entry) => {
            deaths_list.push(entry.Cases);
          });
        });
  
      updateUI();
    };
  
    api_fetch(country);
  }

  // UPDATE UI FUNCTION

  function updateUI() {
    updateStats();
    axesLinearChart();
  }

  function updateStats() {
    const total_cases = cases_list[cases_list.length - 1];
    const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];
  
    const total_recovered = recovered_list[recovered_list.length - 1];
    const new_recovered_cases = total_recovered - recovered_list[recovered_list.length - 2];
  
    const total_deaths = deaths_list[deaths_list.length - 1];
    const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];
  
    // INNERHTML
    country_name_element.innerHTML = user_country;
    total_cases_element.innerHTML = total_cases;
    new_cases_element.innerHTML = `+${new_confirmed_cases}`;
    recovered_element.innerHTML = total_recovered;
    new_recovered_element.innerHTML = `+${new_recovered_cases}`;
    deaths_element.innerHTML = total_deaths;
    new_deaths_element.innerHTML = `+${new_deaths_cases}`;

    if(new_cases_element.textContent.includes('-')){
      new_cases_element.innerHTML = `${new_confirmed_cases}`;
    }
    if(new_recovered_element.textContent.includes('-')){
      new_recovered_element.innerHTML = `${new_confirmed_cases}`;
    }
    if(new_deaths_element.textContent.includes('-')){
      new_deaths_element.innerHTML = `${new_deaths_cases}`;
    }
  
    // FORMAT DATES
    dates.forEach((date) => {
      formatedDates.push(formatDate(date));
    });
  }
  
  // UPDATE CHART
  let my_chart;
  function axesLinearChart() {
    if (my_chart) {
      my_chart.destroy();
    }
  
    my_chart = new Chart(chart, {
      type: "bar",
      data: {
        datasets: [
          {
            label: "Cases",
            data: cases_list,
            fill: false,
            borderColor: "#3333ff",
            borderWidth: 1,
          },
          {
            label: "Recovered",
            data: recovered_list,
            fill: false,
            borderColor: 'green',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderWidth: 1
          },
          {
            label: "Deaths",
            data: deaths_list,
            fill: false,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderWidth: 1
          },
        ],
        labels: formatedDates,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
  
  // FORMAT DATES
  const monthsNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  
  function formatDate(dateString) {
    let date = new Date(dateString);
  
    return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
  }
