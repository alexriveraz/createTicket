var debug = require('debug')('mod_remedyws')

const soapRequest = require('easy-soap-request');

woTpl={
	"remedyUsr": "arzamora@kionetworks.com",
	"remedyPwd": "0159W4$t3",
	"woStatus": "Assigned",
	"shortDescr": "Resumen de la petición",
	"requestMgr": "",
	"asigneeGrps": "",
	"empResol": "KIO NETWORKS",
	"Site": "",
	"custFullName": "JUAN ESQUIVEL FLORES",
	"reqID": "",
	"reqSuppOrg": "Sigma Business Data Services",
	"supportOrg": "Sigma Business Data Services",
	"reqAsignee": "",
	"supportCo": "KIO NETWORKS",
	"resolution":"",
	"supportGrpName": "Plataforma ITSM",
	"statusReason": "",
	"detailedDescr": "Este es un texto de prueba para la descripción",
	"custMiddleName": "",
	"woID": "",
	"woType": "2000",
	"woPriority": "3",
	"manufacturer2": "",
	"productName2": "",
	"kioRepSrc": "4200",
	"createdFromFlag": "1",
	"reqMgrCo": "KIO NETWORKS",
	"prodCatT1": "",
	"prodCatT2": "",
	"prodCatT3": "",
	"custLastName": "ESQUIVEL FLORES",
	"custCo": "KIO NETWORKS",
	"custPersonID": "",
	"custFirstName": "JUAN",
	"custIntEmail": "jesquivelf@kionetworks.com",
	"custOrg": "Sigma Business Data Services",
	"custDept": "",
	"lastName": "ESQUIVEL FLORES",
	"firstName": "JUAN",
	"middleInitial": "",
	"org": "",
	"mgrSuppOrg": "Sigma Business Data Services",
	"mgrSuppGrpName": "Plataforma ITSM",
	"summary": "Resúmen de la petición",
	"locationCo": "KIO NETWORKS",
	"categoryT1": "PRUEBAS DE IMPACTO",
	"categoryT2": "PRUEBAS DE IMPACTO",
	"categoryT3": "PRUEBAS DE IMPACTO",
	"intEmail": "jesquivelf@kionetworks.com",
    "ddlPrio": "3",
	"ddlUrg": "4000",
	"ddlImp": "4000",
	"company": "KIO NETWORKS",
	"persID": "",
	"action": "CREATE",
	"region": "",
	"siteGrp": "",
	"dept": "",
	"reqLoginID": "",
	"cliente": "jesquivelf@kionetworks.com",
	"grpSuppAsign": "Plataforma ITSM",
	"impact": "4000",
	"urgency": "4000",
	"priority": "3",
	"submitter": "jesquivelf@kionetworks.com"
};
extraMsg="";

const args = process.argv;
//console.log(args);
dataIndex=args.indexOf("--data");
if(dataIndex == -1) {
    extraMsg=extraMsg+"WARNING: No data argument passed. Creating WO with default template data..";
    //console.log("WARNING: No data argument passed. Creating WO with default template data...");
}
if (dataIndex != -1 && args[dataIndex+1] == undefined) {
    extraMsg=extraMsg+"WARNING: No text data passed to '--data' argument. Creating WO with default template data..."
    //console.log("WARNING: No text data passed to '--data' argument. Creating WO with default template data...");
}
if (dataIndex != -1 && args[dataIndex+1] != undefined) {
    data=args[dataIndex+1];
    //console.log("INFO: Found data text on index "+dataIndex+" with string: "+data);
    try {
        dataObj=JSON.parse(data);
        //console.log("dataObj:" +JSON.stringify(dataObj));
    }
    catch (error) {
        errorstr={
            "result": "error",
            "reason": err,
            "message": "Ocurrió un error al intentar procesar en formato JSON el argumento 'data'.",
            "statusCode": "100",
            "extraMessages": extraMsg
        }
        console.log(JSON.stringify(error));
        process.exit(100);
    }
    //console.log("Template Before:\n"+JSON.stringify(woTpl));
    Object.keys(dataObj).forEach(function(key) {
        woTpl[key] = dataObj[key];
        //console.log("key: "+key+", data: "+dataObj[key]);
    });
    //console.log("Template After: "+JSON.stringify(woTpl));
}
createWO();


function createWO(){
  wourl='https://kionetworks-dev.onbmc.com/arsys/services/ARService?server=onbmc-s&webService=NXR:WOI_WorkorderInterface_Create_WS__c'
  
  woEnvelope = require('./remedy_createwows_envelope');
  woHeaders = {
    'Accept-Encoding': 'gzip,deflate',
    'user-agent': 'Apache-HttpClient/4.1.1 (java 1.5)',
    'Content-Type': 'text/xml;charset=UTF-8',
    'SOAPAction': 'urn:NXR:WOI_WorkorderInterface_Create_WS__c/WorkOrder_Submit_Service'
  };
  (async () => {
    try {
      const { response } = await soapRequest({ url: wourl, headers: woHeaders, xml: woEnvelope.xml, timeout: 10000 }); // Optional timeout parameter(milliseconds)
      const { headers, body, statusCode } = response;
      //console.log(headers);
      //console.log("Body:"+body);
      //console.log("status code:"+statusCode);
      createdWOID=body.match("WO[0-9]{13}")[0];
      result={
          "result": "success",
          "statusCode": statusCode,
          "id": createdWOID,
          "extraMessages": extraMsg
      }
      console.log(JSON.stringify(result));
    } catch (err) {
        error={
            "result": "error",
            "reason": err,
            "message": "Ocurrió un error al intentar crear el ticket.",
            "statusCode": "200",
            "extraMessages": extraMsg
        }
        console.log(JSON.stringify(error));
        process.exit(200);
    }
  })();
}
