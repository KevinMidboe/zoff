function updateList(){list=$.ajax({type:"GET",url:"php/change.php",async:false}).responseText;list=$.parseJSON(list);conf=list.conf;if(conf.hasOwnProperty("addsongs")&&conf.addsongs=="true")adminadd=1;else adminadd=0;if(conf.hasOwnProperty("allvideos")&&conf.allvideos=="true")music=1;else music=0;if(conf.hasOwnProperty("longsongs")&&conf.longsongs=="true")longS=1;else longS=0;if(conf.hasOwnProperty("vote")&&conf.vote=="true")adminvote=1;else adminvote=0;if(conf.hasOwnProperty("adminpass")&&conf.adminpass!=="")hasadmin=1;else hasadmin=0;setTimeout(function(){$("#wrapper").empty();$.each(list.songs,function(e,t){var n=t.title.replace(/\\\'/g,"'").replace(/&quot;/g,"'").replace(/&/g,"&");var r=t.id;var i="http://i.ytimg.com/vi/"+r+"/mqdefault.jpg";var s="";if(e%2===0)s=" oddlist";var o="";if(pass_corr=="correct")o="<input id='del' title='Remove' type='button' class='button' value='X' onclick=\"vote('"+r+"','del')\">";var u="<div id='result' class='result lresult"+s+"'>"+"<img src='"+i+"' class='thumb lthumb'>"+"<div class='ltitle'>"+n+"</div>"+"<div class='votes'>"+t.votes+"<a onclick=\"vote('"+r+"','pos');\" id='plus'>+</a>"+"<a onclick=\"vote('"+r+"','neg');\" id='minus'>-</a>"+o+"</div>"+"</div>";$("#wrapper").append(u)});if($("#playlist").height()!=$("#player").height()){if(!window.mobilecheck()){$("#playlist").css({height:$("#player").height()-$("#adminPanel").outerHeight(true)+30});$("#playlist").css({overflow:"hidden"});if(scroller===false){myScroll=new IScroll("#playlist",{mouseWheel:true,scrollbars:false,scrollY:true,interactiveScrollbars:false});scroller=true}else{myScroll.refresh()}}}if(window.mobilecheck()){document.getElementById("player").style.display="none";ytplayer.pauseVideo()}else{myScroll.refresh()}if(!adminTogg){names=["vote","addsongs","longsongs","frontpage","allvideos","removeplay"];for(var e=0;e<names.length;e++){document.getElementsByName(names[e])[0].checked=conf[names[e]]==="true";document.getElementsByName(names[e])[1].checked=conf[names[e]]==="false"}if(hasadmin)$("#setpass").text("Channel has admin");else $("#setpass").text("Channel has no admin")}},2500)}function vote(e,t){$.ajax({type:"GET",url:"php/change.php",async:false,data:"vote="+t+"&id="+e+"&pass="+adminpass,success:function(){if(t=="pos"){$("#playlist").addClass("success")}else{$("#playlist").addClass("fadeerror")}updateList()}});setTimeout(function(){$("#playlist").removeClass("success");$("#playlist").removeClass("fadeerror")},1500)}function skip(){$.ajax({type:"GET",url:"php/change.php",async:false,data:"skip",success:function(){$("#buttons").addClass("success");updateList()}});setTimeout(function(){$("#playlist").removeClass("success")},1500)}function show(){if(showToggle){showToggle=false;$("#toptitle").empty();$("#chan").addClass("bigChan");$("#chan").html("zoff.no/"+chan)}else{showToggle=true;$("#toptitle").html("Zöff");$("#chan").removeClass("bigChan");$("#chan").html(chan)}}function ks(){list=$.ajax({type:"GET",url:"php/change.php",async:false}).responseText;list=$.parseJSON(list);myScroll.destroy();myScroll=null;$("#playlist").css({height:$("#player").height()});$("#playlist").css({overflow:"hidden"});myScroll=new IScroll("#playlist",{mouseWheel:true,scrollbars:false,scrollY:true,interactiveScrollbars:false});scroller=true}function initYoutubeControls(e){if(e!==undefined){ytplayer=e;durationFixer=setInterval(durationSetter,1e3)}else{tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";firstScriptTag=document.getElementsByTagName("script")[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag)}elems=Array("volume","duration","fullscreen");var t=document.getElementById("controls");var n=document.createElement("div");n.id="playpause";n.className="play";t.appendChild(n);for(x=0;x<elems.length;x++){var r=document.createElement("div");r.id=elems[x];t.appendChild(r)}initControls();fitToScreen();$(window).resize(function(){fitToScreen()})}function initControls(){document.getElementById("playpause").addEventListener("click",playPause);document.getElementById("fullscreen").addEventListener("click",function(){document.getElementById("player").webkitRequestFullscreen()});var e=document.getElementsByClassName("qChange")}function fitToScreen(){document.getElementById("controls").style.top=document.getElementById("player").offsetTop+$("#player").height()+"px";document.getElementById("controls").style.left=document.getElementById("player").offsetLeft+"px"}function initSlider(){$("#volume").slider({min:0,max:100,value:ytplayer.getVolume(),range:"min",animate:true,slide:function(e,t){setVolume(t.value)}})}function settings(){$("#qS").toggleClass("hide")}function changeQuality(){wantedQ=this.getAttribute("name");if(ytplayer.getPlaybackQuality!=wantedQ){ytplayer.setPlaybackQuality(wantedQ)}}function setVolume(e){ytplayer.setVolume(e)}function playPause(){state=ytplayer.getPlayerState();button=document.getElementById("playpause");if(state==1){ytplayer.pauseVideo()}else if(state==2){ytplayer.playVideo()}}function durationSetter(){duration=ytplayer.getDuration();dMinutes=Math.floor(duration/60);dSeconds=duration-dMinutes*60;currDurr=ytplayer.getCurrentTime();minutes=Math.floor(currDurr/60);seconds=currDurr-minutes*60;document.getElementById("duration").innerHTML=pad(minutes)+":"+pad(seconds)+" <span id='dash'>/</span> "+pad(dMinutes)+":"+pad(dSeconds)}function pad(e){return e<10?"0"+Math.floor(e):Math.floor(e)}function volumeOptions(){button=document.getElementById("volume");if(ytplayer.isMuted()){ytplayer.unMute();button.innerHTML="Mute"}else{ytplayer.mute();button.innerHTML="Unmute"}}function logQ(){}function onYouTubeIframeAPIReady(){ytplayer=new YT.Player("player",{height:window.height*.75,width:window.width*.6,videoId:response,playerVars:{rel:"0",wmode:"transparent",controls:"0",iv_load_policy:"3",theme:"light",color:"white"},events:{onReady:onPlayerReady,onStateChange:onPlayerStateChange,onError:errorHandler,onPlaybackQualityChange:logQ}})}function onPlayerStateChange(e){if(e.data===0&&checkEnd()||e.data==1&&checkEnd()){startNextSong();ytplayer.pauseVideo();wasPaused=false}else if(e.data==1&&wasPaused&&!beginning){beginning=false;wasPaused=false;syncInterval=setInterval(getTime,5e3);getTime()}else if(e.data==2){clearInterval(syncInterval);interval=true;wasPaused=true;beginning=false}if(e.data==1||e.data==2){activeButton=document.getElementById("playpause").className;if(e.data==2&&activeButton=="pause"||e.data==1&&activeButton=="play"){$("#playpause").toggleClass("play");$("#playpause").toggleClass("pause")}}if(e.data===0){quickFixCountdown=setTimeout(function(){if(ytplayer.getPlayerState()===0&&wasPaused){startNextSong();wasPaused=false}},5e3)}}function checkEnd(){$.ajax({type:"get",url:"php/timedifference.php",data:"abcde",async:false,success:function(e){timeDifference=$.parseJSON(e)}});if(parseInt(timeDifference[0])>ytplayer.getDuration()){return true}return false}function startNextSong(){if(checkEnd()&&!changed){setTimeout(function(){response=$.ajax({type:"POST",url:"php/change.php",async:false,data:"thisUrl="+response+"&act=save",success:function(){}}).responseText;getTitle(response);if(!window.mobilecheck()){ytplayer.loadVideoById(response)}beginning=true;setBGimage(response)},2500);updateList();changed=true;setTimeout(function(){changed=false;syncInterval=setInterval(getTime,5e3);interval=true},2500)}}function getTime(){if(ytplayer.getCurrentTime()>2&&ytplayer.getPlayerState()==1)wasPaused=false;if(!wasPaused){$.ajax({type:"get",url:"php/timedifference.php",data:"abcde",async:false,success:function(e){timeDifference=$.parseJSON(e)}});if(!window.mobilecheck()){if(parseInt(timeDifference[2])+1>ytplayer.getCurrentTime()+parseInt(timeDifference[3])&&ytplayer.getPlayerState()===0){return true}else if(ytplayer.getCurrentTime()+parseInt(timeDifference[3])>parseInt(timeDifference[2])+5||ytplayer.getCurrentTime()+parseInt(timeDifference[3])<parseInt(timeDifference[2])-5&&ytplayer.getPlayerState()!==0&&ytplayer.getPlayerState()!=3){if(parseInt(timeDifference[0])>ytplayer.getDuration()){}ytplayer.seekTo(timeDifference[0]);ytplayer.pauseVideo();if(!window.mobilecheck()){ytplayer.playVideo()}getTitle();return false}}if(response!=timeDifference[1]){clearInterval(syncInterval);ytplayer.pauseVideo();if(!window.mobilecheck()){ytplayer.loadVideoById(timeDifference[1])}setBGimage(timeDifference[1]);setTimeout(function(){diffVideo=true;beginning=true;$.ajax({type:"POST",url:"php/change.php",async:false,data:"thisUrl=123abcprompeprompe&act=save",success:function(e){response=timeDifference[1];getTitle()}});syncInterval=setInterval(getTime,5e3)},2500)}}}function getTitle(){$.ajax({type:"GET",url:"php/timedifference.php",async:false,success:function(e){viewers=$.parseJSON(e);var t=viewers[5].length>1?"viewers":"viewer";var n=viewers[4].replace(/\\\'/g,"'").replace(/&quot;/g,"'").replace(/&/g,"&");document.title=n+" • Zöff";document.getElementsByName("v")[0].placeholder=n+" • "+viewers[5].length+" "+t}})}function errorHandler(e){setTimeout(function(){response=$.ajax({type:"POST",url:"php/change.php",async:false,data:"thisUrl="+response+"&act=empty",success:function(){}}).responseText;if(!window.mobilecheck()){ytplayer.loadVideoById(response)}setBGimage(response)},2500)}function onPlayerReady(e){getTime();if(!window.mobilecheck()){ytplayer.playVideo()}initYoutubeControls(ytplayer);getTitle();setBGimage(response);initSlider()}function setBGimage(e){if(window.mozInnerScreenX==null&&!window.mobilecheck()){$("#bgimage").css("background-image","url(http://img.youtube.com/vi/"+e+"/0.jpg)")}else if(window.mobilecheck()){$("#mobile-banner").css("background-image","url(http://img.youtube.com/vi/"+e+"/hqdefault.jpg)");$("#mobile-banner").css("width",$(window).width())}}function search(e){$("#results").html("");if(e!==""){var t=encodeURIComponent(e);var n="http://gdata.youtube.com/feeds/api/videos?q="+t+"&format=5&orderby=relevance&max-results=25&v=2&alt=jsonc";$.ajax({type:"GET",url:n,dataType:"jsonp",success:function(e){if(e.data.items){var t="";$.each(e.data.items,function(e,n){if(n.duration>720&&longS===0){return}if(n.category=="Music"||music==1){var r=encodeURIComponent(n.title).replace(/'/g,"\\'");var i=n.viewCount;var s="http://i.ytimg.com/vi/"+n.id+"/default.jpg";var o=Math.floor(n.duration/60)+":"+(n.duration-Math.floor(n.duration/60)*60);var u="								<div id='result' class='result' onclick=\"submitAndClose('"+n.id+"','"+r+"');\">									<img src='"+s+"' class='thumb'>									<div id='title'>"+n.title+"										<div class='result_info'>"+i+" views • "+o+"</div>										<input id='add' title='Add several songs' type='button' class='button' value='+' onclick=\"submit('"+n.id+"','"+r+"');\">									</div>								</div>";t+=u}});$("<div style='display:none;'>"+t+"</div>").appendTo("#results").slideDown("slow")}else{$("#video").html("<div id='no'>No Video</div>")}}})}}function submitAndClose(e,t){submit(e,t);$("#results").html("")}function submit(e,t){$.ajax({type:"GET",url:"php/change.php",async:false,data:"v="+e+"&n="+t+"&pass="+adminpass,success:function(){console.log("added "+e);document.getElementById("search").value="";$("#search").addClass("success")},error:function(){console.log("error in adding");document.getElementById("search").value="";$("#search").addClass("error")}});$("#search").focus();setTimeout(function(){$("#search").removeClass("success");$("#search").removeClass("error")},1500);updateList();event.stopPropagation()}function admin(){adminTogg=!adminTogg;if(adminTogg)$("#playlist").height($("#playlist").height()-210);if(!adminTogg)setTimeout(function(){$("#playlist").height($("#playlist").height()+210)},501);$("#adminPanel").toggleClass("hiddenAdmin")}function submitAdmin(e){voting=e.vote.value;addsongs=e.addsongs.value;longsongs=e.longsongs.value;frontpage=e.frontpage.value;allvideos=e.allvideos.value;removeplay=e.removeplay.value;adminpass=e.pass.value;confRes=$.ajax({type:"POST",url:"php/change.php",async:false,data:"conf=start&vote="+voting+"&addsongs="+addsongs+"&longsongs="+longsongs+"&frontpage="+frontpage+"&allvideos="+allvideos+"&removeplay="+removeplay+"&pass="+adminpass,success:function(){}}).responseText;pass_corr=confRes;if(pass_corr=="correct"){$("#adminPanel").addClass("success")}else{$("#adminPanel").addClass("fadeerror");alert("Wrong password :(")}updateList();setTimeout(function(){$("#adminPanel").removeClass("success");$("#adminPanel").removeClass("fadeerror")},1500)}var list;var toSend="";var sendURL;var myScroll;var scroller=false;var showToggle=true;var chan=$("#chan").html();var hasadmin=0;var timeDifference;var wasPaused;var beginning;var diffVideo;var serverTime;var url;var response;var url;var tag;var firstScriptTag;var ytplayer;var syncInterval;var title;var interval;var viewers;var video_id;var changed=false;var conf=[];var adminvote=0;var adminadd=0;var adminskip=0;var music=0;var longS=0;var frontpage=1;var adminpass="";var old_input="";var timer=0;var adminTogg=false;var pass_corr="";$(document).ready(function(){window.mobilecheck=function(){var e=false;(function(t){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))e=true})(navigator.userAgent||navigator.vendor||window.opera);return e};updateList();wasPaused=false;beginning=true;diffVideo=false;interval=false;response=$.ajax({type:"GET",url:"php/change.php",async:false}).responseText;response=$.parseJSON(response);conf=response.conf;try{for(var e in response.nowPlaying)break;response=e}catch(t){response="1"}$.ajax({type:"get",url:"php/timedifference.php",data:"abcde",async:false,success:function(e){timeDifference=$.parseJSON(e)}});tag=document.createElement("script");tag.src="https://www.youtube.com/iframe_api";firstScriptTag=document.getElementsByTagName("script")[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);if(window.mobilecheck()){mobileSync=setInterval(function(){getTime();updateList()},1e4);document.getElementById("search").blur()}else{syncInterval=setInterval(getTime,5e3);listInterval=setInterval(updateList,1e4)}$("#search").focus();$("#base").bind("keyup keypress",function(e){var t=e.keyCode||e.which;if(t==13){e.preventDefault();return false}});$(".search_input").focus();$(".search_input").keyup(function(e){var t=$(this).val();if(t.length<3){$("#results").html("")}if(e.keyCode==13){search(t)}else if(e.keyCode==27){$("#results").html("")}else{timer=100}});setInterval(function(){timer--;if(timer===0){search($(".search_input").val())}},1)})