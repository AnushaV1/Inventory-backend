const axios = require('axios');
//"885909950805"
class getProductFromAPI{
static async getProduct(upc_code) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            }

    const res = await axios.post('https://api.upcitemdb.com/prod/trial/lookup', {"upc": `${upc_code}`},{
        headers: headers
    } );
    const result = res.data;
    
    if((result.code === "OK") && result.items.length!== 0) {
        return result.items[0]
    }

} catch (error) {
    if(error === "Error: Request failed with status code 400") {
        console.log("error caught with 400")
        return error;
}
    
}
}
}

module.exports = getProductFromAPI;


