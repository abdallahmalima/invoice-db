export function isLocalhost(){
    return process.env.NODE_ENV=='localhost'
}

export function isProduction(){
    return process.env.NODE_ENV=='production'
}

export function isDevelopment(){
    return process.env.NODE_ENV=='development'
}

export function getReportEmails(emails){
    if(isLocalhost()|| isDevelopment()){
        return ['abdallahantony55.aa@gmail.com']
      }
        return emails  
}