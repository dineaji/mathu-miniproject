/*
File Name : Car Collections.JS
Purpose : promoting the cars
FrameWork Used : underscoreJS, OwlCarouselJS, isotopeJS
Implementation Summary
    1. Enforce API surface and semantic compatibility with 1.9.x branch
    2. Improve the module's maintainability by reducing the storage
        paths to a single mechanism.
    3. Use the same single mechanism to support "private" and "user" data.
    4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    5. Avoid exposing implementation details on user objects (eg. expando properties)
*/

(function(global,$,cookie,apiconfig,Backbone){
	var fileparser,
		responseText,
		thumbGrid,
		filteredColl,
		HWCarCookie,
		isLoaded = syncUserData = false,
		selectedData={},
		gridColWrap = 3,
		productReset=isotopeBool=dataLoaded=filterActive=pageCount=false,
		yearFilter = false,
		userDatasCookie=['wishlist','verified','unverified'],
		cookieName = "HW_CarCollections",
		activeclass = "active",
		isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && screen.width < 768,
		headerHeightVal = isMobile ? 0 : 100,
		apiBasePath = "https://product.mattel.com/api/ProductInfo/GetCars",
		activeYear = document.getElementById("active-year") ? document.getElementById("active-year").value : "",
		activeYearLen = activeYear ? activeYear.split(',').length : 0,
		HWLayout = HWMAT.layout,
		currentObjRef,
		collections = {
			// Carousel Configuration
			carouselConfig : function(configName){
				var configObj;
				switch(configName){
					case 'marquee':
						  configObj={'itemVisible':1.9,'mobileVisible' : 4,'singleItem':false,'autoPlay':false,'center':true,'pagination':false,'navigation':false,'loop':true}
						  break;
					case 'carCarousel':
						  configObj={'itemVisible':1,'singleItem':false,'autoPlay':false,'center':false,'pagination':false}
						  break;
					case 'filter':
						  configObj={'itemVisible':8,'autoPlay':false,'center':false,'pagination':true,'navigation':true,'loop':false,'singleItem':true,'tabletVisible' : 4}
						  break;
					case 'carDetail':
						 configObj={'itemVisible':1,'autoPlay':false,'center':false,'pagination':false,'navigation':true,'loop':false,'tabletVisible' : 1}
						  break;
					case 'wishlist':
						 configObj={'itemVisible':3,'autoPlay':false,'center':false,'pagination':false,'navigation':true,'loop':false,'mobileVisible' : 2}
						  break;
				}
				return configObj;
			},// Template configuration
			templateConfig : function(configName){			
				var configObj;
				switch(configName){
					case 'carDetail':
						configObj={"templateId":"thumbnail-carousel-template","targetId":""}
						break;
					case 'thumbnail':
						configObj={"templateId":"thumbnail-coll-template","targetId":"thumbnail-coll-container",'isotopEnabled':true}
						break;
					case 'filter':
						configObj={"templateId":"filter-data-template","targetId":""}
						break;
					case 'unlockedModel':
						configObj={"templateId":"unlocked-template","targetId":"unlock-container-wrapper"}
						break;
					case 'unlockedAll':
						configObj={"templateId":"unlocked-template","targetId":"modal-global-container"}
						break;
				}
				return configObj;
			},// Event Configuration
			bindingConfig : function(){					
				var obj= [{
					'elem' : '.filter-containers .filter-text-wrapper',
					'func' : 'filterIn',
				},{
					'elem' : '#thumbnail-coll-container li.coll-thumb .coll-thumb-wrapr',
					'func' : 'thumbnailAction',
				},{
					'elem' : '.close-icon',
					'func' : 'closeAction',
					'partElem' : '.thumb-carousel-container'
				},{
					'elem' : '.coll-wishlist-icon',
					'func' : 'wishlistAction',
				},{
					'elem' : '.coll-checkmark-icon',
					'func' : 'checkmarkAction',
				},{
					'elem' : '.filter-content-wrapper li',
					'func' : 'filterValidation'
				},{
					'elem' : '.modal-container .code-validation',
					'func' : 'codeValidation',
				},{
					'elem' : '.unlock-field .submit-code',
					'func' : 'codeValidation',
					'partElem': 'all'
				},{
					'elem' : '.filtered-datas li .cross-icon',
					'func' : 'clearFilterData'
				},{
					'elem' : '.clr-filter-data',
					'func' : 'clearAll'
				},{
					'elem' : '.filter-mobile',
					'func' : 'mobileFilter'
				},{
					'elem' : '.carousel-filter-status a.car-stats-val',
					'func' : 'detailFilter'
				},{
					'elem' : '.unlock-tooltip .modal-close-icon',
					'func' : 'closeTooltipModal'
				}]
				return obj;
			},// Grid Configuration
			isotopeConfig : function(){				
				var istpOptions = {
					'itemSelector'	: 	".coll-thumb",
					'layoutMode': 'fitRows',
					'fitRows': {
					  gutter: 0
					},
				    'percentPosition': 	true,
				    'sortBy'		: 	'',
				    'initLayout'	: 	true ,
				    'itemPositionDataEnabled'	: true,
				    'sortAscending'	: 	true
				}
				return istpOptions;
			},// Event Config fn will be looping when call this fn
			bindLooping : function(obj){			
				var isField;
				for(var i=0;i<obj.length;i++){
					isField = obj[i].partElem=="" ? '' : obj[i].partElem;
					HWLayout.eventBinding(obj[i].elem,obj[i].func,obj[i].partElem,this);
				}
			},
			// Carousel Properties
			renderCarousel : function(el,prop,destroy){		 
	            var self=this,
	                $owl = $(el);
	            if($owl.is("#year-filter-container")){ prop.itemVisible = 3;prop.tabletVisible =2; }
	            if($owl.is("#Makes-filter-container")){ prop.itemVisible = 1;prop.tabletVisible =1; }
	            if(destroy!="wishlist") self.objectUpdate($owl.children(),prop);
	            if(destroy) $owl.trigger('destroy.owl.carousel')
	            $owl.owlCarousel({
	                items           :  prop.itemVisible,    		 // Integer
	                singleItem      :  prop.singleItem || false,     // Boolean
	                dots		    :  prop.pagination || false,     // Boolean
	                //smartSpeed      :  400,                 		 // Integer
	                callbacks       :  true,                		 // Boolean
	                autoplay        :  prop.autoPlay || false, 		 // Boolean / Integer 
	                loop            :  prop.loop || false,       	 // Boolean
	                mouseDrag       :  false,               		 // Boolean
	                nav   		   	:  prop.navigation || false,     // Boolean
	                navText  		:  false, 						 // Boolean
	                addClassActive  :  true,						 // Boolean
					itemsDesktop	:  false,						 // Boolean
					navRewind 		:  false,						 // Boolean
					startPosition	:  $owl.data('currentIndex') || 0, // Integer
					centerClass 	:  'active-element',
					center 			:  prop.center, 				 // Boolean
					transitionStyle	:  true,
					//navSpeed		:  400,
					responsiveClass  : true,
					rewindNav		: true,
					responsive 		:{
						0:{
							items : prop.mobileVisible || 1
						},
						768:{
							items : prop.tabletVisible || 4
						},
						980:{
							items : prop.itemVisible
						}
					},
	            })
	            $owlActiveSlider = $owl.data('owlCarousel');
	        },// New key include on every model for refrence
	    	objectUpdate : function(elem,obj){
	    		var itemVisible = !isMobile ? obj.itemVisible : obj.mobileVisible || 1;
	    		if(elem.length<=itemVisible){
	    			obj.pagination = obj.navigation = false;
	    			return obj;
	    		}
	    	},// Ajax Fn written in Pure JS
			// Hover event Binding Fn
	        hoverBinding : function($curEl,cbIn,cbOut,isMobile){
	        	if(isMobile) return;
	        	var self = this;
	        	$("body").on('mouseenter touchstart', $curEl, function() { 
				     self[cbIn](this)
				}).on('mouseleave', $curEl, function() { 
				     self[cbOut](this)
				});
	        },// Class Toggle 
	        toggleClass : function(elem){
				if($(elem).hasClass(activeclass)){
					$(elem).removeClass(activeclass);
					return true;
				} else{
					$(elem).addClass(activeclass);
				}
			},// it will return obj if match two id's
			filterData : function(obj,matchId){
				return obj.filter(function(elem, i, array) {
				       return elem.ToyNumber == matchId;
				    }
				);
			},// class name toggle 
			loadingToggle : function(elem){
				$(elem).toggleClass('loading')
			},
			// window scroll in jQuery Format
			scrollAnimate : function($container,duration){
				setTimeout(function(){
					var body = $("html, body");
					body.stop().animate({scrollTop: $container.offset().top-headerHeightVal}, '1000', 'swing', function() {});
				},duration || 0)
			},// Remove the existing template
			templateRefill : function(templateElem){
				$(templateElem).remove();
			},// has class fn in JS format
			classExist : function(elem,clsName){
				$.each(elem.attr('class').split(/\s+/), function(i, name) {
				    if (name.indexOf(clsName) > -1) { // or name.indexOf('toaster') === 0
				        clsName = name;
				        return true;
				    }
				});
			},
			closeAction : function(elem,targetElem){
				$(targetElem).removeClass(activeclass);
				$(targetElem).remove();
				$(".coll-thumb").removeClass(activeclass)
				thumbGrid.isotope('layout');
			},
			filterProducts : function(obj,keyName,val){
				var ret=[];
				obj.filter(function(el,indx){
					if(typeof el[keyName]!=="object"){
						if(el[keyName]==val){
							ret.push(el)
						}
					} else if(el[keyName]!=null){
						for(var i=0;i<el[keyName].length;i++){
							if(el[keyName][i]['StyleSEOName']==val){
								ret.push(el)
							}
						}
					}
				})
				return ret;
			},
			filterAllProducts : function (carsObj, filterObj, filterMiniCollection) {
				var self = this;
				var miniCollectionRes;
				$.each(filterObj, function(targetName, el){
					var res = [];
					el.filter(function(val, index){
						var refKey = HWLayout.productFieldConfig(targetName);
						res = res.concat(self.filterProducts(carsObj, refKey, val));
						if(filterMiniCollection && refKey == 'MiniCollectionSEOName') {
							miniCollectionRes = res;
						}				
					});
					carsObj = res;
				});
				if(filterMiniCollection) {
					return {
						'result' : carsObj,
						'miniCollectionRes' : miniCollectionRes
					}
				} else {				
					return carsObj;
				}
			},
			removeObjFrmArray : function(arrayOfObjects,refKey,val,deletedObj){
				var objData = arrayOfObjects,
					filterSelectedObj = Object.keys(selectedData),
					filterSelectedObjLen =  filterSelectedObj.length,filterNameMap,i,j;
				for(i = 0; i < arrayOfObjects.length; i++) {
					for(j=0;j<deletedObj.length;j++){
						  	if(arrayOfObjects[i]!=undefined && typeof arrayOfObjects[i][refKey]!="object"){
								for(k=0;k<filterSelectedObjLen;k++){
							    if(val.toString().indexOf(arrayOfObjects[i][refKey]) !== -1) {
							    	filterNameMap = HWLayout.productFieldConfig(filterSelectedObj[k])
							    	if(_.indexOf(selectedData[filterSelectedObj[k]],arrayOfObjects[i][filterNameMap])==-1){
							    		arrayOfObjects.splice(i, 1);
							    	} else{
							    		// arrayOfObjects[i]['loaded'] = false;
							    	}
								}
								}
							}
							else if(arrayOfObjects[i]!=undefined && typeof arrayOfObjects[i][refKey]=="object"){
								for(var k=0;k<arrayOfObjects[i][refKey].length;k++){
									if(val.toString().indexOf(arrayOfObjects[i][refKey][k].Id) !== -1 && val.toString().indexOf(deletedObj[j][refKey][k].Id)!=-1) {
								        arrayOfObjects.splice(i, 1);
								        // i--;
								    }
								}
							}
						}	
					
				}
				return arrayOfObjects;

			},
			// removeObjFrmArray : function(arrayOfObjects,refKey,val,deletedObj){
			// 	var objData = arrayOfObjects,objA,objB,i,j;
			// 	for(i = 0; i < deletedObj.length; i++) {
			// 		for(j=0;j<arrayOfObjects.length;j++){
			// 			console.log(i)
			// 		  	if(deletedObj[i]!=undefined && typeof deletedObj[i][refKey]!="object"){
			// 			    if(val.toString().indexOf(deletedObj[i][refKey]) !== -1 && val.toString().indexOf(arrayOfObjects[j][refKey])==-1) {
			// 			        deletedObj.splice(i, 1);
			// 			        // i--;
			// 			    }
			// 			} else if(arrayOfObjects[i]!=undefined && typeof arrayOfObjects[i][refKey]=="object"){
			// 				for(var k=0;k<arrayOfObjects[i][refKey].length;k++){
			// 					if(val.toString().indexOf(arrayOfObjects[i][refKey][k].Id) !== -1 && val.toString().indexOf(deletedObj[j][refKey][k].Id)!=-1) {
			// 				        arrayOfObjects.splice(i, 1);
			// 				        i--;
			// 				    }
			// 				}
			// 			}
						
			// 		}
			// 	}
			// 	return arrayOfObjects;

			// },
			removeDataFrmArray : function(arr,val){
				for(var i = arr.length - 1; i >= 0; i--) {
				    if(arr[i] === val) {
				       arr.splice(i, 1);
				    }
				}
				return arr;
			},
			refillContainer: function(){
				thumbGrid.isotope('remove', $(this.isotopeConfig().itemSelector));
			},
	        templateLooping : function(res){
				var self = this;
				var templateObj = self.templateConfig();
				for(var i=0;i<templateObj.length;i++){
					self.templateBind(templateObj[i],res)
				}
			},
			templateBind : function(obj,res,optnl){
				var self = this,
					$finalTempData='',
					refrncName = typeof optnl=="undefined" ? "" : optnl,
	            divElem = document.getElementById(obj.targetId),
	            templateId =   _.template(document.getElementById(obj.templateId).innerHTML.trim());

				templateCollection = templateId({ 'items' : res,'ref':refrncName});
	            if(!obj.isotopEnabled && optnl!="year"){
	            	divElem.innerHTML = templateCollection
	            }else{
	            	$(templateCollection).appendTo(divElem);
	            }
	         	
	         	$finalTempData = $(divElem).children('li.coll-thumb');
	            if(optnl=="thumbnails") HWLayout.wrapElement($finalTempData,'thumb-dynm-wrapper',gridColWrap)
	            if(obj.isotopEnabled){
	            	if(!isotopeBool){
	            		self.appendCollItems(divElem,templateCollection);
	            		isotopeBool = true;
	            	} else if(typeof thumbGrid !="undefined"){
	            		setTimeout(function(){
			        		thumbGrid.isotope('appended',$($finalTempData));
			        		$($finalTempData).imagesLoaded().progress( function() {
			        			loading_target = $(".thumb-small-image");
							  	$(loading_target).removeClass('loading');
							  	thumbGrid.isotope('layout');
							});
	            		},0)
	            	}
	            } 
			},
			fieldValUpdate : function(obj){
				for(var i=0;i<obj.length;i++){
					obj[i].loaded=false;
				}
				return obj;
			},
			appendCollItems : function(elem,items){
				thumbGrid = $(elem);
				thumbGrid.isotope(this.isotopeConfig());
				thumbGrid.imagesLoaded().progress( function() {
				loading_target = $(".thumb-small-image");
				  $(loading_target).removeClass('loading');
				  thumbGrid.isotope('layout');
				});
			},
			filterIn : function(curElem,linkingBool){
				var self = this,
					$curElem = $(curElem).closest('li'),
					filtrName = $curElem.data('filterName'),
					configObj = self.templateConfig('filter'),
					destroy = false,
					wrapCnt = isMobile ? 9 : 15 || self.carouselConfig('filter').itemVisible ,
					$parElem = $curElem.closest("#filter-coll-container");

				configObj.targetId = (filtrName) ? filtrName+"-filter-container" : "";
				$parElem.removeClass(activeclass);
				if(!linkingBool) $parElem.addClass(activeclass);
				if(isMobile && $curElem.hasClass(activeclass)){
					$curElem.removeClass(activeclass);
					return;
				} 
				if(!linkingBool) HWLayout.addClass('.filter-containers>li',$curElem);
				if(filtrName!="year" && $curElem.attr('data-rendered')){
					if(this[filtrName+'len']!=self[filtrName].length){
						destroy = true;
					}else{
						return;
					}
				}
				$curElem.attr('data-rendered',true)
				self.templateBind(configObj,self[filtrName],filtrName);
				if(filtrName!="year") this[filtrName+'len'] = self[filtrName] ? self[filtrName].length : 0;
				if(isMobile || filtrName=="Makes") HWLayout.wrapElement($($("#"+configObj.targetId).find('li')),'',wrapCnt)	
				self.renderCarousel($("#"+configObj.targetId) ,self.carouselConfig('filter'),destroy);
			},
			filterOut : function(elem){
				var self = this,
					$curElem = $(elem).closest('li');
				$curElem.removeClass(activeclass);
			},
			wishlistIn : function(elem){
				var self = this;
				if( typeof cookie.get('carWishlist')!='undefined' &&  cookie.get('carWishlist').length> 0){
					$(elem).addClass(activeclass);
					$(".added-wishlist-modal").addClass(activeclass);
				}
			},
			wishlistOut : function(elem){
				$(elem).removeClass(activeclass);
				$(".added-wishlist-modal").removeClass(activeclass);	
			},
			tooltipIn : function(elem){
				var $parentElem = $(elem).parent(),
					$tooltipElem = $parentElem.find(".tooltip-contet");

				if(($(window).scrollTop()+300)>$tooltipElem[0].scrollHeight){
					$parentElem.addClass('pos-bottom');
				}
				$parentElem.addClass(activeclass)
			},
			tooltipOut : function(elem){
				$(elem).parent().removeClass(activeclass).removeClass('pos-bottom');
			},
			closeTooltipModal : function(elem){
				$(elem).closest('.tooltip-modal-open').removeClass(activeclass)
			},
			mobileFilter : function(elem){
				var $curElem = elem,
					targetElem = $('.filter-containers');
				this.toggleClass($curElem);
				this.toggleClass(targetElem);
			},
			thumbnailAction : function(curElem){
				var self = this,
					$curElem = $(curElem).parent('li'),
					uniqueId = $curElem.data('id'),
					carslContainer = ".thumb-carousel-container",
					wishState = $curElem.find(".coll-wishlist-icon").hasClass('wishlist') || $curElem.find(".coll-wishlist-icon").hasClass(activeclass),
					checkElem = $curElem.find(".coll-checkmark-icon"),
					checkState = (checkElem.hasClass('unverified')) ? 'unverified' : (checkElem.hasClass('verified') ? "verified" : ""),
					objConfig = self.templateConfig('carDetail'),
					parElemW = $curElem.closest("#thumbnail-coll-container").width(),
					curLeft = $curElem.position().left,
					closeIcon,filterData;

				if($curElem.hasClass(activeclass)){
					closeElem = $curElem.find('.close-icon');
					self.toggleClass($curElem);
					self.closeAction(closeElem,carslContainer);
					return;
				}
				self.loadingToggle($curElem);
				this.activeProductId = $curElem.data('id');
				self.templateRefill(".thumb-carousel-container");
				filterData = this.filterData(this.carMapedDatas,uniqueId)[0]
				filterData.wishlistState = filterData.wishState = wishState ? 'wishlist' : "";
				filterData.checkMarkState = filterData.checkState = checkState;
	            var templateId =   _.template(document.getElementById(objConfig.templateId).innerHTML.trim());
	            // $parentId.after(templateId({ 'items' : filterData,'ref':'thumb-caraousel'}));
	            $curElem.append(templateId({ 'items' : filterData,'ref':'thumb-caraousel'}))
	            $(carslContainer).imagesLoaded(function() {
				var currURL= window.location.href;
				var carName = $curElem.data('car-name');
				currURL = currURL.substring(0, currURL.indexOf("/collection") + 1);
				currURL = currURL+'collection/detail/'+carName+'?carId='+uniqueId;
				window.history.pushState(null, null,currURL);
	            	$(carslContainer).css({'width':parElemW+'px','margin-left':'-'+curLeft+'px'});
	            	if($curElem.find(".coll-wishlist-icon").hasClass('disabled')){
	            		$(carslContainer).find(".coll-wishlist-icon").addClass('disabled');
	            	}
	            	self.renderCarousel('.thumb-carousel-container .slides' ,self.carouselConfig('carDetail'));
	            	$(".thumb-carousel-container").addClass(activeclass);
	            	setTimeout(function(){
	            		if(isMobile) HWLayout.addClass("#thumbnail-coll-container li.coll-thumb",$curElem);
		            	
	            	},500)
	            	setTimeout(function(){
	            		self.loadingToggle($curElem);
	            		thumbGrid.isotope('layout');
	            		self.scrollAnimate($(carslContainer),400);
	            		HWLayout.addClass("#thumbnail-coll-container li.coll-thumb",$curElem);
	            	},1100)
	            	setTimeout(function(){
						if(isMobile) thumbGrid.isotope('layout');
	            		$(".thumb-carousel-container").css('opacity','1');
	            		$(".thumb-carousel-container .carousel-filter-status").addClass(activeclass);
	            	},1300)
	            });
	            HWLayout.trackingFunction('cars','view',filterData['Title'],"cars: landing page",'');
			},
			filedValExist : function(allObj,resultVal){
				for(var i=0;i<allObj.length;i++){
					if(allObj[i].ToyNumber==resultVal){
						return true;
					}
				}
				return false;
			},
			objToDom : function(curObj,allObj){
				var renderedLis = $(this.isotopeConfig().itemSelector),i,j,k,
					isotopeData = thumbGrid.data('isotope').filteredItems;

				for(i=0;i<curObj.length;i++){
					for(j=0;j<isotopeData.length;j++){
						if(curObj[i].ToyNumber.toString() == isotopeData[j].element.dataset.id){
							if(!this.filedValExist(allObj,curObj[i].ToyNumber)){
	    					 	thumbGrid.isotope('remove',$(isotopeData[j].element)).isotope('layout');
							} else{
	    					 	curObj.splice(i, 1);
							}
						}
					}
					
				}
				return curObj;
			},
			clearFilterData : function(elem){
				var self=this,
					parentElem =elem.parentElement || elem[0].parentElement,
					filterData = $(elem).data('filter'),
					refKey = $(elem).data('refKey'),
					shortName = $(elem).data('shortName'),
					getMiniCollectionRes = shortName =="mini"? true : false,
					miniCollectionRes,
					loadedDatas,
					obj = [],availableDatas,indexName = parentElem.classList[0],
					objUniqueVal;

				$("#"+indexName).removeClass(activeclass);
				$(parentElem).addClass(activeclass);
				
				setTimeout(function(){$(parentElem).remove();},100)
				selectedData[refKey] = this.removeDataFrmArray(selectedData[refKey],filterData);
				if(!selectedData[refKey].length) delete selectedData[refKey];
				if(!_.isEmpty(selectedData)){
					if(!filterActive) this.refillContainer(); 
					obj = this.filterAllProducts(this.carMapedDatas, selectedData, getMiniCollectionRes);
					//obj = this.filterProducts(this.filteredDatas,HWLayout.productFieldConfig(refKey),filterData);
					// objUniqueVal =  HWLayout.uniqueVal(obj,HWLayout.productFieldConfig(refKey));
					//this.filteredDatas = this.removeObjFrmArray(this.filteredDatas,HWLayout.productFieldConfig(refKey),filterData,obj);
					if(getMiniCollectionRes){
						this.filteredDatas = obj.result;
						miniCollectionRes = obj.miniCollectionRes;
					}else{
						this.filteredDatas = obj;
					}
					this.filterLoaded = false;
					this.fieldValUpdate(this.filteredDatas);
					if(!this.filteredDatas.length) this.clearAll();
					filterActive = true;
					thumbGrid.isotope('remove', $(this.isotopeConfig().itemSelector));	
					this.ajaxCollection(this.templateConfig('thumbnail').targetId,this.filteredDatas);
					loadedDatas = thumbGrid.data('isotope').filteredItems;
					if(dataLoaded){
						this.filPage = this.filPage-obj.length;
					}
					if(loadedDatas.length==0 && this.filteredDatas.length>0){
						this.page = 0;
						this.initial_count = this.initial;
						this.getCollDatas(this.filteredDatas,true);
					}
					if(shortName =="mini"){
						var dropDownData = selectedData['MiniCollections'] ? miniCollectionRes : this.carMapedDatas;
						//this.filterMini =  this.removeObjFrmArray(this.filterMini,HWLayout.productFieldConfig(refKey),filterData,obj);
						availableDatas = dropDownData.length ? dropDownData : this.carMapedDatas;
						this.filterIds(availableDatas,false);
					}
				}
				else{
					this.clearAll();
					this.fieldValUpdate(this.filteredDatas);
				}
				// this.initial_count = this.initial;
			},
			clearAll : function(){
				var self=this;
				productReset=filterActive =this.filterLoaded =  false;
				this.initial_count = this.initial;
				this.filPage = this.page=0;
				this.carMapedDatas = HWLayout.props(this.carMapedDatas,true);
				selectedData = {};
				this.refillContainer();
				this.filterIds(this.carMapedDatas,false);
				thumbGrid.isotope({filter:"*"})
				$(".filtered-datas li p").remove();
				$(".filter-containers li:not(.year-field) .filter-content-wrapper li").removeClass(activeclass)
				// isotopeBool = false;
				setTimeout(function(){
					self.filteredDatas = self.filterMini =[];
					self.ajaxCollection(self.templateConfig('thumbnail').targetId,self.carMapedDatas)
					self.getCollDatas(self.carMapedDatas);	
				},100)
				$(".filtered-datas").addClass('disabled');
			},
			filterSelectedOpn : function(filtrName,elem,obj){
				var self = this;
				switch(filtrName){
					case 'mini' : 
						self.miniValidataion(elem,obj)
						break;
					case 'year' :
						self.yearValidation(elem,obj);
						break;
					case 'default':
						return;
				}
			},
			yearValidation : function(elem,obj){
				var parentElem ="#year-filter-container";
				if($(elem).hasClass(activeclass)) return;
				$(parentElem).find('li').removeClass(activeclass)
				$(parentElem).closest(".year-field").removeClass(activeclass)
				yearFilter=true;
				this.clearAll();
				// retObj = this.filterProducts(this.carDatas,HWLayout.productFieldConfig(targetName),id);
				this.filterYear = obj;
				this.ajaxCollection(this.templateConfig('thumbnail').targetId,this.filterYear)
				this.getCollDatas(obj);
				$(elem).addClass(activeclass);
				HWLayout.trackingFunction('cars','filter',$($(elem).find('span')).html(),'filter: '+$(elem).closest(".filter-content-wrapper").data('tagKey'),elemPosition);
				return false;
			},
			miniValidataion : function(elem,obj){
				//this.filterMini =this.filterMini.concat(obj);
				this.filterIds(obj,false);
			},
			filterValidation : function(elem,detailBool){
				var id= $(elem).data('id'),
					src= $(elem).find('img').attr('src'),
					text =  $(elem).find('span').html(),
					indx= $(elem).attr('id'),
					shortName = $(elem).data('shortName'),
					targetName = $(elem).data('refKey'),
					tagKey = $(elem).closest(".filter-content-wrapper").data('tagKey'),
					targetElem = $("."+targetName+"-selected-data"),
					selectedHtml ="<p class="+indx+"><a data-short-name="+shortName+" data-filter="+id+" data-ref-key="+targetName+" class='cross-icon'></a><img src="+src+" /><span>"+text+"</span></p>",
					arr=[],parentElem,retObj,elemPosition,
					selectedDataLen;
					
					yearFilter=false;
					thumbGrid = typeof thumbGrid=="undefined" ? $("#thumbnail-coll-container") : thumbGrid;
				
				if(targetElem.length || targetName =="year"){
					if($(elem).hasClass(activeclass)){
						if(!detailBool) this.clearFilterData($("."+indx).find('.cross-icon'));
						return;
					}
					else{
						// prepare filter object
						selectedData[targetName] = selectedData[targetName]!=undefined ? $.merge(selectedData[targetName],[id]) : [id];
						filteredColl = HWLayout.uniqueData(selectedData[targetName]);
						selectedDataLen = Object.keys(selectedData).length;

						// prepare cars list based on filter object
						retObj = this.filterAllProducts(this.carMapedDatas, selectedData);
						/*console.log(retObj);*/
						if(!retObj.length) {
							selectedData[targetName] = this.removeDataFrmArray(selectedData[targetName],id);
							if(!selectedData[targetName].length) delete selectedData[targetName];
							selectedDataLen = Object.keys(selectedData).length;
							return;
						}
						this.fieldValUpdate(retObj)
						this.filterSelectedOpn(shortName,elem,retObj);
						// selectedData.push("."+shortName+"-"+id);
						if(((!productReset || !filterActive) && $(this.isotopeConfig().itemSelector).length) || selectedDataLen>=1){
							thumbGrid.isotope('remove', $(this.isotopeConfig().itemSelector));	
						} 
						//this.filteredDatas=this.filteredDatas.concat(retObj)
						this.filteredDatas = retObj;
						this.ajaxCollection(this.templateConfig('thumbnail').targetId,this.filteredDatas)
						this.filterLoaded = false;
						//if(!productReset || this.filteredDatas.length<=this.initial){
							this.page = 0;this.getCollDatas(retObj,true);
						//} 
						pageCount = false;
						targetElem.append(selectedHtml);
						productReset = true;
						this.toggleClass(elem);
						elemPosition = detailBool ? "cars: detail page" : 'filter nav';
						HWLayout.trackingFunction('cars','filter',$(text).html(),'filter: '+tagKey,elemPosition);
					}
					filterActive = true;
					$(".filtered-datas").removeClass('disabled');
				}
				
			},
			filterIsotope : function(NameToShow) {
		        if(NameToShow === undefined || NameToShow === "all") return true;
		        thumbGrid.isotope({filter: NameToShow }).isotope('layout');
		    },
		    wishlistAction : function(elem){
		    	var productElem = $(elem).closest('.product-tile'),
					modelIndx = parseInt(productElem.data('index')),
					$appendWishModal = $(".selected-product-image"),
					productTitl = productElem.find('.product-title').html(),
					productId = productElem.data('id'),
					thumbImg = productElem.find('.thumb-small-image img'),
					thumbImgSrc= thumbImg ? thumbImg.attr('src') : 0,
					toyId =$(elem).closest(".coll-actions-container").data('id'),
					trackingPageName = $(elem).closest(".thumb-carousel-container").length ? "detail" : "landing",
					duration,newElem,elemPosition,statusName;

				// this fn will return if toyId exist in carverified/carunverified cookie.
				if(cookie.inCookie('carUnverified',toyId) || cookie.inCookie('carVerified',toyId) || $(elem).hasClass('disabled')) return;

				if($(elem).hasClass("wishlist") || !productElem.hasClass('product-tile--added')){
					$(elem).removeClass("wishlist");
					elemPosition = $appendWishModal.find('img[src="' + thumbImgSrc + '"]').closest('.owl-item').index();
					if(typeof $appendWishModal.data('owl.carousel') =="undefined"){
						$appendWishModal.find('img[src="' + thumbImgSrc + '"]').remove();
					} else{
						$appendWishModal.trigger('remove.owl.carousel',elemPosition).trigger('refresh.owl.carousel');
					}
					HWLayout.wishlistAPICall(this.carMapedDatas[modelIndx],toyId,false);
					statusName = "remove"
					// cookie.toggleCookie(false,apiconfig.toyId)
				} else{
					newElem = "<li data-id="+productId+"><img src='"+thumbImgSrc+"' title='"+productTitl+"'/></li>"
					if(typeof $appendWishModal.data('owl.carousel') =="undefined"){
						$appendWishModal.append(newElem);
						this.renderCarousel($appendWishModal ,this.carouselConfig('wishlist'),'wishlist');
					} else{
						$appendWishModal.trigger('add.owl.carousel',[newElem]).trigger('refresh.owl.carousel');
						elemPosition = $appendWishModal.find('img[src="' + thumbImgSrc + '"]').closest('.owl-item').index() || 0;
						setTimeout(function(){$appendWishModal.trigger('to.owl.carousel',elemPosition);},800)
					}
					
					// cookie.toggleCookie(true,apiconfig.toyId)
	               	HWLayout.wishlistAPICall(this.carMapedDatas[modelIndx],toyId,true);

					$(elem).addClass("wishlist");
					this.carMapedDatas[modelIndx].wishState="active"
					if($('.added-wishlist-modal').hasClass(activeclass)) return;	
					this.toggleClassWithFlash('.added-wishlist-modal',2700);
					statusName = "add"
				}
				HWLayout.trackingFunction('cars',statusName,productTitl,"cars:"+ trackingPageName +" page",'');
			},
			getCookieProducts : function(recentElem){
				var cookieName = "carWishlist";
				var storedIds = cookie.get(cookieName);
				if( typeof storedIds!='undefined' &&  storedIds.length> 0){
	                this.cookieVals = unescape(storedIds).split('_');
	                if(this.cookieVals.length<1) return;
	                for(var i =0;i<this.carMapedDatas.length;i++){
	                	for(var j=0;j<this.cookieVals.length;j++){
	                		if(this.carMapedDatas[i].ToyNumber==this.cookieVals[j]){
	                			this.carMapedDatas[i].wishState = activeclass;
	                			this.carMapedDatas[i].productAdded = true;
	                			if(this.carMapedDatas[i].ThumbnailImages[0]!=undefined){
	                				$(recentElem).append("<li data-id="+this.carMapedDatas[i].ToyNumber+"><img src='"+this.carMapedDatas[i].ThumbnailImages[0].URL+"' title='"+this.carMapedDatas[i].Title+"' /></li>")
	                			}
	                		}
	                	}
	                }
	                this.renderCarousel($(recentElem) ,this.carouselConfig('wishlist'),'wishlist');
	                this.toggleClassWithFlash('.added-wishlist-modal',2700)
	               	// this.toggleClassWithFlash('.shop-nav__counter',2000)
	               	$('.shop-nav__counter').addClass(activeclass);
	            }
			},
			toggleClassWithFlash : function(elem,duration){
				$(elem).addClass(activeclass).stop().delay(duration).queue('',function(){
				    $(this).removeClass(activeclass);
				});
			},
			loginMessageToggle : function(){
				if(typeof cookie.get(ssoCookieName)==="undefined"){
					$(".enter-code-wrapper").addClass('login-msg-active')
					$(".error-validation-message").show();
				}
			},
			checkmarkAction : function(elem){
				var $curElem = $(elem),	
					$parentElem = $(elem).closest(".product-tile"),
					$allCurElem = $parentElem.find(".coll-checkmark-icon"),
					templeteConfig = HWLayout.templateConfig('enterCode'),
					isActiveClass = $(elem).hasClass('unverified') ? true : false,
					showDuration = (isActiveClass) ? 0 : 1300,
					modelIndx = parseInt($(elem).closest('.product-tile').data('index')),
					isUnlocked = $(elem).hasClass('verified') ? true : false,
					toyId = $(elem).closest(".coll-actions-container").data('id'),
					trackingPageName = $(elem).closest(".thumb-carousel-container").length ? "detail" : "landing",
					obj={};
				cookie.cookieName = "carWishlist";
				if(cookie.inCookie(cookie.cookieName,toyId)){
					$parentElem.removeClass("product-tile--added");
					this.wishlistAction($parentElem.find(".wishlist-action"));
					HWLayout.toggleWishlistState(false,toyId);
					// HWLayout.setWishlistCounter(false);
					// $parentElem.find(".wishlist-action").removeClass("wishlist active")
				}
				$parentElem.find(".wishlist-action").addClass('disabled');
				//cookieName = BLITZ.MATTEL_SHOP.config.cookieName;
				this.activeProductId = $curElem.closest("li").data('id') || $curElem.closest('p').data('id');
				if(isUnlocked){
					//alert("Already Unlocked");
					return;
				}
				if(!isUnlocked){
					obj.name = $(elem).closest(".coll-thumb-wrapr").find(".product-title").html();
					obj.imageURL =  $(elem).closest(".product-tile").find(".thumb-small-image img").attr("src");
					this.templateBind(templeteConfig,obj,'enterCode');
					if(!isActiveClass){
						HWLayout.unVerifiedStateAPICall($allCurElem,toyId);
						this.carMapedDatas[modelIndx].status = this.carMapedDatas[modelIndx].checkState ="unverified";
						$allCurElem.addClass('unverified');
					}
					setTimeout(function(){$(".modal-container").modal('show').addClass('unlock-modal-open');},showDuration)
					 setTimeout(function(){
					 	$(".modal-container").find('input[type="text"]').focus()
					 },showDuration+600);
					 $("#"+templeteConfig.targetId).find(".code-validation").attr('data-id',toyId)
					HWLayout.trackingFunction('cars','have',obj.name,"cars:"+ trackingPageName +" page",'');
				}else if(this.classExist($curElem,'.verified')){
					$allCurElem.addClass('unverified');				
				}
			},
			codeValidation : function(elem,identifier){
				var self = this,
					res={},
					toyId = $(elem).attr('data-id') || this.activeProductId,
					targetClass = ".enter-code-wrapper",
					elemWrapper = $(elem).hasClass("code-validation") ? $(elem).closest(targetClass) : $(elem).closest(targetClass),
					inputElem = elemWrapper.find('.enter-code') || $(elem).closest('li').find('.enter-code'),
					inputVal = inputElem.val(),
					isnum = /^\d+$/.test(inputVal),
					templeteConfig = this.templateConfig('unlockedModel'),
					curModel = HWLayout.getFilterData(this.carMapedDatas,'ToyNumber',toyId)[0],
					$activeThumb = $(".coll-thumb[data-id="+toyId+"]"),
					$activeCarsl = $(".thumb-carousel-container").hasClass(activeclass) ? $(".thumb-carousel-container .coll-checkmark-icon") : 0,
					modelIndx = $activeThumb.data('index'),
					errorElem =  elemWrapper.find(".error-validation-message"),
					isLoggedIn = cookie.get(ssoCookieName),
					isAlreadyVerified = false,
					isGlobalCode;
				
				if(typeof isLoggedIn=="undefined"){
					errorElem.show();
					elemWrapper.addClass('login-msg-active');
					this.toggleClassWithFlash(errorElem,500)
				}
				elemWrapper.removeClass('login-msg-active');
				
				if(inputVal==""){ 
					errorElem.show();
					errorElem.html(this.errorMessages('empty'),inputElem); 
				}
				else{
					this.catalogService = {};
			        this.catalogService.name = "carCatalog";
			        this.catalogService.domain = apiconfig.apiDomainConfig(this.catalogService.name);
			        apiconfig.packagingCode = inputVal;
			        elemWrapper.addClass('loading');
					HWLayout.ajaxDataFormat(this.catalogService.domain,apiconfig.apiMethodConfig(this.catalogService.name,'getProductDetailByCode'),function(res){
						isGlobalCode = res!=false && typeof res[0]!= "undefined"  ? res[0] : undefined;
						if((identifier=="all") || (typeof isGlobalCode!="undefined" && inputVal.toLowerCase() != curModel.Packagingcode.toLowerCase())){
							curModel = isGlobalCode;
							if(typeof curModel=="undefined"){
								elemWrapper.removeClass('loading');
								errorElem.show();
								errorElem.html(self.errorMessages('invalid'),inputElem);
								return;	
							} 
							if(!_.isEmpty(HWMAT.layout.collService.userDatas)){
								HWMAT.layout.collService.userDatas.filter(function(item){
									if(item.toyId == curModel.ToyNumber){
										isAlreadyVerified = true;
									}
								})
							}
							if(curModel.status=="verified" || cookie.inCookie("carVerified",curModel.ToyNumber) || isAlreadyVerified){
								elemWrapper.removeClass('loading');
								errorElem.html(self.errorMessages('unlocked'),inputElem)
								return;
							}
							errorElem.html(''); 
							
							curModel.checkState="verified";
							/*setTimeout(function(){
								inputElem.val('');
							},500);*/
							cookie.toggleCookie(true,curModel.ToyNumber);
							// window.localStorage.removeItem("carDetail");
							// HWLayout.setObjectStorage('carDetail',curModel);
							HWLayout.trackingFunction('cars','verify',curModel.Title,'cars: landing page','');
							HWLayout.verifiedStateAPICall(curModel,curModel.ToyNumber,curModel.MiniCollectionId,function(res){
								cookie.cookieName = "carWishlist";
								if(cookie.inCookie(cookie.cookieName,curModel.ToyNumber)){
									HWLayout.toggleWishlistState(false,curModel.ToyNumber);
								}
								//elemWrapper.removeClass('loading')
								setTimeout(function(){
									window.location.href = "/"+apiconfig.localeName+"/collection/detail/"+curModel.CarMetaSEOName+"?carId="+curModel.ToyNumber+"";
									inputElem.val('');
								},4000);
							});
							// setTimeout(function(){
								
							// },3000);
						} else{
							if(inputVal.toLowerCase() != curModel.Packagingcode.toLowerCase()){
								elemWrapper.removeClass('loading');
								errorElem.show();
								errorElem.html(self.errorMessages('invalid'),inputElem);
								return;
							} 
							self.templateBind(templeteConfig,curModel,'unlock');
							self.carMapedDatas[modelIndx].checkState = apiconfig.status= "verified";
							HWLayout.verifiedStateAPICall(curModel,curModel.ToyNumber);
							HWLayout.trackingFunction('cars','verify',curModel.Title,'cars: pop up','');
						}
						$activeThumb.find('.coll-checkmark-icon').addClass("verified").removeClass("unverified");
						if($activeCarsl) $activeCarsl.addClass("verified").removeClass("unverified");
						// if(res.responseText)
					},null,null,null,true);
					// getProductDetailByCode
				} 
			},
			errorMessages: function(msg,clearTxt){
				var msgContent,
					invalidMessage  = $(".invalid-error-message").html(),
					usedMessage = $(".already-unlock-message").html();

				if(typeof clearTxt!="undefined") $clearTxt.val('');
				switch(msg){
					case 'empty' : 
						 msgContent = invalidMessage;
						 break;
					case 'invalid' : 
						 msgContent = invalidMessage;
						 break;
					case 'onlyNos':
						 msgContent = invalidMessage;
						 break;
					case 'unlocked':
						msgContent = usedMessage;
						 break;
				}
				return msgContent;
			},
			getCollDatas : function(obj,bool){
				var start, end, n, ret = [],self=this;
				if(typeof obj=="undefined") return;
				if(this.initial_count === 'all') {
				    _.each(obj, function(m) {
				        ret.push(m);
				    });
				} 
				else {
				    if(this.page === 0) {
	                    start = 0;
	                    end = this.initial_count - 1;
	                } else {
	                	if(bool){
	                		if(this.initial_count<0) this.initial_count = this.filPage || 0;
	                		this.filPage = start = (obj.length<this.initial_count) ? this.filPage+obj.length : this.initial_count+1;
	                	}
	                	else{
	                    	start = (this.initial_count) + ((this.page - 1) * this.paged_count);
	                	}
	                    end = start + this.paged_count - 1;
	                }
	                if(end >= this.count() - 1) {
	                    end = this.count() - 1;
	                }
				    if(start>= this.count()) { // start has extended past the length... find not loaded
				        n = this.paged_count;
				       $(".thumbnail-coll-wrapper").addClass('success');
				       dataLoaded = true;
				    } else {
				    	// if(start==0 && end==0) return
				    	if(bool){
							if(this.page==0){
								this.filPage = start =0
							}
				    		for(var i=start, m; i < end + 1; i++) {
					            m = obj[i];
					            if(!_.isUndefined(m) && !m.loaded) {
				                        ret.push(m);
				                        m.loaded=true;
					                }
					            }
				    	} else{
					        for(var i=start, m; i < end + 1; i++) {
					            m = obj[i];
					            if(!_.isUndefined(m)) {
				                        ret.push(m);
					                }
					            }
					        }
					        dataLoaded = false;
				        }
				    }
				    // alert("start:"+start+" End:"+end+" initialCount:" + this.initial_count);
				    if(!ret.length){
				    	$(".thumbnail-coll-wrapper").addClass('success');
				    	//this.initial_count = ret.length-1;
				       	this.filterLoaded = dataLoaded = true;
				    	return;	
				    } 
				   if(bool){
					    if(ret.length<=this.initial_count && bool){
					    	 this.initial_count= end;
					    	 if(this.page==0) this.page++;
					    } else{
					    	this.initial_count =this.initial_count + ((this.page ) * this.paged_count);
					    	this.page++
					    }
				   }
				   else{
				    	this.initial_count = this.initial;
				    	this.page++
					    }
				    // alert("start:"+start+" End:"+end+" initialCount:" + this.initial_count);
				    this.templateBind(this.templateConfig('thumbnail'),ret,'thumbnails');
			},
			count: function() {
	            return this.models.length;
	        },
			ajaxCollection : function(el,obj){
				this.initial = $("#"+el).data('initialCount');
				this.initial_count = this.initial_count || this.initial || 0;
	            this.paged_count = 0;
	            this.curt_count_obj = {};
	            this.page = this.page || 0;
	            this.paged_count = $("#"+el).data('paged');
	            this.models = obj;
	            this.filPage = this.filPage || 0;
	            this.remItem = this.remItem || 0;
			},
			loadMore : function(curVal){
	        	var self =this,
	        		obj = filterActive ? this.filteredDatas : ((yearFilter) ? this.filterYear : this.carMapedDatas);
				if(window.innerHeight > curVal.getBoundingClientRect().bottom){
					var bool = (filterActive) ? true :0;
					if(!this.filterLoaded) self.getCollDatas(obj,bool);
				}
			},
			filterIds : function(obj,firstLoad){
				var nameObj,keyName,
					filtrRef= firstLoad ? $(".filter-containers>li:not(.unlock-field,.year-field)") : $(".filter-containers>li:not(.unlock-field,.segment-field,.year-field)");
				for(var i=0;i<filtrRef.length;i++){
					nameObj= filtrRef[i].dataset.filterName;
					keyName = HWLayout.productFieldConfig(nameObj);
					if(keyName.toLowerCase()!=="styles"){
						this[nameObj] = HWLayout.filterObjects(this.filterDatas[nameObj],HWLayout.uniqueObjectCnt(obj,keyName),keyName);
					} else{
						this[nameObj] = HWLayout.filterObjects(this.filterDatas[nameObj],HWLayout.splitObjects(obj,nameObj,'StyleSEOName'),keyName);
					}
					this[nameObj+'len'];
					// console.log(this[nameObj])
				}
			},
			detailFilter : function(elem,bool,evt){
				evt.preventDefault();
				var self = this,
					filterId = $(elem).attr('href').split('='),elem,parElem,
					parentClass = ".filter-containers";

				//this.clearAll();
				parElem = $(parentClass).find("li[data-filter-name="+filterId[0]+"]");
				this.filterIn(parElem,true);
				elem = $("#"+filterId[0]+"-filter-container li[data-id="+filterId[1]+"]");
				if(elem.length){
					this.scrollAnimate($("#filter-coll-container"));
					setTimeout(function(){
						self.filterValidation(elem,true);	
					},500)
				} 
			},
			filterLinking : function(){
				var filterArr = Object.keys(HWLayout.productFieldConfig()),filterId,elem,parElem,
					parentClass = ".filter-containers",count=0,filterIdArr,filterParse;

				for(var i=0;i<filterArr.length;i++){
					filterId = HWLayout.getQueryParameterByName(filterArr[i]);
					if(filterId!=null){
						filterIdArr = filterId.split(',');
						for(var j=0;j<filterIdArr.length;j++){
							filterParse = filterIdArr[j];
							if(typeof filterParse=="string" && isNaN(filterParse)){
								parElem = $(parentClass).find("li[data-filter-name="+filterArr[i]+"]");
								this.filterIn(parElem,true);
								elem = $("#"+filterArr[i]+"-filter-container li[data-id="+filterParse+"]");
								if(elem.length){
									this.filterValidation(elem);
									count++;
								}
							}
						}
					}
				}
				return count;
			},
			gridLayoutUpdate : function(){
				// if(!isMobile) return;
				if(thumbGrid!=undefined && typeof thumbGrid.isotope=="function"){
					setTimeout(function(){thumbGrid.isotope('layout');},500)
				}
			},
			syncUserDatas : function(userRes){
				if(userRes==undefined) return;
				if(typeof this.carMapedDatas=="undefined"){
					this.syncUserData = userRes;
					return;
				}
				syncUserData = true;
				var $targetElem,$iconElem;
				for(var i=0;i<this.carMapedDatas.length;i++){
					for(var j=0;j<userRes.length;j++){
						if(this.carMapedDatas[i].ToyNumber == userRes[j].code){
							$targetElem = $(".coll-actions-container[data-id="+userRes[j].code+"]")
							if(userRes[j].status=="wishlist"){
								$iconElem = $targetElem.find(".wishlist-action");
								cookie.cookieName = "carWishlist";
								cookie.toggleCookie(true,userRes[j].code);
							} else{
								$iconElem = $targetElem.find(".coll-checkmark-icon");
								$targetElem.find(".wishlist-action").addClass('disabled');
							}
							$iconElem.addClass(userRes[j].status);
							this.carMapedDatas[i].status = userRes[j].status;
						}
					}
				}
				this.getCookieProducts(".selected-product-image");
			},
			linkAnonymousUser : function(obj){
				if(this.carMapedDatas==undefined){
					this.userDataObj = this.userDataObj || obj;
					cookie.prepend("userMapped",false);
					return;
				}
				var obj = this.userDataObj || obj,
					cnt = obj.arrayList.length,
					self =this;
				if(!cnt) return;
				for(var i=0;i<self.carMapedDatas.length;i++){
					if(cnt){
					 if(obj['carVerified'] && obj['carVerified'].indexOf(self.carMapedDatas[i].ToyNumber)!=-1){
						statusname = 'verified';
						self.carMapedDatas[i].status = self.carMapedDatas[i].checkState  = statusname;
						$(".coll-thumb[data-id="+self.carMapedDatas[i].ToyNumber+"]").find('.coll-checkmark-icon').addClass(statusname);
						$(".coll-thumb[data-id="+self.carMapedDatas[i].ToyNumber+"]").find('.coll-wishlist-icon').addClass('disabled');
						cnt--;
					} else if(obj['carUnverified'] && obj['carUnverified'].indexOf(self.carMapedDatas[i].ToyNumber)!=-1){
						statusname = 'unverified';
						self.carMapedDatas[i].status = self.carMapedDatas[i].checkState = statusname;
						$(".coll-thumb[data-id="+self.carMapedDatas[i].ToyNumber+"]").find('.coll-checkmark-icon').addClass(statusname);
						$(".coll-thumb[data-id="+self.carMapedDatas[i].ToyNumber+"]").find('.coll-wishlist-icon').addClass('disabled');
						cnt--;
					} else if(obj['carWishlist'] && obj['carWishlist'].indexOf(self.carMapedDatas[i].ToyNumber)!=-1){
						statusname = 'wishlist';
						self.carMapedDatas[i].status = self.carMapedDatas[i].checkState  = statusname;
						$(".coll-thumb[data-id="+self.carMapedDatas[i].ToyNumber+"]").find('.coll-wishlist-icon').addClass(statusname);
						cnt--;
					} else{
						statusname = '';
					} 
				}else{
						break;
					}
				}
				cookie.prepend("userMapped",true);
			},
			carAPICall : function(){
				var self = this,
					$closestElem = $("#"+self.templateConfig('thumbnail').targetId),
					// masterStorage = HWLayout.getObjectStorage('masterAttr'),
					// carStorage = HWLayout.getObjectStorage('carList'),
					masterStorage = HWLayout.getObjectStorage('masterAttr')!=null ? HWLayout.compareStorageDate(HWLayout.getObjectStorage('masterAttr'),'masterAttr') : 0,
					carStorage = HWLayout.getObjectStorage('carList')!=null ? HWLayout.compareStorageDate(HWLayout.getObjectStorage('carList'),'carList') : 0,
					carStorage = carStorage && HWLayout.getObjectStorage('carList')['activeYear']!=undefined && (HWLayout.getObjectStorage('carList')['activeYear'] == activeYear) ? carStorage: 0,
					statusObj,cnt,statusname;

				this.catalogService = {};
		        this.catalogService.name = "carCatalog";
		        this.catalogService.domain = apiconfig.apiDomainConfig(this.catalogService.name);

				if(masterStorage){
					self.filterDatas = masterStorage;	
				} else{
					HWLayout.ajaxDataFormat(this.catalogService.domain,apiconfig.apiMethodConfig(this.catalogService.name,'getAttributeList'),function(res){
						if(res==false) return;
						self.filterDatas = res;	
						var masterApiObject = {'obj':self.filterDatas, 'timestamp': HWLayout.storageExpiryDate()};
						HWLayout.setObjectStorage('masterAttr',masterApiObject);
						// HWLayout.setObjectStorage('masterAttr',self.filterDatas);
						if(!self.filterIdCall && self.carMapedDatas){
							self.filterIds(self.carMapedDatas,true);
						}
						return;
					})
				}

				HWLayout.currentYear = apiconfig.currentYear = $("#active-year").val();
		        if(carStorage && carStorage!=false){
		        	self.carDatas = carStorage;
					self.carMapedDatas = HWLayout.props(self.carDatas);
					self.ajaxCollection(self.templateConfig('thumbnail').targetId,self.carMapedDatas)
					if(window.location.href.indexOf("?")==-1) self.getCollDatas(self.carMapedDatas);
					if(typeof self.filterDatas!="undefined"){
						self.filterIds(self.carMapedDatas,true);
						self.filterIdCall = true;
					} else{
						self.filterIdCall = false;
					}
					if(window.location.href.indexOf("?")!=-1){
						if(self.filterLinking()){
							// self.page=0;
							// self.getCollDatas(self.carMapedDatas);
						} else{
							//alert("No Products Found with this Filter ID");
							self.getCollDatas(self.carMapedDatas);
						}
					}
					Backbone.history.stop();
					Backbone.history.start({
	                    pushState: true,
	                    root: '/' + apiconfig.localeName + '/collection/'
	                });
					$("#thumbnail-coll-container").removeClass('loading');
					var carApiObject = {'obj':self.carDatas, 'activeYear' : activeYear, 'timestamp': HWLayout.storageExpiryDate()};
					HWLayout.setObjectStorage('carList',carApiObject);
					//HWLayout.setObjectStorage('carList',self.carDatas);
					if(!syncUserData) self.syncUserDatas(self.syncUserData);
					if(cookie.get("userMapped")==undefined || cookie.get("userMapped")==false){
						statusObj = self.linkAnonymousUser(HWLayout.splitStatusName());
					}
					if(!HWLayout.ssoId){
						cookie.prepend("userMapped",false);
						self.getCookieProducts(".selected-product-image");
					} 
					return;
		        } else{
					HWLayout.ajaxDataFormat(this.catalogService.domain,apiconfig.apiMethodConfig(this.catalogService.name,'getCarList'),function(res){
						self.carDatas = res;
						if(res==false) return;
						self.carMapedDatas = HWLayout.props(self.carDatas);
						self.ajaxCollection(self.templateConfig('thumbnail').targetId,self.carMapedDatas)
						if(window.location.href.indexOf("?")==-1) self.getCollDatas(self.carMapedDatas);
						self.filterIds(self.carMapedDatas,true);
						if(window.location.href.indexOf("?")!=-1){
							if(self.filterLinking()){
								// self.getCollDatas(self.carMapedDatas);
							} else{
								//alert("No Products Found with this Filter ID");
								self.getCollDatas(self.carMapedDatas);
							}
						}
						Backbone.history.stop();
						Backbone.history.start({
		                    pushState: true,
		                    root: '/' + apiconfig.localeName + '/collection/'
		                });
						$("#thumbnail-coll-container").removeClass('loading');
						var carApiObject = {'obj':self.carDatas, 'timestamp': HWLayout.storageExpiryDate(),'activeYear' : activeYear};
						HWLayout.setObjectStorage('carList',carApiObject);
						// HWLayout.setObjectStorage('carList',self.carDatas);
						if(!syncUserData) self.syncUserDatas(self.syncUserData);
						if(cookie.get("userMapped")==undefined || cookie.get("userMapped")==false){
							statusObj = self.linkAnonymousUser(HWLayout.splitStatusName());
						}
						if(!HWLayout.ssoId){
							cookie.prepend("userMapped",false);
							self.getCookieProducts(".selected-product-image");
						} 
						return;
					})
		        }
			},
			Router : Backbone.Router.extend({
		       routes: {
		            ":id" : "activeTab"
		        },
		        activeTab: function (id) {
		        	if(id.includes("index")) return;
		           	if(typeof id=="string" && isNaN(id)){
		           		var seoName = id.toLowerCase(),
		           			parentClass = ".filter-containers",
			           		filterName =  Object.keys(HWMAT.layout.productFieldConfig())[0],
							parElem = $(parentClass).find("li[data-filter-name="+filterName+"]");
						currentObjRef.filterIn(parElem,true);
						elem = $("#"+filterName+"-filter-container li[data-id="+seoName+"]");
						if(elem.length) currentObjRef.filterValidation(elem);
					}
		        }   
		    }),
			init : function(){
				if(typeof _!="function" || typeof $!="function" || typeof Backbone !="object" || isLoaded) return;
				currentObjRef = this;
				var self = this,
				route = new self.Router();
				this.filteredDatas=this.filterYear = this.filterMini = [];
				/*window.localStorage.removeItem("masterAttr");
            	window.localStorage.removeItem("carList")*/
				this.carAPICall();
				this.bindLooping(this.bindingConfig());
				this.hoverBinding(".filter-containers>li:not(.unlock-field)",'filterIn','filterOut',isMobile);
				this.hoverBinding(".tooltip-modal-open>a",'tooltipIn','tooltipOut');
				this.hoverBinding(".nav > li.wish-list",'wishlistIn','wishlistOut');
				this.loginMessageToggle();
				this.filterLoaded =false;
				this.filLength = 0;
				isLoaded = true;
		}
	};
	collections.init();
	global.HWMAT.collections = collections;
}(this, jQuery,HWMAT.cookie,HWMAT.config,Backbone));


// jQuery Ready Fn

$(function(){
	HWMAT.collections.init(); // this function might fails because of previous call which trigger on page ready.

	// get cookie products after page load
	$(window).on('load',function(){
		
	})
	// lazy load event triggers in page ready
	$(window).scroll(function(){
	    var parentContainer= document.querySelector("#thumbnail-coll-container");
	    HWMAT.collections.loadMore(parentContainer);
	})
	$(window).resize(function () {
	   HWMAT.collections.gridLayoutUpdate();
	});
});
