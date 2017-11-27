

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
	            'elem' : '.styles__submit__34ILB.register',
	            'func' : 'formRegister',
	        },{
	            'elem' : '.styles__submit__34ILB.login',
	            'func' : 'formLogin',
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
	    checkAllFields : function(cb,isgetValues){
	    	var obj = [];
	    	var isEmptyField = false;
	    	$(".styles__inputWrapper__38hST .styles__input__OX3CX").each(function(indx,item){
	    		if(isEmptyField) return;
	    		if($(item).val()=="") {
	    			if(isgetValues) $(this).next('.styles__label__R5MB3').addClass('icon-close');
	    			isEmptyField = true;
	    			cb(false);	
	    			return;
	    		}
	    		obj.push($(item).val());
	    	})
	    	if(!isEmptyField){
	    		if(!$(".styles__input__2g5u8").length || $(".styles__input__2g5u8:checked").length) cb(obj);
	    		else cb(false);
	    		
	    	}
	    },
	    formRegister : function(elem,closestElem,evt){
	    	evt.preventDefault();
	    	var inputValues;
	    	this.checkAllFields(function(res){
	    		if(!res) return
	    		inputValues = {
                    name:  res[0],// req.name,
                    email: res[1], //req.email,
                    number: res[2], //req.number,
                    password: res[3], //req.password,
                    collegeName : res[4] || '',
                    roles : ['user']
                }
	    	},true)
	    	this.signUp = {
	            name : "SignUpRegistration",
	            domain : function(){
	              return apiconfig.apiDomainConfig(this.name)  
	            }
	        };
	        apiconfig.registerFieldDatas = inputValues;
	        this.ajaxDataFormat(this.signUp.domain(),apiconfig.apiMethodConfig(this.signUp.name,'signup'),function(res){
	        	if(res=="Existing User"){
	        		$.notify("It seems, you have already registered. please try to login",'warn')
	        	} else if(typeof res=="object") {
	        		console.log("welcome: " +res.Name);
	        		setTimeout(function(){
		        		$.notify("Successfully Registered",'success');
		        		window.location = "/home";
	        		},500)
	        	}
	        });

	    },
	    formLogin : function(elem,closestElem,evt){
	    	evt.preventDefault();
	    	var inputValues;
	    	this.checkAllFields(function(res){
	    		if(!res) return
	    		inputValues = {
                    number: res[0], //req.number,
                    password: res[1], //req.password,
                }
	    	},true)
	    	this.signUp = {
	            name : "SignUpRegistration",
	            domain : function(){
	              return apiconfig.apiDomainConfig(this.name)  
	            }
	        };
	        apiconfig.loginFieldDatas = inputValues;
	        this.ajaxDataFormat(this.signUp.domain(),apiconfig.apiMethodConfig(this.signUp.name,'login'),function(res){
	        	if(res=="not an existing user"){
	        		$.notify("Email or password are incorrect",'warn')
	        	} else if(typeof res=="object") {
	        		console.log("welcome: " +res.Name);
	        		setTimeout(function(){
		        		$.notify("Successfully Loggedin",'success');
		        		window.location = "/home";
		        	},500)
	        	}
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

$(document).on('change','.styles__inputWrapper__3eyQZ input',function(){
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
	globalCF.layout.checkAllFields(function(res){
		if(res){
			$(".styles__submit__34ILB").removeAttr("disabled");
		} else{
			$(".styles__submit__34ILB").attr("disabled",true);
		}
	});
})