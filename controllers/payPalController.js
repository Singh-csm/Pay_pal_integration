const payPal = require("paypal-rest-sdk");
const dotenv = require("dotenv");
dotenv.config()
const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY }= process.env;

payPal.configure({
    "mode": PAYPAL_MODE,
    "client_id": PAYPAL_CLIENT_KEY,
    "client_secret": PAYPAL_SECRET_KEY
})


const renderBuyPage = async(req, res) => {
    try {
        res.render("index");
    } catch (error) {
        console.log(error.message);
    }
}


const payProduct = async(req, res) => {
    try {
        const payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
                "item_list":{
                    "items": [{
                        "name": "Time",
                        "sku" : "001",
                        "price": "75.00",
                        "currency":"USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency":"USD",
                    "total": "75.00"
                },
                "description": "Have a wondeful day!"
            }]
        };

        payPal.payment.create(payment_json, function(error, payment){
            if(error) {
                throw error;
            }else{
                for(let i=0; i<payment.links.length; i++){
                    if(payment.links[i].rel === "approval_url"){
                        res.redirect(payment.links[i].href);
                    }
                }
            }
        });

    } catch (error) {
        console.log(error.message);
    }
}


const successPage = async(req, res) => {
    try {
        const payerId = req.query.payerID;
        const paymentId = req.query.paymentId;
    
        const execute_payment_json = {
            "payerId": payerId,
            "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": "75.00"
                    }
            }]
        }
    
        payPal.payment.execute(paymentId, execute_payment_json, function (error, payment){
            if (error){
                throw error;
            }else{
                res.render("success");
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}


const cancelPage = async (req, res) => {
    try {
        res.render("cancel")
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = { renderBuyPage, payProduct, successPage, cancelPage}