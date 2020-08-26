(this.webpackJsonpbldr=this.webpackJsonpbldr||[]).push([[0],{10:function(e,t,n){e.exports=n.p+"static/media/relax.8074cc44.gif"},13:function(e,t,n){e.exports=n(20)},18:function(e,t,n){},20:function(e,t,n){"use strict";n.r(t);var a=n(0),l=n.n(a),r=n(6),i=n.n(r),o=(n(18),n(3)),s=n.n(o),c=n(7),u=n(2),d=n(1),m=n(8),h=n(9),y=n(12),f=n(11),p=function(e){var t=Object(a.useRef)(null);return Object(a.useEffect)((function(){e.index===e.currentLine&&t.current.focus()}),[e.index,e.currentLine]),l.a.createElement("span",{className:"line ".concat(e.lineValid?"valid":"invalid")},l.a.createElement("textarea",{ref:t,key:e.index,contentEditable:"true",suppressContentEditableWarning:!0,onChange:function(t){return e.handleLineChange(t,e.index)},onKeyDown:function(t){return e.handleKeyDown(t,e.index)},onClick:function(t){return e.handleClick(t,e.index)},placeholder:e.placeholderLine,value:e.line?e.line:""}),l.a.createElement("h4",{className:"counter"}," ",e.syllableCount," / ",e.syllableLimit))},g=function(e){var t=e.lines,n=Object(d.a)({},e.exampleHaiku);return t&&t.length?t.map((function(t,a){return l.a.createElement(p,{className:"line",lineValid:e.syllableCounts[a]===e.syllableLimits[a],key:a,line:t,placeholderLine:n[a],currentLine:e.currentLine,syllableLimit:e.syllableLimits[a],syllableCount:e.syllableCounts[a]?e.syllableCounts[a]:0,index:a,handleKeyDown:e.handleKeyDown,handleClick:e.handleClick,handleLineChange:e.handleLineChange})})):null},v=function(e){return l.a.createElement("button",{onClick:e.handleClick,className:e.buttonStyle},e.value)},b=function(e){return l.a.createElement(l.a.Fragment,null,l.a.createElement(v,{handleClick:e.handleContinue,buttonStyle:"continue",value:e.continueText||"Continue"}),l.a.createElement(v,{handleClick:e.handleCancel,buttonStyle:"cancel",value:e.cancelText||"Cancel"}))},E=n(4),C=function(e){var t=e.currentWord,n=t&&"text"in t&&"syllables"in t,a=t&&"activeEdit"in t&&t.activeEdit;if(!n&&!a)return null;var r=e.currentWord.syllables;return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"currentWord"},l.a.createElement("h1",{className:"currentWordDisplay"},"".concat(n?t.text:"")),l.a.createElement("span",{onMouseEnter:function(t){return e.viewOriginalWord(!0)},onMouseLeave:function(t){return e.viewOriginalWord(!1)}},e.currentWord.edited?l.a.createElement("button",{className:"asterisk"},"*"):null,e.displayOriginalWord?l.a.createElement("span",{className:"originalWord"},l.a.createElement("span",null," This word was edited (by you). Here is the original:"),l.a.createElement("br",null),l.a.createElement("span",null,t.original?t.original.syllables:null," syllables"),l.a.createElement("br",null),l.a.createElement("span",null,t.original?t.original.definition:null),l.a.createElement(v,{value:"Reset word to original",handleClick:e.handleCurrentWordReset})):null),l.a.createElement("span",{className:"currentWordSyllables"},l.a.createElement(E.a,{className:"currentWordSyllableCount",onChange:function(t){return e.handleSyllableChange(t)},value:r}),l.a.createElement("textarea",{className:"currentWordSyllableText",disabled:!0,value:" syllable".concat(r>1||0===r?"s":"")})),e.displaySyllableUpdate?l.a.createElement(b,{continueText:"Update syllable count",cancelText:"Cancel",handleContinue:e.continueSyllableUpdate,handleCancel:e.cancelSyllableUpdate}):null,n&&"definition"in t?l.a.createElement(E.a,{className:"currentDefinition autoresize",value:t.definition,onChange:function(t){e.handleDefinitionChange(t)}}):null,e.displayDefinitionUpdate?l.a.createElement(b,{continueText:"Update definition",cancelText:"Cancel",handleContinue:e.continueDefinitionUpdate,handleCancel:e.cancelDefinitionUpdate}):null,e.displayWordResetButton?l.a.createElement(v,{handleClick:e.handleResetClick,buttonStyle:"recycle",value:"Reset syllable count & definition"}):null))},S=function(e){return l.a.createElement("div",{className:"title"},l.a.createElement("span",null,l.a.createElement("span",{className:"underline"},"title"),":"),l.a.createElement("textarea",{className:"title",value:e.title,onChange:function(t){return e.handleTitleChange(t.target.value,e.currentPoemIndex)}}))},w=function(e){var t=e.poem;if(!t)return null;var n=t.linesEdit?t.linesEdit:t.lines;if(n){var a=t.valid,r=n.reduce((function(e,t){return!t&&e}),!0);return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"poem"},t?l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"row"},l.a.createElement(S,{title:t?t.title:"",handleTitleChange:e.handleTitleChange}),r?null:l.a.createElement(l.a.Fragment,null,l.a.createElement(v,{handleClick:e.handleSavePoem,value:"Save & create new poem"}),l.a.createElement(v,{handleClick:e.handleResetPoem,value:"Reset"}))),l.a.createElement("div",{className:"lines"},l.a.createElement(g,{lines:n,syllableLimits:e.criteria.syllableLimits,syllableCounts:e.syllableCounts,exampleHaiku:e.criteria.exampleHaiku,currentLine:e.currentLine,handleLineChange:e.handleLineChange,handleKeyDown:e.handleKeyDown,handleClick:e.handleClick}),l.a.createElement("hr",{className:"divider"}))):null),t&&!e.poemIsEmpty?l.a.createElement(l.a.Fragment,null,a?l.a.createElement("div",null,l.a.createElement("h1",null,"This haiku is valid!")):null,l.a.createElement(C,{currentWord:e.currentWord,displaySyllableUpdate:e.displaySyllableUpdate,handleSyllableChange:e.handleSyllableChange,continueSyllableUpdate:e.continueSyllableUpdate,cancelSyllableUpdate:e.cancelSyllableUpdate,autoresize:e.autoresize,handleResetClick:e.handleResetClick,handleCurrentWordChange:e.handleCurrentWordChange,handleDefinitionChange:e.handleDefinitionChange,continueDefinitionUpdate:e.continueDefinitionUpdate,cancelDefinitionUpdate:e.cancelDefinitionUpdate,displayDefinitionUpdate:e.displayDefinitionUpdate,viewOriginalWord:e.viewOriginalWord,displayOriginalWord:e.displayOriginalWord,handleCurrentWordReset:e.handleCurrentWordReset})):null)}console.log("lines: ".concat(n))},O=function(e){var t=e.lines&&e.lines.length?e.lines.map((function(e,t){return l.a.createElement("span",{key:t},l.a.createElement("span",null,e),l.a.createElement("br",null))})):null;return e.lines&&e.lines.length>0?l.a.createElement("span",{onClick:e.handleClick},t):null},W=function(e){if(!e.history||!e.history.length)return null;var t=Object(u.a)(e.history).filter((function(t){return t.id===e.currentPoem}));console.log("poem: ".concat(JSON.stringify(t)));!!t&&t.valid,t.linesEdit?Object(d.a)({},t.linesEdit):t.lines;return l.a.createElement("div",{className:"history"},e.history.length?e.history.map((function(t,n){console.log("poem: ".concat(JSON.stringify(t)));var r=t.id===e.currentPoem;return l.a.createElement("span",{key:n},l.a.createElement(a.Fragment,null,l.a.createElement("button",{disabled:r,className:"poemHistoryButton",key:n,onClick:function(n){return e.togglePoemHistory(t.id)}},l.a.createElement("h4",null,l.a.createElement("strong",null,t.title)),l.a.createElement("br",null),l.a.createElement(O,{lines:t.linesEdit?t.linesEdit:t.lines,className:"miniPoem",index:n}),r?l.a.createElement("span",null,"*",l.a.createElement("sub",null,"active poem")):null)))})):l.a.createElement("div",null,"No poems"))},j=function(e){var t=e.userName,n=e.buttons,a=e.selectedButton,r=e.displayHistory;return l.a.createElement("div",{className:"nav"},n.map((function(t,n){return l.a.createElement("button",{className:t.name===a||"history"===t.name&&r?"selected":null,key:n,onClick:function(){return e.handleClick(t.name)}},"history"===t.name&&r?"Hide ":"",t.text)})),l.a.createElement("button",{onClick:e.toggleUser}," by ",t," "))},k=function(e){var t=e.words;t||(t=[]),console.log("WordBank words: ".concat(JSON.stringify(e.words)));var n=t.map((function(e,t){if(console.log("word: ".concat(JSON.stringify(e))),e)return l.a.createElement("li",null,l.a.createElement("span",null,l.a.createElement("h2",null,e.text),l.a.createElement("hr",null),e.syllables?l.a.createElement("p",null,e.syllables," syllable",e.syllables>1?"s":null):l.a.createElement("p",null," No syllable count "),l.a.createElement("p",null,e.definition)))}));return console.log("items: ".concat(n)),l.a.createElement("ul",null,n)},P=n(10),U=n.n(P),x=function(){return l.a.createElement("div",{className:"relax"},l.a.createElement("img",{src:U.a,alt:"Just a second... :)"}))},N=function(){return l.a.createElement("div",{className:"help"},l.a.createElement("h1",null,"Help is coming soon..."))},D="http://localhost:5000",L=function(e){Object(y.a)(n,e);var t=Object(f.a)(n);function n(e){var a;return Object(m.a)(this,n),(a=t.call(this,e)).toggleUser=function(){console.log("toggleUser");var e=a.state.users.find((function(e){return e.userName!=a.state.user.userName}));a.setState({user:e})},a.addWordToMap=function(e,t){var n=new Map(a.state.map);void 0!==n.get(e)?t(n.get(e)):a.lookupWord(e,(function(n){a.setState({map:a.state.map.set(e,Object(d.a)({},n))}),t(n)}))},a.toggleView=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(e&&e!==a.state.activeView&&e in a.state.views)if(e!==a.state.views.history.name)a.setState({activeView:e});else{var t=Object(d.a)(Object(d.a)({},a.state.display),{},{history:!a.state.display.history});a.setState({display:t})}},a.getCurrentPoem=function(){var e=a.state.history.filter((function(e){return e}));return e?e.find((function(e){return e.id===a.state.currentPoem})):null},a.handleTitleChange=function(e){a.setState({history:a.state.history.map((function(t,n){return t.id===a.state.currentPoem?Object(d.a)(Object(d.a)({},t),{},{title:e}):t}))})},a.handleResetPoem=function(){var e=a.state.history.map((function(e,t){return e.id===a.state.currentPoem&&(e.linesEdit=e.lines),e}));a.setState({history:e})},a.handleSavePoem=function(){var e=a.getCurrentPoem();if(e&&e.lines){var t=Object(u.a)(a.state.history).map((function(e,t){return e&&e.id===a.state.currentPoem?(e.lines=e.linesEdit,e):e})),n=a.createPoem();a.setState({history:[].concat(Object(u.a)(t),[n]),currentPoem:n.id});var l="".concat(D,"/wordAPI/poem");fetch(l,{method:"post",body:JSON.stringify(e),headers:{"Content-Type":"application/json"}}).then((function(e){return e.json()})).then((function(e){console.log("result of fetch: ".concat(JSON.stringify(e)))})).catch((function(e){return e}))}},a.handlePoemClick=function(e,t){var n="";if(window.getSelection().modify&&window.getSelection){var l=e.target.selectionStart,r=e.target.selectionEnd,i=window.getSelection();i.isCollapsed?(i.modify("move","forward","character"),i.modify("move","backward","word"),i.modify("extend","forward","word"),n=i.toString(),i.modify("move","forward","character")):n=i.toString(),e.target.setSelectionRange(l,r)}var o=a.state.map.get(n);void 0===o?a.updateCurrentWord(n):a.setState({currentWord:Object(d.a)(Object(d.a)({},o),{},{edited:!1})}),a.setState({currentLine:t})},a.handlePoemKeyDown=function(e){var t;switch(e.key){case"Enter":e.preventDefault();break;case"ArrowDown":e.preventDefault(),t=Object(d.a)({},a.state.currentLine),++t<a.state.lineCount&&a.setState({currentLine:t});break;case"ArrowUp":e.preventDefault(),t=Object(d.a)({},a.state.currentLine),--t>=0&&a.setState({currentLine:t});break;default:return}},a.handlePoemLineChange=function(e,t){var n=e.target.selectionStart,l=e.target.selectionEnd,r=e.target.value,i=e.target.value.slice(0,e.target.selectionEnd).split(" "),o=i[i.length-1];a.updateCurrentWord(o);a.getCurrentPoem();var s=a.state.syllableCounts,c=a.state.history.map((function(e,n){if(!e)return e;if(e.id===a.state.currentPoem){var l=Object(u.a)(e.linesEdit);return l||(l=a.createLines()),l[t]=r,s=l.map((function(e){return a.getSyllableCount(e)})),Object(d.a)(Object(d.a)({},e),{},{linesEdit:l})}}));a.setState({history:c,syllableCounts:s}),a.validatePoem(a.getCurrentPoem()),e.target.setSelectionRange(n,l)},a.createLines=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:a.state.criteria.lineCount;return new Array(e).fill("")},a.handlePoemClick=function(e,t){var n="";if(window.getSelection().modify&&window.getSelection){var l=e.target.selectionStart,r=e.target.selectionEnd,i=window.getSelection();i.isCollapsed?(i.modify("move","forward","character"),i.modify("move","backward","word"),i.modify("extend","forward","word"),n=i.toString(),i.modify("move","forward","character")):n=i.toString(),e.target.setSelectionRange(l,r)}var o=a.state.map.get(n);void 0===o?a.updateCurrentWord(n):a.setState({currentWord:Object(d.a)(Object(d.a)({},o),{},{edited:!1})}),a.setState({currentLine:t})},a.handleDefinitionChange=function(e){e.target.value&&e.target.value!==a.state.currentWord.activeEdit.edit.definition?a.setState({display:Object(d.a)(Object(d.a)({},a.state.display),{},{definitionUpdate:!0})}):a.setState({display:Object(d.a)(Object(d.a)({},a.state.display),{},{definitionUpdate:!1})}),a.setState({currentWord:Object(d.a)(Object(d.a)({},a.state.currentWord),{},{activeEdit:Object(d.a)(Object(d.a)({},a.state.currentWord.activeEdit),{},{definition:!0,edit:Object(d.a)(Object(d.a)({},a.state.currentWord.activeEdit.edit),{},{definition:e.target.value})})})})},a.handleSyllableChange=function(e){e.target.value&&e.target.value!==a.state.currentWord.syllables?a.setState({display:Object(d.a)(Object(d.a)({},a.state.display),{},{syllableUpdate:!0})}):a.setState({display:Object(d.a)(Object(d.a)({},a.state.display),{},{syllableUpdate:!1})}),a.setState({currentWord:Object(d.a)(Object(d.a)({},a.state.currentWord),{},{activeEdit:Object(d.a)(Object(d.a)({},a.state.currentWord.activeEdit),{},{syllables:!0,edit:Object(d.a)(Object(d.a)({},a.state.currentWord.activeEdit.edit),{},{syllables:e.target.value?parseInt(e.target.value):""})})})})},a.handleStart=function(){var e=Object(d.a)({},a.createPoem());if(!a.state.history||!a.state.history.length){var t=[e];a.setState({history:t,currentPoem:e.id,activeView:a.state.views.poemBuilder.name})}},a.lookupWord=function(e,t){for(var n=arguments.length,a=new Array(n>2?n-2:0),l=2;l<n;l++)a[l-2]=arguments[l];if(!e&&!t)return console.log("lookupWord --\x3e word: ".concat(e)),null;var r="".concat(D,"/wordAPI/").concat(e);fetch(r).then((function(e){return e.json()})).then((function(n){var l={text:e,definition:n.definition,syllables:n.syllables,edited:n.edited,activeEdit:{edit:n}};t(l,a)})).catch((function(e){return e}))},a.renderViews=function(){var e=[a.state.display.history?a.getView(a.state.views.history.name):null];return e.push(a.getView(a.state.activeView)),e},a.incrementCounter=function(){a.setState({counter:a.state.counter+1})},a.createPoem=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"Haiku",n=e||a.state.counter;a.incrementCounter();var l="".concat(t," ").concat(n),r=a.state.user,i={user:r?r.userName:"",id:"".concat(r?r.userName:"","_").concat(n),title:l,lines:a.createLines(),linesEdit:a.createLines(),lineCount:3,type:"haiku",valid:!1};return i},a.viewOriginalWord=function(e){a.setState({display:Object(d.a)(Object(d.a)({},a.state.display),{},{originalWordWarning:e})})},a.continueUpdate=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(a.state.currentWord&&a.state.currentWord.activeEdit){var l,r,i=Object(d.a)({},a.state.currentWord),o=t?a.state.currentWord.activeEdit.edit.syllables:i.syllables,s=n?a.state.currentWord.activeEdit.edit.definition:i.definition,c=Object(d.a)(Object(d.a)({},i),{},{syllables:o,definition:s,original:Object(d.a)({},i),edited:!0,activeEdit:Object(d.a)({},i)}),u=a.state.map;u.delete(i.text),u.set(i.text,c);var m=a.state.history.map((function(e,t){return e.id===a.state.currentPoem?(r=a.getCurrentPoem(),l=a.validatePoem(e.linesEdit),Object(d.a)(Object(d.a)({},r),{},{valid:l})):r=e}));t&&a.cancelWarning(a.state.display.syllableUpdate,!0,!1),n&&a.cancelWarning(a.state.display.definitionUpdate,!1,!0),a.updateSyllableCounts(r.linesEdit),a.setState({map:u,displaySyllableUpdate:!1,currentWord:c,history:m})}},a.cancelWarning=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];a.state.currentWord&&a.state.currentWord.activeEdit&&a.updateCurrentWord(null,t,n),a.setState({displayWarning:!1})},a.updateCurrentWord=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=Object(d.a)({},a.state.currentWord);(t||e)&&(e||(e="text"in t?t.text:""),a.addWordToMap(e,(function(e){var t=a.getCurrentPoem(),n=(t.linesEdit?t.linesEdit:t.lines).map((function(e){return a.getSyllableCount(e)}));a.setState({currentWord:Object(d.a)(Object(d.a)({},e),{},{activeEdit:{syllables:!1,definition:!1,edit:Object(d.a)({},e)},syllableCounts:n})})})))},a.validatePoem=function(e){if(e){var t=e.lines;if(!t)return!1;for(var n=0;n<t.length;n++)if(a.state.syllableCounts[n]!==a.state.criteria.syllableLimits[n])return a.setState({valid:!1}),!1;return a.setState({valid:!0}),!0}},a.getSyllableCount=function(e){if(e)return e.split(" ").reduce((function(e,t){var n=a.state.map.get(t);return n&&"syllables"in n&&void 0!==n.syllables?e+n.syllables:e+0}),0)},a.togglePoemHistory=function(e){a.setState({currentPoem:e})},a.getView=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(e&&e in a.state.views){var t=Object(d.a)({},a.state.views),n=a.getCurrentPoem();if(n){console.log("current poem: ".concat(JSON.stringify(n)));var r=n.linesEdit?n.linesEdit:n.lines;r||(r=a.createLines());var i=a.state.currentWord&&a.state.currentWord.activeEdit?a.state.currentWord.activeEdit.edit:null,o=a.state.user,s=a.state.history.filter((function(e){return e})),c=s?s.filter((function(e){return e.user===(o?o.userName:"")})):null;switch(console.log("filteredHistory: ".concat(JSON.stringify(c))),e){case t.poemBuilder.name:return l.a.createElement(w,{poem:n,syllableCounts:a.state.syllableCounts,map:a.state.map,criteria:a.state.criteria,handleKeyDown:a.handlePoemKeyDown,handleClick:a.handlePoemClick,handleLineChange:a.handlePoemLineChange,currentLine:a.state.currentLine,handleSavePoem:a.handleSavePoem,handleTitleChange:a.handleTitleChange,handleDefinitionChange:a.handleDefinitionChange,handleSyllableChange:a.handleSyllableChange,handleResetPoem:a.handleResetPoem,currentWord:i,displayDefinitionUpdate:a.state.display.definitionUpdate,displaySyllableUpdate:a.state.display.syllableUpdate,continueDefinitionUpdate:function(){return a.continueUpdate(a.state.display.definitionUpdate,!1,!0)},continueSyllableUpdate:function(){return a.continueUpdate(a.state.display.syllableUpdate,!0,!1)},cancelDefinitionUpdate:function(){return a.cancelWarning(a.state.display.definitionUpdate,!1,!0)},cancelSyllableUpdate:function(){return a.cancelWarning(a.state.display.syllableUpdate,!0,!1)},viewOriginalWord:a.viewOriginalWord,displayOriginalWord:a.state.display.originalWordWarning});case t.wordBank.name:var u=Object.keys(a.state.map).map((function(e){return a.state.map.get(e)}));return l.a.createElement(k,{words:u});case t.help.name:return l.a.createElement(N,null);case t.selfDestruct.name:return l.a.createElement(x,null);case t.history.name:return l.a.createElement(W,{history:c,currentPoem:a.state.currentPoem,togglePoemHistory:a.togglePoemHistory})}}else console.log("poem: ".concat(JSON.stringify(n),", returning"))}},a.state={user:{userName:"a",name:"J"},users:[{userName:"a",name:"J"},{userName:"b",name:"D"}],counter:0,currentLine:0,currentPoem:null,history:null,activeView:"poemBuilder",views:{poemBuilder:{name:"poemBuilder",text:"Current Build"},wordBank:{name:"wordBank",text:"Word Bank"},help:{name:"help",text:"Help"},selfDestruct:{name:"selfDestruct",text:"Self Destruct"},history:{name:"history",text:"My Poems"}},display:{history:!1,syllableUpdate:!1,definitionUpdate:!1,originalWordWarning:!1},criteria:{lineCount:3,syllableLimits:[5,7,5],example:["haikus are easy","but sometimes they don't make sense","refrigerator"]},map:new Map,currentWord:null,syllableCounts:[0,0,0]},a}return Object(h.a)(n,[{key:"componentWillMount",value:function(){var e=Object(c.a)(s.a.mark((function e(){var t,n,a=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("componentDidMount"),t=this.state.user){e.next=5;break}return console.log("no current user found, returning"),e.abrupt("return");case 5:return this.setState({user:t}),n="".concat(D,"/wordAPI/poem/").concat(t.userName),console.log(n),e.next=10,fetch(n,{headers:{"Content-Type":"application/json",Accept:"application/json"}}).then((function(e){return e.json()})).then((function(e){console.log(e),a.setState({history:e,counter:e.length,currentPoem:e[0].id})}));case 10:e.sent;case 11:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=Object.keys(this.state.views).map((function(t){return{name:t,text:e.state.views[t].text}})),n=this.state.user;return console.log("currentUser: ".concat(JSON.stringify(this.state.user))),l.a.createElement(a.Fragment,null,this.state.activeView&&this.state.history&&this.state.history.length?l.a.createElement(a.Fragment,null,l.a.createElement(j,{userName:n?n.name:"?",buttons:t,selectedButton:this.state.activeView,displayHistory:this.state.display.history,handleClick:this.toggleView,toggleUser:this.toggleUser}),this.renderViews(this.state.activeView)):l.a.createElement(v,{buttonStyle:"startButton",handleClick:this.handleStart,value:"Build!"}))}}]),n}(l.a.Component);i.a.render(l.a.createElement(L,null),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.bb348199.chunk.js.map