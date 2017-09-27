function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function scoreboardTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug":".ui.one.column.centered.grid.leaderboard\n  h2(style=\"color: #FFF\") Scoreboard\n.ui.one.column.centered.grid\n    .content.left.aligned\n      table.ui.selectable.celled.table.leaderboard\n        thead\n          tr\n            th Player\n            th Rating\n        tbody\n        - for (var player = 0; player \u003C count; ++player) \n          tr\n            td Vasiliy Dmitriev\n            td 100500"};
;var locals_for_with = (locals || {});(function (count) {;pug_debug_line = 1;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui one column centered grid leaderboard\"\u003E";
;pug_debug_line = 2;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Ch2 style=\"color: #FFF;\"\u003E";
;pug_debug_line = 2;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "Scoreboard\u003C\u002Fh2\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 3;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Cdiv class=\"ui one column centered grid\"\u003E";
;pug_debug_line = 4;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Cdiv class=\"content left aligned\"\u003E";
;pug_debug_line = 5;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Ctable class=\"ui selectable celled table leaderboard\"\u003E";
;pug_debug_line = 6;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Cthead\u003E";
;pug_debug_line = 7;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Ctr\u003E";
;pug_debug_line = 8;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Cth\u003E";
;pug_debug_line = 8;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "Player\u003C\u002Fth\u003E";
;pug_debug_line = 9;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Cth\u003E";
;pug_debug_line = 9;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "Rating\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Fthead\u003E";
;pug_debug_line = 10;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Ctbody\u003E\u003C\u002Ftbody\u003E";
;pug_debug_line = 11;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
for (var player = 0; player < count; ++player) 
{
;pug_debug_line = 12;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Ctr\u003E";
;pug_debug_line = 13;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 13;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "Vasiliy Dmitriev\u003C\u002Ftd\u003E";
;pug_debug_line = 14;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 14;pug_debug_filename = ".\u002Fpublic\u002Fblocks\u002F\u002Fscoreboard\u002Fscoreboard.pug";
pug_html = pug_html + "100500\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
}
pug_html = pug_html + "\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"count" in locals_for_with?locals_for_with.count:typeof count!=="undefined"?count:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}