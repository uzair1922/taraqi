import moment from 'moment';
/// <reference types="cypress" />

describe('City Filter with Temperature Units', () => {
  beforeEach(() => {
    cy.visit('https://openweathermap.org/');
    cy.wait(5000);
  });

  it('Select Valid City and check temperature in Centigrade and Fahrenheit', () => {
    const cityName = 'islamabad';

    // Select Metric unit
    cy.contains('div.option', 'Metric: °C, m/s').click({ force: true });
    cy.contains('div.option', 'Metric: °C, m/s').parent('.switch-container').should('have.attr', 'blue', '');

    // Search and select the city
    cy.get('input[placeholder="Search city"]').click({ force: true }).type(cityName);
    cy.wait(2000);
    cy.get('.button-round.dark').click({ force: true });
    cy.get('.search-dropdown-menu li:first-child').click();

    // Validate temperature in Centigrade from API response
    cy.request({
      method: 'GET',
      url: 'https://openweathermap.org/data/2.5/onecall',
      qs: {
        lat: 33.7104,
        lon: 73.1338,
        units: 'metric',
        appid: '439d4b804bc8187953eb36d2a8c26a02',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.current).to.have.property('temp');

      //Saving temperature from API response in a constant roundedTempC
      const currentTempC = response.body.current.temp;
      const roundedTempC = Math.round(currentTempC);

      //Verifying the temperature from API response (roundedTempC) with the temperature shown on the front-end are identical
      cy.get('.current-temp [class*="heading"]').should('have.text', roundedTempC + '°C');

      // Additional assertions or validations for Centigrade
      expect(roundedTempC).to.be.a('number');
      expect(roundedTempC).to.be.within(-50, 50);

      // Select Imperial unit
      cy.contains('div.option', 'Imperial: °F, mph').click({ force: true });
      cy.contains('div.option', 'Imperial: °F, mph').parent('.switch-container').should('have.attr', 'blue', '');

      // Search and select the city again (as unit changed)
      cy.get('input[placeholder="Search city"]').click({ force: true }).clear().type(cityName);
      cy.get('.button-round.dark').click({ force: true });
      cy.get('.search-dropdown-menu li:first-child').click();

      // Validate temperature in Fahrenheit
      cy.request({
        method: 'GET',
        url: 'https://openweathermap.org/data/2.5/onecall',
        qs: {
          lat: 33.7104,
          lon: 73.1338,
          units: 'imperial',
          appid: '439d4b804bc8187953eb36d2a8c26a02',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.current).to.have.property('temp');

        //Saving temperature from API response in a constant roundedTempF
        const currentTempF = response.body.current.temp;
        const roundedTempF = Math.round(currentTempF);

        //Verifying the temperature from API response (roundedTempF) with the temperature shown on the front-end are identical
        cy.get('.current-temp [class*="heading"]').should('have.text', roundedTempF + '°F');

        // Additional assertions or validations for Fahrenheit
        expect(roundedTempF).to.be.a('number');
        expect(roundedTempF).to.be.within(-50, 120);

        // Log the temperatures in Centigrade & Fahrenheit
        cy.log(`Temperature in Centigrade: ${roundedTempC}°C`);
        cy.log(`Temperature in Fahrenheit: ${roundedTempF}°F`);
      });
    });
  });
});

describe('City Filter', () => {
  before(() => {
    // Visit the OpenWeatherMap website
    cy.visit('https://openweathermap.org/');
    // Wait for 2 seconds
    cy.wait(2000);
  });

  it('Select Invalid City and verify error message', () => {
    // Define an invalid city name
    const cityName = 'qwerty';

    // Click on the input field for searching a city and type the invalid city name
    cy.get('input[placeholder="Search city"]').click({ force: true }).type(cityName);
    
    // Click on the search button to initiate the search
    cy.get('.button-round.dark').click({ force: true });
    
    // Wait for 1 second to allow the search results to load
    cy.wait(1000);

    // Within the notification widget, verify the error message for the invalid city
    cy.get('.widget-notification').within(() => {
      // Assert that the error message is visible and contains the expected text
      cy.contains('span[data-v-10aab74f]', 'No results for ' + cityName, { timeout: 10000 })
        .should('be.visible')
        .should('contain', 'No results for ' + cityName);
    });
  });
});


describe('Forecast of the week', () => {
  beforeEach(() => {
    // Visit the website and wait for it to load
    cy.visit('https://openweathermap.org/');
    cy.wait(5000);
  });

  it('Click on days to see the forecast', () => {
    const cityName = 'islamabad';

    // Select Metric unit
    cy.contains('div.option', 'Metric: °C, m/s').click({ force: true });
    cy.contains('div.option', 'Metric: °C, m/s').parent('.switch-container').should('have.attr', 'blue', '');

    // Search and select the city
    cy.get('input[placeholder="Search city"]').click({ force: true }).type(cityName);
    cy.wait(2000);

    // Define the days of the week
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get the current day index
    const todayIndex = new Date().getDay();

    // Get the expected day based on the current day index
    const expectedDay = daysOfWeek[todayIndex];

    // Select the list of days
    cy.get('.day-list')
      .find('li')
      .each(($li, index) => {
        // Get the expected day for each list item
        const currentDay = moment().add(index, 'days').format('ddd');

        // Click on the current list item
        cy.wrap($li)
          .click({ multiple: true, force: true })
          .wait(2000) // Wait for 2 seconds before clicking the next item

          // Assertion to check if the day matches the expected day
          .should('contain', currentDay);
      });
  });
});
