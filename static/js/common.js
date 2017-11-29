

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
	        },{
	        	'elem' : '.add-new-button',
	        	'func' : 'addNewComplaint'
	        },{
	        	'elem' : '.submit-ticket',
	        	'func' : 'submitComplaint'
	        },{
	        	'elem' : '.Comments-container .add-comments',
	        	'func' : 'addCommentBox'
	        },{
	        	'elem' : '.submit-comments',
	        	'func' : 'submitCommentBox'
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
	        	} else if(typeof res=="object" || res=="you are a admin user") {
	        		console.log("welcome: " +res.Name);
	        		setTimeout(function(){
		        		$.notify("Successfully Loggedin",'success');
		        		window.location = "/home";
		        	},500)
	        	}
	        });
	    },
	    getSubmittedComplaint : function(){
            this.feedback = {
	            name : "feedbackData",
	            domain : function(){
	              return apiconfig.apiDomainConfig(this.name)  
	            }
	        };
            // apiconfig.newComplainDatas = inputValues;
	        this.ajaxDataFormat(this.feedback.domain(),apiconfig.apiMethodConfig(this.feedback.name,'getComplaint'),function(res){
	        	console.log(res)
	        });
	    },
	    submitComplaint : function(evt){
	    	var arr = [];
	    	if($(".ticket-field").is("[disabled]")){
	    		$.notify("Please fill your input..", 'warn');
	    		return;
	    	}
	    	$(".ticket-field").each(function(indx,item){
	    		arr.push($(item).val())
	    	})
	    	var inputValues ={
	    		category : arr[0],
                subCategory : arr[1],
                enteredQuery : arr[2] || 'No Text',
                status : arr[3] || 'NEW'
            }
            this.feedback = {
	            name : "feedbackData",
	            domain : function(){
	              return apiconfig.apiDomainConfig(this.name)  
	            }
	        };
            apiconfig.newComplainDatas = inputValues;
	        this.ajaxDataFormat(this.feedback.domain(),apiconfig.apiMethodConfig(this.feedback.name,'newComplaint'),function(res){
	        	console.log(res)
	        	if(res=="Successfully Posted"){
	        		$.notify("Successfully Created", 'Success');
	        		$("form")[0].reset();
	        	}
	        });
	    },
	    addNewComplaint : function(evt){
	    	var self = this;
	    	self.fillComplaintDropdown();
	    },
	    fillComplaintDropdown : function(res){
	    	res = res==undefined ? this.feedbackCategoryDatas : res;
	    	var templateId = $("#new-complaints-template").html();
	    	var container = $("#new-complaints-container");
	    	var template = _.template(templateId);
	    	var sub_key = [];
	    	Object.keys(res).forEach(function(key) {
			 	 sub_key.push(key);
			 })
			 $(container).append(template({
			 	feedbackFields :sub_key
			 }));
	    },
	    getFeedbackDatas : function(){
	    	var self = this;
	    	
	    	this.feedback = {
	    		name: "feedbackData",
	    		domain : function(){
	              return apiconfig.apiDomainConfig(this.name)  
	            }
	    	}
	    	this.ajaxDataFormat(this.feedback.domain(),apiconfig.apiMethodConfig(this.feedback.name,'getfeedbackJson'),function(res){
	    		self.fillComplaintDropdown(res);
	    		self.feedbackCategoryDatas = res;
	    	})
	    },
	    addCommentBox : function(elem){
	    	var container = $("#comments-list");
	    	var templateId = $("#comments-list-template").html();
	    	var template = _.template(templateId);
	    	var roleName = $("#role-name").val();
			 
			$(container).append(template({}));
			$(elem).hide();

	    },
	    submitCommentBox : function(elem){
	    	var self = this;
    		var container = $("#comments-list");
	    	var templateId = $("#comments-list-template").html();
	    	var template = _.template(templateId);
	    	var roleName = $("#role-name").val();
	    	var checktextfield = $("#comment-area").val();
	    	var ticketId = $("#created-id").html().trim();
	    	var status = $("#status-data").val();

	    	if(checktextfield==""){
	    		$.notify("Please fill it and then try..", 'warn');
	    	}
    		else{
		    	$(elem).hide(); 
		    	$(".Comments-container .add-comments").show();
    			$(".dynamic-list").remove();
			 
				$(container).append(template({
					role : roleName,
					input : checktextfield
				}));
				this.feedback = {
		    		name: "feedbackData",
		    		domain : function(){
		              return apiconfig.apiDomainConfig(this.name)  
		            }
		    	}
		    	apiconfig.updateComplaintDatas = {
		    		id : ticketId,
		    		status : status,
		    		role : roleName,
		    		enteredQuery : checktextfield
		    	}
		    	this.ajaxDataFormat(this.feedback.domain(),apiconfig.apiMethodConfig(this.feedback.name,'updateComment'),function(res){
		    		$.notify("Posted..", 'Success');
		    	})
    		}
	    },
	    init : function(){
            if(typeof $!="function" || typeof _!="function") return;
            var self = this;
            this.bindLooping(this.bindingConfig());   
            if(typeof pageName !="undefined" && pageName.toLowerCase() =="createissue"){
            	this.getFeedbackDatas();
            	this.getSubmittedComplaint()	;
            } 
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

$(".dropdown-container").on("change",".custom-select.dropdown",function(evt){
	var $curElem = $(this),
		selectedVal = $curElem.val();
		var selectedArrays = globalCF.layout.feedbackCategoryDatas[selectedVal];
		var parentElem = $(this).closest('li');
		var nextSelectedElem = parentElem.next(".dropdown-list").find(".custom-select.dropdown");
	if(selectedArrays!=undefined && nextSelectedElem.length){
		nextSelectedElem.html('');
		nextSelectedElem.append("<option selected>select your queries</option>")
		for(var i=0;i<selectedArrays.length;i++){
			nextSelectedElem.append('<option>'+selectedArrays[i]+'</option>');
		}
		nextSelectedElem.removeAttr('disabled');
	}
	else if(parentElem.next(".text-list").length){
		parentElem.next(".text-list").find("textarea").removeAttr("disabled");
	}

})

// self.fillComplaintDropdown(res);