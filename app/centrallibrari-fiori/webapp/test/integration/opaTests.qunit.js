sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/app/centrallibrarifiori/test/integration/FirstJourney',
		'com/app/centrallibrarifiori/test/integration/pages/BooksList',
		'com/app/centrallibrarifiori/test/integration/pages/BooksObjectPage',
		'com/app/centrallibrarifiori/test/integration/pages/ActiveLoansObjectPage'
    ],
    function(JourneyRunner, opaJourney, BooksList, BooksObjectPage, ActiveLoansObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/app/centrallibrarifiori') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBooksList: BooksList,
					onTheBooksObjectPage: BooksObjectPage,
					onTheActiveLoansObjectPage: ActiveLoansObjectPage
                }
            },
            opaJourney.run
        );
    }
);