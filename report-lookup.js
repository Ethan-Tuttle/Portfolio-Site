const loadingEl = document.createElement('div');
const loadingHeading = document.createElement('h1');
loadingHeading.classList.add('centered');
loadingHeading.classList.add('title');
const loadingDescription = document.createElement('p');
loadingDescription.classList.add('centered');
loadingDescription.classList.add('description');


const loadingWindow = {
    raw_text: {
        icon_text_raw: `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>`,
        loading_window_title_raw: "Running Lookup",
        loading_window_reason_raw: "Performing lookup magic.."
    },
    html_elements: {
        icon_html_element: loadingEl,
        title_html_element: loadingHeading,
        body_description_html_element: loadingDescription,
    }
};

document.addEventListener('DOMContentLoaded' , () => {
    const reportCardSubmit = document.getElementById('report_card_lookup');

    reportCardSubmit.addEventListener('click' , async () => {
        await runReportLookup();
    });
});


async function runReportLookup( ) {
    const url = document.getElementById('report_card_url').value;
    if ( url == '' ) {
        return;
    }

    // empty form
    const formBody = document.querySelector('.form-wrapper');
    formBody.innerHTML = '';

    // set up loading 
    // add heading
    loadingWindow.html_elements.title_html_element.innerHTML = loadingWindow.raw_text.loading_window_title_raw;
    formBody.append( loadingWindow.html_elements.title_html_element );

    // add loading
    loadingWindow.html_elements.icon_html_element.innerHTML = loadingWindow.raw_text.icon_text_raw;
    formBody.append( loadingWindow.html_elements.icon_html_element );

    // add reason
    loadingWindow.html_elements.body_description_html_element.innerHTML = loadingWindow.raw_text.loading_window_reason_raw;
    formBody.append( loadingWindow.html_elements.body_description_html_element );

    // start lookup 
    const response = await fetch( url );
    const description = document.querySelector('.description');

    if ( !response.ok ) {
        
        description.innerHTML = 'Failed to retrieve data from the report card link.... the page will automatically reload in 3 seconds.';
        setTimeout( () => {
            window.location.reload();
        } , 3000 );
    }
    const results = await response.json();
    description.innerHTML = 'Data has been retrieved! Redirecting to your report...';

    setTimeout( async () => {
        await buildReport( results , url );
    } , 3000 );

    return;
}

async function buildReport( results , url ) {
    const searchSection = document.querySelector('.search-section');
    searchSection.classList.add('hidden');
    const resultsSection = document.querySelector('.report-results');
    const resultsBody = resultsSection.querySelector('#results');
    resultsSection.classList.remove('hidden');

    // When the results are from the main endpoint...
    if ( typeof(results.report_card) === 'undefined' ) {
        resultsBody.innerHTML = results.message;
        return;
    }

    // When the results.report_card.status exists, we need to set an interval. When the status no longer exists, we are done
    // ...is starting_progress_report
    // ...is calulating_progress_report
    // ...updating_progress_report
    // For now it'll just be a status message but eventually a refresh will happen on its own
    if ( typeof(results.report_card.status) != 'undefined' ) {
        resultsBody.innerHTML = results.report_card.status;
        return;
    }
    
    //... load the data into the document
    resultsBody.innerHTML = JSON.stringify( results.report_card );
}