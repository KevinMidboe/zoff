!function(){var e,t,o={populate_channels:function(t){var n="",a=0;t.sort(o.sortFunction),pre_card=$(e);for(x in t){var s=t[x][3];if(20>a){var i=t[x][1],l=t[x][0],r="background-image:url('https://img.youtube.com/vi/"+i+"/hqdefault.jpg');",c=t[x][4],d=pre_card;d.find(".chan-name").text(s),d.find(".chan-name").attr("title",s),d.find(".chan-views").text(l),d.find(".chan-songs").text(c),d.find(".chan-bg").attr("style",r),d.find(".chan-link").attr("href",s),$("#channels").append(d.html())}n+="<option value='"+s+"'> ",a++}document.getElementById("preloader").style.display="none",document.getElementById("searches").innerHTML=n,$("#channels").fadeIn(800),$("#search").focus()},sortFunction:function(e,t){var o=e[0],n=t[0],a=e[4],s=t[4];return n>o?1:o>n?-1:s>a?1:a>s?-1:0}};String.prototype.capitalizeFirstLetter=function(){return this.charAt(0).toUpperCase()+this.slice(1)},$(document).ready(function(){e=$("#channel-list-container").html(),console.log(e),window.list_html=e,$("#channels").empty();var n=io.connect("//"+window.location.hostname+":3000");n.emit("frontpage_lists"),n.on("playlists",function(e){o.populate_channels(e)});var a=0;document.getElementById("zicon").addEventListener("click",function(){a+=10,document.getElementById("zicon").style.paddingLeft=a+"%",a>=100&&(window.location.href="https://www.youtube.com/v/0IGsNdVoEh0?autoplay=1&showinfo=0&autohide=1")}),t=$.ajax({type:"GET",url:"https://api.github.com/repos/zoff-music/zoff/commits",async:!1}).responseText,t=$.parseJSON(t),$("#latest-commit").html("Latest Commit: <br>"+t[0].commit.author.date.substring(0,10)+": "+t[0].committer.login+"<br><a href='"+t[0].html_url+"'>"+t[0].sha.substring(0,10)+"</a>: "+t[0].commit.message+"<br")})}();