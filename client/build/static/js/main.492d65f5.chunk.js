(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{149:function(e,t,a){"use strict";a.r(t);a(87),a(88),a(89);var n=a(23),r=a.n(n),o=a(0),s=a.n(o),i=a(33),l=a.n(i),c=a(58),u=a(40),d=a(73),p=a.n(d),h=a(13),f=a.n(h),m=a(20),v=a(55),g=a(10),y=a(25),b=a(8),S=a(12),k=a(11),E=(a(95),a(18)),O=a.n(E),L=a(74),I=a(42),w=a(75),D=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).state={item:void 0},n}return Object(b.a)(a,[{key:"render",value:function(){return null}},{key:"componentDidMount",value:function(){var e=Object(m.a)(f.a.mark((function e(){var t,a,n=this;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.a.getItem(this.props.storageName);case 2:if(void 0!==(t=e.sent)&&null!==t){e.next=6;break}return this.setState({item:void 0},(function(){return n.props.dataDidUpdate(void 0)})),e.abrupt("return");case 6:if(null!==t){e.next=10;break}return r.a.removeItem(this.props.storageName),this.setState({item:void 0},(function(){return n.props.dataDidUpdate(void 0)})),e.abrupt("return");case 10:a=JSON.parse(t),this.setState({item:a},(function(){return n.props.dataDidUpdate(a)}));case 12:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(e,t){var a=this;if(!O.a.isEqual(e.activeItem,this.props.activeItem)){if(void 0===this.props.activeItem)return;if(O.a.isEqual(this.state.item,this.props.activeItem))return;console.log("save item",this.props.activeItem);var n=JSON.stringify(this.props.activeItem);r.a.setItem(this.props.storageName,n),this.setState({item:this.props.activeItem},(function(){console.log("updating data after a save?"),a.props.dataDidUpdate(a.props.activeItem)}))}}}]),a}(s.a.Component);function j(e){if(void 0===e)return"";var t=e.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);return t&&t[1]}var x=a(4),C=a.n(x),N=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).childRefs=[],e.childComments.forEach((function(e){null!==e&&(n.childRefs[e.id]=s.a.createRef())})),n}return Object(b.a)(a,[{key:"render",value:function(){var e=this,t=this.props.childComments.filter((function(e){return null!==e}));return s.a.createElement(s.a.Fragment,null,t.map((function(a,n){return s.a.createElement(R,{key:a.id,comment:a,depth:e.props.depth,canExpand:e.props.canExpand,ref:e.childRefs[a.id],onUpdateOpen:function(r,o,s){var i;return e.props.onUpdateOpen(r,o,null!==s&&void 0!==s?s:o?null===a||void 0===a?void 0:a.id:null===(i=t[n+1])||void 0===i?void 0:i.id)},isOpen:!(e.props.collapsedIds.findIndex((function(e){return null!==a&&e===a.id}))>=0),collapsedIds:e.props.collapsedIds,idToScrollTo:e.props.idToScrollTo})})))}}]),a}(s.a.Component);function T(e){var t=Math.floor((new Date).getTime()/1e3-e),a=Math.floor(t/31536e3);return a>1?a+" years":(a=Math.floor(t/2592e3))>1?a+" months":(a=Math.floor(t/86400))>1?a+" days":(a=Math.floor(t/3600))>=1?a+" hour"+(a>1?"s":""):(a=Math.floor(t/60))>1?a+" minutes":Math.floor(t)+" seconds"}var F=["#bc8672","#c5be53","#d46850","#8c7f3b","#dec392","#c9893a"],R=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).divRef=void 0,n.state={expandSelf:!1},n.divRef=s.a.createRef(),n}return Object(b.a)(a,[{key:"componentDidMount",value:function(){this.scrollIfDesired()}},{key:"componentDidUpdate",value:function(){this.scrollIfDesired()}},{key:"scrollIfDesired",value:function(){var e;if(console.log("scroll to id ",this.props.idToScrollTo),this.props.idToScrollTo===(null===(e=this.props.comment)||void 0===e?void 0:e.id)){var t,a=null===(t=this.divRef.current)||void 0===t?void 0:t.offsetTop;console.log("scrolling to me",a),void 0!==a&&window.scrollTo({behavior:"smooth",top:a-80})}}}],[{key:"getDerivedStateFromProps",value:function(e,t){return e.canExpand?null:{expandSelf:!1}}}]),Object(b.a)(a,[{key:"getDivRef",value:function(){return this.divRef.current}},{key:"render",value:function(){var e=this;console.log("isOpen",this.props.isOpen);var t=this.props.comment;if(null===t)return null;var a=(t.kidsObj||[]).filter(M),n=t.text||"";if(!M(t))return null;var r=this.props.isOpen?s.a.createElement(s.a.Fragment,null,s.a.createElement("p",{className:"comment",dangerouslySetInnerHTML:{__html:n}}),a.length>0&&s.a.createElement(N,{childComments:a,canExpand:this.props.canExpand&&!this.state.expandSelf,depth:this.props.depth+1,onUpdateOpen:function(t,a,n){return e.props.onUpdateOpen(t,a,n)},collapsedIds:this.props.collapsedIds,idToScrollTo:this.props.idToScrollTo})):null,o=this.props.depth<F.length?F[this.props.depth]:"#bbb";return s.a.createElement("div",{className:C()("bp3-card",{collapsed:!this.props.isOpen}),onClick:function(t){return e.handleCardClick(t)},style:{paddingLeft:12+Math.max(4-this.props.depth),marginLeft:this.state.expandSelf&&this.props.isOpen?-17*this.props.depth:0,borderLeftColor:o,borderLeftWidth:this.state.expandSelf?6:void 0,borderRight:this.state.expandSelf?"1px solid"+o:void 0,paddingRight:this.state.expandSelf?6:void 0}},s.a.createElement("p",{style:{fontWeight:this.props.isOpen?450:300},ref:this.divRef},t.by," | ",T(t.time)," ago"),r)}},{key:"handleCardClick",value:function(e){if(e.stopPropagation(),"A"!==e.target.tagName){var t=e.target,a=this.state.expandSelf?.85:.9;if(this.props.depth>0&&this.props.canExpand&&(e.pageX+t.offsetLeft)/window.innerWidth>a)this.setState({expandSelf:!this.state.expandSelf});else{var n=!this.props.isOpen;if(null===this.props.comment)return;this.props.onUpdateOpen(this.props.comment.id,n,void 0)}}}}]),a}(s.a.Component);function M(e){return null!==e&&!(e.deleted&&(void 0===e.kidsObj||0===e.kidsObj.length))}var A,U=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).state={data:void 0,collapsedComments:[],idToScrollTo:void 0},n.anchorClickHandler=n.anchorClickHandler.bind(Object(y.a)(n)),n}return Object(b.a)(a,[{key:"render",value:function(){var e=this;if(void 0===this.state.data)return null;console.log("scroll to ID",this.state.idToScrollTo);var t=this.state.data,a=void 0===t.url?s.a.createElement("span",null,t.title):s.a.createElement("a",{href:t.url},t.title),n=(t.kidsObj||[]).filter(M);return document.title="HN: ".concat(t.title),s.a.createElement("div",null,s.a.createElement("h2",{style:{overflowWrap:"break-word"}},a),s.a.createElement("h4",null,s.a.createElement("span",null,t.by),s.a.createElement("span",null," | "),s.a.createElement("span",null,t.score," points"),s.a.createElement("span",null," | "),s.a.createElement("span",null,T(t.time)," ago"),s.a.createElement("span",null," | "),s.a.createElement("span",null,j(t.url))),void 0!==t.text&&s.a.createElement("p",{className:"top-text",dangerouslySetInnerHTML:{__html:t.text}}),s.a.createElement(N,{childComments:n,canExpand:!0,depth:0,collapsedIds:this.state.collapsedComments,onUpdateOpen:function(t,a,n){return e.handleCollapseEvent(t,a,n)},idToScrollTo:this.state.idToScrollTo}))}},{key:"handleCollapseEvent",value:function(e,t,a){if(t){var n=O.a.cloneDeep(this.state.collapsedComments);O.a.remove(n,(function(t){return t===e})),sessionStorage.setItem("SESSION_COLLAPSED",JSON.stringify(n)),this.setState({collapsedComments:n})}else{var r=this.state.collapsedComments.concat(e);sessionStorage.setItem("SESSION_COLLAPSED",JSON.stringify(r)),this.setState({collapsedComments:r})}void 0!==a&&this.setState({idToScrollTo:a})}},{key:"componentDidMount",value:function(){window.scrollTo({top:0}),this.updateDataFromDataLayer(),document.body.addEventListener("click",this.anchorClickHandler);var e=sessionStorage.getItem("SESSION_COLLAPSED");if(null!==e){var t=JSON.parse(e);this.setState({collapsedComments:t})}this.props.onVisitMarker(this.props.id)}},{key:"componentWillUnmount",value:function(){document.body.removeEventListener("click",this.anchorClickHandler)}},{key:"anchorClickHandler",value:function(e){if("A"===e.target.tagName){var t=e.target,a=t.href.match(/https?:\/\/news\.ycombinator\.com\/item\?id=(\d+)/);if(null!==a)return this.props.history.push("/story/"+a[1]),e.preventDefault(),!1;t.target="_blank"}}},{key:"updateDataFromDataLayer",value:function(){var e=Object(m.a)(f.a.mark((function e(){var t;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getStoryData(this.props.id);case 2:t=e.sent,this.setState({data:t});case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentDidUpdate",value:function(e){null===e.dataLayer&&null!==this.props.dataLayer&&this.updateDataFromDataLayer()}},{key:"getStoryData",value:function(){var e=Object(m.a)(f.a.mark((function e(t){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null!==this.props.dataLayer){e.next=4;break}e.t0=void 0,e.next=7;break;case 4:return e.next=6,this.props.dataLayer.getStoryData(t);case 6:e.t0=e.sent;case 7:return e.abrupt("return",e.t0);case 8:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),a}(s.a.Component),P=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).state={allItems:[],currentLists:[],isLoadingFresh:!1,isLoadingNewData:!1},n}return Object(b.a)(a,[{key:"refreshData",value:function(e){}}]),Object(b.a)(a,[{key:"render",value:function(){var e=this;return s.a.createElement(s.a.Fragment,null,s.a.createElement(D,{dataDidUpdate:function(t){return e.processDataFromLocalStorage(t,e.state.currentLists)},activeItem:this.state.allItems,storageName:"HN-ALL-ITEMS"}),s.a.createElement(D,{dataDidUpdate:function(t){return e.processDataFromLocalStorage(e.state.allItems,t)},activeItem:this.state.currentLists,storageName:"HN-DATA-LISTS"}))}},{key:"getStoryData",value:function(){var e=Object(m.a)(f.a.mark((function e(t){var a;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0===(a=this.state.allItems.find((function(e){return e.id===t})))){e.next=3;break}return e.abrupt("return",a);case 3:return e.next=5,this.getStoryFromServer(t);case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getStoryFromServer",value:function(){var e=Object(m.a)(f.a.mark((function e(t){var a,n,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a="/api/story/"+t,this.props.updateIsLoadingStatus(!0),e.next=4,fetch(a);case 4:if((n=e.sent).ok){e.next=8;break}return console.error(n),e.abrupt("return",void 0);case 8:return e.next=10,n.json();case 10:if(!("error"in(r=e.sent))){e.next=15;break}return console.error(r),this.props.updateIsLoadingStatus(!1),e.abrupt("return",void 0);case 15:return console.log("hn item from server",r),this.props.updateIsLoadingStatus(!1),e.abrupt("return",r);case 18:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"clearItemData",value:function(e){var t=this.state.allItems.find((function(t){return t.id===e})),a=this.state.allItems.filter((function(t){return t.id!==e}));console.log("clear item",{before:this.state.allItems.length,after:a.length}),void 0!==t&&function(){for(var e,a=[t],n=JSON.parse(null!==(e=sessionStorage.getItem("SESSION_COLLAPSED"))&&void 0!==e?e:""),r=new Set(n);a.length;){var o,s=a.shift();void 0!==s&&(r.has(s.id)&&r.delete(s.id),null===(o=s.kidsObj)||void 0===o||o.filter((function(e){return null!==e})).forEach((function(e){return a.push(e)})))}var i=Array.from(r);console.log("old collapse",n,i),sessionStorage.setItem("SESSION_COLLAPSED",JSON.stringify(i))}(),this.setState({allItems:a})}},{key:"getPageData",value:function(e){var t=this;console.log("getpagedata",e,this.state),""!==e&&void 0!==e||(e="front");var a={day:A.Day,week:A.Week,month:A.Month,front:A.Front}[e];if(void 0===a)return console.error("unknown page -> source map"),[];var n=this.state.currentLists.find((function(e){return e.key===a}));if(void 0===n)return console.log("no ids to load..."),this.loadData(a),[];var r=n.stories.map((function(e){return t.state.allItems.find((function(t){return t.id===e}))})).filter((function(e){return void 0!==e}));return a!==A.Front&&(r=O.a.sortBy(r,(function(e){return-e.score}))),r}},{key:"loadData",value:function(){var e=Object(m.a)(f.a.mark((function e(t){var a,n,r;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("loading data"),a="",e.t0=t,e.next=e.t0===A.Front?5:e.t0===A.Day?7:e.t0===A.Week?9:e.t0===A.Month?11:13;break;case 5:return a="/topstories/topstories",e.abrupt("break",13);case 7:return a="/topstories/day",e.abrupt("break",13);case 9:return a="/topstories/week",e.abrupt("break",13);case 11:return a="/topstories/month",e.abrupt("break",13);case 13:if(!this.state.isLoadingNewData){e.next=16;break}return console.log("only have one request at a time"),e.abrupt("return");case 16:return this.props.updateIsLoadingStatus(!0),this.setState({isLoadingNewData:!0}),e.next=20,fetch(a);case 20:if((n=e.sent).ok){e.next=26;break}return console.error(n),this.props.updateIsLoadingStatus(!1),this.setState({isLoadingNewData:!1}),e.abrupt("return");case 26:return e.next=28,n.json();case 28:r=e.sent,t!==A.Front&&(r=O.a.sortBy(r,(function(e){return-e.score}))),console.log("hn items from server",r),this.props.updateIsLoadingStatus(!1),this.setState({isLoadingNewData:!1}),this.updateNewItems(r,t);case 34:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"processDataFromLocalStorage",value:function(e,t){var a=this;console.log("fresh data from local storage",e,t),void 0!==e&&this.setState({allItems:e}),void 0!==t&&this.setState({currentLists:t}),void 0!==e&&void 0!==t?t.forEach((function(t){var n=t.stories.map((function(t){return e.find((function(e){return e.id===t}))})).filter((function(e){return void 0!==e}));a.props.provideNewItems(n,t.key)})):this.state.isLoadingFresh||(console.log("local storage is empty, loading fresh data based on active page",this.props.loadFreshSource),this.setState({isLoadingFresh:!0}),this.loadData(this.props.loadFreshSource))}},{key:"updateNewItems",value:function(e,t){var a=this;console.log("items coming from server",e,t),void 0===e&&(e=[]);var n=e.map((function(e){return e.id})),r=O.a.cloneDeep(this.state.currentLists),o=r.find((function(e){return e.key===t}));void 0===o?r.push({key:t,stories:n}):o.stories=n;var s=O.a.cloneDeep(this.state.allItems),i=[];e.forEach((function(e){var t=s.findIndex((function(t){return t.id===e.id}));if(-1===t)return s.push(e),void i.push(e);var a=s[t];a.lastUpdated>e.lastUpdated?i.push(a):(s[t]=e,i.push(e))})),this.setState({allItems:s,currentLists:r},(function(){a.props.provideNewItems(i,t)}))}}]),a}(s.a.Component),W=a(155),_=a(157),H=a(152),J=a(153),K=a(154),q=a(46),B=a(59),G=a(156),V=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(){return Object(g.a)(this,a),t.apply(this,arguments)}return Object(b.a)(a,[{key:"render",value:function(){var e=this;return s.a.createElement(W.a,null,s.a.createElement(W.a.Header,null,s.a.createElement(W.a.Brand,null,s.a.createElement(B.a,{to:"/"},"hn-offline"))),s.a.createElement(_.a,null,s.a.createElement(q.LinkContainer,{to:"/day"},s.a.createElement(H.a,{eventKey:1},"day")),s.a.createElement(q.LinkContainer,{to:"/week"},s.a.createElement(H.a,{eventKey:2},"week")),s.a.createElement(q.LinkContainer,{to:"/month"},s.a.createElement(H.a,{eventKey:3},"month"))),s.a.createElement(W.a.Form,{pullRight:!0},this.props.isLoading&&s.a.createElement(G.a,{size:32}),!this.props.isLoading&&s.a.createElement(J.a,{bsStyle:"primary",onClick:function(){return e.props.requestNewData()}},s.a.createElement(K.a,{glyph:"refresh"}))))}}]),a}(s.a.PureComponent),Y=a(34),$=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(){return Object(g.a)(this,a),t.apply(this,arguments)}return Object(b.a)(a,[{key:"render",value:function(){var e=this.props.data,t=s.a.createElement(s.a.Fragment,null," | ",s.a.createElement(Y.a,{to:"/story/"+e.id},s.a.createElement(K.a,{glyph:"comment"})," ",e.descendants)),a=void 0===e.url?s.a.createElement(Y.a,{to:"/story/"+e.id},e.title):s.a.createElement("a",{href:e.url,target:"_blank"},e.title);return s.a.createElement("div",{className:C()({isRead:this.props.isRead})},s.a.createElement("p",null,a),s.a.createElement("p",null,s.a.createElement("span",null,s.a.createElement(K.a,{glyph:"chevron-up"})," "," "+e.score),void 0!==e.descendants&&t,s.a.createElement("span",null," | "+T(e.time)+" ago"),s.a.createElement("span",null," | "+j(e.url))))}}]),a}(s.a.Component),z=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).state={items:[]},n}return Object(b.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.history;if(console.log("story list mount",e),"POP"===e.action){var t=+sessionStorage.getItem("SCROLL_LIST");isNaN(t)||(console.log("fire off scroll",t),window.scrollTo({top:t,behavior:"smooth"}))}}},{key:"componentWillUnmount",value:function(){console.log("save scroll pos",window.scrollY),sessionStorage.setItem("SCROLL_LIST",""+window.scrollY)}},{key:"render",value:function(){var e=this;return document.title="HN: Offline",s.a.createElement("div",null,this.props.items.filter((function(e){return void 0!==e.descendants})).map((function(t){return s.a.createElement($,{data:t,key:t.id,isRead:e.props.readIds[t.id]})})))}}]),a}(s.a.Component),X=function(e){Object(S.a)(a,e);var t=Object(k.a)(a);function a(e){var n;return Object(g.a)(this,a),(n=t.call(this,e)).dataLayer=void 0,n.state={items:[],allItems:[],activeList:A.Front,error:void 0,isLoading:!1,readIdList:{},storyKey:0},n.dataLayer=s.a.createRef(),n.updateActiveDataStore=n.updateActiveDataStore.bind(Object(y.a)(n)),n.newItemsProvided=n.newItemsProvided.bind(Object(y.a)(n)),n}return Object(b.a)(a,null,[{key:"getDerivedStateFromProps",value:function(e,t){var a;switch(e.match.params.page){case"day":a=A.Day;break;case"week":a=A.Week;break;case"month":a=A.Month;break;default:a=A.Front}return console.log("derived state",e.match.params.page,a),Object(v.a)(Object(v.a)({},t),{},{activeList:a})}}]),Object(b.a)(a,[{key:"componentDidMount",value:function(){var e=Object(m.a)(f.a.mark((function e(){var t;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.a.getItem("STORAGE_READ_ITEMS");case 2:null!==(t=e.sent)&&this.setState({readIdList:t});case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"updateActiveDataStore",value:function(e,t){t&&this.setState({items:e}),this.setState((function(t){var a=O.a.cloneDeep(t.allItems).concat(e);return a=O.a.uniqBy(a,(function(e){return e.id})),console.log("new all itemS",a),{allItems:a}}))}},{key:"render",value:function(){var e=this;return console.log("render state",this.state,this.dataLayer),void 0!==this.state.error?s.a.createElement("div",null,s.a.createElement("p",null,"an error occurred, refresh the page"),s.a.createElement("p",null,"unfortunately, your local data was cleared to prevent corruption")):s.a.createElement("div",null,s.a.createElement(P,{ref:this.dataLayer,provideNewItems:this.newItemsProvided,updateIsLoadingStatus:function(t){return e.setState({isLoading:t})},loadFreshSource:this.state.activeList}),s.a.createElement(V,{requestNewData:function(){if(e.props.location.pathname.indexOf("story")>-1){var t=+e.props.location.pathname.split("/")[2];return console.log("clear old story"),e.dataLayer.current.clearItemData(t),void e.setState((function(e){return{storyKey:e.storyKey+1}}))}e.state.isLoading||e.dataLayer.current.loadData(e.state.activeList)},isLoading:this.state.isLoading}),s.a.createElement(L.a,null,s.a.createElement(I.a,{path:"/story/:id",exact:!0,render:function(t){return s.a.createElement(U,{id:+t.match.params.id,dataLayer:e.dataLayer.current,history:t.history,key:t.match.params.id+"-"+e.state.storyKey,onVisitMarker:function(t){return e.saveIdToReadList(t)}})}}),s.a.createElement(I.a,{path:"/:page?",render:function(t){return s.a.createElement(z,Object.assign({items:null===e.dataLayer.current?[]:e.dataLayer.current.getPageData(t.match.params.page),readIds:e.state.readIdList},t))}})))}},{key:"saveIdToReadList",value:function(e){var t=O.a.cloneDeep(this.state.readIdList);console.log("new read list",t),t[e]||(t[e]=!0,r.a.setItem("STORAGE_READ_ITEMS",t),this.setState({readIdList:t}))}},{key:"newItemsProvided",value:function(e,t){t===this.state.activeList&&this.setState({items:e})}}]),a}(s.a.Component),Q=Object(w.a)(X);!function(e){e[e.Front=0]="Front",e[e.Day=1]="Day",e[e.Week=2]="Week",e[e.Month=3]="Month"}(A||(A={}));var Z=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function ee(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var a=e.installing;null!=a&&(a.onstatechange=function(){"installed"===a.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See http://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}p.a.polyfill(),window.onerror=function(e,t,a,n,o){console.error("major error",e),r.a.clear(),document.body.innerHTML="<h1>major error occurred.  local storage cleared to avoid corruption. please refresh</h1>"},l.a.render(s.a.createElement(c.a,null,s.a.createElement(u.a,{path:"/:page?"},s.a.createElement(Q,null))),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");Z?(!function(e,t){fetch(e).then((function(a){var n=a.headers.get("content-type");404===a.status||null!=n&&-1===n.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):ee(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit http://bit.ly/CRA-PWA")}))):ee(t,e)}))}}()},86:function(e,t,a){e.exports=a(149)},95:function(e,t,a){}},[[86,1,2]]]);
//# sourceMappingURL=main.492d65f5.chunk.js.map