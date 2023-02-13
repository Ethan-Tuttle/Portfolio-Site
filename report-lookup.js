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

    setTimeout( () => {
        buildReport( results );
    } , 3000 );

    return;
}

function buildReport( results ) {
    const searchSection = document.querySelector('.search-section');
    searchSection.classList.add('hidden');
    const resultsSection = document.querySelector('.report-results');
    const resultsBody = resultsSection.querySelector('#results');
    resultsSection.classList.remove('hidden');

    if ( results.message = "" ) {
        
    }

    resultsBody.innerHTML = results;
    return;
}