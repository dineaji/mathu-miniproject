/**
* Global namespace for web site elements
*/

var ssoCookieName = "user_data",
    localeName = document.getElementById('hdnLocaleName') != null ? document.getElementById('hdnLocaleName').value : 'en-us',
    isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && screen.width < 768;

(function(global,$,cookie,apiconfig){
    var isLoaded = false,
        activeclass = "active",
        Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } },
        layout = {

    eventBinding : function($curEl,callBack,targetElem,curObj){
        var self = curObj || this,
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
            'elem' : '.leaving-hws',
            'func' : 'intrestitial',
        },{
            'elem' : '.customize-button',
            'func' : 'userCustomize'
        },{
            'elem' : '.user-configure-item .mini-go-icon',
            'func' : 'openConfigureList'
        },{
            'elem' : '.customize-banner-section .cancel-item',
            'func' : 'settingHomeScreen'
        },{
            'elem' : '.customize-banner-section .apply-item',
            'func' : 'submitUserChanges'
        },{
            'elem' : '.sso-nav-link',
            'func' : 'customLogout'
        },{
            'elem' : '.close-modal',
            'func' : 'closeModal'
        },{
            'elem' : '.customize-item-list',
            'func' : 'classToggle'
        },{
            'elem' : '.open-signin-modal',
            'func' : 'openSiginDropdown'
        },{
            'elem' : '.open-signin-modal .user-profile-btn>a',
            'func' : 'removeActiveClass',
            'partElem' : '.open-signin-modal'
        },
		{
            'elem' : '.top-nav-games.game-pop-up a',
            'func' : 'gameintrestitial'
        },
		{
            'elem' : '.top-nav-videos.video-pop-up a',
            'func' : 'videointrestitial'
        },
		{
			'elem' : '.inter-submit',
			'func' : 'closeLeavingInterstetial'
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
    templateConfig : function(configName){          
        var configObj;
        switch(configName){
            case 'customizeModal':
                configObj={"templateId":"customize-template-container","targetId":"customize-modal-container"}
                break;
            case 'enterCode':
                    configObj={"templateId":"enter-code-template","targetId":"modal-global-container"}
                    break;
        }
        return configObj;
    },
    templateBind : function(obj,res,optnl){
        var self = this,templateCollection,refrncName = typeof optnl=="undefined" ? "" : optnl,
        divElem = document.getElementById(obj.targetId),
        templateId =   _.template(document.getElementById(obj.templateId).innerHTML.trim());
        templateCollection = templateId({ 'items' : res});
        if(!refrncName) $(templateCollection).appendTo(divElem);
        return $(templateCollection)
    },
    // API model fields for mapping
    productFieldConfig : function(keyName){
        var obj={
            "MiniCollections" : "MiniCollectionSEOName",
            "Makes" : "MakeSEOName",
            "Styles" : "Styles",
            "Colors" : "ColorSEOName",
            "year" : "Year"
        }
        return keyName ? obj[keyName] : obj;
    },
    ajaxResp : function(url,cb){                
        var self=this;
        fileparser= (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXobject("Microsoft.XMLHTTP");
        fileparser.open('GET',url,false);
        fileparser.send()
        responseText=fileparser.responseText;
        parseJson=JSON.parse(responseText);
        return parseJson;
    },// Ajax Fn with jQuery Format
    ajaxDataFormat : function(domain,obj,cb,ObjName,isAsynOptnl,bodyObj,isReturnErrorMsg){
        var self = this,
        contentFormat = obj.type=="GET" || ObjName=="profileSetting" || (ObjName == "rewardService" && obj.name!="oauthtoken") ? "application/json" : "application/x-www-form-urlencoded",
            tokenName = ObjName ? self[ObjName] : 0,
            tokenId = tokenName ? tokenName.tokenId : undefined,
            referenceName = obj.name || '';
        return $.ajax({
            type: obj.type,
            async: isAsynOptnl || true,
            url: domain+obj.name+obj.params,
            contentType : contentFormat,
            data : typeof obj.body=="function" ? obj.body(bodyObj) : obj.body,
             // beforeSend: function(xhr){xhr.setRequestHeader('x-access-token','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJod3JhY2VyIiwiaWF0IjoxNDcxNjI2MjAxMTM2LCJleHBpcmVzSW4iOiIzMG0ifQ.ldwzM_HBWj3O-txm56M8dsOeU3OJv6m1jSFrmsV-OWw')},
            beforeSend: function(xhr) { 
                if(tokenId!=undefined){
                    if(tokenName.name=="collectionService" || tokenName.name == "wishlistService"){
                        xhr.setRequestHeader('Authorization','bearer '+ tokenId);
                        xhr.setRequestHeader('Accept' , 'application/vnd.mattel.hotwheels.collection.v1+json; screenScaleFactor=2; platform=ios');
                    } else if(tokenName.name=='rewardService'){
                        if(referenceName=="oauthtoken"){
                            xhr.setRequestHeader('x-signature',tokenId);
                        } else{
                            xhr.setRequestHeader('x-access-token',tokenId);
                        }
                    }
                }
                if(obj.type=="GET"){
                    xhr.setRequestHeader('dataType', 'jsonp');
                }
            },
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
                    if(isReturnErrorMsg){
                        cb(errrLog)
                    }else{
                        cb(false)
                    }
                }
            }
        });
    },
    renderCarousel : function(el,prop,destroy){      
        var self=this,
            $owl = $(el);
        if(destroy) $owl.trigger('destroy.owl.carousel')
        $owl.owlCarousel({
            items           :  prop.itemVisible,             // Integer
            singleItem      :  prop.singleItem || false,     // Boolean
            dots            :  prop.pagination || false,     // Boolean
            smartSpeed      :  400,                          // Integer
            callbacks       :  true,                         // Boolean
            autoplay        :  prop.autoPlay || false,       // Boolean / Integer 
            loop            :  prop.loop || false,           // Boolean
            mouseDrag       :  false,                        // Boolean
            nav             :  prop.navigation || false,     // Boolean
            navText         :  false,                        // Boolean
            addClassActive  :  true,                         // Boolean
            itemsDesktop    :  false,                        // Boolean
            navRewind       :  false,                        // Boolean
            startPosition   :  $owl.data('currentIndex') || 0, // Integer
            centerClass     :  'active-element',
            center          :  prop.center,                  // Boolean
            transitionStyle :  true,
            navSpeed        :  400,
            responsiveClass  : true,
            rewindNav       : true,
            animateOut      : prop.mode ? 'slideOutDown' : '',
            animateIn       : prop.mode ? 'flipInX' : '',
            responsive      :{
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
        return $owl;
    },
    getFilterData : function(obj,refKey,val){
        return obj.filter(function(item){
            if(item[refKey]==undefined || val==undefined) return false;
            if(item[refKey].toLowerCase() == val.toLowerCase()){
                return item;
            }
        })
    }, // return distivt values 
    uniqueVal : function(obj,keyName){
        return _.keys(_.countBy(obj, function(data) { return data[keyName]; }));
    },
    rewardUniqueVal : function(obj,keyName1,keyName2){
        return _.keys(_.countBy(obj, function(data) { return data[keyName1] || data[keyName2]; }));
    },
    uniqueObject : function(obj,keyName){
        return uniqueList = _.uniq(obj, function(item, key) { 
            return item[keyName];
        });
    },
    splitObjects : function(obj,key,subKey){
        var arr=[];
        for(var i=0;i<obj.length;i++){
            for(var j=0;j<obj[i][key].length;j++){
                arr.push(obj[i][key][j][subKey])
            }
        }
        return this.uniqueData(arr);
    },
    uniqueObjectCnt : function(obj,keyName){
        var self =this,
        dist = _.uniq( _.collect( obj, function( x ){
            return x[keyName] ;
        }));
        return dist;
    },
    uniqueData : function(data){
        return  _.uniq(data)
    },
    props : function(obj,bool){
        if(typeof bool!="undefined" && bool){
             obj = _.map(obj, function(element,indx) { 
                return _.extend({}, element, {loaded: false,index:indx,status:element.status || ""});
            });
        }
        else{
            obj = _.map(obj, function(element,indx) { 
                return _.extend({}, element, {loaded: false,checkState:'',wishState:'',index:indx,status:element.status || ""});
            });
        }
        return obj;
    },
    removeUndefinedArr : function(obj){
        return obj.filter(function(n){ return n != undefined }); 
    },
    groupUniqueObj : function(resObj,keyName){
        var data = {};
        if(resObj==undefined || keyName==undefined ) return false;
        for (var i = 0; i < resObj.length; ++i) {
            var obj = resObj[i];
            if (data[obj[keyName]] === undefined)
                data[obj[keyName]] = []; //Assign a new array with the first element of DtmStamp.
            
            data[obj[keyName]].push(obj);
        }
        return data;
    },
    rewardUniqueObj : function(resObj,keyName){
        var data = {};
        if(resObj==undefined || keyName==undefined ) return false;
        for (var i = 0; i < resObj.length; ++i) {
            var obj = resObj[i];
            if(obj['collectionKey']==undefined){
                obj['collectionKey'] = obj['badgeId']
            }
            if (data[obj[keyName]] === undefined)
                data[obj[keyName]] = []; //Assign a new array with the first element of DtmStamp.
            
            data[obj[keyName]].push(obj);
        }
        return data;
    },
    filterObjects : function(obj,uniqueId,keyName){
        var arr=[];
        for(i=0;i<obj.length;i++){
            for(j=0;j<uniqueId.length;j++){
                if(uniqueId[j] == obj[i].SEOName){
                    arr.push(obj[i])
                }
            }
        }
        return arr;
    },// This will remove class from all elements and adding class for current Elem
    addClass : function(removeElem, addCur){
        $(removeElem).removeClass(activeclass);
        $(addCur).addClass(activeclass);
    },
    removeActiveClass : function(elem,parentElem){
        $(elem).closest(parentElem).removeClass(activeclass);
    },
    setObjectStorage : function(setName,obj){
        if(this.getObjectStorage(setName)!=null) window.localStorage.removeItem(setName);
        localStorage.setItem(setName, JSON.stringify(obj));
    },
    getObjectStorage : function(name){
        return JSON.parse(localStorage.getItem(name));
    },
    getQueryParameterByName : function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    getHashParameterdByPathCode : function(cb){
        if(typeof Path=="undefined") return;
        var arr=[];
        Path.map('#/:page_1(/:page_2)').to(function() {
            if (this.params['page_2']) {
                arr =  [this.params['page_1'], this.params['page_2']];
            } else {
                arr = this.params['page_1']
            }
            cb(arr);
        })
        Path.listen();
    },
    intrestitial : function(elem,bool,evt){
        evt.preventDefault();
        var $curElem = $(elem).attr('href'),
            modelId = ".intrestitial-modal-container #modal-global-container",
            containerElem = $(".hw-intresteritial-container:last").clone(),
            submitElem = ".inter-submit";
        if(typeof $curElem=="undefined") return;
        if ($(".intrestitial-modal-container #modal-global-container .hw-intresteritial-container")[0]){                   
		   $(modelId).empty();$(modelId).html($(containerElem));
		}
		else{
			$(modelId).empty().append($(containerElem));                                               
		}
        $(containerElem).find(submitElem).attr('href',$curElem)
        $(".intrestitial-modal-container").modal('show');
        $(".modal-content").css("display","block");
    },
    arrayToCookie : function(name, val){
        var myDate = new Date();
        myDate.setMonth(myDate.getMonth() + 12);
        var newCookie = name + '=' + val + '; path=' +"/"+document.getElementById('hdnLocaleName').value;
        document.cookie = newCookie;
    },
    openSiginDropdown : function(elem){
        $(elem).toggleClass(activeclass)
    },
    getCollDatas : function(obj){
        var start, end, n, ret = [],self=this;
        if(typeof obj=="undefined") return;
        if(this.initial_count === 'all') {
            _.each(obj, function(m) {
                ret.push(m);
            });
        } 
        else {
            start = this.page === 0 ? 0 : (this.initial_count) + ((this.page - 1) * this.paged_count);
            end = this.page === 0 ? this.initial_count - 1 : (start + this.paged_count - 1);
            if(end >= this.count() - 1) {
                end = this.count() - 1;
            }
            if(start>= this.count()) { // start has extended past the length... find not loaded
                n = this.paged_count;
            } else {
                for(var i=start, m; i < end + 1; i++) {
                    m = obj[i];
                    if(!_.isUndefined(m)) {
                            ret.push(m);
                        }
                    }
                }
            }
        this.page++;
        return ret;
    },
    count: function() {
        return this.models.length;
    },
    ajaxCollection : function(el,obj){
        var $elem = $("#"+el);
        this.initial = $elem.data('initialCount');
        this.initial_count = this.initial || 0;
        this.page = parseInt($elem.attr('data-loaded-cnt')) || 0;
        this.paged_count = $("#"+el).data('paged') || 0;
        this.models = obj;
    },
    wrapElement : function(elem,clsName,gridColWrap){
        if(clsName) $('.'+clsName+":empty").remove();
        for(var i=0;i<elem.length;i+=gridColWrap){
            var $div = $("<div/>", {class: clsName});
            elem.slice(i, i + gridColWrap).wrapAll($div);
        }
    },
    imageLoaded : function(elem,clsName,duration){
        $(elem).imagesLoaded().progress( function() {
            setTimeout(function(){
                $(elem).removeClass(clsName)
            },duration || 0)
        })
    },
    UserLoggedInStatus : function(cookieName , isDecode){
        var getCookie = cookie.get(cookieName),
            isExist = typeof getCookie!="undefined" ? true : false,
            decoded = isExist && isDecode ? JSON.parse(Base64.decode(getCookie))[0].ConsumerId : false;

        return isExist && isDecode ? decoded : isExist ?  getCookie : isExist;
    },
    checkUserId : function(res){
        if(res==undefined) return;
        var tokenVal = res.access_token,
            carCookieDatas,
            isSSOIdExist = this.ssoId;

        this.collService.tokenId = tokenVal;
        if(isSSOIdExist){
            console.log("SSOID Exist and consumerId false") // get collection user
            this.collService.SSOId = isSSOIdExist;
            apiconfig.userId = isSSOIdExist;
            if(cookie.get("userMapped")==undefined || cookie.get("userMapped")==false){
                carCookieDatas = this.linkcookieDatatoUser(this.splitStatusName());

            }
            this.ajaxDataFormat(this.collService.domain(),apiconfig.apiMethodConfig(this.collService.name,'getCar'),"userCollections",'collService');    
        }
    },
    setWishlistCounter: function(bool){
        var shopArray = cookie.get('HW_ProductValue', true),
            carArray =  cookie.get('carWishlist', true),
            shopLength = shopArray ? (shopArray.filter(Boolean)).length : 0,
            carLength = carArray ? carArray.length : 0,
            isIncrement = bool!=undefined ? bool : true;

        if(_.isArray(shopArray) || _.isArray(carArray)){
            if(isIncrement){
                $('.shop-nav__counter').removeClass("active").delay(50).queue(function(next){
                    $(this).addClass("active");
                    next();
                });
            } else{
                $('.shop-nav__counter').addClass("active");
            }
            $(".shop-nav__counter .number").text(shopLength+carLength);

        } else {
            $('.shop-nav__counter').removeClass('active');
             $(".shop-nav__counter .number").text('');
        }
    },
    toggleWishlistState : function(bool,id){
        cookie.cookieName = "carWishlist";
        cookie.toggleCookie(bool,id);
        this.setWishlistCounter(bool);
    },
    splitStatusName : function(){
        var wishlistNames = ['carWishlist','carUnverified','carVerified'],
            isWishlistObj,
            ids,idsString,obj={},mapArr=[];
        for(var i=0;i<wishlistNames.length;i++){
             idsString = cookie.get(wishlistNames[i], true);
             obj[wishlistNames[i]] = typeof idsString!="undefined" ? idsString : [];
        }
        mapArr = obj['carUnverified'].concat(obj['carVerified']);
        for(var j=0;j<mapArr.length;j++){
            for(var k=0;k<obj['carVerified'].length;k++){
                obj['carWishlist'] = _.without(obj['carWishlist'], mapArr[j]);
                obj['carUnverified'] = _.without(obj['carUnverified'], obj['carVerified'][k]);
            }
        }
        isWishlistObj = obj['carWishlist'] = obj['carWishlist']!=null ? obj['carWishlist'] : [];
        obj.arrayList = isWishlistObj.concat(obj['carUnverified'],obj['carVerified']);
        return obj;
    },
    linkcookieDatatoUser : function(cookieObj){
        var self = this,
            totCount = cookieObj.arrayList.length,statusName,
            mapObj = Object.keys(cookieObj).map(function (key) {return cookieObj[key]});
        if(!totCount) return
        for(var i=0;i<mapObj.length-1;i++){
            statusName = i==0 ? "wishlist" : (i==1) ? "unverified" : "verified";
            for(j=0;j<mapObj[i].length;j++){
                this.addUserByToyid(mapObj[i][j],statusName)
            }
        }
        setTimeout(function(){
            if(HWMAT.collections) HWMAT.collections.linkAnonymousUser(self.splitStatusName())
        },700)
        setTimeout(function(){
            if(HWMAT.profile){
                self.ajaxDataFormat(self.collService.domain(),apiconfig.apiMethodConfig(self.collService.name,'getCar'),function(res){
                    if(res==false) return;
                    var obj = res.items ? self.groupUniqueObj(res.items,'status') : '',
                        unverified = obj['unverified'] ? obj['unverified'].length : 0,
                        verified = (obj['verified'] ? (!isNaN(obj['verified']) ? obj['verified'] : obj['verified'].length) : 0)+unverified,
                        $targetHtml = $('.profile-status-count[data-status-name="verified"]');
                    if($targetHtml.html()==0) $('.profile-status-count[data-status-name="verified"]').html(verified);
                },'collService');
            }
        },3000)
        cookie.prepend("userMapped",true);
    },
    toggleClassWithFlash : function(elem,duration){
        $(elem).addClass(activeclass).stop().delay(duration).queue('',function(){
            $(this).removeClass(activeclass);
        });
    },
    addUserByToyid : function(toyId,statusName){
        var elemStatus,
            self = this;
        apiconfig.toyId = toyId;
        apiconfig.status=statusName;
        this.ajaxDataFormat(this.collService.domain(),apiconfig.apiMethodConfig(this.collService.name,'addcar'),'','collService');
    },
    userCollections : function(res){
        if(res==undefined) return;
        var uniqueobj;
        if(res==false){
            this.collService.userDatas = res;
        } else{
           this.collService.userDatas =  res.items.map(function(item) {
                return {'miniId':item.mini_collection.id,'toyId':item.code,'status':item.status,'position':item.mini_collection.position,'totalItem' :item.mini_collection.total_items};
            });
        }
        //update wishlist count in top nav
        if(res && res.items && (cookie.get("wishlistMapped")==undefined || cookie.get("wishlistMapped")==false)){
            var splitStatus = this.groupUniqueObj(res.items,'status'),
                isWishlist = splitStatus ? splitStatus['wishlist'] : false,
                countElem = $(".nav-wishlist.shop-nav__counter .number"),
                wishlistNos,cookeLen;
            if(isWishlist){
                wishlistNos = this.uniqueVal(isWishlist,'code');
                cookeLen = wishlistNos ? wishlistNos.length : 0;
                if(cookeLen){
                    cookie.cookieName = "carWishlist";
                    for(var i=0;i<cookeLen;i++){
                        cookie.toggleCookie(true,wishlistNos[i]);
                    }
                    this.setWishlistCounter(true)
                }
            }
            cookie.prepend("wishlistMapped",true);
        }
       if(HWMAT.collections){
            HWMAT.collections.syncUserDatas(res.items || res)
       } else if (HWMAT.profile){
            uniqueobj = this.groupUniqueObj(this.collService.userDatas,'status');
            uniqueobj['totalItems'] = res ? res.items.length : 0;
            setTimeout(function(){HWMAT.profile.userCollectionsData(res.items || res,uniqueobj);},500)
       } else if(HWMAT.wishlist){
            uniqueobj = this.groupUniqueObj(res.items,'status');
            HWMAT.wishlist.wishlistRender(uniqueobj || res)
       } else if(HWMAT.carDetail){
            HWMAT.carDetail.actionStatusUpdate(res.items || res)
       }
    },
    updateRewardFields : function(obj,fieldName,dynamicVal){
        return  _.map(obj,function(item){
             item[fieldName]=dynamicVal;
             return item;
        })
    },
    getRewardObject : function(){
        var self = this;
        this.rewardObj = {
            name : "rewardDatas",
            domain : function(){
                return apiconfig.apiDomainConfig(this.name)
            }
        }
        self.ajaxDataFormat(self.rewardObj.domain(),apiconfig.apiMethodConfig(self.rewardObj.name,'getCarRewards'),function(res){
            if(res==false){
                console.log("getcarRewards Data Not Found");
                return;
            }
            self.carRewardObj = self.props(res,false);
            self.ajaxDataFormat(self.rewardObj.domain(),apiconfig.apiMethodConfig(self.rewardObj.name,'getMiniRewards'),function(res){
                if(res==false){
                    console.log("getMiniRewards Data Not Found");
                    return;
                }
                self.miniRewardObj = self.props(res,false);
            })
        })
    },
    rewardCookieCnt : function(bool,toyNo,state){
        cookie.cookieName = "rewardCarCount";
        if(state && state.toLowerCase()!="wishlist") cookie.toggleCookie(bool,toyNo);
        if(this.ssoId) this.addRewardsToUser(bool,state)
    },
    rewardCompareUserBadge : function(existRewardIds,currentObj){
        if(!existRewardIds.length) return currentObj;
        var obj = currentObj;

        for(var i=0;i<currentObj.length;i++){
            if(existRewardIds.indexOf(obj[i]['badgeId'])!=-1){
                obj[i] = null;
                // delete obj[i];
                //delete obj[i];
            }
        }

        return obj;
    },
    addRewardsToUser : function(bool,state,isMapped){
        if(this.carRewardObj==undefined || this.miniRewardObj==undefined) return;
        this.totalCarsCount = typeof this.lastAddedCarLen == "number" ? this.lastAddedCarLen : (this.collService.userDatas ? this.collService.userDatas.length : 0);
        var self = this,
            increment = bool,
            sendMiniRewardObj = [],userArr = [],
            carCookieCount = self.rewardCookieLength('rewardCarCount'),
            pointsVal = !isMapped ? (rewardPoints[state].points ? parseInt(rewardPoints[state].points) : 0) : parseInt(this.rewardCookieLength('reward_Coins_Count',true));
            if(self.ssoId && (!_.isEmpty(self.totalCarsCount) || typeof self.totalCarsCount == "number")){
                // self.totalCarsCount.length++;
                carCookieCount = self.totalCarsCount;
                carCookieCount++;
            }
            // if(carCookieCount>1) carCookieCount++;
            // alert("Old:"+carCookieCount);
            // carCookieCount = _.isEmpty(self.totalCarsCount) ? self.rewardCookieLength('rewardCarCount') : self.totalCarsCount++,
            self.rewardAPICall(function(res){
                self.rewardService.userDetails = res || '';
                var userBadgesObj = self.rewardService.userDetails ? self.rewardService.userDetails.badges : '',
                userSplitCategory = userBadgesObj ? self.groupUniqueObj(userBadgesObj,'category') : '',
                userCarsUnique = userSplitCategory['Cars collected'] ? self.uniqueVal(self.removeUndefinedArr(userSplitCategory['Cars collected']),'badgeId') : [],
                // carCookieCount = userCarsUnique ? userCarsUnique.length : 0,
                userCollectionUnique = userSplitCategory['Collection started'] ? self.rewardUniqueVal(self.removeUndefinedArr(userSplitCategory['Collection started']),'collectionKey','badgeId') : [],
                badgeCnt = _.sortedIndex(rewardRange,carCookieCount),
                badgeCnt = (rewardRange.indexOf(carCookieCount)!=-1 && rewardRange.indexOf(carCookieCount)!=0 ? badgeCnt : 0)+(userCarsUnique ? userCarsUnique.length : 0),
                userRewardIds = self.rewardService.userDetails ? userArr.concat(userCarsUnique,userCollectionUnique) : [];
                // carCookieCount!=1 && rewardRange.indexOf(carCookieCount)!=-1 || self.rewardService.userDetails == ""
                // carCookieCount++;
                var isBadge = (carCookieCount!=1 && rewardRange.indexOf(carCookieCount)!=-1) || self.rewardService.userDetails == "" ? true : false,
                creationDateInt = new Date().toJSON(),
                // badgeSplitObj =  isBadge || isMapped ?  self.updateRewardFields([self.carRewardObj[badgeCnt-1]],'earnedDate',creationDateInt) : [],
                targetObj = isMapped ? self.carRewardObj.slice(0,[rewardRange.indexOf(carCookieCount) || 1]) : (isBadge ? [self.carRewardObj[rewardRange.indexOf(carCookieCount)]] : 0),
                isAlreadyExist = targetObj ? self.rewardCompareUserBadge(userRewardIds,targetObj) : false,
                badgeSplitObj = targetObj && isAlreadyExist[0]!=null ?  self.updateRewardFields(isAlreadyExist,'earnedDate',creationDateInt) : [],
                badgeTotObj,
                arr = [],
                isMapping = isMapped;

                // alert("New:"+carCookieCount);
            if((state && state.toLowerCase()!="wishlist" && state.toLowerCase()!="removed") || isMapped){
                var miniiDsArr = cookie.get('miniStartedIds',true,true),
                    miniObjArr = self.rewardUniqueObj(self.miniRewardObj,'collectionKey');
                if(miniiDsArr && miniiDsArr.length){
                    for(var i=0;i<miniiDsArr.length;i++){
                        if(miniObjArr[miniiDsArr[i]]!=undefined && !miniObjArr[miniiDsArr[i]][0].loaded){
                            miniObjArr[miniiDsArr[i]][0].loaded = true;
                            if((isMapped || sendMiniRewardObj.length==0) && (userRewardIds.indexOf(miniiDsArr[i])==-1) && miniObjArr[miniiDsArr[i]][0]['showBadge']==1){
                                if(isMapped) { sendMiniRewardObj.push(miniObjArr[miniiDsArr[i]][0]);  } 
                                else{ sendMiniRewardObj = miniObjArr[miniiDsArr[i]][0];                             }
                            }
                        }
                    }
                }
            }
            // alert(isBadge, carCookieCount, badgeSplitObj.length,sendMiniRewardObj.length)
            badgeTotObj = arr.concat(badgeSplitObj,sendMiniRewardObj);
            self.rewardsPointsUpdate(pointsVal,badgeTotObj,increment)
            })

    },
    rewardsPointsUpdate : function(pts,badges,increment){
        var self = this;
        var userCurrentPoints;
        if(this.rewardService && typeof this.rewardService.oathEnabled!="undefined" && this.rewardService.tokenId){
            this.ajaxDataFormat(this.rewardService.domain(),apiconfig.apiMethodConfig(this.rewardService.name,'getUserBalance'),function(res){
                if(res!=false){
                    userCurrentPoints = typeof res!="undefined" && typeof res.coins!="undefined" ? res.coins : 0;
                    apiconfig.totalRewardPts = increment ? userCurrentPoints+pts :  Math.abs(userCurrentPoints-pts);
                    apiconfig.badgeItems = badges;
                    self.ajaxDataFormat(self.rewardService.domain(),apiconfig.apiMethodConfig(self.rewardService.name,'updatePoints'),function(res){
                        if(res!=false && HWMAT.profile){
                        setTimeout(function(){
                            self.ajaxDataFormat(self.rewardService.domain(),apiconfig.apiMethodConfig(self.rewardService.name,'getUserPoints'),function(res){
                                if(res!=false){
                                   var splitBadgesObj = res && typeof res.badges!="undefined" && res.badges.length ? self.groupUniqueObj(self.removeUndefinedArr(res.badges),'category') : 0,
                                        carsBadgeCnt = splitBadgesObj['Cars collected'] ? splitBadgesObj['Cars collected'].length : 0,
                                        miniBadgeCnt = splitBadgesObj['Collection started'] ? splitBadgesObj['Collection started'].length : 0,
                                        $carRewardsHtml = $('.profile-status-count[data-status-name="carsRewards"]'),
                                        $miniRewardsHtml = $('.profile-status-count[data-status-name="miniRewards"]');

                                    if($carRewardsHtml.html()==0) $carRewardsHtml.html(carsBadgeCnt);
                                    if($miniRewardsHtml.html()==0) $miniRewardsHtml.html(miniBadgeCnt);
                                }
                            },'rewardService')
                         },3000)
                         }
                    },'rewardService')
            }
            },'rewardService')
        }
    },
    rewardCoinsStore : function(bool,state,pts){
        cookie.cookieName = "reward_Coins_Count";
        var cookieVal = cookie.get(cookie.cookieName),
            pointsVal = !pts ? (rewardPoints[state].points ? parseInt(rewardPoints[state].points) : 0) : pts,
            intVal = cookieVal ? parseInt(cookieVal) : 0,
            finalVal = bool ? pointsVal+intVal : Math.abs(intVal-pointsVal);

        this.arrayToCookie(cookie.cookieName,finalVal);
        /*
        if(state && !this.ssoId){
            this.toggleClassWithFlash('.coins-flash-message',5000);
            if(bool){
                $(".coins-flash-message").html("Anonymous User: <br>Coins Earned : "+parseInt(rewardPoints[state].points) +"Coins<br>Total Coins: "+finalVal+" coins");
            } else{
                $(".coins-flash-message").html("Anonymous User: <br>Coins Losts : "+parseInt(rewardPoints[state].points) +"Coins<br>Total Coins: "+finalVal+" coins");
            }
            
        }*/
    },
    rewardMiniStartedCookie : function(bool,toyId,optlMiniId,optlMiniSeoName){
        var miniId = $(".coll-thumb[data-id="+toyId+"]").find(".collection-id").val() || $("#detail-car-container").find(".collection-id").val() || optlMiniId;
        if(typeof miniId == "number"){
            miniId = optlMiniSeoName || miniId;
        }
        cookie.cookieName = "miniStartedIds";
        if(!cookie.inCookie(cookie.cookieName,miniId,true)){
            cookie.toggleCookie(bool,miniId,true);
        }
    },
    rewardCookieLength : function(cookieName,isInteger){
        var dataLength = isInteger ? cookie.get(cookieName) : cookie.get(cookieName, true);
        return dataLength ? (isInteger ? dataLength : dataLength.length ): 0;
    },
    linkcookieRewardstoUser : function(){
        var self =this;
        if(parseInt(this.rewardCookieLength('reward_Coins_Count',true))){
            this.ajaxDataFormat(this.collService.domain(),apiconfig.apiMethodConfig(this.collService.name,'getCar'),function(res){
                if(res!=false) {
                    self.lastAddedCarLen = res.last_seq;
                }
                self.addRewardsToUser(true,null,true)
            },'collService');
        }
        cookie.prepend("rewardsMapped",true);
    },
    wishlistAPICall : function(obj,toyId,toggleState){
        apiconfig.toyId = toyId;
        cookie.cookieName = "carWishlist";
        apiconfig.status = "wishlist"
        if(!toggleState){
            obj.wishState="";
            if(obj.status=="wishlist" && this.ssoId){
                this.ajaxDataFormat(this.collService.domain(),apiconfig.apiMethodConfig(this.collService.name,'removeCar'),'','collService');
                obj.status = "";
            }
        } else{
            if(this.ssoId && obj.status=="" || obj.status=="removed"){
                this.addcarinCollectionService();
                obj.status = "wishlist"
            }
            this.rewardCoinsStore(toggleState,'wishlist');
            this.rewardCookieCnt(toggleState,apiconfig.toyId,'wishlist');            
        }

    },
    unVerifiedStateAPICall : function(elem,toyId){
        apiconfig.toyId = toyId;
        apiconfig.status= "unverified";
        cookie.cookieName = "carUnverified";
        cookie.toggleCookie(true,toyId)
        if(!$(elem).hasClass(apiconfig.status)){
            this.rewardMiniStartedCookie(true,toyId);
            this.rewardCoinsStore(true,apiconfig.status);
            this.rewardCookieCnt(true,toyId,apiconfig.status);
        }
        this.addcarinCollectionService();
        // obj.status =obj.checkState =apiconfig.status;
    },
    verifiedStateAPICall : function(obj,toyId,optlMiniId,cb){
        apiconfig.toyId = toyId;
        apiconfig.status= "verified";
        cookie.cookieName = "carVerified";
        cookie.toggleCookie(true,toyId);
        obj.status ="verified";
        this.rewardMiniStartedCookie(true,toyId,optlMiniId,obj.MiniCollectionSEOName);
        this.rewardCoinsStore(true,'verified');
        this.rewardCookieCnt(true,toyId,'verified');
        this.addcarinCollectionService(cb || '');
        if(!this.ssoId) cb(false);
    },
    addcarinCollectionService : function(cb){
        var self = this;
        if(this.ssoId){
            this.ajaxDataFormat(this.collService.domain(),apiconfig.apiMethodConfig(this.collService.name,'addcar'),function(res){
                if(res!=false && res.last_seq){
                    self.lastAddedCarLen = res.last_seq;
                } 
                if(typeof cb == "function") cb(res!=false && res.last_seq ? res : res.responseText);
                if(res.responseText) console.log("Add car in Collection Service API Failed. Error is "+res.responseText)
            },'collService','','',true);
        }
    },
    trackingFunction : function(obj){
        //console.log(arguments);
        var obj={
            catName : arguments[0],
            action : arguments[1],
            label : arguments[2],
            desc : arguments[3],
            pos : arguments[4]
        }
        // utag.link({  eve_cat:"profile" , eve_act:"view", eve_lab:"[page name]", eve_des:"profile",eve_pos:"" });
        if(typeof utag!="undefined" && typeof utag.link=="function"){
            utag.link({  eve_cat:obj.catName ||'' , eve_act:obj.action || '', eve_lab:obj.label || '', eve_des:obj.desc || '',eve_pos:obj.pos || '' });
        }
    },
    generatePids : function(cb){
        var ids = cookie.get('HW_ProductValue', true),
            obj={},
            idsString = _.isArray(ids) ?  ids.join(',') : ids,
            self=this;

        obj.name = "productCatalog";
        obj.domain = apiconfig.apiDomainConfig(obj.name);
        if( idsString !== undefined && idsString !== null){
            apiconfig.pids = idsString;
            this.ajaxDataFormat(obj.domain,apiconfig.apiMethodConfig(obj.name,'wishlist'),function(response){
                if(typeof cb=="function"){
                    cb(response);
                    return;
                }
                self.productWishlist = response;
            });
        } else{
             if(typeof cb=="function") cb(false);
             self.productWishlist = false;
        }
    },
    tokenGenerator : function(){
        var randomNo = (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10),
            secretId = "6@8*35h0+A77",
            hash = CryptoJS.HmacSHA256(randomNo, secretId),
            hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        return [randomNo,hashInBase64];
    },
    rewardAPICall : function(cb){
        if(typeof CryptoJS=="undefined") return;
        var tokenValues = this.tokenGenerator(),
            self = this;
        
        apiconfig.userId = this.ssoId;
        apiconfig.rewardClientId = tokenValues[0];
        this.rewardService = {
            name : "rewardService",
            tokenId : tokenValues[1],
            oathEnabled : false,
            domain : function(){
                return apiconfig.apiDomainConfig(this.name)
            }
        };
        self.ajaxDataFormat(self.rewardService.domain(),apiconfig.apiMethodConfig(self.rewardService.name,'token'),function(res){
            if(res!=false){
                self.rewardService.oathEnabled = true
                self.rewardService.tokenId = res;
                self.ajaxDataFormat(self.rewardService.domain(),apiconfig.apiMethodConfig(self.rewardService.name,'getUserPoints'),function(res){
                    if(res!=false){
                        self.rewardService.userDetails = res;
                        if(typeof cb == "function") cb(res);
                        if((cookie.get("rewardsMapped")==undefined || cookie.get("rewardsMapped")==false)){
                            self.linkcookieRewardstoUser();
                        }
                        if(HWMAT.profile){
                            var splitBadgesObj = res && typeof res.badges!="undefined" && res.badges.length ? self.groupUniqueObj(self.removeUndefinedArr(res.badges),'category') : 0,
                                carsBadgeCnt = splitBadgesObj['Cars collected'] ? self.uniqueVal(splitBadgesObj['Cars collected'],'badgeId').length : 0,
                                miniBadgeCnt = splitBadgesObj['Collection started'] ? self.uniqueVal(splitBadgesObj['Collection started'],'badgeId').length : 0;    
                            $('.profile-status-count[data-status-name="carsRewards"]').html(carsBadgeCnt);
                            $('.profile-status-count[data-status-name="miniRewards"]').html(miniBadgeCnt);
                        }
                    }
                    return res;
                },'rewardService')
            }
        },'rewardService');
    },
    deleteCookie : function(name) {
        document.cookie = name + '=;Path=/'+localeName+';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    clearCookie : function(){
        var wishlistNames = ['carWishlist','miniStartedIds','carUnverified','HW_ProductValue','carVerified','userMapped','wishlistMapped','rewardsMapped','reward_Coins_Count','rewardCarCount'];
        for(var i=0;i<wishlistNames.length;i++){
            this.deleteCookie(wishlistNames[i]);
        }
    },
    compareStorageDate : function(obj, storageName){
        if(obj==null || obj['timestamp']==undefined){
            window.localStorage.removeItem(storageName);
            return false;
        }
        var expiresIn = obj.timestamp,
            now = Date.now(),
            objList = false;

         if(expiresIn<now) {// will Expire in 1Day
            window.localStorage.removeItem(storageName);
            console.log(storageName +" data Expired");
         } else{
            objList = obj['obj']
         }
        return objList;
    },
    storageExpiryDate : function(){
        return Date.now()+(24*60*60)*1000;
    },
    customLogout : function(elem){
        var keyName = $(elem).data('role');
        if(keyName!=undefined && keyName.toLowerCase()=="logout"){
            this.clearCookie();
            /*window.localStorage.removeItem("masterAttr");
            window.localStorage.removeItem("carList")*/
        }
    },
    userCustomize : function(elem,optnl,evt){
        evt.preventDefault();
        var elemetId = "#profile-user-settings",
            modalId = "#modal-global-container";

        // $(modalId).html($(elemetId).html());
        $(elemetId).addClass('profile-modal-open in').show();
        // setTimeout(function(){
        //     $(".modal-container").modal('show').addClass('profile-modal-open');
        //     $(".profile-modal-open .modal-content").show();
        // },100)
        this.profileSetting={};
        this.profileSetting.name = "profileSetting";
        this.profileSetting.domain = apiconfig.apiDomainConfig(this.profileSetting.name);
        this.trackingFunction('profile','customize','profile','profile','');
    },
    settingHomeScreen : function(elem,optnl,evt){
        if(evt) evt.preventDefault();
        $(elem).closest('.user-modal-content').find(".configure-topic-section").removeClass(activeclass)
        $(elem).closest('.user-modal-content').find("#open-configure-list").html('');
    },
    submitUserChanges : function(elem){
        var self = this,
            $curElem = $(elem),
            type = $(elem).data('type')=="picture" ? "avatar" :$(elem).data('type'),
            $targetContainer = $("#"+this.templateConfig('customizeModal').targetId),
            $selectedElem = $targetContainer.find('.active'),selectedTitle;

        if(!$selectedElem.length){
            alert("choose your favourite Item");
            return;
        }
        selectedTitle = $selectedElem.data('title');
        apiconfig.profileType = type;
        apiconfig.profileLSrc = $selectedElem.data('src');
        apiconfig.profileSSrc = $selectedElem.find('img').attr('src');
        $.ajax({
            url: this.profileSetting.domain+'/Profile/UpdateProfileSettings',
            type: 'POST', 
            data: JSON.stringify({ settingType: apiconfig.profileType, settingValue: apiconfig.profileLSrc, settingOtherValue: apiconfig.profileSSrc, }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response){
                if(type=="avatar"){
                    $(".user-profile-banner .user-profile-icon img").attr('src',apiconfig.profileSSrc)
                } else{
                    $(".user-profile-banner").css('background-image',"url("+apiconfig.profileLSrc+")");
                }
                self.trackingFunction('profile','customize',selectedTitle,'profile','');
                if($('.customize-banner-section .cancel-item').length) $('.customize-banner-section .cancel-item').trigger('click');
            },
            error: function(){
             console.log("update Profile Setting Error")
            }
        }); 
        /*this.ajaxDataFormat(this.profileSetting.domain,apiconfig.apiMethodConfig(this.profileSetting.name,'UpdateProfileSettings'),function(res){
            // console.log(res);
            if(type=="avatar"){
                $(".user-profile-banner .user-profile-icon img").attr('src',apiconfig.profileSSrc)
            } else{
                $(".user-profile-banner").css('background-image',"url("+apiconfig.profileLSrc+")");
            }
            self.settingHomeScreen($curElem);
        },'profileSetting')*/
    },
    classToggle : function(elem){
        $("#"+this.templateConfig('customizeModal').targetId).find('.customize-item-list').removeClass(activeclass)
        $(elem).toggleClass(activeclass);
    },
    openConfigureList : function(elem,optnl,evt){
        evt.preventDefault();
        var self = this,
            $curElem = $(elem).closest('.user-configure-item'),
            targetName = $curElem.data('target'),
            tcmId = $curElem.data('keywordid'),
            templateObj = self.templateConfig('customizeModal'),
            targetId = $curElem.closest('.user-modal-content'),
            divElem,templateId;

        apiconfig.tcmId = tcmId;
        apiconfig.targetName = targetName;
        this.ajaxDataFormat(this.profileSetting.domain,apiconfig.apiMethodConfig(this.profileSetting.name,'DisplayProfileSetting'),function(res){
            if(res==false) return;
            divElem =  $curElem.closest(".user-modal-content").find("#"+templateObj.targetId);
            templateId =   _.template(document.getElementById(templateObj.templateId).innerHTML.trim());
            $(divElem).html(templateId({ 'items' : JSON.parse(res)}));
            $curElem.closest(".configure-topic-section").addClass(activeclass);    
        });
    },
    sendEmailFormInfo : function(obj,elem){
        var self = this,
            paramObj = obj,
            tokenVal ='',
            $curElem = $(elem);

        this.wishlistService = {
            name : "wishlistService",
            tokenId : tokenVal,
            domain : function(){return apiconfig.apiDomainConfig(this.name)}
        };
        $("#mailSendBtn").addClass('loading');
        obj.carIds = !_.isEmpty(obj.carIds) ? obj.carIds.join(',') : '';
        obj.productIds = !_.isEmpty(obj.productIds) ? obj.productIds.join(',') : '';
        self.ajaxDataFormat(self.wishlistService.domain(),apiconfig.apiMethodConfig(self.wishlistService.name,'getGuiId'),function(res){
            if(res==false){$curElem.find('.modal__fail').show();return;}
            paramObj['guiId'] = res;
            self.ajaxDataFormat(apiconfig.apiDomainConfig('emailWishlist'),apiconfig.apiMethodConfig('emailWishlist','token'),function(res){
                self.wishlistService['tokenId'] = res.token;
                self.ajaxDataFormat(apiconfig.apiDomainConfig('emailWishlist'),apiconfig.apiMethodConfig('emailWishlist','sendEmail'),function(res){
                    console.log(res);
                    $("#mailSendBtn").removeClass('loading');
                    $curElem.find('.modal__description form').remove();
                    $curElem.find('.modal__footer').remove();
                    $curElem.find('.modal__success').show();
                    $('#mailSendBtn').removeAttr('disabled', 'disabled');
                },'wishlistService',false,paramObj)
            })
        },false,false,paramObj)
    },
	gameintrestitial : function(elem,bool,evt){
        evt.preventDefault();
		var $curElem = $(elem).attr('href'),
            modelId = ".intrestitial-modal-container #modal-global-container",
            containerElem = $(".game-pop-up-container:last").clone(),
            submitElem = ".inter-submit";
       if(typeof $curElem=="undefined") return;
	   if ($(".intrestitial-modal-container #modal-global-container .game-pop-up-container")[0]){                   
		   $(modelId).empty();$(modelId).html($(containerElem));
		}
		else{
			$(modelId).empty().append($(containerElem));                                               
		}        
        $(".intrestitial-modal-container").modal('show');
        $(".modal-content").css("display","block");
    },
	videointrestitial : function(elem,bool,evt){
        evt.preventDefault();
		var $curElem = $(elem).attr('href'),
            modelId = ".intrestitial-modal-container #modal-global-container",
            containerElem = $(".video-pop-up-container:last").clone(),
            submitElem = ".inter-submit";
       if(typeof $curElem=="undefined") return;
        if ($(".intrestitial-modal-container #modal-global-container .video-pop-up-container")[0]){                   
		   $(modelId).empty();$(modelId).html($(containerElem));
		}
		else{
			$(modelId).empty().append($(containerElem));                                               
		}   
        $(".intrestitial-modal-container").modal('show');
        $(".modal-content").css("display","block");
    },
    closeModal : function(elem){
        $(elem).closest('.modal-open').removeClass('in')
    },
    afterSSOLogin : function() {
        var self = this;
        var getCookie = cookie.get("user_data"),
            isExist = typeof getCookie!="undefined" ? true : false,
            decoded = isExist ? JSON.parse(Base64.decode(getCookie))[0].UserName : false;
            
         if(decoded){
             HWMAT.layout.helmetupdate();
          }
          else{
              setTimeout(HWMAT.layout.afterSSOLogin, 250);
          }
          $('body').removeClass('loginreg-scrn');
    },
    helmetupdate : function(){
      var getCookie = cookie.get("user_data"),
          isExist = typeof getCookie!="undefined" ? true : false,
          decoded = isExist ? JSON.parse(Base64.decode(getCookie))[0].UserName : false,
          loginResourceLabel = "getStarted=" + $('#hdnGetStart').val() + "&register=" + $('#hdnRegister').val() + "&signIn=" + $('#hdnSignIn').val() + "&collect=" + $('#hdnCollect').val() + "&wishlist=" + $('#hdnWishlist').val() + "&badges=" + $('#hdnBadges').val(),
          loginStatusURL = "/Profile/GetUserLoggedInStatus?username=" + decoded + "&locale=" + localeName + "&" + loginResourceLabel;
      $.get(loginStatusURL, function (data) {
            $(".navbar-right .open-signin-modal").remove();
            $(".navbar-right .logged-in,.navbar-right-mobile .logged-in").parent("li").remove();
            $(".navbar-right").append(data);
          if($(data).find(".logged-in").length){
                $(".navbar-right-mobile .sso-nav-link").parent("li").remove();
                $(".navbar-right-mobile").append(data);
          } else{
                $(".navbar-right-mobile .sso-nav-link").removeAttr("hidden");
          }
      });
    },
    init : function(){
        if(typeof $!="function" || isLoaded) return;
        var self= this;
        this.sendMiniRewardObj = [];
        this.bindLooping(this.bindingConfig());     
        apiconfig.getCarStatus = this.status || "all";
        this.collService = {
            name : "collectionService",
            domain : function(){
              return apiconfig.apiDomainConfig(this.name)  
            }
        };
        // this.collService.name = "collectionService";
        // this.collService.domain = apiconfig.apiDomainConfig(this.collService.name);
        this.ssoId = this.UserLoggedInStatus(ssoCookieName,true);
        if($("body").hasClass("page-games-detail")) self.getRewardObject();
        setTimeout(function(){ if(HWMAT.profile || HWMAT.collections || HWMAT.carDetail) self.getRewardObject();},300)
        if(this.ssoId){
            this.ajaxDataFormat(this.collService.domain(),apiconfig.apiMethodConfig(this.collService.name,'token'),'checkUserId');
            setTimeout(function(){ self.rewardAPICall(); },500)
        } 
        $(".pageLoader").css("display","none");
        $(".container").css("visibility","visible");
        isLoaded = true;
     }
};
  layout.init();
  layout.helmetupdate();
  global.HWMAT.layout = layout;
}(this, jQuery,HWMAT.cookie,HWMAT.config));

$(function(){
    HWMAT.layout.init(); 
    $(document).on('click','.screen-module1 .cta-btn,.screen-module2 .cta-btn',function(){
        var hrefName = $(this).data('linkName'),
            hrefTitle = $(this).data('linkTitle'),
            actionName = hrefName.toLowerCase()=="games" ? "play" : "view" ;

        HWMAT.layout.trackingFunction(hrefName,actionName,hrefTitle,"cars: pop up",'');
    });
    $(document).on('click','.linkTracking',function(){
        var datValue = $(this).data('tag'),
            splitArr = datValue ? datValue.split('|') : 0;
        if(!splitArr) return;
        HWMAT.layout.trackingFunction(splitArr[0],splitArr[1],splitArr[2],splitArr[3],splitArr[4]);
    })
    $('body').on('click','.login_scrn .login_btn',function () {
        HWMAT.layout.afterSSOLogin();
    });
});

/**
* Car Menu dropdown for web site elements
*/


(function(window,$,hwLayout){
    var isLoaded = false;
    var MAX_SLIDES  = 6;
    var MOVE_SLIDES = 6;
    var isDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) && screen.width < 1025;
    var loadSlides = {
        carouselConfig : function(configName){
            var self = this;
            var configObj;
            switch(configName){
                case 'bxsliderOptions' : 
                    configObj = {
                        auto: false,
                        startSlide: 0,
                        minSlides: 1,
                        maxSlides: MAX_SLIDES,
                        slideWidth: 220,
                        slideMargin: 20,
                        infiniteLoop:false,
                        pager : false,
                        moveSlides: MOVE_SLIDES,
                        hideControlOnEnd: true,
                        slideSelector : 'li',
                        onSlideAfter: function($slideElement, oldIndex, newIndex) {
                            var $slider = $slideElement.closest('.dropdown-menu').data('sliderData');
                            var slideCount = $slider.getSlideCount();
                            self.lazyLoad($slider);
                        },
                    } 
            }
            return configObj;
        },
        apiConfig : function(){
            var apis = {
                "name" : "/customdata/getvideos",
                "type" : "Get"
            }
            return apis;
        },
        templateConfig : function(configName){          
            var configObj;
            switch(configName){
                case 'bindJsonData':
                    configObj={
                        "targetId":"car-menus-container",
                        "templateId" : "car-menus-template-container"
                    }
                    break;
            }
            return configObj;
        },
        initCarousels: function(el,prop){
            var self=this,
                $bxsldr = $(el),
                $carousel,
                $target,
                elemIndex;
            
            _.each($bxsldr,function(item){
                elemIndex = $(item).attr('data-index') || 0;
                if(!$(item).hasClass('slider-active')){
                    $carousel = $(item);
                    $target = $carousel.closest(".dropdown-menu");
                    self.initCarousel($carousel, $target);
                    $(item).addClass('slider-active')
                }
            })
        },
        initCarousel: function($carousel, $target){
            if($carousel.children('li').length>=MAX_SLIDES) $target.data('sliderData', $carousel.bxSlider(this.carouselConfig('bxsliderOptions')));
        },
        lazyLoad : function($slider){
            var totalSlides = $slider.find('li>a').length;
            var current = $slider.getCurrentSlide();
            var remaining = totalSlides - (MAX_SLIDES + (current*MOVE_SLIDES));
            var reloadConfig = this.carouselConfig('bxsliderOptions');
            var curObj = HWMAT.apiObject;
            var filteredObj;
            var elem;
            var pagination;

            // Grab mattel's data- ids
            var total = curObj.length;
            var items = $slider.data('nextThumbCount');
            var allData = $slider.data();
            // if possible retrieve another batch of items through ajax
            if(remaining <= items && totalSlides < total && total !== undefined){
                filteredObj = curObj && curObj.slice(totalSlides,(totalSlides+this.paged_count));
                elem = this.templateBind(this.templateConfig('bindJsonData'),filteredObj,true);
                $slider.append(elem);
                $(elem).imagesLoaded().progress( function() {
                    setTimeout(function(){
                        loading_target = $(".thumbnail-unit");
                        $(loading_target).removeClass("list-thumbnails-loading");
                    },300)
                });
                reloadConfig.startSlide = current;
                $slider.reloadSliderDynamic(reloadConfig); // don't delete only refresh
                pagination = $slider.data('pagination');
                $slider.data('pagination', Number(pagination) + 1);
            }
        },
        templateBind : function(elemSelector,res,isLoadOnlyThumb){
            var self = this,
                divElem = document.getElementById(elemSelector.targetId),
                templateId =   _.template(document.getElementById(elemSelector.templateId).innerHTML.trim()),
                templateCollection = templateId({ 
                    'items' : res ,
                    'loadOnlyThumb':isLoadOnlyThumb || false
                });

            if(isLoadOnlyThumb){
                return templateCollection;
            } else{
                $(templateCollection).appendTo(divElem);
                self.initCarousels(divElem ,self.carouselConfig('thumbCarousel'));
                $(divElem).imagesLoaded().progress( function() {
                    setTimeout(function(){
                        loading_target = $(".thumbnail-unit");
                        $(loading_target).removeClass("list-thumbnails-loading");
                    },300)
                });
                self.initCarousels(divElem ,self.carouselConfig('thumbCarousel'));
                $(divElem).closest(".subnav-bg").removeClass("loading");
            }
        },
        ajaxCollection : function(el,obj){
            this.initial_thumb_count = $("#"+el).data('initialThumbCount');
            this.paged_count = $("#"+el).data('nextThumbCount');
            this.models = obj;
            this.loadCount = 0;
        },
        splitObject : function(obj){
            obj = obj.slice(this.loadCount,(this.loadCount+this.initial_thumb_count));
            this.loadCount++;
            return obj;
        },
        checkThumbLimitation : function(templateConfig,obj){
            var self = this;
            var thumbCount = $("#"+templateConfig.targetId).data('initialThumbCount')
            obj = self.splitObject(obj);
            self.templateBind(templateConfig,obj)
        },
        apiCall : function(){
            var self = this;
            var arr = [];
            var obj ;
            var pubId = $("#Pubid").val();          
            HWMAT.apiObject = [];
            var apiConfigs = self.apiConfig();
            $.getJSON( "/CustomData/GetCarNavigations?publicationId="+pubId+"&locale="+localeName, function( data ) {
                if(!data){
                    console.log("API's not connected");
                    return;
                }
                HWMAT.apiObject = data;
                self.ajaxCollection(self.templateConfig('bindJsonData').targetId,HWMAT.apiObject);
                self.checkThumbLimitation(self.templateConfig('bindJsonData'),HWMAT.apiObject);

                // hover state for menu icons
                $(".collections-hover").on('mouseover', function () {
                    var bgColor = $(this).find(".collection-title-bg").data("titlebg");
                    $(this).find(".collection-title-bg").css({ "background-color": bgColor });
                });
                $(".collections-hover").on('mouseout', function () {
                    $(this).find(".collection-title-bg").css("background-color", "transparent");
                });
                
            });
        },
        init : function(){
            if(typeof _!="function" || typeof $!="function" || isLoaded || isDevice) return;
            var self = this;
            self.apiCall();
            isLoaded = true;
        }
    };
    loadSlides.init();  
    //$.post( "/Profile/GetUserLoggedInStatus", { username: userName, locale: currLocale} );
    HWMAT.loadSlides = loadSlides;
})(this,jQuery, HWMAT && HWMAT.layout)

$(function(){
    HWMAT.loadSlides.init();
})
