const axios = require('axios');
const bip39 = require('bip39');

module.exports = {

createMnemonic: async (req, res) => {
    const mnemonic = bip39.generateMnemonic()
    let response = {status:true, mnemonic:mnemonic};
    res.send(response);
    },

createWallet: async (req, res) => {

    if (req.body.name && req.body.passphrase && req.body.mnemonic_sentence && !req.body.name == "" && !req.body.passphrase == "" && !req.body.mnemonic_sentence == "") {
        await axios.post('https://localhost:8090/v2/byron-wallets',{style:req.body.style, name:req.body.name, passphrase:req.body.passphrase, mnemonic_sentence:req.body.mnemonic_sentence}).then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            console.log(err)
            let response = {status:false, message:"Unable to Create Address by Wallet Id, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid name or passphrase & Try Again!!!"};
        res.send(response);
     }
},

getWalletByWalletId: async (req, res) => {

    if (req.query.walletId && !req.query.walletId == "") {
        await axios.get('http://localhost:8090/v2/byron-wallets/'+req.query.walletId).then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            let response = {status:false, message:"Unable to get Wallet Details By Id, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Wallet Id & Try Again!!!"};
        res.send(response);
    }
},

listWallets: async (req, res) => {

    await axios.get('http://localhost:8090/v2/byron-wallets').then(async output=>{
        let response = {status:true, data: output.data};
        res.send(response);
    }).catch(err => {
        let response = {status:false, message:"Unable to get list of Wallets, Please Try Again!!!"};
        res.send(response);
    })
},
    
createAddressByWalletId: async (req, res) => {

    if (req.body.walletId && req.body.passphrase && req.body.address_index && !req.body.walletId == "" && !req.body.passphrase == "" && !req.body.address_index == "") {
        await axios.post(`http://localhost:8090/v2/byron-wallets/${req.body.walletId}/addresses`,{passphrase:req.body.passphrase,address_index:req.body.address_index}).then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            console.log(err)
            let response = {status:false, message:"Unable to Create Address by Wallet Id, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Wallet Id or passphrase or address index & Try Again!!!"};
        res.send(response);
    }
},

getAddressByWalletId: async (req, res) => {

    if (req.query.walletId && !req.query.walletId == "") {
        await axios.get('http://localhost:8090/v2/byron-wallets/'+req.query.walletId+'/addresses').then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            let response = {status:false, message:"Unable to get Address by Wallet Id, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Wallet Id & Try Again!!!"};
        res.send(response);
    }
},

getbalanceOfAddress: async (req, res) => {

    if (req.query.address && !req.query.address == "") {
        await axios.get('https://explorer.cardano-testnet.iohkdev.io//api/addresses/summary/'+req.query.address).then(async output=>{
            var balance = output.data.Right.caBalance.getCoin;
            let response = {status:true, balance: balance};
            res.send(response);
        }).catch(err => {
            let response = {status:false, message:"Unable to get Balance by Address, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Address & Try Again!!!"};
        res.send(response);
    }
},

transfer: async (req, res) => {
    var body = {
        "payments": [
           {
             "address": req.body.address,
             "amount": {
                "quantity": req.body.amount,
                "unit": "lovelace"
             }
            }
        ],
        "passphrase": req.body.passphrase
    }
    if (req.body.walletId && !req.body.walletId == "" ) {
        await axios.post(`http://localhost:8090/v2/byron-wallets/${req.body.walletId}/transactions`,body).then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            console.log(err)
            let response = {status:false, message:"Unable to transfer Funds by Wallet Id, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Wallet Id or passphrase or address index & Try Again!!!"};
        res.send(response);
    }
},

getTransactionByAddress: async (req, res) => {

    if (req.query.address && !req.query.address == "") {
        await axios.get('https://explorer.cardano-testnet.iohkdev.io//api/addresses/summary/'+req.query.address).then(async output=>{
            var transaction = output.data.Right.caTxList;
            let response = {status:true, transaction: transaction};
            res.send(response);
        }).catch(err => {
            let response = {status:false, message:"Unable to get Balance by Address, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Address & Try Again!!!"};
        res.send(response);
    }
},

getTransactionByWalletId: async (req, res) => {

    if (req.query.walletId && !req.query.walletId == "") {
        await axios.get('http://localhost:8090/v2/byron-wallets/'+req.query.walletId+'/transactions').then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            let response = {status:false, message:"Unable to get Transaction by Wallet Id, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Wallet Id & Try Again!!!"};
        res.send(response);
    }
},

getTransactionByTransactionId: async (req, res) => {

    if (req.query.walletId && req.query.transactionId && !req.query.walletId == "" && !req.query.transactionId == "") {
        await axios.get('http://localhost:8090/v2/byron-wallets/'+req.query.walletId+'/transactions'/+req.query.transactionId).then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            console.log(err)
            let response = {status:false, message:"Unable to get Transactions by Transaction Id, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Wallet Id or Transaction Id & Try Again!!!"};
        res.send(response);
    }
},

getTransactionFee: async (req, res) => {
    var body = {
        "payments": [
           {
             "address": req.body.address,
             "amount": {
                "quantity": req.body.amount,
                "unit": "lovelace"
             }
            }
        ],
        "passphrase": req.body.passphrase
    }
    if (req.body.walletId && !req.body.walletId == "" ) {
        await axios.post(`http://localhost:8090/v2/byron-wallets/${req.body.walletId}/payment-fees`,body).then(async output=>{
            let response = {status:true, data: output.data};
            res.send(response);
        }).catch(err => {
            let response = {status:false, message:"Unable to get Transaction Fee, Please Try Again!!!"};
            res.send(response);
        });
    } else {
        let response = {status:false, message:"Enter valid Wallet Id & Try Again!!!"};
        res.send(response);
    }
},

getStatus: async (req, res) => {
    let return_val = {
        status: false,
        data: ""
    }
    await axios.get('http://localhost:8090/v2/network/information').then(async output=>{
        return_val.status = true;
        return_val.data = output.data;
        res.send(return_val);
    }).catch(err => {
        let response = {status:false, message:"Unable to get Status, Please Try Again!!!"};
        res.send(response);
    })
},

}
