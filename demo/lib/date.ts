export function calculateDateDifference(startDate, endDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  
    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
  
    const differenceInDays = Math.round(Math.abs((endDateTime - startDateTime) / oneDay));
  
    return differenceInDays;
  }



 export  const getCheckInDateRange = (products) => {
    let lowestCheckIn = null;
    let highestCheckIn = null;
  
    if (products.length > 0) {
      // Extract check-in dates from products
      const checkInDates = products.map((product) => product.check_in);
  
      // Filter out null values
      const validCheckInDates = checkInDates.filter((date) => date);
  
      if (validCheckInDates.length > 0) {
        // Find the lowest and highest check-in dates
        lowestCheckIn = new Date(Math.min(...validCheckInDates));
        highestCheckIn = new Date(Math.max(...validCheckInDates));
      }
    }
  
    return { lowestCheckIn, highestCheckIn };
  };


  export function convertDateFormat(dateString) {
    // Check if the dateString is not null or undefined
    if (!dateString) {
      return 'Invalid'; // Or any default value you prefer
    }
  
    const dateComponents = dateString.split('/');
  
    // Check if the date has three components (day, month, and year)
    if (dateComponents.length !== 3) {
      return 'Invalid';
    }
  
    const [day, month, year] = dateComponents;
  
    // Use the JavaScript Date object to validate the date
    const parsedDate = new Date(`${month}/${day}/${year}`);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid';
    }
  
    return `${month}/${day}/${year}`;
  }
  
  
  
 