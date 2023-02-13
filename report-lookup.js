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
    // ...is updating_progress_report
    // For now it'll just be a status message but eventually a refresh will happen on its own
    if ( typeof(results.report_card.status) != 'undefined' ) {
        const dataStillLoading = document.querySelector('#data-still-loading');
        dataStillLoading.classList.remove('hidden');
        const heading = dataStillLoading.querySelector('.loading-status');
        const msg = dataStillLoading.querySelector('.loading-desc');

        if ( results.report_card.status == "starting_progress_report" ) {
            heading.innerHTML = 'Running Your First Report';
            msg.innerHTML = 'We are running your very first report. Hold tight! This can take up to 5 minutes. If you want to check your progress, refresh the page and run your report again.';
        } else if ( results.report_card.status == "calulating_progress_report" ) {
            heading.innerHTML = 'Calculating Your Report';
            msg.innerHTML = 'We are running currently processing the data for your report. Hold tight! This can take up to 5 minutes. If you want to check your progress, refresh the page and run your report again.';
        } else if ( results.report_card.status == "updating_progress_report" ) {
            heading.innerHTML = 'Your Report Data is Out of Date';
            msg.innerHTML = 'It looks like your report is a bit out of date. We are working on getting your updated data. Hold tight! This can take up to 5 minutes. If you want to check your progress, refresh the page and run your report again.';
        }
        
        return;
    }
    
    //... load the data into the document
    resultsBody.innerHTML = '';
    resultsBody.classList.add('grid');
        
    let resultTables = [`
        <table>
            <tr>
                <th>Total Raid Clears</th>
                <th>Total Score</th>
            
            </tr>
            <tr>
                <td>${results.report_card.totalRaidClears.total}</td>
                <td>${results.report_card.totalRaidClears.score.toFixed( 2 )}</td>
            </tr>
        </table>` ,
        `<table>
        <tr>
            <th>Total Day One Raid Clears</th>
            <th>Total Score</th> 
        </tr>
        <tr>
            <td>${results.report_card.totalDayOneRaidClears.total}</td>
            <td>${results.report_card.totalDayOneRaidClears.score.toFixed( 2 )}</td>
        </tr>
        </table>`,
        `<table>
        <tr>
            <th>Total Low Man Raid Clears</th>
            <th>Total Score</th> 
        </tr>
        <tr>
            <td>${results.report_card.totalLowManRaidClears.total}</td>
            <td>${results.report_card.totalLowManRaidClears.score.toFixed( 2 )}</td>
        </tr>
        </table>`,
        `<table>
        <tr>
            <th>Total Flawless Raid Clears</th>
            <th>Total Score</th> 
        </tr>
        <tr>
            <td>${results.report_card.totalFlawlessRaidClears.total}</td>
            <td>${results.report_card.totalFlawlessRaidClears.score.toFixed( 2 )}</td>
        </tr>
        </table>`,
        `<table>
        <tr>
            <th>Total Dungeon Clears</th>
            <th>Total Score</th> 
        </tr>
        <tr>
            <td>${results.report_card.totalDungeonClears.total}</td>
            <td>${results.report_card.totalDungeonClears.score.toFixed( 2 )}</td>
        </tr>
        </table>`,
        `<table>
        <tr>
            <th>Total Day One Dungeon Clears</th>
            <th>Total Score</th> 
        </tr>
        <tr>
            <td>${results.report_card.totalDayOneDungeonClears.total}</td>
            <td>${results.report_card.totalDayOneDungeonClears.score.toFixed( 2 )}</td>
        </tr>
        </table>`,
        `<table>
        <tr>
            <th>Total Solo Flawless Dungeon Clears</th>
            <th>Total Score</th> 
        </tr>
        <tr>
            <td>${results.report_card.totalSoloFlawlessDungeonClears.total}</td>
            <td>${results.report_card.totalSoloFlawlessDungeonClears.score.toFixed( 2 )}</td>
        </tr>
        </table>`,
        `<table>
        <tr>
            <th>Overall Rank</th>
            <th>Overall Score</th> 
        </tr>
        <tr>
            <td>${results.report_card.rank}</td>
            <td>${results.report_card.total_points.toFixed( 2 )}</td>
        </tr>
        </table>`
    ];

    for ( let table of resultTables ) {
        let element = document.createElement('div');
        element.innerHTML = table;
        resultsBody.append( element );
    }
}