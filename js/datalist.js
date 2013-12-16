// HTML5 datalist plugin v.0.2
// Copyright (c) 2010-The End of Time, Mike Taylor, http://miketaylr.com
// Copyright (c) 2013, Tomin
// MIT Licensed: http://www.opensource.org/licenses/mit-license.php
//
/* 
<input type="search" list="suggestions">
<datalist id="suggestions">
  <!--[if !IE]><!-->
  <select><!--<![endif]-->
    <option label="DM" value="Depeche Mode">
    <option label="Moz" value="Morrissey">
    <option label="NO" value="New Order">
    <option label="TC" value="The Cure">
  <!--[if !IE]><!-->
  </select><!--<![endif]-->
</datalist>
*/

// TODO: Still buggy yet. IE7 support for querySelectorAll. http://www.codecouch.com/2012/05/adding-document-queryselectorall-support-to-ie-7/
(function(d,s){if(!document.querySelectorAll){d=document,s=d.createStyleSheet();d.querySelectorAll=function(r,c,i,j,a){a=d.all,c=[],r=r.replace(/\[for\b/gi,'[htmlFor').split(',');for(i=r.length;i--;){s.addRule(r[i],'k:v');for(j=a.length;j--;)a[j].currentStyle.k&&c.push(a[j]);s.removeRule(0)}return c}}})();
//document.querySelectorAll||(document.querySelectorAll=function(a){var b=document,c=b.documentElement.firstChild,d=b.createElement("STYLE");return c.appendChild(d),b.__qsaels=[],d.styleSheet.cssText=a+"{x:expression(document.__qsaels.push(this))}",window.scrollBy(0,0),b.__qsaels});

(function(window, document, undefined) {
	"use strict";		    
	
	var isDatalistSupported = function () {
		return ((typeof this.obj[0].list === 'object' ) && (document.createElement('datalist') && !!window.HTMLDataListElement));
	}  
	var	Datalist = function(element) {
		this.obj = document.querySelectorAll(element);
		if(!isDatalistSupported) {			
			this.init();
		}		
	};
	var	P = Datalist.prototype;

	// Common utils
	P.one = function(elemId) { 
		return document.querySelector(elemId); 
	};

	P.all = function(elemId, context) {
		if (context !== undefined) {
			return document.querySelectorAll(context + " " + elemId);
		}
		return document.querySelectorAll(elemId); 
	};	

	function insertAfter(referenceNode, newNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}

	function each(obj, fn) {
		if (obj.length) for (var i = 0, ol = obj.length, v = obj[0]; i < ol && fn(v, i) !== false; v = obj[++i]);
		else for (var p in obj) if (fn(obj[p], p) === false) break;
	};
	var addEvent = (document.addEventListener) ? 
	  function(elem, type, listener) { elem.addEventListener(type, listener, false); } : 
	  function(elem, type, listener) { elem.attachEvent("on" + type, listener); };

    P.init = function() {		
		each(this.obj, function(v, i) {
			if (typeof v.getAttribute !== 'function') return;
			var dataid = v.getAttribute('list'),				
				opts = P.all('option', "#" + dataid),		
				frag = document.createDocumentFragment(),
				div = document.createElement("div"),
				ul = document.createElement("ul");
				
			div.className = "mydiv";
			div.style.display = "block";

			ul.className = "datalist";
			ul.style.width = v.width + "px";
			ul.style.top = v.height + 2 + "px";

			each(opts, function(opt, j) {
				var li= document.createElement("li");
				var span = document.createElement("span");
				span.className = "value";			
							
				var tempText = document.createTextNode(opt.value);
				span.appendChild(tempText);
				
				li.appendChild(span);
				ul.appendChild(li);
				
				addEvent(li, "mousedown", function(e) {
					v.value = opt.value;
					v.blur();
				});				
			});
			frag.appendChild(ul);
			insertAfter(v, frag);
			
			addEvent(v, "focus", function(e) {
				ul.style.display = "block";
			});

			addEvent(v, "blur", function(e) {
				ul.style.display = "none";
			});					
		});
		
	}
	
	// Expose:
	window.Datalist = Datalist;		

})(this, this.document);
