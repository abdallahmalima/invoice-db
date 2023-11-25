const useHostName = () => {
    let url = 'http://localhost:3000';

     if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if(hostname==='samakisamaki.jasmai.design'){
            url = 'https://samakisamaki.jasmai.design'
        }
     }

     return {url}
  };
  
  export default useHostName;