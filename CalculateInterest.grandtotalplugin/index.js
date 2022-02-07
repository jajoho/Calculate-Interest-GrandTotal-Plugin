// 	Return a JSON with the values you like to replace

// 	Keys:
// 	delayStart -> Delay period start date (date, formatted)
// 	delayEnd -> Delay period end date (date, formatted)
// 	originalClaimAmount -> Outstanding debt (number)
// 	interestRate -> Interest rate (number)
//	ownInterestRate -> Own interest rate, if the automatically calculated one is to be overwritten (number)

// Interest rate calculated with actual/360 method (EZB): https://en.wikipedia.org/wiki/Day_count_convention#Actual/360
var actEZB = parseInt(360.00);

// Function to fetch via API the prime rate from bundesbank.de
function getXML() {
  const URL = "https://api.statistiken.bundesbank.de/rest/data/";
  const PATH = "BBK01/SU0115?detail=dataonly&lastNObservations=1";
  string = loadURL("GET", URL + PATH);
  if (!string.startsWith("<")) {
    return log(localize("Check Internet Connection"));
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
var primeInterest = interestRate + primeRate;

///Calculate delay period in number of days
delayEnd = new Date(delayEnd);
delayStart = new Date(delayStart);

// Calculate difference between start and end of default period
var delayInDays = ((delayEnd - delayStart) / (1000 * 3600 * 24)) + 1; // +1 to count first and last day

// Calculate final interest rate with own interest rate or prime rate from bundesbank.de
function calculatedInterestRate() {
  if (ownInterestRate > 0) {
    return ownInterestRate;
  }
  else {
    result = primeInterest;
    return result;
  }
}
var interestRate = calculatedInterestRate();

// Calculate interest
var sumInterest = ((originalClaimAmount * interestRate) / 100 / actEZB) * delayInDays;

optionsLocaleDate = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

// Distinction between 1 and several days for notes
function localizeDay() {
  if (delayInDays < 0) {
    return `${localize("ErrorDayCount")}`;
  }
  if (delayInDays == 1) {
    return `${localize("DelayPeriod")}: ${new Intl.NumberFormat().format(delayInDays)} ${localize("Day")} (${delayStart.toLocaleDateString(optionsLocaleDate)})`;
  } else {
    return `${localize("DelayPeriod")}: ${new Intl.NumberFormat().format(delayInDays)} ${localize("Days")} (${localize("from")} ${delayStart.toLocaleDateString(optionsLocaleDate)} ${localize("until")} ${delayEnd.toLocaleDateString(optionsLocaleDate)})`;
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

  aLine = `${localizeDay()}\n${localize("OriginalClaimAmount")}: ${new Intl.NumberFormat('lookup', { style: 'currency', currency: 'EUR', currencyDisplay: 'code' }).format(originalClaimAmount)}\n${localize("InterestRate")}: ${new Intl.NumberFormat("de-DE").format((interestRate))} %`;

  aLine = "<i>" + aLine + "</i>";

  if (aNotes.length > 0) aNewNotes = aNotes + aLine;
  else aNewNotes = aLine;

  result.notes = aNewNotes;
  result.unitPrice = Math.round(sumInterest * 100) / 100;

  return result;
}

function removePrevious(s) {
  const regExp = /(\<i)\s*[^\>]*\>([^\<]*\<\/i>)?/gi;
  return s.replace(regExp, "");
}
