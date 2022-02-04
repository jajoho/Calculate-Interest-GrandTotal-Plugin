/*
	Return a JSON with the values you like to replace
	
	Keys:
	
	delayPeriod -> Delay Period (number)
	outstandingDebt -> Outstanding debt (number)
	interestRate -> Interest rate (number)

*/

/*

 function getPrimeRate(primeRate) {

	fetch("https://api.statistiken.bundesbank.de/rest/data/BBK01/SU0115?detail=dataonly&lastNObservations=1", {
		method: "GET", // POST, PUT, DELETE, etc.
		headers: {
			// the content type header value is usually auto-set
			// depending on the request body
			"Content-Type": "text/plain;charset=UTF-8"
		},
		referrerPolicy: "origin", // no-referrer, origin, same-origin...
		mode: "cors", // same-origin, no-cors
		credentials: "omit" // omit, include
	})
		.then(response => response.text())
		.then(data => {
			var parser = new DOMParser();
			var xml = parser.parseFromString(data, "text/xml");
			var obsValue = xml.getElementsByTagName("generic:Obs")[0].childNodes[1];
			var obsResult = obsValue.getAttribute("value");
			console.log(obsResult);
		});
}

getPrimeRate();

// Old function: get prime rate from Bundesbank
getPrimeRate();

function getPrimeRate() {
    return fetch("https://api.statistiken.bundesbank.de/rest/data/BBK01/SU0115?detail=dataonly&lastNObservations=1", {
        method: "GET",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8"
        },
        referrerPolicy: "origin",
        mode: "cors",
        credentials: "omit"
    })
        .then(response => response.text())
        .then(data => {
            var parser = new DOMParser();
            var xml = parser.parseFromString(data, "text/xml");
            var obsValue = xml.getElementsByTagName("generic:Obs")[0].childNodes[1];
            var obsResult = obsValue.getAttribute("value");
            //console.log("obsResult inside getPrimeRate function " + obsResult);
            return obsResult;
        })
        .then(obsResult => {
            var finalResult = 9 + +obsResult;
            //console.log("finalResult inside getPrimeRate function " + finalResult);
            return finalResult;
        });
}

 */


 async function fetch(...args) {
    const { default: fetch } = await import('node-fetch');
	 return await fetch(...args);
}

// New function: get prime rate from Bundesbank
getPrimeRate();
async function getPrimeRate() {
	let url = new URL('https://api.statistiken.bundesbank.de/rest/data/BBK01/SU0115?detail=dataonly&lastNObservations=1');
	let res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8"
        },
        referrerPolicy: "origin",
        mode: "cors",
        credentials: "omit"
    });
	if (res.ok) {
		let text = await res.text();
		var parser = new DOMParser();
		var xml = parser.parseFromString(text, "text/xml");
    	var obsValue = xml.getElementsByTagName("generic:Obs")[0].childNodes[1];
    	var obsResult = obsValue.getAttribute("value");
		//console.log(obsResult);
		var final =  parseInt(9) + +obsResult;
		return final;
	} else {
		return `HTTP error: ${res.status}`;
	}
}

let primePrimePrime = getPrimeRate().then(primeResult => {
	console.log(`then: ${primeResult}`);
});


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
	var sumInterest = originalClaimAmount * getPrimeRate() / 100 / daysOfYear(currentYear) * delayInDays;
	var interestRounded = Math.round((sumInterest + Number.EPSILON) * 100) / 100;

	/* Create and change notes and provide GrandTotal interest sum for the document*/
	var aNotes = valueForKeyPath("notes");
	if (!aNotes)
		aNotes = "";

	aNotes = removePrevious(aNotes)

	const optionsLocaleDate = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};

	aLine = `${localize("Delay Period")}: ${delayInDays} ${localize("Days")} (${localize("from")} ${delayStart.toLocaleDateString('de-De', optionsLocaleDate)} ${localize("until")} ${delayEnd.toLocaleDateString('de-De', optionsLocaleDate)})\n${localize("Original claim amount")}: ${currency} ${formattedNumber(originalClaimAmount)}\n${localize("Interest rate")}: ${getPrimeRate()} %`;


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

