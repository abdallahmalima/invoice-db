const useHostName = () => {
    let url = 'http://localhost:3000';

     if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if(hostname==='joshmal.jasmai.design'){
            url = 'https://joshmal.jasmai.design'
        }
     }

     return {url}
  };
  
  export default useHostName;