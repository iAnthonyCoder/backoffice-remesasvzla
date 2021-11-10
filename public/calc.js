var rates = false
var ccyFromId
var amount
var ccyToId
var globalInverse = false
var selectedRate

const url = 'https://api-remesasvzla.herokuapp.com/api/v1/refreshes/lastest'
const fetchRates = async () => {
    var respuesta = await fetch(url)
    var response = await respuesta.json();
    return response;  
}

const convertNow = (val, inverse) => {
    document.getElementById('hlink').href='#'
    globalInverse = inverse
    if(ccyFromId && ccyFromId.length > 2 && ccyToId && ccyToId.length > 2 && parseFloat(val) > 0 && !inverse) {
        
        selectedRate = rates.find(x => x.currency_to_receive._id === ccyFromId && x.currency_to_deliver._id === ccyToId)
        if(selectedRate){
            document.getElementById('hlink').href=selectedRate.url
         
            val = (val.replaceAll(',', '') * selectedRate.rate).toFixed(2).toString();
        
            if(val != "") {
              valArr = val.split('.');
              valArr[0] = (parseInt(valArr[0],10)).toLocaleString('en-US');
              val = valArr.join('.');
            }
            document.getElementById('toAmount').value = val
        }
    }
    if(ccyFromId && ccyFromId.length > 2 && ccyToId && ccyToId.length > 2 && parseFloat(val) > 0 && inverse) {
        
        selectedRate = rates.find(x => x.currency_to_receive._id === ccyFromId && x.currency_to_deliver._id === ccyToId)
        if(selectedRate){
            document.getElementById('hlink').href=selectedRate.url
           
            val = (val.replaceAll(',', '') / selectedRate.rate).toFixed(2).toString();
        
            if(val != "") {
              valArr = val.split('.');
              valArr[0] = (parseInt(valArr[0],10)).toLocaleString();
              val = valArr.join('.');
            }

            document.getElementById('fromAmount').value = val
        }
    }

    if(selectedRate){
        document.getElementById('montoTasa').innerHTML = `Tasa ${selectedRate.currency_to_receive.iso_code} $ = ${selectedRate.rate} ${selectedRate.currency_to_deliver.iso_code}`
    }
}

const addDestinations = (id) => {
    let filteredRates = rates.filter(x => x.currency_to_receive._id === id).map(x => x.currency_to_deliver).sort(function(a, b){
    if(a.iso_code < b.iso_code) { return -1; }
    if(a.iso_code > b.iso_code) { return 1; }
    return 0;
})
    let str = `<option value='0'>------</option>`
    filteredRates.map((val) => {
                    str += `<option value='${val._id}'>${val.iso_code}</option>`
                });
    let select = document.getElementById('toCcy');
    select.innerHTML = str;
}


const loadRates = () => {

    fetchRates()
        .then(res => {
            if(res && res.length > 0){
    
                let ccyFromm = res.map(x => x.currency_to_receive)
                const ids = ccyFromm.map(o => o._id)
                const filtered = ccyFromm.filter(({_id}, index) => !ids.includes(_id, index + 1)).sort(function(a, b){
    if(a.iso_code < b.iso_code) { return -1; }
    if(a.iso_code > b.iso_code) { return 1; }
    return 0;
})
                let select = document.getElementById('fromCcy');
                let str = `<option value='0'>------</option>`
                filtered.map((val) => {
                    str += `<option value='${val._id}'>${val.iso_code}</option>`
                });
                select.innerHTML = str;
                loadCalculator = true
                rates = res
            }
            document.getElementById("calculator").style.visibility="visible";
        }).catch(
            er => console.log(er)
        )
        
    
    document.getElementById("fromCcy").addEventListener("input", function(event) {

       

        if(event.target.value != '0'){
            ccyFromId = event.target.value
            
            addDestinations(event.target.value)
            amount = null
            ccyToId = null
            inverse = false
            selectedRate = null
            document.getElementById('toAmount').value = ''
            document.getElementById('fromAmount').value = ''
            document.getElementById('montoTasa').innerHTML = ''
            convertNow()
        }
    });
    
    document.getElementById("toCcy").addEventListener("input", function(event) {
       
         if(event.target.value != '0'){
            ccyToId = event.target.value
            if(amount.length > 0){
                convertNow(amount, globalInverse)
            }
            // document.getElementById('toAmount').value = ''
            // document.getElementById('fromAmount').value = ''
            // document.getElementById('montoTasa').innerHTML = ''
            
        }
    });
    
    document.getElementById("fromAmount").addEventListener("input", function(event) {
         var val = event.target.value;
      val = val.replace(/[^0-9\.]/g,'');
        
      if(val != "") {
        valArr = val.split('.');
        valArr[0] = (parseInt(valArr[0],10)).toLocaleString('en-US');
        val = valArr.join('.');
      }
        amount = event.target.value
        convertNow(val, false)
        event.target.value = val
    });


    
    document.getElementById("toAmount").addEventListener("input", function(event) {
         var val = event.target.value;
      val = val.replace(/[^0-9\.]/g,'');
        
      if(val != "") {
        valArr = val.split('.');
        valArr[0] = (parseInt(valArr[0],10)).toLocaleString('en-US');
        val = valArr.join('.');
      }
        amount = event.target.value
        inverse = true
        convertNow(val, true)
        event.target.value = val
    });
}
window.onload=loadRates;

