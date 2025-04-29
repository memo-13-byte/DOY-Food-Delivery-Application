export const getResponseErrors = (error) => {
    const errorsMap = error.response.data.errors
    
    if (typeof errorsMap === 'string' || errorsMap instanceof String) {
        return [errorsMap]
    }
    let errorData = []
    Object.values(errorsMap).forEach( function(value) {errorData.push(value)})
    
    return errorData
};