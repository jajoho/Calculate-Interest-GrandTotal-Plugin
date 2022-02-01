/*
	Return a JSON with the values you like to replace
	
	Keys:
	
	delayPeriod -> Delay Period (number)
	outstandingDebt -> Outstanding debt (number)
	interestRate -> Interest rate (number)

	
	Variables:
	
	currency
	and the ones you define in the info.plist
	
	Functions:
	
	localize(string) returns a string with the localized value (if defined)
	formattedNumber(number) returns a string with the number format for the document

*/



/*
Dokumentation: https://api.statistiken.bundesbank.de/doc/index.html?urls.primaryName=Deutsche%20REST%20API%20Dokumentation

	Anfrage Bundesbank Basiszinssatz:
		fetch("https://api.statistiken.bundesbank.de/rest/data/BBK01/SU0115?detail=dataonly&lastNObservations=1")
		  .then(response => response.text())
		  .then(data => {
		    const parser = new DOMParser();
		    const xml = parser.parseFromString(data, "application/xml");
		    console.log(xml);
		  })
		  .catch(console.error);



getPrimeRate();

function getPrimeRate() {

	fetch("https://api.statistiken.bundesbank.de/rest/data/BBK01/SU0115?detail=dataonly&lastNObservations=1", {
			method: "GET", // POST, PUT, DELETE, etc.
			headers: {
				// the content type header value is usually auto-set
				// depending on the request body
				"Content-Type": "text/plain;charset=UTF-8"
			},
			referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
			mode: "cors", // same-origin, no-cors
			credentials: "omit" // omit, include
		})
		.then(response => response.text())
		.then(data => {
			const parser = new DOMParser();
			const xml = parser.parseFromString(data, "text/xml");
			const obsValue = xml.getElementsByTagName("generic:ObsValue")[0];
			console.log(obsValue);
		});
}

*/


/* Check if year is leap (366 days) year or regular year (365 days) for interest calculation*/
function daysOfYear(year) {
	return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
	return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

var currentTime = new Date()
var currentYear = currentTime.getFullYear()


update();

function update() {
	var result = {};

	/* Calculate delay period in number of days */
	delayEnd = new Date(delayEnd);
	delayStart = new Date(delayStart);
	var delayInDays = ((delayEnd - delayStart) / (1000 * 3600 * 24)) + 1; // +1 to count first and last day

	/* Calculate interest and round the result of the calculation */
	var sumInterest = originalClaimAmount * interestRate / 100 / daysOfYear(currentYear) * delayInDays;
	var interestRounded = Math.round((sumInterest + Number.EPSILON) * 100) / 100;

	/* Create and change notes and provide GrandTotal interest sum for the document*/
	var aNotes = valueForKeyPath("notes");
	if (!aNotes)
		aNotes = "";

	aNotes = removePrevious(aNotes)

	const optionsLocaleDate = {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	};

	aLine = localize("Delay Period") + ": " + delayInDays + " " + localize("Days") + " (" + localize("from") + " " + delayStart.toLocaleDateString('de-De', optionsLocaleDate) + " " + localize("until") + " " + delayEnd.toLocaleDateString('de-De', optionsLocaleDate) + ")" + "\n" + localize("Original claim amount") + ": " + currency + " " + formattedNumber(originalClaimAmount) + "\n" + localize("Interest rate") + ": " + formattedNumber(interestRate) + " %";


	aLine = "<i>" + aLine + "</i>";

	if (aNotes.length > 0)
		aNewNotes = aNotes + aLine;
	else
		aNewNotes = aLine;

	result["notes"] = aNewNotes;
	result["unitPrice"] = interestRounded;

	return result;
}


function removePrevious(s) {
	var regExp = /(\<i)\s*[^\>]*\>([^\<]*\<\/i>)?/gi;
	return s.replace(regExp, "");
}
