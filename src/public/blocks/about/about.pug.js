function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function aboutTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug":"html\nbody\n    .ui.one.column.centered.grid.about\n        h2(style=\"color: #FFF\") Developers\n    .ui.one.column.centered.grid.about\n        - var developers = ['olga_surikova','vasiliy_dmitriev','nikita_boyarskikh','egor_kurakov']\n        - var id = 0\n            each developer in developers\n                img#devAvatar.ui.circular.image(name=id,src=\"\u002Fimages\u002F\"+developer+\".jpg\")\n                -id++\n    .ui.modal\n        i.close.icon\n        #title.ui.header\n        .image.content\n            .ui.medium.image\n                img#developer-avatar(src=\"\")\n            .description\n                #workOn.ui.header\nscript(src=\"\u002Fscripts\u002FaboutAlertDialog.js\")"};
;pug_debug_line = 1;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Chtml\u003E\u003C\u002Fhtml\u003E";
;pug_debug_line = 2;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cbody\u003E";
;pug_debug_line = 3;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui one column centered grid about\"\u003E";
;pug_debug_line = 4;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Ch2 style=\"color: #FFF;\"\u003E";
;pug_debug_line = 4;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "Developers\u003C\u002Fh2\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 5;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui one column centered grid about\"\u003E";
;pug_debug_line = 6;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
var developers = ['olga_surikova','vasiliy_dmitriev','nikita_boyarskikh','egor_kurakov']
;pug_debug_line = 7;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
var id = 0
{
;pug_debug_line = 8;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
// iterate developers
;(function(){
  var $$obj = developers;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var developer = $$obj[pug_index0];
;pug_debug_line = 9;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cimg" + (" class=\"ui circular image\""+" id=\"devAvatar\""+pug_attr("name", id, true, false)+pug_attr("src", "/images/"+developer+".jpg", true, false)) + "\u002F\u003E";
;pug_debug_line = 10;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
id++
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var developer = $$obj[pug_index0];
;pug_debug_line = 9;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cimg" + (" class=\"ui circular image\""+" id=\"devAvatar\""+pug_attr("name", id, true, false)+pug_attr("src", "/images/"+developer+".jpg", true, false)) + "\u002F\u003E";
;pug_debug_line = 10;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
id++
    }
  }
}).call(this);

}
pug_html = pug_html + "\u003C\u002Fdiv\u003E";
;pug_debug_line = 11;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui modal\"\u003E";
;pug_debug_line = 12;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Ci class=\"close icon\"\u003E\u003C\u002Fi\u003E";
;pug_debug_line = 13;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui header\" id=\"title\"\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 14;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"image content\"\u003E";
;pug_debug_line = 15;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui medium image\"\u003E";
;pug_debug_line = 16;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cimg id=\"developer-avatar\" src=\"\"\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 17;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"description\"\u003E";
;pug_debug_line = 18;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui header\" id=\"workOn\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fbody\u003E";
;pug_debug_line = 19;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fabout\u002Fabout.pug";
pug_html = pug_html + "\u003Cscript src=\"\u002Fscripts\u002FaboutAlertDialog.js\"\u003E\u003C\u002Fscript\u003E";} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}