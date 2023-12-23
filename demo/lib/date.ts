export function calculateDateDifference(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  
    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
  
    const differenceInDays = Math.round(Math.abs((endDateTime - startDateTime) / oneDay));
  
    return differenceInDays;
  }