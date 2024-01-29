import { calculateDateDifference } from "./date";
import { isDevelopment, isProduction } from "./env";

export function getTotalTodayPayments(products) {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();
  
    return products
      .filter(payment => {
        const paymentDate = payment.check_in;
        return (
          paymentDate.getFullYear() === todayYear &&
          paymentDate.getMonth() === todayMonth &&
          paymentDate.getDate() === todayDate
        );
      })
      .map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            payment:product.payment*days
        }
      })
      .reduce((total, payment) => total + payment.payment, 0);
  }
  

  export function getTotalThisWeekPayments(products) {

    const {  currentWeekMonday, currentWeekSunday } = getCurrentWeekMondayAndSunday();
    
    const filtedProducts= products
    .filter(payment => {
      const paymentDate = payment.check_in;
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDay = paymentDate.getDate();

      const lastWeekMondayYear =  currentWeekMonday.getFullYear();
      const lastWeekMondayMonth =  currentWeekMonday.getMonth();
      const lastWeekMondayDay =  currentWeekMonday.getDate();

      const lastWeekSundayYear =  currentWeekSunday.getFullYear();
      const lastWeekSundayMonth = currentWeekSunday.getMonth();
      const lastWeekSundayDay = currentWeekSunday.getDate();
     
      return (
        (paymentYear === lastWeekMondayYear && paymentMonth === lastWeekMondayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay <= lastWeekSundayDay) ||
        (paymentYear === lastWeekMondayYear && paymentMonth < lastWeekSundayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay >= lastWeekSundayDay)
       
      );
    }).map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            check_in:product.check_in,
            payment:product.payment*days
        }
      })

     

const totalSales=filtedProducts.reduce((total, payment) => total + payment.payment, 0);

return totalSales

   
   
  }

  export function getTotalThisMonthPayments(products) {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
  
    return products
      .filter(payment => {
        const paymentDate = payment.check_in;
        return (
          paymentDate.getFullYear() === thisYear &&
          paymentDate.getMonth() === thisMonth
        );
      })
      .map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            payment:product.payment*days
        }
      })
      .reduce((total, payment) => total + payment.payment, 0);
  }

  export function getTotalThisYearPayments(products) {
    const thisYear = new Date().getFullYear();
  
    return products
      .filter(payment => payment.check_in.getFullYear() === thisYear)
      .map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            payment:product.payment*days
        }
      })
      .reduce((total, payment) => total + payment.payment, 0);
  }


  function getLastWeekMondayAndSunday() {
    const today = new Date();

    if(isProduction()|| isDevelopment()){
      today.setHours(today.getHours() + 3);
    }

    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
    // Calculate the difference between the current day and Monday
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  
    // Calculate last week's Monday by subtracting the difference plus 7 days from the current date
    const lastWeekMonday = new Date(today);
    lastWeekMonday.setDate(today.getDate() - daysSinceMonday - 7);
  
    // Calculate last week's Sunday by subtracting one day from last week's Monday
    const lastWeekSunday = new Date(lastWeekMonday);
    lastWeekSunday.setDate(lastWeekMonday.getDate() + 6);
  
    return { lastWeekMonday, lastWeekSunday };
  }
  

  export function getTotalSalesLastWeekDataset(products) {
    const { lastWeekMonday, lastWeekSunday } = getLastWeekMondayAndSunday();
    
    
  const filtedProducts= products
    .filter(payment => {
      const paymentDate = payment.check_in;
     
     
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDay = paymentDate.getDate();

      const lastWeekMondayYear = lastWeekMonday.getFullYear();
      const lastWeekMondayMonth = lastWeekMonday.getMonth();
      const lastWeekMondayDay = lastWeekMonday.getDate();

      const lastWeekSundayYear = lastWeekSunday.getFullYear();
      const lastWeekSundayMonth = lastWeekSunday.getMonth();
      const lastWeekSundayDay = lastWeekSunday.getDate();

      return (
        (paymentYear === lastWeekMondayYear && paymentMonth === lastWeekMondayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay <= lastWeekSundayDay)
       
      );
    }).map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            check_in:product.check_in,
            payment:product.payment*days
        }
      })
    
    

 const dailyTotals = [];
  // Loop through each day from lastWeekMonday to lastWeekSunday
  let currentDate = new Date(lastWeekMonday);
  while (currentDate <= lastWeekSunday) {
    const total = filtedProducts
      .filter( product  => {
        return product.check_in.getDate() === currentDate.getDate();
      })
      .reduce((sum, { payment }) => sum + payment, 0);

    dailyTotals.push(total);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyTotals;
  }

  export function getTotalSalesLastWeekDatasetApi(products) {
    const { lastWeekMonday, lastWeekSunday } = getLastWeekMondayAndSunday();
    
    
  const filtedProducts= products
    .filter(payment => {
      const paymentDate = payment.check_in;
      paymentDate.setHours(paymentDate.getHours() + 3);
     
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDay = paymentDate.getDate();

      const lastWeekMondayYear = lastWeekMonday.getFullYear();
      const lastWeekMondayMonth = lastWeekMonday.getMonth();
      const lastWeekMondayDay = lastWeekMonday.getDate();

      const lastWeekSundayYear = lastWeekSunday.getFullYear();
      const lastWeekSundayMonth = lastWeekSunday.getMonth();
      const lastWeekSundayDay = lastWeekSunday.getDate();

      return (
        (paymentYear === lastWeekMondayYear && paymentMonth === lastWeekMondayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay <= lastWeekSundayDay)
       
      );
    }).map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            check_in:product.check_in,
            payment:product.payment*days
        }
      })
    
    

 const dailyTotals = [];
  // Loop through each day from lastWeekMonday to lastWeekSunday
  let currentDate = new Date(lastWeekMonday);
  while (currentDate <= lastWeekSunday) {
    const total = filtedProducts
      .filter( product  => {
        return product.check_in.getDate() === currentDate.getDate();
      })
      .reduce((sum, { payment }) => sum + payment, 0);

    dailyTotals.push(total);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyTotals;
  }

  function getCurrentWeekMondayAndSunday() {
    const today = new Date();
    if(isProduction()|| isDevelopment()){
      today.setHours(today.getHours() + 3);
    }
    const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
    // Calculate the difference between the current day and Monday
    const daysUntilMonday = dayOfWeek === 0 ? 1 - 7 : 1 - dayOfWeek;
  
    // Calculate this week's Monday by adding the difference from the current date
    const currentWeekMonday = new Date(today);
    currentWeekMonday.setDate(today.getDate() + daysUntilMonday);
  
    // Calculate this week's Sunday by adding six days to this week's Monday
    const currentWeekSunday = new Date(currentWeekMonday);
    currentWeekSunday.setDate(currentWeekMonday.getDate() + 6);
  
    return { currentWeekMonday, currentWeekSunday };
  }

  export function getTotalSalesThisWeekDataset(products) {
    const {  currentWeekMonday, currentWeekSunday } = getCurrentWeekMondayAndSunday();
    
    const filtedProducts= products
    .filter(payment => {
      const paymentDate = payment.check_in;
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDay = paymentDate.getDate();

      const lastWeekMondayYear =  currentWeekMonday.getFullYear();
      const lastWeekMondayMonth =  currentWeekMonday.getMonth();
      const lastWeekMondayDay =  currentWeekMonday.getDate();

      const lastWeekSundayYear =  currentWeekSunday.getFullYear();
      const lastWeekSundayMonth = currentWeekSunday.getMonth();
      const lastWeekSundayDay = currentWeekSunday.getDate();

      return (
        (paymentYear === lastWeekMondayYear && paymentMonth === lastWeekMondayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay <= lastWeekSundayDay)
       
      );
    }).map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            check_in:product.check_in,
            payment:product.payment*days
        }
      })
    
    

 const dailyTotals = [];
  // Loop through each day from lastWeekMonday to lastWeekSunday
  let currentDate = new Date(currentWeekMonday);
  while (currentDate <=  currentWeekSunday) {
    const total = filtedProducts
      .filter( product  => {
        return product.check_in.getDate() === currentDate.getDate();
      })
      .reduce((sum, { payment }) => sum + payment, 0);

    dailyTotals.push(total);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyTotals;

  }

  export function getTotalSalesThisWeekDatasetApi(products) {
    const {  currentWeekMonday, currentWeekSunday } = getCurrentWeekMondayAndSunday();
   
    const filtedProducts= products
    .filter(payment => {
      const paymentDate = payment.check_in;
      paymentDate.setHours(paymentDate.getHours() + 3);
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDay = paymentDate.getDate();

      const lastWeekMondayYear =  currentWeekMonday.getFullYear();
      const lastWeekMondayMonth =  currentWeekMonday.getMonth();
      const lastWeekMondayDay =  currentWeekMonday.getDate();

      const lastWeekSundayYear =  currentWeekSunday.getFullYear();
      const lastWeekSundayMonth = currentWeekSunday.getMonth();
      const lastWeekSundayDay = currentWeekSunday.getDate();

      return (
        (paymentYear === lastWeekMondayYear && paymentMonth === lastWeekMondayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay <= lastWeekSundayDay)
       
      );
    }).map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            check_in:product.check_in,
            payment:product.payment*days
        }
      })
    
    

 const dailyTotals = [];
  // Loop through each day from lastWeekMonday to lastWeekSunday
  let currentDate = new Date(currentWeekMonday);
  while (currentDate <=  currentWeekSunday) {
    const total = filtedProducts
      .filter( product  => {
        return product.check_in.getDate() === currentDate.getDate();
      })
      .reduce((sum, { payment }) => sum + payment, 0);

    dailyTotals.push(total);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyTotals;

  }


  export function calculateSalesDifference(lastWeekSales, thisWeekSales) {
    // Find the index of the last non-zero element in thisWeekSales
    const thisWeekLastSaleIndex = findLastNonZeroIndex(thisWeekSales);
  
    // Extract the sales data up to the last non-zero day for both weeks
    const lastWeekSalesSubset = lastWeekSales.slice(0, thisWeekLastSaleIndex + 1);
    const thisWeekSalesSubset = thisWeekSales.slice(0, thisWeekLastSaleIndex + 1);
  
    // Calculate total sales for each subset
    const totalLastWeekSales = lastWeekSalesSubset.reduce((sum, value) => sum + value, 0);
    const totalThisWeekSales = thisWeekSalesSubset.reduce((sum, value) => sum + value, 0);
  
    // Calculate the difference and percentage change
    const salesDifference = totalThisWeekSales - totalLastWeekSales;
    let percentageChange = totalLastWeekSales !== 0 ? ((salesDifference / totalLastWeekSales) * 100).toFixed(2) : 100;
   if(salesDifference==0){
    percentageChange=0
   }
    // Determine if it's a rise or fall
    const status = salesDifference >= 0 ? 'Rise' : 'Fall';
  
    return {
      salesDifference,
      percentageChange,
      status,
      totalLastWeekSales,
      totalThisWeekSales,
    };
  }
  
  // Helper function to find the index of the last non-zero element in an array
  function findLastNonZeroIndex(arr) {
     // If all elements are zero, get today's day of the week as the index
     const today = new Date();
     let dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
   
     // Convert dayOfWeek to match your desired indexing (0 for Monday, 6 for Sunday)
     dayOfWeek = (dayOfWeek + 6) % 7;

    for (let i = arr.length - 1; i >= 0; i--) {

        if(i==dayOfWeek){
            if(arr[dayOfWeek] == 0){
                return dayOfWeek;
            }
       }

        if (arr[i] > 0) {
          return i;
        }
      }
    
      
    
      return dayOfWeek; // Treat the day value as an index
  }

  export function calculateSalesDifferenceMonth(lastWeekSales, thisWeekSales) {
    // Find the index of the last non-zero element in thisWeekSales
    const thisWeekLastSaleIndex = findLastNonZeroIndexCurrentMonth(thisWeekSales);
  
    // Extract the sales data up to the last non-zero day for both weeks
    const lastWeekSalesSubset = lastWeekSales.slice(0, thisWeekLastSaleIndex + 1);
    const thisWeekSalesSubset = thisWeekSales.slice(0, thisWeekLastSaleIndex + 1);
  
    // Calculate total sales for each subset
    const totalLastWeekSalesMonth = lastWeekSalesSubset.reduce((sum, value) => sum + value, 0);
    const totalThisWeekSalesMonth = thisWeekSalesSubset.reduce((sum, value) => sum + value, 0);
  
    // Calculate the difference and percentage change
    const salesDifferenceMonth = totalThisWeekSalesMonth - totalLastWeekSalesMonth;
    let percentageChangeMonth = totalLastWeekSalesMonth !== 0 ? ((salesDifferenceMonth / totalLastWeekSalesMonth) * 100).toFixed(2) : 100;
    
    if(salesDifferenceMonth==0){
      percentageChangeMonth=0;
    }
    // Determine if it's a rise or fall
    const statusMonth = salesDifferenceMonth >= 0 ? 'Rise' : 'Fall';
  
    return {
      salesDifferenceMonth,
      percentageChangeMonth,
      statusMonth,
      totalLastWeekSalesMonth,
      totalThisWeekSalesMonth,
    };
  }
  
  // Helper function to find the index of the last non-zero element in an array
  function findLastNonZeroIndexCurrentMonth(arr) {
    const today = new Date();
    const dayOfMonth = today.getDate(); // 1 to 31
  
    // If today's value in the array is non-zero, return the current day
   
  
    // Find the last non-zero element in the array for each day of the month
    for (let i = arr.length - 1; i >= 0; i--) {
        if(i==(dayOfMonth - 1)){
            if (arr[dayOfMonth - 1] == 0) {
                return dayOfMonth - 1;
              }
        }
      if (arr[i] > 0) {
        return i;
      }
    }
  
    // If all elements are zero, return the adjusted day of the month
    return dayOfMonth - 1;
  }


  function getLastMonthFirstAndLastDay() {
    const today = new Date();
    
    // Calculate the first day of the last month
    const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  
    // Calculate the last day of the last month
    const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  
    return { firstDayLastMonth, lastDayLastMonth };
  }
  

  export function getTotalSalesLastMonthDataset(products) {
    const { firstDayLastMonth, lastDayLastMonth } = getLastMonthFirstAndLastDay();
// console.log(firstDayLastMonth, lastDayLastMonth)
  const filtedProducts= products
    .filter(payment => {
      const paymentDate = payment.check_in;
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDay = paymentDate.getDate();

      const lastWeekMondayYear =  firstDayLastMonth.getFullYear();
      const lastWeekMondayMonth =  firstDayLastMonth.getMonth();
      const lastWeekMondayDay =  firstDayLastMonth.getDate();

      const lastWeekSundayYear = lastDayLastMonth.getFullYear();
      const lastWeekSundayMonth = lastDayLastMonth.getMonth();
      const lastWeekSundayDay = lastDayLastMonth.getDate();

      return (
        (paymentYear === lastWeekMondayYear && paymentMonth === lastWeekMondayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay <= lastWeekSundayDay)
       
      );
    }).map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            check_in:product.check_in,
            payment:product.payment*days
        }
      })
    
    

 const dailyTotals = [];
  // Loop through each day from lastWeekMonday to lastWeekSunday
  let currentDate = new Date(firstDayLastMonth);
  while (currentDate <= lastDayLastMonth) {
    const total = filtedProducts
      .filter( product  => {
        return product.check_in.getDate() === currentDate.getDate();
      })
      .reduce((sum, { payment }) => sum + payment, 0);

    dailyTotals.push(total);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyTotals;
  }
  
  export function getCurrentMonthFirstAndLastDay() {
    const today = new Date();
    
    // Calculate the first day of the current month
    const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
    // Calculate the last day of the current month
    const lastDayThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
    return { firstDayThisMonth, lastDayThisMonth };
  }

  export function getTotalSalesCurrentMonthDataset(products) {
    const { firstDayThisMonth, lastDayThisMonth } = getCurrentMonthFirstAndLastDay();
// console.log(firstDayLastMonth, lastDayLastMonth)
  const filtedProducts= products
    .filter(payment => {
      const paymentDate = payment.check_in;
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const paymentDay = paymentDate.getDate();

      const lastWeekMondayYear =  firstDayThisMonth.getFullYear();
      const lastWeekMondayMonth =  firstDayThisMonth.getMonth();
      const lastWeekMondayDay =  firstDayThisMonth.getDate();

      const lastWeekSundayYear = lastDayThisMonth.getFullYear();
      const lastWeekSundayMonth = lastDayThisMonth.getMonth();
      const lastWeekSundayDay = lastDayThisMonth.getDate();

      return (
        (paymentYear === lastWeekMondayYear && paymentMonth === lastWeekMondayMonth) && (paymentDay >= lastWeekMondayDay && paymentDay <= lastWeekSundayDay)
       
      );
    }).map(product=>{
        const days=calculateDateDifference(product.check_in,product.check_out);
        return {
            check_in:product.check_in,
            payment:product.payment*days
        }
      })
    
    

 const dailyTotals = [];
  // Loop through each day from lastWeekMonday to lastWeekSunday
  let currentDate = new Date(firstDayThisMonth);
  while (currentDate <= lastDayThisMonth) {
    const total = filtedProducts
      .filter( product  => {
        return product.check_in.getDate() === currentDate.getDate();
      })
      .reduce((sum, { payment }) => sum + payment, 0);

    dailyTotals.push(total);
    
    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dailyTotals;
  }