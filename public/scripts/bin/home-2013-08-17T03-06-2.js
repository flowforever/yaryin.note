/*version=2013-08-17T03-06-2;compress date :Sat, 17 Aug 2013 03:06:32 GMT*/;window.AvrilConfig={};(function(){var a={initView:function(){},initDoc:function(){},config:{language:"zh-cn"}};$.ajax({url:"/resources/config",success:function(b){$.extend(a.config,b),yaryin.tools.cache.version=a.config.version,function c(){window.tinyMCE?tinyMCE.init({language:a.config.language.replace("-","_")}):setTimeout(c,100)}}}),$.datepicker.setDefaults($.datepicker.regional["zh-CN"]),yaryin.event.hook(a,"initView,initDoc"),a.executePageEvents=function(a,b){a=a.where(function(a){return!!a});if(a.length>0)for(var c=0;c<a.length;c++)yaryin.event.get("ready",a.take(c+1).join("/"))(b);else yaryin.event.get("ready","home")(b)},a.applyModel=function(a,b){$(a).find("[data-tmpl]").each(function(){yaryin.tools.template.render($(this),b)})},yaryin.app=a,yaryin.namespace("yaryin.app.note");var b="tinymce";a.note.extend({save:function(a,b){},newFile:function(a,b){},getList:function(a,b){yaryin.ui.pop.open("/editor/list",b)},changeUrl:function(a){a=a||decodeURI(document.location.pathname),a.indexOf("/")>=0&&(a=a.replace("/",""));var c=function(){return/\%|\\|\/|\:|\#|\s+/g};yaryin.prompt("input you url please.".localize(b),function(a){if(!a)return yaryin.alert("please input a file name"),!1;if(c().test(a))return yaryin.alert("the file name could not contain %,#,\\,/ and white space".localize(b)),!1;window.history&&window.history.pushState?history.pushState(null,"",a):document.location.href="/"+a},a)},initEditor:yaryin.event.get("tinymce.init"),share:function(){yaryin.alert("<strong>"+"here is your note address<br/>".localize(b)+"</strong>"+decodeURI(document.location.href))}});var c=a.note;a.note.initEditor(function(b,d){b.addButton("yaryin_newfile",{text:"New",icon:!1,onclick:c.newFile}),b.addMenuItem("yaryin_newfile",{text:"New",context:"file",onclick:c.newFile}),b.addButton("yaryin_save",{text:"Save",icon:!1,onclick:c.save}),b.addMenuItem("yaryin_save",{text:"Save",context:"file",onclick:c.save}),b.addButton("yaryin_recent",{text:"Recent files",icon:!1,onclick:a.note.getList}),b.addMenuItem("yaryin_recent",{text:"Recent files",context:"file",onclick:a.note.getList}),b.addButton("yaryin_changeurl",{text:"Change url",icon:!1,onclick:function(){c.changeUrl(decodeURI(document.location.pathname))}}),b.addMenuItem("yaryin_changeurl",{text:"Change url",context:"file",onclick:function(){c.changeUrl(decodeURI(document.location.pathname))}}),b.addButton("yaryin_share",{text:"Share",icon:!1,onclick:c.share}),b.addMenuItem("yaryin_share",{text:"Share",context:"file",onclick:c.share})}),$(function(){a.initView(document),a.executePageEvents(window.location.pathname.split("/"),[$(document)]),a.initDoc()})})();(function(a){var b=yaryin.app;b.initView.onInitView(function(){yaryin.tools.template.parse(document)}),b.mvc={currentFragment:function(b){return b&&(this._$fragment=a(b)),this._$fragment||(this._$fragment=this.defaultFragment()),this._$fragment},defaultFragment:function(){return a("[data-fragment=home]")},request:function(c,d){a.ajax({url:c,data:{_backboneJson:!0},success:function(a){var e=b.mvc.currentFragment();b.applyModel(e,a),b.executePageEvents((c.split("?")[0]||"home").split("/"),[e]),d&&d()}})},showFragment:function(b){a("[data-fragment]").hide(),a('[data-fragment="'+b+'"]').show()}};var c=Backbone.Router.extend({routes:{"*path":"default"},"default":function(a){var c=(a||"").split("?")[0]||"home";b.mvc.showFragment((a||"").split("?")[0]||"home"),b.mvc.request(a)}});b.route=new c,Backbone.history.start(),b.initView.onInitView(function(b,c){var d=a(c),e=function(){return d.find.apply(d,arguments)};e("a.bk,.bk a:not(.no-bk)").live("click",function(b){b.preventDefault(),Backbone.history.navigate(a(this).attr("href"),{trigger:!0})})})})(jQuery)