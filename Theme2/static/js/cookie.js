/**
* Global namespace for web site elements
*/

(function(global,$){
    var cookieName = "HW_CarCollections",
        localeName = document.getElementById('hdnLocaleName') != null ? document.getElementById('hdnLocaleName').value : 'en-us',
        cookiePath = "/"+localeName,
        cookie = {
    prepend : function(name, value, options,isString) {
            var ids = [];
            options = options || {};
            if (!value) {
                value = '';
                options.expires = -365;
            } else {
                value = escape(value);
            }
            if (options.expires) {
                var d = new Date();
                d.setDate(d.getDate() + options.expires);
                value += '; expires=' + d.toUTCString();
            }
            if (options.domain) { value += '; domain=' + options.domain; }
            if (options.path) { value += '; path=' + options.path; }
            // get current cookies
            ids = this.get(name,'',isString);

            // split by _
            if(ids !== undefined && ids !== "" && ids !== null){ ids = isString ?  ids.split('^') : ids.split('_'); }
            // insert element from the left
            if( !_.isArray(ids) ){ ids = [value]; } 
            else {
                // Don't insert repeated cookies
                if( !this.inCookie(name, value) ){ ids.unshift(value); }
            }
            this.arrayToCookie(name, ids,isString);
        },
        arrayToCookie : function(name, ids ,isString){
            var myDate = new Date();
            myDate.setMonth(myDate.getMonth() + 12);
            var newCookie = isString ? name + '=' + ids.join('^') + '; path=' +cookiePath : name + '=' + ids.join('_') + '; path=' +cookiePath;
            document.cookie = newCookie;
        },
        get : function(name, asArray,isString){
            var separator;
            var cookies = document.cookie.split(';');

            for (var i = 0; i < cookies.length; i++) {
                separator = cookies[i].indexOf("=");
                tempName = $.trim(cookies[i].substr(0, separator));
                v = cookies[i].substr(separator + 1);
                if (tempName === name){
                    if(!asArray){ return unescape(v); } 
                    else {
                        if( v.length == 0){ return null; } 
                        else { return isString ?  unescape(v).split('^') : unescape(v).split('_'); }
                    }
                }
            }
        },
        remove : function(name, id, isString){
            var value;
            var ids;
            var newIds;
            var cookies = document.cookie.split(';');

            for (var i = 0; i < cookies.length; i++) {
                separator = cookies[i].indexOf("=");
                tempName = $.trim(cookies[i].substr(0, separator));
                value = cookies[i].substr(separator + 1);
                if (tempName === name){
                    ids = isString ? value.split('^') : value.split('_');
                    newIds = _.without(ids, id+'');
                    this.arrayToCookie(name, newIds);
                }
            }
        },
        toggleCookie : function(isActive, id,isString) {
            if( id !== undefined) {
                if(isActive){
                    this.prepend(this.cookieName, id,'',isString);
                } else {
                    this.remove(this.cookieName, id,isString);
                }
            }
        },
        inCookie : function(name, id,isString){
            if( _.indexOf( this.get(name, true,isString), id + '' ) > -1){
                return true;
            }
            return false;
        }
    };
    global.HWMAT.cookie = cookie;
}(this, jQuery));