/*! @maps4html/web-map-custom-element 09-03-2024 */

class MapExtent extends HTMLElement{static get observedAttributes(){return["checked","label","opacity","hidden"]}#hasConnected;get units(){return this.getAttribute("units")||M.FALLBACK_PROJECTION}get checked(){return this.hasAttribute("checked")}set checked(e){e?this.setAttribute("checked",""):this.removeAttribute("checked")}get label(){return this.hasAttribute("label")?this.getAttribute("label"):M.options.locale.dfExtent}set label(e){e&&this.setAttribute("label",e)}get opacity(){return+(this._opacity??this.getAttribute("opacity"))}set opacity(e){1<+e||+e<0||this.setAttribute("opacity",e)}get hidden(){return this.hasAttribute("hidden")}set hidden(e){e?this.setAttribute("hidden",""):this.removeAttribute("hidden")}get extent(){const e=e=>Object.assign(M._convertAndFormatPCRS(e._extentLayer.bounds,M[e.units],e.units),{zoom:e._extentLayer.zoomBounds});var t;return this._extentLayer.bounds?e(this):((t=this)._calculateBounds(),e(t))}zoomTo(){var e=this.extent;let t=this.getMapEl()._map,a=e.topLeft.pcrs.horizontal,r=e.bottomRight.pcrs.horizontal,i=e.bottomRight.pcrs.vertical,o=e.topLeft.pcrs.vertical,n=L.bounds(L.point(a,i),L.point(r,o)),s=t.options.crs.unproject(n.getCenter(!0)),l=e.zoom.maxZoom,h=e.zoom.minZoom;t.setView(s,M.getMaxZoom(n,t,h,l),{animate:!1})}getMapEl(){return(this.getRootNode()instanceof ShadowRoot?this.getRootNode().host:this).closest("mapml-viewer,map[is=web-map]")}getLayerEl(){return this.getRootNode()instanceof ShadowRoot?this.getRootNode().host:this.closest("layer-")}attributeChangedCallback(e,t,a){if(this.#hasConnected)switch(e){case"units":break;case"label":t!==a&&(this._layerControlHTML.querySelector(".mapml-layer-item-name").innerHTML=a||M.options.locale.dfExtent);break;case"checked":this.parentLayer.whenReady().then(()=>{this._handleChange(),this._calculateBounds(),this._layerControlCheckbox.checked=null!==a}).catch(e=>{console.log("Error while waiting on parentLayer for map-extent checked callback: "+e)});break;case"opacity":t!==a&&(this._opacity=a,this._extentLayer&&this._extentLayer.changeOpacity(a));break;case"hidden":t!==a&&this.parentLayer.whenReady().then(()=>{let e=this.parentLayer._propertiesGroupAnatomy;var t=Array.from(this.parentNode.querySelectorAll("map-extent:not([hidden])")).indexOf(this);null!==a?this._layerControlHTML.remove():0===t?e.insertAdjacentElement("afterbegin",this._layerControlHTML):0<t&&this.parentNode.querySelectorAll("map-extent:not([hidden])")[t-1]._layerControlHTML.insertAdjacentElement("afterend",this._layerControlHTML),this._validateLayerControlContainerHidden()}).catch(()=>{console.log("Error while waiting on parentLayer for map-extent hidden callback")})}}constructor(){super(),this._createLayerControlExtentHTML=M._createLayerControlExtentHTML.bind(this),this._changeHandler=this._handleChange.bind(this)}async connectedCallback(){this.parentLayer="LAYER-"===this.parentNode.nodeName.toUpperCase()?this.parentNode:this.parentNode.host,this.hasAttribute("data-moving")||this.parentLayer.hasAttribute("data-moving")||(this.mapEl=this.parentLayer.closest("mapml-viewer,map[is=web-map]"),await this.mapEl.whenProjectionDefined(this.units).catch(()=>{throw new Error("Undefined projection:"+this.units)}),this.isConnected&&(this.#hasConnected=!0,this._map=this.mapEl._map,this.parentLayer.addEventListener("map-change",this._changeHandler),this.mapEl.addEventListener("map-projectionchange",this._changeHandler),this._opacity=this.opacity||1,this._extentLayer=M.extentLayer({opacity:this.opacity,crs:M[this.units],extentZIndex:Array.from(this.parentLayer.querySelectorAll("map-extent")).indexOf(this),extentEl:this}),this._layerControlHTML=this._createLayerControlExtentHTML(),this._calculateBounds(),this._bindMutationObserver()))}_bindMutationObserver(){this._observer=new MutationObserver(e=>{for(var t of e)"childList"===t.type&&this._runMutationObserver(t.addedNodes)}),this._observer.observe(this,{childList:!0})}_runMutationObserver(a){var r=e=>{this.whenReady().then(()=>{this._calculateBounds(),this._validateDisabled()})};for(let t=0;t<a.length;++t){let e=a[t];"MAP-META"===e.nodeName&&e.hasAttribute("name")&&("zoom"===e.getAttribute("name").toLowerCase()||"extent"===e.getAttribute("name").toLowerCase())&&e.hasAttribute("content")&&r(e)}}getLayerControlHTML(){return this._layerControlHTML}_projectionMatch(){return this.units.toUpperCase()===this._map.options.projection.toUpperCase()}_validateDisabled(){if(this._extentLayer){let r=this.querySelectorAll("map-link[rel=image],map-link[rel=tile],map-link[rel=features],map-link[rel=query]");return!this._projectionMatch()||(()=>{let t=r.length,a=0;for(let e=0;e<t;e++)r[e]._validateDisabled()||a++;return a===t})()?(this.setAttribute("disabled",""),this.disabled=!0):(this.removeAttribute("disabled"),this.disabled=!1),this.toggleLayerControlDisabled(),this._handleChange(),this.disabled}}getMeta(e){e=e.toLowerCase();if("extent"===e||"zoom"===e)return this.parentLayer.src?this.querySelector(`:scope > map-meta[name=${e}]`)||this.parentLayer.shadowRoot.querySelector(`:host > map-meta[name=${e}]`):this.querySelector(`:scope > map-meta[name=${e}]`)||this.parentLayer.querySelector(`:scope > map-meta[name=${e}]`)}toggleLayerControlDisabled(){let e=this._layerControlCheckbox,t=this._layerControlLabel,a=this._opacityControl,r=this._opacitySlider,i=this._selectdetails;this.disabled?(e.disabled=!0,r.disabled=!0,t.style.fontStyle="italic",a.style.fontStyle="italic",i&&i.forEach(e=>{e.querySelectorAll("select").forEach(e=>{e.disabled=!0,e.style.fontStyle="italic"}),e.style.fontStyle="italic"})):(e.disabled=!1,r.disabled=!1,t.style.fontStyle="normal",a.style.fontStyle="normal",i&&i.forEach(e=>{e.querySelectorAll("select").forEach(e=>{e.disabled=!1,e.style.fontStyle="normal"}),e.style.fontStyle="normal"}))}_handleChange(){this.checked&&!this.disabled?(this._extentLayer.addTo(this.parentLayer._layer),this._extentLayer.setZIndex(Array.from(this.parentLayer.querySelectorAll("map-extent")).indexOf(this))):this.parentLayer._layer.removeLayer(this._extentLayer)}_validateLayerControlContainerHidden(){let e=this.parentLayer._propertiesGroupAnatomy,t=this.parentLayer.src?this.parentLayer.shadowRoot:this.parentLayer;e&&(0===t.querySelectorAll("map-extent:not([hidden])").length?e.setAttribute("hidden",""):e.removeAttribute("hidden"))}disconnectedCallback(){this.hasAttribute("data-moving")||this.parentLayer.hasAttribute("data-moving")||!this._extentLayer||(this._validateLayerControlContainerHidden(),this._layerControlHTML.remove(),this.parentLayer._layer&&this.parentLayer._layer.removeLayer(this._extentLayer),this.parentLayer.removeEventListener("map-change",this._changeHandler),this.mapEl.removeEventListener("map-projectionchange",this._changeHandler),delete this._extentLayer,this.parentLayer._layer&&delete this.parentLayer._layer.bounds)}_calculateBounds(){delete this._extentLayer.bounds,delete this._extentLayer.zoomBounds,this.parentLayer._layer&&delete this.parentLayer._layer.bounds;let t=this.querySelectorAll("map-link[rel=image],map-link[rel=tile],map-link[rel=features],map-link[rel=query]"),a=this.querySelector(":scope > map-meta[name=extent][content]")?M.getBoundsFromMeta(this):void 0,r=this.querySelector(":scope > map-meta[name=zoom][content]")?M.getZoomBoundsFromMeta(this):void 0;for(let e=0;e<t.length;e++){var i=t[e].getZoomBounds(),o=t[e].getBounds(),n=r&&r.hasOwnProperty("maxZoom")?r.maxZoom:-1/0,s=r&&r.hasOwnProperty("minZoom")?r.minZoom:1/0,l=r&&r.hasOwnProperty("minNativeZoom")?r.minNativeZoom:1/0,h=r&&r.hasOwnProperty("maxNativeZoom")?r.maxNativeZoom:-1/0;r?(n=Math.max(n,i.maxZoom),s=Math.min(s,i.minZoom),h=Math.max(h,i.maxNativeZoom),l=Math.min(l,i.minNativeZoom),r.minZoom=s,r.maxZoom=n,r.minNativeZoom=l,r.maxNativeZoom=h):r=Object.assign({},i),a?a.extend(o):a=L.bounds(o.min,o.max)}a?this._extentLayer.bounds=a:this._extentLayer.bounds=L.bounds(M[this.units].options.bounds.min,M[this.units].options.bounds.max),r=r||{},r.hasOwnProperty("minZoom")||(r.minZoom=0),r.hasOwnProperty("maxZoom")||(r.maxZoom=M[this.units].options.resolutions.length-1),r.hasOwnProperty("minNativeZoom")&&r.minNativeZoom!==1/0||(r.minNativeZoom=r.minZoom),r.hasOwnProperty("maxNativeZoom")&&r.maxNativeZoom!==-1/0||(r.maxNativeZoom=r.maxZoom),this._extentLayer.zoomBounds=r}whenReady(){return new Promise((t,a)=>{let r,i;this._extentLayer?t():(r=setInterval(function(e){e._extentLayer?(clearInterval(r),clearTimeout(i),t()):e.isConnected||(clearInterval(r),clearTimeout(i),a("map-extent was disconnected while waiting to be ready"))},300,this),i=setTimeout(function(){clearInterval(r),clearTimeout(i),a("Timeout reached waiting for extent to be ready")},1e4))})}whenLinksReady(){var e;let t=[];for(e of[...this.querySelectorAll("map-link[rel=image],map-link[rel=tile],map-link[rel=features],map-link[rel=query]")])t.push(e.whenReady());return Promise.allSettled(t)}}export{MapExtent};
//# sourceMappingURL=map-extent.js.map