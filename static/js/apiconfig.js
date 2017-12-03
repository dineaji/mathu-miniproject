/*
 -- This is how you configure the path
    to your API Ajax call
*/
(function(global,$){
    var env = $("#environment").val();
    var config = {
    apiDomainConfig : function(domainName){
        var obj = {
            SignUpRegistration :  $("#environment").val() == "development" ? "http://localhost:3002" : '/',
            feedbackData :  $("#environment").val() == "development" ? "http://localhost:3002" : '/',
        }
        return domainName ? obj[domainName] : obj;
    },
    apiMethodConfig :  function(domainName ,methodName){
        var obj={
            SignUpRegistration :{
                signup : {
                    "name" : "/signup",
                    "body": this.registerFieldDatas,
                    "type" : "POST",
                    "params" : ""
                },
                login : {
                    "name" : "/login",
                    "body" : this.loginFieldDatas,
                    "type" : "POST",
                    "params" : ""
                 },
                logout : {
                    "name" : "/logout",
                    "body" : "",
                    "type" : "get",
                    "params" : ""
                 },
                 isLoggedIn : {
                    "name" : "/isLoggedIn",
                    "body" : "",
                    "type" : "get",
                    "params" : ""
                 }
            },
            feedbackData: {
                getfeedbackJson : {
                    "name" : "/complaintCategory.json",
                    "body" : "",
                    "type" : "get",
                    "params" : ""
                },
                newComplaint : {
                    "name" : "/submitNewTicket",
                    "body" : this.newComplainDatas,
                    "type" : "POST",
                    "params" : ""
                },
                getComplaint : {
                    "name" : "/getSubmittedTicket?hai",
                    "body" : "",
                    "type" : "get",
                    "params" : ""
                },
                updateComment : {
                    "name" : "/updateTicket",
                    "body" : this.updateComplaintDatas,
                    "type" : "POST",
                    "params" : ""
                }
            }
        }
        return domainName&&methodName == undefined ? obj[domainName] : domainName&&methodName ? obj[domainName][methodName] : "";
    }
}
global.globalCF.config = config;
}(this, jQuery));
