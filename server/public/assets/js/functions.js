function removeAllListeners() {
  Helper.log(["Removing all listeners"]);
  socket.removeEventListener("chat.all");
  socket.removeEventListener("chat");
  socket.removeEventListener("conf");
  socket.removeEventListener("pw");
  socket.removeEventListener("toast");
  socket.removeEventListener("id");
  socket.removeEventListener("channel");
  socket.removeEventListener("np");
  socket.removeEventListener("get_list");
  //socket.removeEventListener("self_ping");
  socket.removeEventListener("viewers");
  socket.removeEventListener("auth_required");
  socket.removeEventListener("auth_accepted");
  socket.removeEventListener("suggested");
  socket.removeEventListener("color");
  socket.removeEventListener("chat_history");
  //socket.removeEventListener("name");
  socket.removeEventListener(id);
}

function list_last_logs() {
  console.log(JSON.stringify(Helper.logs));
}

function filterPlaylistElements(page) {
  var value = document.getElementById("filtersearch_input").value;
  var search_type = document.querySelector(".category-advanced-select").value;
  if (search_type != "category" && search_type != "title") {
    document.querySelector(".filter-results").innerHTML =
      "Something went wrong with fetching data..";
    return;
  }
  if (value == "") return;
  Helper.ajax({
    type: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    url: "/api/search/" + chan.toLowerCase(),
    data: {
      searchQuery: value,
      page: page,
      type: search_type
    },
    success: function(data) {
      var json = JSON.parse(data);
      document.querySelector(".filter-results").innerHTML = "";
      if (json.results.search_results.length > 0) {
        addFilterButtons("top", json);
        for (var i = 0; i < json.results.search_results.length; i++) {
          document.querySelector(
            ".filter-results"
          ).innerHTML += List.generateSong(
            json.results.search_results[i],
            false,
            false,
            true,
            false,
            "block",
            false,
            true
          );
        }
        addFilterButtons("bottom", json);
      } else {
        toast("Couldn't find any items with those tags..", "red");
        document.querySelector(".filter-results").innerHTML =
          "Couldn't find any items with those tags..";
      }
    },
    error: function(e) {
      if (e.status != 429) {
        toast("Couldn't find any items with those tags..", "red");

        document.querySelector(".filter-results").innerHTML =
          "Couldn't find any items with those tags..";
      } else {
        toast("You are doing that too much..", "red");
      }
    }
  });
}

function addFilterButtons(position, json) {
  if (json.results.next != undefined || json.results.prev != undefined) {
    document.querySelector(".filter-results").innerHTML +=
      "<div class='filter-pagination-container " +
      position +
      "-filter-container'></div>";
    if (json.results.prev != undefined) {
      document.querySelector("." + position + "-filter-container").innerHTML +=
        "<a href='#' class='btn orange prev-filter' data-page='" +
        json.results.prev +
        "'>Prev</a>";
    } else {
      document.querySelector("." + position + "-filter-container").innerHTML +=
        "<a href='#' class='btn orange disabled'>Prev</a>";
    }
    if (json.results.next != undefined) {
      document.querySelector("." + position + "-filter-container").innerHTML +=
        "<a href='#' class='btn orange next-filter' data-page='" +
        json.results.next +
        "'>Next</a>";
    } else {
      document.querySelector("." + position + "-filter-container").innerHTML +=
        "<a href='#' class='btn orange disabled'>Next</a>";
    }
  }
}

function say_updated() {
  setTimeout(function() {
    before_toast();
    M.toast({
      html:
        "The list was updated, want to refresh? <a class='waves-effect waves-light btn light-green' href='#' id='refresh_mobile' style='cursor:pointer;pointer-events:all;margin-left:10px;'> yes</a><a class='waves-effect waves-light btn red lighten' id='dont_refresh_list' style='cursor:pointer;pointer-events:all;margin-left:10px;'>no</a>",
      displayLength: 10000000
    });
  }, 500);
}

function sendDescription() {
  emit("suggest_description", {
    channel: chan,
    description: document.getElementById("description_input").value
  });
  document.getElementById("description_input").value = "";
}

function sendThumbnail() {
  emit("suggest_thumbnail", {
    channel: chan,
    thumbnail: document.getElementById("thumbnail_input").value
  });
  document.getElementById("thumbnail_input").value = "";
}

function sendRules() {
  emit("suggest_rules", {
    channel: chan,
    rules: document.getElementById("rules_input").value
  });
  document.getElementById("rules_input").value = "";
}

function resizeFunction() {
  if (chan && !Helper.mobilecheck()) {
    if (document.querySelector("#wrapper") == null) return;
    if (!client && !embed)
      document.querySelector("#hide-playlist").style.left =
        document.querySelector("#video-container").offsetWidth -
        document.querySelector("#hide-playlist").offsetWidth +
        "px";
    if (
      ((window.innerWidth > 600 && !embed) ||
        (window.innerWidth > 500 && embed)) &&
      document.querySelector("#wrapper").style.height != ""
    ) {
      document.querySelector("#wrapper").style.height = "";
      document.querySelector("#chat-bar").style.height = "";
      document.querySelector("#channelchat").style.height = "";
      document.querySelector("#all_chat").style.height = "";
      document.querySelector("#chat-container").style.height = "";
    } else if (
      (window.innerWidth < 601 && !embed) ||
      (window.innerWidth < 501 && embed)
    ) {
      if (!client && !embed) {
        var scPlaying = false;
        var ytPlaying = false;
        if (scUsingWidget) {
          Player.soundcloud_player.isPaused(function(paused) {
            try {
              ytPlaying =
                Player.player.getPlayerState() == YT.PlayerState.PLAYING ||
                Player.player.getPlayerState() == YT.PlayerState.BUFFERING;
            } catch (e) {}
            scPlaying = !paused;
            resizePlaylistPlaying(ytPlaying || scPlaying, true);
            return;
          });
        } else {
          try {
            ytPlaying =
              Player.player.getPlayerState() == YT.PlayerState.PLAYING ||
              Player.player.getPlayerState() == YT.PlayerState.BUFFERING;
          } catch (e) {}
          try {
            scPlaying = Player.soundcloud_player.isPlaying();
          } catch (e) {}
          resizePlaylistPlaying(ytPlaying || scPlaying, true);
        }
        return;
      }
    }
    var temp_fit;

    if (!embed && !client) {
      temp_fit = Math.round(Helper.computedStyle("#wrapper", "height") / 71);
      List.element_height =
        Helper.computedStyle("#wrapper", "height") / temp_fit - 5.3;
    } else if (embed) {
      temp_fit =
        Math.round(Helper.computedStyle("#wrapper", "height") / 91) + 1;
      List.element_height =
        Helper.computedStyle("#wrapper", "height") / temp_fit - 4;
    } else if (!client) {
      temp_fit =
        Math.round(
          (Helper.computedStyle(".tabs", "height") -
            Helper.computedStyle("header", "height") -
            64 -
            40) /
            71
        ) + 1;
      List.element_height =
        (window.innerHeight -
          Helper.computedStyle(".tabs", "height") -
          Helper.computedStyle("header", "height") -
          64 -
          40) /
          temp_fit -
        5;
    } else {
      temp_fit =
        Math.round(Helper.computedStyle("#wrapper", "height") / 71) + 1;
      List.element_height =
        Helper.computedStyle("#wrapper", "height") / temp_fit - 5.3;
    }
    if (List.element_height < 55.2 && !client && !embed) {
      temp_fit = temp_fit - 1;
      List.element_height = 55.2;
      temp_fit = Math.round(
        (window.innerHeight -
          Helper.computedStyle(".tabs", "height") -
          Helper.computedStyle("header", "height") -
          64 -
          40) /
          71
      );
      List.element_height =
        (window.innerHeight -
          Helper.computedStyle(".tabs", "height") -
          Helper.computedStyle("header", "height") -
          64 -
          40) /
          temp_fit -
        5;
    } else if (List.element_height < 55.2 && embed) {
      //List.can_fit = List.can_fit - 1;
      temp_fit = Math.round(
        (window.innerHeight -
          Helper.computedStyle(".tabs", "height") -
          Helper.computedStyle("header", "height") -
          64 -
          40) /
          71
      );
      List.element_height =
        (window.innerHeight -
          Helper.computedStyle(".tabs", "height") -
          Helper.computedStyle("header", "height") -
          64 -
          40) /
          temp_fit -
        5;
      temp_fit = temp_fit - 2;
    }
    if (temp_fit > List.can_fit || temp_fit < List.can_fit) {
      List.dynamicContentPage(-10);
    }
    if (List.can_fit < temp_fit) {
      for (var i = 0; i < List.page + temp_fit; i++) {
        Helper.css(
          document.querySelector("#wrapper").children[i],
          "display",
          "inline-flex"
        );
      }
    } else if (List.can_fit > temp_fit) {
      Helper.css(
        document.querySelector("#wrapper").children[List.page + temp_fit],
        "display",
        "none"
      );
      var elements = document.querySelector("#wrapper").children;
      for (var i = List.page + temp_fit; i < elements.length; i++) {
        Helper.css(
          document.querySelector("#wrapper").children[i],
          "display",
          "none"
        );
      }
    }
    List.can_fit = temp_fit;
    //List.element_height = (Helper.computedStyle("#wrapper", "height") / List.can_fit)-5.3;
    Helper.css(".list-song", "height", List.element_height + "px");
    Channel.set_title_width();
    if (!client) {
      var controlsPosition =
        document.querySelector("#controls").offsetHeight -
        Helper.computedStyle("#controls", "height");
      if (
        document.querySelectorAll("#controls").length > 0 &&
        !Helper.mobilecheck()
      ) {
        Helper.css(
          document.querySelector("#seekToDuration"),
          "top",
          controlsPosition - 55
        );
      } else if (document.querySelectorAll("#controls").length > 0) {
        Helper.css(
          document.querySelector("#seekToDuration"),
          "top",
          controlsPosition - 20
        );
      }
      Channel.window_width_volume_slider();
    }
  }
}

function fullVideo(hide) {
  if (hide) {
    document.querySelector("#playlist").className += " show-only-mobile";
    document.querySelector("#video-container").classList.remove("m9");
    document.querySelector("#video-container").className += " m12";
    document.querySelector("main").style.maxWidth = "100%";
    document.querySelector("#hide-playlist").style.left =
      document.querySelector("#video-container").offsetWidth -
      document.querySelector("#hide-playlist").offsetWidth +
      "px";
    document.querySelector("#hide-playlist .material-icons").innerText =
      "keyboard_arrow_left";
  } else {
    document.querySelector("#playlist").classList.remove("show-only-mobile");
    document.querySelector("#video-container").classList.remove("m12");
    document.querySelector("#video-container").className += " m9";
    document.querySelector("main").style.maxWidth = "";
    document.querySelector("#hide-playlist").style.left =
      document.querySelector("#video-container").offsetWidth -
      document.querySelector("#hide-playlist").offsetWidth +
      "px";
    document.querySelector("#hide-playlist .material-icons").innerText =
      "keyboard_arrow_right";
  }
  hiddenPlaylist = hide;
}

function getColor(id) {
  Helper.ajax({
    method: "POST",
    url: "/api/color",
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    data: JSON.stringify({
      id: id
    }),
    success: function(c) {
      c = JSON.parse(c);
      if (typeof c == "object") {
        Player.setBGimage({ color: c, only: true });
      }
    }
  });
}

function hide_native(way) {
  if (way == 1) {
    Helper.addClass(".castButton", "castButton-white-active");
    if (!Helper.mobilecheck()) {
      if (
        M.Tooltip.getInstance(document.getElementsByClassName("castButton")[0])
      ) {
        Helper.tooltip(".castButton", "destroy");
      }
      Helper.tooltip(".castButton", {
        delay: 5,
        position: "top",
        html: "Stop casting"
      });
    }
    Helper.toggleClass("#duration", "hide");
    Helper.toggleClass("#fullscreen", "hide");
    try {
      if (videoSource == "youtube") {
        Player.player.stopVideo();
      } else if (videoSource == "soundcloud") {
        Player.soundcloud_player.pause();
      }
    } catch (e) {}
    //clearTimeout(durationTimeout);
    Player.stopInterval = true;
    if (Helper.mobilecheck()) {
      if (document.querySelector("#pause").classList.contains("hide")) {
        Helper.toggleClass("#play", "hide");
        Helper.toggleClass("#pause", "hide");
      } else if (document.querySelector("#play").classList.contains("hide")) {
        Helper.toggleClass("#play", "hide");
        Helper.toggleClass("#pause", "hide");
      }
    } else {
      Playercontrols.visualVolume(100);
    }
    if (Helper.mobilecheck()) {
      Helper.addClass("#player_overlay", "hide");
      Helper.css("#player_overlay", "display", "none");
      Helper.css("#playing_on", "display", "none");
    } else {
      var thisThumbnail;
      if (Player.np.thumbnail == undefined)
        thisThumbnail =
          "https://img.youtube.com/vi/" + video_id + "/hqdefault.jpg";
      else thisThumbnail = Player.np.thumbnail;
      Helper.removeClass("#player_overlay", "hide");
      Helper.css("#player_overlay", "display", "block");
      Helper.css("#player_overlay", "background", "url(" + thisThumbnail + ")");
      Helper.css("#player_overlay", "background-position", "center");
      Helper.css("#player_overlay", "background-size", "100%");
      Helper.css("#player_overlay", "background-color", "black");
      Helper.css("#player_overlay", "background-repeat", "no-repeat");
      Helper.css("#playing_on", "display", "flex");
      Helper.setHtml(
        "#chromecast_text",
        "Playing on<br>" + castSession.getCastDevice().friendlyName
      );
    }
    Player.player.setVolume(100);
    if (scUsingWidget) Player.soundcloud_player.setVolume(100);
    else Player.soundcloud_player.setVolume(1);

    Helper.addClass("#player_overlay_text", "hide");
  } else if (way == 0) {
    if (!Helper.mobilecheck()) {
      if (
        M.Tooltip.getInstance(document.getElementsByClassName("castButton")[0])
      ) {
        Helper.tooltip(".castButton", "destroy");
      }
      Helper.tooltip(".castButton", {
        delay: 5,
        position: "top",
        html: "Cast Zoff to TV"
      });
    }
    Helper.removeClass(".castButton", "castButton-white-active");

    Helper.toggleClass("#duration", "hide");
    Helper.toggleClass("#fullscreen", "hide");
    if (videoSource == "youtube") {
      Player.player.playVideo();
    } else if (videoSource == "soundcloud") {
      Player.soundcloud_player.play();
    }
    Player.stopInterval = false;
    duration = Player.player.getDuration();
    Player.durationSetter();
    if (!Helper.mobilecheck()) {
      Player.player.setVolume(Crypt.get_volume());
      Playercontrols.visualVolume(Crypt.get_volume());
      if (scUsingWidget)
        Player.soundcloud_player.setVolume(embed ? 1 : Crypt.get_volume());
      else
        Player.soundcloud_player.setVolume(
          embed ? 1 : Crypt.get_volume() / 100
        );
    }
    Helper.addClass("#player_overlay", "hide");
    Helper.removeClass("#player_overlay_text", "hide");
    Helper.setHtml("#chromecast_text", "");
    Helper.css("#playing_on", "display", "none");
    if (!offline) {
      socket.emit("pos", { channel: chan.toLowerCase() });
    } else {
      Player.loadVideoById(video_id);
    }
  }
}

function chromecastListener(evt, data) {
  var json_parsed = JSON.parse(data);
  switch (json_parsed.type) {
    case -1:
      if (offline) {
        Player.playNext();
      } else {
        socket.emit("end", {
          id: json_parsed.videoId,
          channel: chan.toLowerCase()
        });
      }
      break;
    case 0:
      if (offline) {
        Player.playNext();
      } else {
        emit("skip", {
          error: json_parsed.data_code,
          id: json_parsed.videoId,
          channel: chan.toLowerCase()
        });
      }
      break;
    case 1:
      Helper.addClass("#play", "hide");
      Helper.removeClass("#pause", "hide");
      break;
    case 2:
      Helper.addClass("#pause", "hide");
      Helper.removeClass("#play", "hide");
      break;
  }
}

function start_auth() {
  if (!user_auth_started) {
    user_auth_started = true;
    Helper.removeClass("#player_overlay", "hide");
    Helper.css("#player_overlay", "display", "block");
    M.Modal.getInstance(document.getElementById("user_password")).open();
    document.querySelector("#user-pass-input").focus();
    //Crypt.remove_userpass(chan.toLowerCase());
    before_toast();
    M.toast({
      html: "That is not the correct password, try again..",
      displayLength: 4000
    });
  }
}

function emit_list() {
  var add = "";
  //if(private_channel) add = Crypt.getCookie("_uI") + "_";
  /*var p = Crypt.crypt_pass(Crypt.get_userpass(chan.toLowerCase()), true);
    if(p == undefined) p = "";*/
  if (socket.id) {
    socket.emit("list", {
      version: parseInt(_VERSION),
      channel: add + chan.toLowerCase()
    });
  } else {
    setTimeout(function() {
      emit_list();
    }, 50);
  }
}

function get_list_ajax() {
  //var c = Crypt.get_userpass(chan.toLowerCase());
  Helper.ajax({
    type: "POST",
    data: {
      userpass: "",
      token: zoff_api_token
    },
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    url: "/api/list/" + Helper.encodeChannelName(chan.toLowerCase()),
    success: function(response) {
      response = JSON.parse(response);
      if (response.results.length > 0) {
        if (response.status == 403) {
          start_auth();
        } else if (response.status == 404) return;
        if (client) {
          Helper.removeElement("#channel-load");
        }
        List.populate_list(response.results);
      }
    },
    error: function(response) {
      //response = JSON.parse(response);
      if (response.status == 403) {
        start_auth();
      } else if (response.status == 429) {
        setTimeout(function() {
          get_list_ajax();
        }, xmlhttp.getResponseHeader("Retry-After") * 1000);
      } else if (response.status == 404) return;
      if (client) {
        Helper.removeElement("#channel-load");
      }
      //List.populate_list(response.responseJSON.results);
    }
  });
}

function contextListener(that, event) {
  var parent = that.parentElement;
  var suggested = false;
  if (parent.id.indexOf("suggested-") > -1) suggested = true;
  document
    .getElementsByClassName("context-menu-root")[0]
    .setAttribute("data-suggested", suggested);
  document
    .getElementsByClassName("context-menu-root")[0]
    .setAttribute(
      "data-id",
      parent.getAttribute("id").replace("suggested-", "")
    );
  document
    .getElementsByClassName("context-menu-root")[0]
    .setAttribute("data-source", parent.getAttribute("data-video-source"));
  Helper.removeClass("#context-menu-overlay", "hide");
  var left =
    event.pageX - document.querySelector(".context-menu-root").offsetWidth / 2;
  var top = event.pageY;
  if (left + 200 > window.innerWidth) {
    left = window.innerWidth - 200 - 15;
  } else if (left < 0) {
    left = 11;
  }
  if (top + 96 > window.innerHeight) {
    top = window.innerHeight - 96 - 15;
  } else if (top < 0) {
    top = 15;
  }
  if (parent.getAttribute("data-video-source") == "soundcloud") {
    Helper.addClass(".find-context-menu", "context-menu-disabled");
  } else {
    Helper.removeClass(".find-context-menu", "context-menu-disabled");
  }
  Helper.css(".context-menu-root", "left", left + "px");
  Helper.css(".context-menu-root", "top", top + "px");
  Helper.removeClass(".context-menu-root", "hide");
  if (!Helper.mobilecheck()) {
    mouseContext(left, top);
  }
}

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function mouseContext(left, top) {
  var moveFunction = function(event) {
    if (
      event.pageX < left - 60 ||
      event.pageX >
        left + document.querySelector(".context-menu-root").offsetWidth + 60 ||
      event.pageY < top - 60 ||
      event.pageY >
        top + document.querySelector(".context-menu-root").offsetHeight + 60
    ) {
      Helper.addClass(".context-menu-root", "hide");
      Helper.addClass("#context-menu-overlay", "hide");
      document.removeEventListener("mousemove", moveFunction);
    }
  };
  try {
    document.removeEventListener("mousemove", moveFunction);
  } catch (e) {}
  document.addEventListener("mousemove", moveFunction, false);
}

function get_np_ajax() {
  /*var c = Crypt.get_userpass(chan.toLowerCase());
    if(c == undefined) c = "";*/
  Helper.ajax({
    type: "POST",
    data: {
      userpass: "",
      fetch_song: true,
      token: zoff_api_token
    },
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    url:
      "/api/list/" + Helper.encodeChannelName(chan.toLowerCase()) + "/__np__",
    success: function(response) {
      response = JSON.parse(response);
      Player.getTitle(response.results[0].title, 1);
    },
    error: function(response, xmlhttp) {
      //response = JSON.parse(response);
      if (response.status == 403) {
        start_auth();
      } else if (response.status == 429) {
        setTimeout(function() {
          get_np_ajax();
        }, xmlhttp.getResponseHeader("Retry-After") * 1000);
      }
    }
  });
}

function del_ajax(id) {
  /*var a = Crypt.get_pass(chan.toLowerCase());
    var u = Crypt.get_userpass(chan.toLowerCase());
    if(a == undefined) a = "";
    if(u == undefined) u = "";*/
  Helper.ajax({
    type: "DELETE",
    data: {
      adminpass: "",
      userpass: "",
      token: zoff_api_token
    },
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    url: "/api/list/" + Helper.encodeChannelName(chan.toLowerCase()) + "/" + id,
    success: function(response) {
      toast("deletesong");
      get_list_ajax();
    },
    error: function(response, xmlhttp) {
      //response = JSON.parse(response);
      if (response.status == 403) {
        toast("listhaspass");
      } else if (response.status == 429) {
        setTimeout(function() {
          del_ajax(id);
        }, xmlhttp.getResponseHeader("Retry-After") * 1000);
      }
    }
  });
}

function add_ajax(
  id,
  title,
  duration,
  playlist,
  num,
  full_num,
  start,
  end,
  source,
  thumbnail
) {
  /*var a = Crypt.get_pass(chan.toLowerCase());
    var u = Crypt.get_userpass(chan.toLowerCase());
    if(a == undefined) a = "";
    if(u == undefined) u = "";*/
  Helper.ajax({
    type: "POST",
    data: {
      adminpass: "",
      userpass: "",
      title: title,
      duration: duration,
      end_time: end,
      start_time: start,
      thumbnail: thumbnail,
      source: source,
      token: zoff_api_token
    },
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    url: "/api/list/" + Helper.encodeChannelName(chan.toLowerCase()) + "/" + id,
    success: function(response) {
      toast("addedsong");
      get_list_ajax();
    },
    error: function(response, xmlhttp) {
      //response = JSON.parse(response);
      if (response.status == 403) {
        toast("listhaspass");
      } else if (response.status == 409) {
        vote_ajax(id);
      } else if (response.status == 429) {
        setTimeout(function() {
          add_ajax(id, title, duration, playlist, num, full_num, start, end);
        }, xmlhttp.getResponseHeader("Retry-After") * 1000);
      }
    }
  });
}

function vote_ajax(id) {
  /*var a = Crypt.get_pass(chan.toLowerCase());
    var u = Crypt.get_userpass(chan.toLowerCase());
    if(a == undefined) a = "";
    if(u == undefined) u = "";*/
  Helper.ajax({
    type: "PUT",
    data: {
      adminpass: "",
      userpass: "",
      token: zoff_api_token
    },
    headers: { "Content-Type": "application/json;charset=UTF-8" },
    url: "/api/list/" + Helper.encodeChannelName(chan.toLowerCase()) + "/" + id,
    success: function(response) {
      toast("voted");
      get_list_ajax();
    },
    error: function(response, xmlhttp) {
      //response = JSON.parse(response);
      if (response.status == 403) {
        toast("listhaspass");
      } else if (response.status == 429) {
        setTimeout(function() {
          vote_ajax(id);
        }, xmlhttp.getResponseHeader("Retry-After") * 1000);
      }
    }
  });
}

function setup_auth_listener() {
  socket.on("auth_required", function() {
    start_auth();
  });

  socket.on("auth_accepted", function(msg) {
    if (msg.hasOwnProperty("value") && msg.value) {
      if (temp_user_pass != "") {
        userpass = temp_user_pass;
        //Crypt.set_userpass(chan.toLowerCase(), userpass);
      }
    }
  });
}

function setup_no_connection_listener() {
  socket.on("connect_failed", function() {
    Helper.log(["Connection Failed"]);
    if (!connect_error) {
      connect_error = true;
      M.toast({
        html: "Error connecting to server, please wait..",
        displayLength: 100000000,
        classes: "red lighten connect_error"
      });
    }
  });

  socket.on("connect_error", function() {
    Helper.log(["Connection Failed."]);
    if (!connect_error) {
      connect_error = true;
      M.toast({
        html: "Error connecting to server, please wait..",
        displayLength: 100000000,
        classes: "red lighten connect_error"
      });
    }
  });
}

function loadChromecastVideo() {
  castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  var _seekTo;
  try {
    if (videoSource == "youtube") {
      _seekTo = Player.player.getCurrentTime();
    } else if (videoSource == "soundcloud") {
      _seekTo = Player.soundcloud_player.currentTime() / 1000;
    }
  } catch (event) {
    _seekTo = seekTo;
  }
  var mediaInfo = new chrome.cast.media.MediaInfo(video_id, "video");
  var image = {
    url: "https://img.youtube.com/vi/" + video_id + "/mqdefault.jpg",
    heigth: 180,
    width: 320
  };
  if (Player.np.thumbnail) image.url = Player.np.thumbnail;
  mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
  mediaInfo.metadata.title = Player.np.title;
  mediaInfo.metadata.image = image;
  mediaInfo.metadata.images = [image];
  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  request.media.customData = {
    start: Player.np.start,
    end: Player.np.end,
    seekTo: _seekTo,
    channel: chan.toLowerCase(),
    source: videoSource,
    thumbnail:
      Player.np.thumbnail != undefined
        ? Player.np.thumbnail
        : "https://img.youtube.com/vi/" + video_id + "/mqdefault.jpg"
  };
  castSession.loadMedia(request).then(
    function() {
      console.log("Loaded chromecast-video. Don't look here, look at your TV!");
    },
    function(errorCode) {
      console.log("Error code: " + errorCode);
    }
  );
}

function showOnSmallNotMobile() {
  var elements = document.querySelectorAll(".hide-on-mobile-only");
  for (var i = 0; i < elements.length; i++) {
    Helper.removeClass(elements[i], "hide-on-small-only");
  }
}

function enable_intelligent_list() {
  if (Crypt.get_intelligent_list_enabled()) {
    intelligentList = true;
  }
}

function change_intelligent(enabled) {
  document.querySelector(".intelligent_switch_class").checked = enabled;
}

function clearIntelligentQueue() {
  intelligentList = false;
  for (var i = 0; i < intelligentQueue.length; i++) {
    var currentElement = intelligentQueue[i];
    if (currentElement.type == "vote") {
      Helper.removeElement("#" + currentElement.element.id);
      List.insertAtIndex(currentElement.element, false);
    } else if (currentElement.type == "delete") {
      List.deleted_song(
        currentElement.element.id,
        false,
        true,
        currentElement.index
      );
      deleted_elements += 1;
    } else if (currentElement.type == "add") {
      List.insertAtIndex(currentElement.element, true);
      Helper.css(
        document.querySelector("#wrapper").children[List.page + List.can_fit],
        "display",
        "none"
      );
      if (
        document.querySelector("#wrapper").children.length >
        List.page + List.can_fit
      ) {
        Helper.css(".next_page_hide", "display", "none");
        Helper.removeClass(".next_page", "hide");
        Helper.css(".last_page_hide", "display", "none");
        Helper.css(".next_page", "display", "inline-flex");
        Helper.css(".last_page", "display", "inline-flex");
      } else {
        Helper.css(".next_page_hide", "display", "inline-flex");
        Helper.css(".next_page", "display", "none");
      }
    }
  }
  intelligentQueue = [];
}

function updateChromecastMetadata() {
  if (!chromecastAvailable) return;
  var image = {
    url: "https://img.youtube.com/vi/" + video_id + "/mqdefault.jpg",
    heigth: 180,
    width: 320
  };
  if (Player.np.thumbnail) image.url = Player.np.thumbnail;
  chrome.cast.media.GenericMediaMetadata({
    metadataType: 0,
    title: Player.np.title,
    image: image,
    images: [image]
  });
  return new chrome.cast.media.GenericMediaMetadata({
    metadataType: 0,
    title: Player.np.title,
    image: image,
    images: [image]
  });
}

function setup_now_playing_listener() {
  socket.on("np", Player.now_playing_listener);
}

function exitHandler(event) {
  if (
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement !== null
  ) {
    if (
      !document.getElementById("main-row").classList.contains("fullscreened")
    ) {
      Helper.addClass("#main-row", "fullscreened");
    } else {
      Helper.removeClass("#main-row", "fullscreened");
      document.querySelector(".host_switch_class").checked = false;
      enable_host_mode(false);
    }
  }
}

function enable_host_mode(enabled) {
  if (!hostMode) {
    var playerElement = document.querySelector("main");
    var requestFullScreen =
      playerElement.requestFullScreen ||
      playerElement.mozRequestFullScreen ||
      playerElement.webkitRequestFullScreen;
    if (requestFullScreen) {
      requestFullScreen.bind(playerElement)();
      M.Tabs.getInstance(
        document.querySelector(".playlist-tabs-loggedIn")
      ).select("wrapper");
      Helper.addClass("#main-row", "host-mode-height");
      Helper.addClass("#main-row", "host-mode-width");
      Helper.addClass("main", "host-mode-height");
      Helper.addClass("main", "host-mode-width");
      Helper.addClass("#video-container", "host-mode-height");
      Helper.addClass("#playlist", "host-mode-height");
      Helper.css(".playlist-tabs-loggedIn", "display", "none");
      Helper.removeClass("#wrapper", "tabs_height");
      Helper.addClass("#wrapper", "host-mode-wrapper");
      Helper.css(".skip", "display", "none");
      var removeElements = document.querySelectorAll(".list-remove");
      for (var i = 0; i < removeElements.length; i++) {
        removeElements[i].style.display = "none";
      }
      Helper.css(".prev", "display", "none");
      Helper.css("#fullscreen", "display", "none");
      Helper.css("#playlist", "backgroundColor", "inherit");
      Helper.css("#main-row", "backgroundColor", "inherit");
      Helper.css(".main", "backgroundColor", "inherit");
      Helper.removeClass("#host-title", "hide");
      Helper.css("#soundcloud_info_container", "display", "none");
      Helper.css("#player", "pointer-events", "none");
      hostMode = enabled;
      document
        .querySelector("#playlist")
        .insertAdjacentHTML(
          "beforeend",
          "<div id='join-sidebar' style='color:white;'>" +
            document
              .querySelector("#channel-share-modal")
              .querySelector(".modal-content").innerHTML +
            "</div>"
        );
      document.addEventListener("webkitfullscreenchange", exitHandler, false);
      document.addEventListener("mozfullscreenchange", exitHandler, false);
      document.addEventListener("fullscreenchange", exitHandler, false);
      document.addEventListener("MSFullscreenChange", exitHandler, false);
    }
  } else {
    Helper.removeClass("#main-row", "host-mode-height");
    Helper.removeClass("#main-row", "host-mode-width");
    Helper.css(".prev", "display", "block");
    Helper.removeClass(".main", "host-mode-height");
    Helper.removeClass(".main", "host-mode-width");
    Helper.removeClass("#video-container", "host-mode-height");
    Helper.removeClass("#playlist", "host-mode-height");
    Helper.css(".playlist-tabs-loggedIn", "display", "flex");
    Helper.css("#player", "pointer-events", "all");
    Helper.addClass("#wrapper", "tabs_height");
    Helper.addClass("#host-title", "hide");
    Helper.removeClass("#wrapper", "host-mode-wrapper");
    Helper.css("#soundcloud_info_container", "display", "flex");
    Helper.css(".skip", "display", "block");
    document.querySelector("#join-sidebar").remove();
    var removeElements = document.querySelectorAll(".list-remove");
    for (var i = 0; i < removeElements.length; i++) {
      removeElements[i].style.display = "block";
    }
    Helper.css("#fullscreen", "display", "block");
    hostMode = false;
    document.removeEventListener("webkitfullscreenchange", exitHandler, false);
    document.removeEventListener("mozfullscreenchange", exitHandler, false);
    document.removeEventListener("fullscreenchange", exitHandler, false);
    document.removeEventListener("MSFullscreenChange", exitHandler, false);
  }
  resizeFunction();
  List.dynamicContentPage(-10);
}

function get_list_listener() {
  socket.on("get_list", function() {
    var add = "";
    socket_connected = true;
    //if(private_channel) add = Crypt.getCookie("_uI") + "_";
    /*var p = Crypt.crypt_pass(Crypt.get_userpass(chan.toLowerCase()), true);
        if(p == undefined) p = "";*/
    socket.emit("list", {
      offline: offline,
      version: parseInt(_VERSION),
      channel: add + chan.toLowerCase()
    });
  });
  socket.on("id_chromecast", function(msg) {
    chromecast_specs_sent = true;
    castSession.sendMessage("urn:x-cast:zoff.me", {
      type: "mobilespecs",
      guid: msg.guid,
      socketid: msg.cookie_id,
      channel: chan.toLowerCase()
    });
  });
}

function setup_suggested_listener() {
  if (client) return;
  socket.on("suggested", function(params) {
    var single = true;
    if (params.id === undefined) single = false;
    Suggestions.catchUserSuggests(params, single);
  });
}

function setup_viewers_listener() {
  socket.on("viewers", function(view) {
    viewers = view;
    var outPutWord = "<i class='material-icons'>visibility</i>"; //v > 1 ? "viewers" : "viewer";

    Helper.setHtml("#viewers", outPutWord + " " + view);

    if (song_title !== undefined) Player.getTitle(song_title, viewers);
  });
}

function setup_admin_listener() {
  socket.on("toast", toast);
  socket.on("pw", Admin.pw);
  socket.on("conf", Admin.conf);
}

function setup_chat_listener() {
  socket.on("chat_history", function(msg) {
    var data = msg.data;
    for (var i = 0; i < data.length; i++) {
      if (msg.all) {
        Chat.allchat(data[i], data[i].createdAt, true);
        document.getElementById("chatall").scrollTop = document.getElementById(
          "chatall"
        ).scrollHeight;
      } else {
        Chat.channelchat(data[i], data[i].createdAt, true);
        document.getElementById(
          "chatchannel"
        ).scrollTop = document.getElementById("chatchannel").scrollHeight;
      }
    }
  });
  socket.on("chat.all", Chat.allchat);
  socket.on("chat", Chat.channelchat);
}

function setup_list_listener() {
  if (!offline) {
    socket.on("color", Player.setBGimage);
  }
  socket.on("channel", List.channel_function);
}

function setup_playlist_listener() {
  Helper.log(["Setting up playlist_listener"]);
  socket.on("playlists", Frontpage.frontpage_function);
}

function setup_host_initialization() {
  if (!client) {
    Helper.log(["Setting up host initialization listener"]);
    socket.on("id", Hostcontroller.host_listener);
  }
}

function setup_host_listener(id) {
  if (!client) {
    Helper.log(["Setting up host action listener"]);
    socket.on(id, Hostcontroller.host_on_action);
  }
}

function enable_debug() {
  try {
    localStorage.debug = true;
  } catch (e) {}
}

function disable_debug() {
  try {
    localStorage.debug = false;
  } catch (e) {}
}

function embed_code(
  autoplay,
  width,
  height,
  color,
  embed_videoonly,
  embed_localmode
) {
  var autoplay_add = "";
  if (autoplay == "&autoplay=true") autoplay_add = 'allow="autoplay"';
  return (
    '<iframe src="https://zoff.me/api/embed/?channel=' +
    chan.toLowerCase() +
    color +
    autoplay +
    embed_videoonly +
    embed_localmode +
    '" width="' +
    width +
    'px" height="' +
    height +
    'px" ' +
    autoplay_add +
    "></iframe>"
  );
}

function change_offline(enabled, already_offline) {
  if (client) {
    offline = false;
    return;
  }
  Crypt.set_offline(enabled);
  offline = enabled;
  ga("send", "event", "button-click", "offline", "", offline ? 1 : 0);
  socket.emit("offline", {
    status: enabled,
    channel: chan != undefined ? chan.toLowerCase() : ""
  });
  if (!Helper.mobilecheck()) {
    if (
      document.querySelectorAll("#offline-mode").length == 1 &&
      M.Tooltip.getInstance(document.getElementById("offline-mode"))
    ) {
      Helper.tooltip("#offline-mode", "destroy");
    }
  }

  var mouseEnter = function(e) {
    Helper.removeClass("#seekToDuration", "hide");
  };

  var mouseLeave = function(e) {
    dragging = false;
    Helper.addClass("#seekToDuration", "hide");
  };

  var mouseDown = function(e) {
    var acceptable = ["bar", "controls", "duration"];
    if (acceptable.indexOf(e.target.id) >= 0) {
      dragging = true;
    }
  };

  var mouseUp = function(e) {
    dragging = false;
  };

  if (enabled) {
    Helper.addClass("#viewers", "hide");
    Helper.removeClass(".margin-playbar", "margin-playbar");
    Helper.addClass(".prev playbar", "margin-playbar");
    Helper.removeClass(".prev playbar", "hide");
    Helper.removeClass("#offline-mode", "waves-cyan");
    Helper.addClass("#offline-mode", "cyan");
    Helper.removeClass(".delete-context-menu", "context-menu-disabled");
    if (!Helper.mobilecheck()) {
      Helper.tooltip("#offline-mode", {
        delay: 5,
        position: "bottom",
        html: "Disable local mode"
      });
    }

    if (window.location.pathname != "/") {
      socket.removeEventListener("color");
      document
        .getElementById("controls")
        .addEventListener("mouseenter", mouseEnter, false);
      document
        .getElementById("controls")
        .addEventListener("mouseleave", mouseLeave, false);
      document
        .getElementById("controls")
        .addEventListener("mousedown", mouseDown, false);
      document
        .getElementById("controls")
        .addEventListener("mouseup", mouseUp, false);
      document
        .getElementById("controls")
        .addEventListener("mousemove", seekToMove);
      document
        .getElementById("controls")
        .addEventListener("click", seekToClick);

      document
        .querySelector("#main_components")
        .insertAdjacentHTML(
          "beforeend",
          "<div id='seekToDuration' class='hide'>00:00/01:00</div>"
        );
      var controlElement = document.querySelector("#controls");
      if (!Helper.mobilecheck())
        Helper.css(
          "#seekToDuration",
          "top",
          -controlElement.offsetHeight - 25 + "px"
        );
      else if (Helper.mobilecheck())
        Helper.css(
          "#seekToDuration",
          "top",
          -controlElement.offsetHeight - 25 + "px"
        );
      Helper.addClass("#controls", "ewresize");
    }
    if (full_playlist != undefined && !already_offline) {
      for (var x = 0; x < full_playlist.length; x++) {
        full_playlist[x].votes = 0;
      }
      List.sortList();
      List.populate_list(full_playlist);
    }
  } else {
    if (!Admin.logged_in)
      Helper.addClass(".delete-context-menu", "context-menu-disabled");
    Helper.removeClass(".margin-playbar", "margin-playbar");
    Helper.addClass("#playpause", "margin-playbar");
    Helper.removeClass("#viewers", "hide");
    Helper.addClass(".prev playbar", "hide");
    Helper.addClass("#offline-mode", "waves-cyan");
    Helper.removeClass("#offline-mode", "cyan");
    if (!Helper.mobilecheck()) {
      Helper.tooltip("#offline-mode", {
        delay: 5,
        position: "bottom",
        html: "Enable local mode"
      });
    }

    if (window.location.pathname != "/") {
      document
        .getElementById("controls")
        .removeEventListener("mouseenter", mouseEnter, false);
      document
        .getElementById("controls")
        .removeEventListener("mouseleave", mouseLeave, false);
      document
        .getElementById("controls")
        .removeEventListener("mousedown", mouseDown, false);
      document
        .getElementById("controls")
        .removeEventListener("mouseup", mouseUp, false);
      document
        .getElementById("controls")
        .removeEventListener("mousemove", seekToMove);
      document
        .getElementById("controls")
        .removeEventListener("click", seekToClick);
      Helper.removeElement("#seekToDuration");
      socket.on("color", Player.setBGimage);
      socket.emit("pos", { channel: chan.toLowerCase() });
      var add = "";
      socket.emit("list", {
        version: parseInt(_VERSION),
        channel: add + chan.toLowerCase()
      });
      Helper.removeClass("#controls", "ewresize");
    }
  }
}

function seekToClick(e) {
  var acceptable = ["bar", "controls", "duration"];

  if (acceptable.indexOf(e.target.getAttribute("id")) >= 0) {
    if (full_playlist == undefined) return;
    var total =
      full_playlist[full_playlist.length - 1].duration /
      document.getElementById("controls").offsetWidth;
    total = total * e.clientX;

    if (!chromecastAvailable) {
      if (videoSource == "youtube")
        Player.player.seekTo(total + Player.np.start);
      else if (videoSource == "soundcloud")
        Player.soundcloud_player.seek((total + Player.np.start) * 1000);
      dMinutes = Math.floor(duration / 60);
      dSeconds = duration - dMinutes * 60;
      currDurr = total;
      if (currDurr - Player.np.start > duration) {
        currDurr = duration - Player.np.start;
      }
      currDurr = currDurr - Player.np.start;
      minutes = Math.floor(currDurr / 60);
      seconds = currDurr - minutes * 60;
      document.getElementById("duration").innerHTML =
        Helper.pad(minutes) +
        ":" +
        Helper.pad(seconds) +
        " <span id='dash'>/</span> " +
        Helper.pad(dMinutes) +
        ":" +
        Helper.pad(dSeconds);
      per = (100 / duration) * currDurr;
      if (per >= 100) per = 100;
      else if (duration === 0) per = 0;
      document.getElementById("bar").style.width = per + "%";
    } else {
      castSession.sendMessage("urn:x-cast:zoff.me", {
        type: "seekTo",
        seekTo: total
      });
    }
  }
}

function seekToMove(e) {
  var pos_x =
    event.clientX -
    Math.ceil(document.getElementById("seekToDuration").offsetWidth / 2);
  if (pos_x < 0) pos_x = 0;
  else if (
    pos_x + document.getElementById("seekToDuration").offsetWidth >
    document.getElementById("controls").offsetWidth
  ) {
    pos_x =
      document.getElementById("controls").offsetWidth -
      document.getElementById("seekToDuration").offsetWidth;
  }
  Helper.css("#seekToDuration", "left", pos_x + "px");
  try {
    var total =
      full_playlist[full_playlist.length - 1].duration /
      document.getElementById("controls").offsetWidth;
    total = total * event.clientX;
    var _time = Helper.secondsToOther(total);
    var _minutes = Helper.pad(_time[0]);
    var _seconds = Helper.pad(Math.ceil(_time[1]));
    Helper.setHtml("#seekToDuration", _minutes + ":" + _seconds);

    var acceptable = ["bar", "controls", "duration"];
    if (acceptable.indexOf(event.target.getAttribute("id")) >= 0 && dragging) {
      document
        .getElementById("bar")
        .style.width((100 / duration) * total + "%");
    }
  } catch (e) {}
}

function resizePlaylistPlaying(playing, resizing) {
  if (document.querySelector("#wrapper") == null || embed || client) return;
  if (window.innerWidth < 601) {
    var subtract = 0;
    if (playing) {
      var height = window.innerHeight - 246 - 170 - subtract;
      Helper.css("#chat-bar", "height", height + "px");
      Helper.css("#channelchat", "height", height - 130 + "px");
      Helper.css("#all_chat", "height", height - 130 + "px");
      Helper.css("#chat-container", "height", height + "px");
      subtract = 200;
    } else {
      document.querySelector("#chat-bar").style.height = "";
      document.querySelector("#channelchat").style.height = "";
      document.querySelector("#all_chat").style.height = "";
      document.querySelector("#chat-container").style.height = "";
    }
    var page = List.page;
    var canFit = List.can_fit;
    Helper.css(
      "#wrapper",
      "height",
      window.innerHeight - 246 - subtract + "px"
    );

    if (!embed && !client) {
      temp_fit = Math.round(Helper.computedStyle("#wrapper", "height") / 71);
      List.element_height =
        Helper.computedStyle("#wrapper", "height") / temp_fit - 5.3;
    } else {
      temp_fit =
        Math.round(Helper.computedStyle("#wrapper", "height") / 71) + 1;
      List.element_height =
        Helper.computedStyle("#wrapper", "height") / temp_fit - 5.3;
    }
    if (List.element_height < 55.2 && !client) {
      temp_fit = temp_fit - 1;
      List.element_height = 55.2;
      temp_fit = Math.round(
        (window.innerHeight -
          Helper.computedStyle(".tabs", "height") -
          Helper.computedStyle("header", "height") -
          64 -
          40) /
          71
      );
      List.element_height =
        (window.innerHeight -
          Helper.computedStyle(".tabs", "height") -
          Helper.computedStyle("header", "height") -
          64 -
          40) /
          temp_fit -
        5;
    }

    if (temp_fit > List.can_fit || temp_fit < List.can_fit) {
      List.dynamicContentPage(-10);
    }
    if (List.can_fit < temp_fit) {
      Helper.css(
        document.querySelector("#wrapper").children,
        "display",
        "none"
      );
      for (var i = 0; i < List.page + temp_fit; i++) {
        Helper.css(
          document.querySelector("#wrapper").children[i],
          "display",
          "inline-flex"
        );
      }
    } else if (List.can_fit > temp_fit) {
      //Helper.css(document.querySelector("#wrapper").children, "display", "none");
      Helper.css(
        document.querySelector("#wrapper").children[List.page + temp_fit],
        "display",
        "none"
      );
      var elements = document.querySelector("#wrapper").children;
      for (var i = List.page + temp_fit; i < elements.length; i++) {
        Helper.css(
          document.querySelector("#wrapper").children[i],
          "display",
          "none"
        );
      }
    }
    List.can_fit = temp_fit;
    List.element_height =
      Helper.computedStyle("#wrapper", "height") / List.can_fit - 5.3;
    Helper.css(".list-song", "height", List.element_height + "px");
    Channel.set_title_width();
    var toJumpTo = page / canFit;
    if (
      toJumpTo > Math.floor(full_playlist.length / List.can_fit) &&
      resizing
    ) {
      toJumpTo = Math.floor(full_playlist.length / List.can_fit);
    }
    List.dynamicContentPageJumpTo(toJumpTo);
    if (!client) {
      var controlsPosition =
        document.querySelector("#controls").offsetHeight -
        Helper.computedStyle("#controls", "height");
      if (
        document.querySelectorAll("#controls").length > 0 &&
        !Helper.mobilecheck()
      ) {
        Helper.css(
          document.querySelector("#seekToDuration"),
          "top",
          controlsPosition - 55
        );
      } else if (document.querySelectorAll("#controls").length > 0) {
        Helper.css(
          document.querySelector("#seekToDuration"),
          "top",
          controlsPosition - 20
        );
      }
      Channel.window_width_volume_slider();
    }
  }
}

function pagination_results(e) {
  this.preventDefault();
  var that = e;
  var pageToken = that.getAttribute("data-pagination");
  var searchInput = that.getAttribute("data-original-search");

  Helper.addClass(".next-results-button", "disabled");
  Helper.addClass(".prev-results-button", "disabled");
  Search.search(searchInput, false, false, pageToken);
}

function handleEvent(e, target, tried, type) {
  var path = e.path || (e.composedPath && e.composedPath());
  if (!path) {
    var path = [target];
    var parent = target.parentElement;
    while (parent != null) {
      path.push(parent);
      try {
        parent = parent.parentElement;
      } catch (e) {
        break;
      }
    }
  }
  if (path) {
    for (var y = 0; y < path.length; y++) {
      var target = path[y];
      if (dynamicListeners[type] && dynamicListeners[type]["#" + target.id]) {
        dynamicListeners[type]["#" + target.id].call(e, target);
        return;
      } else {
        if (target.classList == undefined) return;
        for (var i = 0; i < target.classList.length; i++) {
          if (
            dynamicListeners[type] &&
            dynamicListeners[type]["." + target.classList[i]]
          ) {
            dynamicListeners[type]["." + target.classList[i]].call(e, target);
            return;
          }
        }
      }
    }
  }
}

function addListener(type, element, callback) {
  if (dynamicListeners[type] == undefined) dynamicListeners[type] = {};
  dynamicListeners[type][element] = callback;
}

function removeListener(type, element) {
  delete dynamicListeners[type][element];
}

function toast(msg, _class) {
  switch (msg) {
    case "other_list_pass":
      msg = "The other list has a pass, can't import the songs..";
      break;
    case "suggested_rules":
      msg = "Your rules have been suggested";
      break;
    case "rules_denied":
      msg = "Your rules will be denied";
      break;
    case "nolist":
      msg = "There is no list with that name";
      break;
    case "suggested_thumbnail":
      if (embed) return;
      msg = "The thumbnail has been suggested!";
      break;
    case "faulty_start_end":
      if (embed) return;
      msg = "You tried to send a faulty start/end value. Try again..";
      break;
    case "wait_longer":
      if (embed) return;
      msg = Helper.rnd([
        "Have you tried to wait longer between commands?!",
        "Looks like you're clicking that button too much..",
        "You need to wait longer between clicks.."
      ]);
      break;
    case "suggested_description":
      if (embed) return;
      msg = "The description has been suggested!";
      break;
    case "thumbnail_denied":
      if (embed) return;
      msg = "The thumbnail is not an url..";
      break;
    case "description_denied":
      if (embed) return;
      msg = "The description will be denied";
      break;
    case "addedsong":
      if (embed) return;
      msg = Helper.rnd([
        "I added your song",
        "Your song has been added",
        "Yay, more songs!",
        "Thats a cool song!",
        "I added that song for you",
        "I see you like adding songs..."
      ]);
      break;
    case "addedplaylist":
      if (embed) return;
      if (Search.submitYouTubeError) {
        M.toast({
          html:
            "Added most of your playlist, but something was wrong. Check the playlist..",
          displayLength: 4000,
          classes: "red lighten connect_error"
        });
        Search.submitYouTubeError = false;
        return;
      }
      msg = Helper.rnd([
        "I added the playlist",
        "Your playlist has been added",
        "Yay, many more songs!",
        "Thats a cool playlist!",
        "I added all the songs for you",
        "I see you like adding songs.."
      ]);
      document.getElementById("import").disabled = false;
      Helper.addClass("#playlist_loader", "hide");
      Helper.removeClass("#import", "hide");
      break;
    case "savedsettings":
      if (embed) return;
      msg = Helper.rnd([
        "I've saved your settings",
        "I stored all your settings",
        "Your settings have been stored in a safe place"
      ]);
      break;
    case "wrongpass":
      if (embed) return;
      msg = Helper.rnd([
        "That's not the right password!",
        "Wrong! Better luck next time...",
        "You seem to have mistyped the password",
        "Incorrect. Have you tried meditating?",
        "Nope, wrong password!",
        "Wrong password. The authorities have been notified."
      ]);
      //Crypt.remove_pass(chan.toLowerCase());
      Admin.display_logged_out();
      Helper.css("#thumbnail_form", "display", "none");
      Helper.css("#description_form", "display", "none");
      w_p = true;
      break;
    case "deleted_songs":
      if (embed) return;
      msg = "All songs in the channel has been deleted!";
      break;
    case "shuffled":
      if (embed) return;
      msg = Helper.rnd([
        "♫ You stir me right round, baby. ♫",
        "♫ Stir, stir, stir my boat ♫",
        "I vigorously stirred your playlist!",
        "I hope you like your list stirred, not shaken.",
        "I shuffled your playlist with the cosmic background radiation as a seed. Enjoy.",
        "100% randomized, for your listening pleasure!",
        "I hope you enjoy your fresh playlist!"
      ]);
      break;
    case "deletesong":
      if (embed) return;
      msg = Helper.rnd([
        "Your song is now in a better place...",
        "You won't be seeing any more of that video...",
        "EXTERMINATE! EXTERMINATE! EXTERMINATE!",
        "I killed it with fire",
        "Thanks for deleting that song. I didn't like it anyways...",
        "Removed song securely."
      ]);
      break;
    case "voted":
      msg = Helper.rnd([
        "You voted!",
        "You vote like a boss",
        "Voting is the key to democracy",
        "May you get your song to the very top!",
        "I love that song! I vouch for you.",
        "Only you vote that good",
        "I like the way you vote...",
        "Up the video goes!",
        "Voted Zoff for president",
        "Only 999 more to go!"
      ]);
      break;
    case "alreadyvoted":
      msg = Helper.rnd([
        "You can't vote twice on that song!",
        "I see you have voted on that song before",
        "One vote per person!",
        "I know you want to hear your song, but have patience!",
        "I'm sorry, but I can't let you vote twice, Dave."
      ]);
      break;
    case "skip":
      if (embed) return;
      msg = Helper.rnd([
        "The song was skipped",
        "I have skipped a song",
        "Skipped to the beat",
        "Skipmaster3000",
        "They see me skippin', they hatin'"
      ]);
      break;
    case "listhaspass":
      if (embed) return;
      if (!tried_again && lastCommand != undefined && lastCommand.length > 0) {
        if (Crypt.get_pass() != undefined) {
          tried_again = true;
          if (lastCommand.length == 1) {
            socket.emit(lastCommand[0]);
          } else if (lastCommand.length == 2) {
            socket.emit(lastCommand[0], lastCommand[1]);
          }
          lastCommand = [];
          return;
        }
      }
      document.getElementById("import_spotify").disabled = false;
      document.getElementById("import").disabled = false;
      tried_again = false;
      msg = Helper.rnd([
        "I'm sorry, but you have to be an admin to do that!",
        "Only admins can do that",
        "You're not allowed to do that, try logging in!",
        "I can't let you do that",
        "Please log in to do that"
      ]);
      //Crypt.remove_pass(chan.toLowerCase());
      Admin.display_logged_out();
      Helper.css("#thumbnail_form", "display", "none");
      Helper.css("#description_form", "display", "none");
      w_p = true;
      Helper.addClass("#playlist_loader", "hide");
      Helper.addClass("#playlist_loader_spotify", "hide");
      Helper.removeClass("#import_spotify", "hide");
      Helper.removeClass("#import", "hide");
      break;
    case "noskip":
      if (embed) return;
      if (!tried_again && lastCommand != undefined && lastCommand.length > 0) {
        if (Crypt.get_pass() != undefined) {
          tried_again = true;
          if (lastCommand.length == 1) {
            socket.emit(lastCommand[0]);
          } else if (lastCommand.length == 2) {
            socket.emit(lastCommand[0], lastCommand[1]);
          }
          lastCommand = [];
          return;
        }
      }
      tried_again = false;
      msg = Helper.rnd([
        "Only Admins can skip songs, peasant!",
        "You have to log in to skip songs on this channel",
        "Try clicking the settings icon and logging in before you skip"
      ]);
      break;
    case "alreadyskip":
      if (embed) return;
      msg = Helper.rnd([
        "Skipping is democratic, only one vote per person!",
        "More people have to vote to skip, not just you!",
        "Get someone else to skip too! You can't do it on yourself."
      ]);
      break;
    case "notyetskip":
      if (embed) return;
      msg = "Skipping is disabled the first 10 seconds.";
      break;
    case "correctpass":
      if (embed) return;
      tried_again = false;
      adminpass =
        Crypt.get_pass(chan.toLowerCase()) == undefined
          ? Crypt.tmp_pass
          : Crypt.get_pass(chan.toLowerCase());
      msg =
        "Correct password. You now have access to the sacred realm of The Admin.";
      Helper.css("#thumbnail_form", "display", "inline-block");
      Helper.css("#description_form", "display", "inline-block");
      break;
    case "changedpass":
      if (embed) return;
      msg = "Your password has been changed!";
      break;
    case "suggested":
      if (embed) return;
      msg = "Your song was suggested!";
      break;
    case "alreadyplay":
      if (embed) return;
      msg =
        "Seems the song you want is already playing. No fooling the system!";
      break;
  }
  before_toast();
  var classes = _class == undefined ? "" : _class;
  M.toast({ html: msg, displayLength: 4000, classes: classes });
}

function emit() {
  if (!embed) {
    lastCommand = [];
    for (var i = 0; i < arguments.length; i++) {
      lastCommand.push(arguments[i]);
    }
  }
  if (arguments.length == 1) {
    socket.emit(arguments[0]);
  } else {
    socket.emit(arguments[0], arguments[1]);
  }
}

function before_toast() {
  M.Toast.dismissAll();
}

function addJoinBox() {
  document
    .querySelector("#video-container")
    .insertAdjacentHTML(
      "beforeend",
      '<a href="https://zoff.me" target="_blank"><div class="addedJoinBox">Listen directly on https://zoff.me</div></a>'
    );
}

function scrollChat() {
  var current = document
    .querySelector(".chatTabs .active")
    .getAttribute("href");
  if (current == "#channelchat") {
    document.querySelector("#chatchannel").scrollTop = document.querySelector(
      "#chatchannel"
    ).scrollHeight;
  } else if (current == "#all_chat") {
    document.querySelector("#chatall").scrollTop = document.querySelector(
      "#chatall"
    ).scrollHeight;
  }
}

function hideAllExtra() {
  document.querySelector(".settings-collapsible").children[0].style.display =
    "none";
  document.querySelector(".settings-collapsible").children[2].style.display =
    "none";
  document.querySelector(".settings-collapsible").children[3].style.display =
    "none";
  document.querySelector(".settings-collapsible").children[4].style.display =
    "none";
  document.querySelector(".settings-collapsible").children[5].style.display =
    "none";
  document.querySelector(".settings-collapsible").children[6].style.display =
    "none";
  document.querySelector(".settings-collapsible").children[7].style.display =
    "none";
}

function searchTimeout(event) {
  search_input = document.getElementsByClassName("search_input")[0].value;

  code = event.keyCode || event.which;

  if (
    code != 40 &&
    code != 38 &&
    code != 13 &&
    code != 39 &&
    code != 37 &&
    code != 17 &&
    code != 16 &&
    code != 225 &&
    code != 18 &&
    code != 27
  ) {
    clearTimeout(timeout_search);
    /*if(search_input.length < 3){
        Helper.css(".results-tabs", "display", "none");
        document.querySelector("#results").innerHTML = "";
        document.querySelector("#results_soundcloud").innerHTML = "";
        Helper.css("")
        if(search_input.length == 0) {
        document.querySelector("body").setAttribute("style", "overflow-y: auto");
    }
}*/
    if (code == 13) {
      Search.search(search_input);
      Search.soundcloudSearch(search_input);
    } else {
      timeout_search = setTimeout(function() {
        Search.search(search_input);
        Search.soundcloudSearch(search_input);
      }, 1000);
    }
  }
}
