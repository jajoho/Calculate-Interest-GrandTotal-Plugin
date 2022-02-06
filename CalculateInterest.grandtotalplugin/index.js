// 	Return a JSON with the values you like to replace

// 	Keys:
// 	delayStart -> Delay period start date (date, formatted)
// 	delayEnd -> Delay period end date (date, formatted)
// 	outstandingDebt -> Outstanding debt (number)
// 	interestRate -> Interest rate (number)
//	ownInterestRate -> Own interest rate, if the automatically calculated one is to be overwritten (number)

// Function to fetch via API the prime rate from bundesbank.de
function getXML() {
  const URL = "https://api.statistiken.bundesbank.de/rest/data/";
  const PATH = "BBK01/SU0115?detail=dataonly&lastNObservations=1";
  string = loadURL("GET", URL + PATH);
  if (string.length == 0) {
    return null;
  } else {
    getString();
    return result;

    function getString() {
      const regExp = /-[0-9]*\.[0-9]+/m;
      result = string.match(regExp);
    }
  }
}

var primeRate = getXML();
var primeRate = parseFloat(primeRate);
var primeInterest = parseInt(interestRate) + primeRate;

// Check if year is leap (366 days) year or regular year (365 days) for interest calculation
function daysOfYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

var currentTime = new Date();
var currentYear = currentTime.getFullYear();

///Calculate delay period in number of days
delayEnd = new Date(delayEnd);
delayStart = new Date(delayStart);

// Math.round to still have delayInDays without decimals (can occur when date strings are not unified)
var delayInDays = Math.round((delayEnd - delayStart) / (1000 * 3600 * 24) + 1); // +1 to count first and last day

// Calculate final interest rate with own interest rate or prime rate from bundesbank.de
function calculatedInterestRate() {
  if (ownInterestRate > 0) {
    return ownInterestRate;
  }
  if (primeRate == null) {
    return localize("Check Internet Connection");
  } else {
    result = primeInterest;
    return result;
  }
}
var finalInterestRate = calculatedInterestRate();

// Calculate interest and round the result of the calculation
var sumInterest = ((originalClaimAmount * finalInterestRate) / 100 / daysOfYear(currentYear)) * delayInDays;
var interestRounded = Math.round((sumInterest + Number.EPSILON) * 100) / 100;

optionsLocaleDate = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

// Distinction between 1 and several days for notes
function localizeDay() {
  if (delayInDays == 1) {
    return `${localize("Day")} (${delayStart.toLocaleDateString("de-De", optionsLocaleDate)})`;
  } else {
    return `${localize("Days")} (${localize("from")} ${delayStart.toLocaleDateString("de-De", optionsLocaleDate)} ${localize("until")} ${delayEnd.toLocaleDateString("de-De", optionsLocaleDate)})`;
  }
}

// Update unit price and notes
update();

function update() {
  var result = {};

  // Create and change notes and provide GrandTotal interest sum for the document
  var aNotes = valueForKeyPath("notes");
  if (!aNotes) aNotes = "";

  aNotes = removePrevious(aNotes);

  aLine = `${localize("DelayPeriod")}: ${new Intl.NumberFormat("de-DE").format(delayInDays)} ${localizeDay()}\n${localize("OriginalClaimAmount")}: ${currency} ${formattedNumber(originalClaimAmount)}\n${localize("InterestRate")}: ${formattedNumber(finalInterestRate)} %`;

  aLine = "<i>" + aLine + "</i>";

  if (aNotes.length > 0) aNewNotes = aNotes + aLine;
  else aNewNotes = aLine;

  result.notes = aNewNotes;
  result.unitPrice = interestRounded;

  return result;
}

function removePrevious(s) {
  const regExp = /(\<i)\s*[^\>]*\>([^\<]*\<\/i>)?/gi;
  return s.replace(regExp, "");
}
