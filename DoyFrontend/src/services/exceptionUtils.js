export const getResponseErrors = (error) => {

    const errorsMap = error.response.data.errors
    let errorData = []
    Object.values(errorsMap).forEach( function(value) {errorData.push(value)})
    
    return errorData
};