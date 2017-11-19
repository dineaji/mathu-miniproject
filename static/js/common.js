

(function(global,$,apiconfig){
	var isLoaded = false;
   	var layout = {

	    eventBinding : function($curEl,callBack,targetElem){
	        var self = this,
	            closestElem = typeof targetElem=="undefined" ? null : targetElem;
	        if(typeof self[callBack]==='function'){
	            $(document).on('click',$curEl,function(evt){
	                self[callBack](this,closestElem,evt);
	                return false;
	            })
	        }
	    },
	    bindingConfig : function(){                 
	        var obj= [{
	            'elem' : '.styles__submit__34ILB',
	            'func' : 'formRegister',
	        }]
	        return obj;
	    },
	    bindLooping : function(obj,curObj){            
	        var isField,
	        self = curObj || this;
	        for(var i=0;i<obj.length;i++){
	            isField = obj[i].partElem=="" ? '' : obj[i].partElem;
	            this.eventBinding(obj[i].elem,obj[i].func,obj[i].partElem,curObj);
	        }
	    },
	    ajaxDataFormat : function(domain,obj,cb){
	        var self = this,
	        	contentFormat = "application/json";
	        return $.ajax({
	            type: obj.type,
	            url: domain+obj.name+obj.params,
	            contentType : contentFormat,
	            data : JSON.stringify(obj.body),
	            success: function(response) {
	                if(typeof self[cb]=='function'){
	                    self[cb](response);
	                } else if(typeof cb =="function"){
	                    cb(response)
	                }
	            },
	            error: function(errrLog) {
	                if(typeof self[cb]=='function'){
	                    self[cb](false);
	                } else if(typeof cb =="function"){
	                    cb(false)
	                }
	            }
	        });
	    },
	    formRegister : function(elem,closestElem,evt){
	    	evt.preventDefault();
	    	this.signUp = {
	            name : "SignUpRegistration",
	            domain : function(){
	              return apiconfig.apiDomainConfig(this.name)  
	            },
	            registerFieldDatas : function(){
	            	return {
                        name:  "Dineshs",// req.name,
                        email: "dineajio@gmail.com", //req.email,
                        password: "27smss106", //req.password,
                        number: "8122334577", //req.number,
                        roles : ['user']
                    }
	            }
	        };
	        apiconfig.registerFieldDatas = this.signUp.registerFieldDatas();
	        this.ajaxDataFormat(this.signUp.domain(),apiconfig.apiMethodConfig(this.signUp.name,'signup'),function(res){
	        	console.log(res);
	        });

	    },
	    init : function(){
            if(typeof $!="function") return;
            var self = this;
            this.bindLooping(this.bindingConfig());     
            isLoaded = true;
        }
	}
	layout.init();

	globalCF.layout = layout;
})(this,jQuery,globalCF.config);

$(document).on('change','.styles__inputWrapper__38hST input',function(){
	var isRequiredField = $(this).attr('aria-required');
	var errorShow = $(this).next('.styles__label__R5MB3');
	if($(this).val()!=""){
		$(this).addClass('filled')
	} else{
		$(this).removeClass('filled')
	}
	if($(this).val()=="" && isRequiredField=="true"){
		$(errorShow).addClass('icon-close')
	} else{
		$(errorShow).removeClass('icon-close')
	}
})