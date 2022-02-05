/*
	Return a JSON with the values you like to replace
	
	Keys:
	delayEnd -> Delay period end date (date, formatted)
	delayStart -> Delay period start date (date, formatted)
	outstandingDebt -> Outstanding debt (number)
	interestRate -> Interest rate (number)

*/

// Function to fetch via API the prime rate from bundesbank.de
function getXML() {
	string = loadURL("GET", "https://api.statistiken.bundesbank.de/rest/data/BBK01/SU0115?detail=dataonly&lastNObservations=1");
	if (string.length == 0) {
		return null;
	}
	getString();
	return result;

	function getString() {
		var regExp = /-[0-9]*\.[0-9]+/m;
		result = string.match(regExp);
	}
}

// Check if year is leap (366 days) year or regular year (365 days) for interest calculation
function daysOfYear(year) {
	return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
	return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

var currentTime = new Date();
var currentYear = currentTime.getFullYear();


update();

function update() {
	var result = {};

	///Calculate delay period in number of days
	delayEnd = new Date(delayEnd);
	delayStart = new Date(delayStart);
	var delayInDays = ((delayEnd - delayStart) / (1000 * 3600 * 24)) + 1; // +1 to count first and last day

	// Calculate final interest rate with interest rate entered by user and prime rate from bundesbank.de 
	var calculatedInterestRate = parseInt(interestRate) + parseInt(getXML());

	// Calculate interest and round the result of the calculation
	var sumInterest = originalClaimAmount * calculatedInterestRate / 100 / daysOfYear(currentYear) * delayInDays;
	var interestRounded = Math.round((sumInterest + Number.EPSILON) * 100) / 100;

	// Create and change notes and provide GrandTotal interest sum for the document
	var aNotes = valueForKeyPath("notes");
	if (!aNotes)
		aNotes = "";

	aNotes = removePrevious(aNotes);

	optionsLocaleDate = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};


	aLine = `${localize("Delay Period")}: ${delayInDays} ${localize("Days")} (${localize("from")} ${delayStart.toLocaleDateString('de-De', optionsLocaleDate)} ${localize("until")} ${delayEnd.toLocaleDateString('de-De', optionsLocaleDate)})\n${localize("Original claim amount")}: ${currency} ${formattedNumber(originalClaimAmount)}\n${localize("Interest rate")}: ${formattedNumber(calculatedInterestRate)} %`;


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

