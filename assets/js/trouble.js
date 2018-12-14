

if(!AgoraRTC.checkSystemRequirements()) {
    alert("Your browser does not support WebRTC!");
  }
  
  /* select Log type */
   AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.NONE);
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.WARNING);
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.INFO);  
  // AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.DEBUG);
  
  /* simulated data to proof setLogLevel() */
  AgoraRTC.Logger.error('this is error');
  AgoraRTC.Logger.warning('this is warning');
  AgoraRTC.Logger.info('this is info');
  AgoraRTC.Logger.debug('this is debug');
  
  var client, localStream, camera, microphone;
  
  var audioSelect = document.querySelector('select#audioSource');
  var videoSelect = document.querySelector('select#videoSource');
  
  function join() {
    document.getElementById("join").disabled = true;
    document.getElementById("video").disabled = true;
    var channel_key = null;
  
    console.log("Init AgoraRTC client with App ID: " + appId.value);
    client = AgoraRTC.createClient({mode: 'interop'});
    client.init(appId.value, function () {
      console.log("AgoraRTC client initialized");
      client.join(channel_key, channel.value, null, function(uid) {
        console.log("User " + uid + " join channel successfully");
  
        if (document.getElementById("video").checked) {
          camera = videoSource.value;
          microphone = audioSource.value;
          localStream = AgoraRTC.createStream({streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: document.getElementById("video").checked, screen: false});
          //localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
          if (document.getElementById("video").checked) {
            localStream.setVideoProfile('120p'); //720p_3
  
          }
  
          // The user has granted access to the camera and mic.
          localStream.on("accessAllowed", function() {
            console.log("accessAllowed");
          });
  
          // The user has denied access to the camera and mic.
          localStream.on("accessDenied", function() {
            console.log("accessDenied");
          });
  
          localStream.init(function() {
            console.log("getUserMedia successfully");
            localStream.play('agora_local');
  
            client.publish(localStream, function (err) {
              console.log("Publish local stream error: " + err);
            });
  
            client.on('stream-published', function (evt) {
              console.log("Publish local stream successfully");
            });
          }, function (err) {
            console.log("getUserMedia failed", err);
          });
        }
      }, function(err) {
        console.log("Join channel failed", err);
      });
    }, function (err) {
      console.log("AgoraRTC client init failed", err);
    });
  
    channelKey = "";
    client.on('error', function(err) {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        client.renewChannelKey(channelKey, function(){
          console.log("Renew channel key successfully");
        }, function(err){
          console.log("Renew channel key failed: ", err);
        });
      }
    });
  
  
    client.on('stream-added', function (evt) {
      var stream = evt.stream;
      console.log("New stream added: " + stream.getId());
      console.log("Subscribe ", stream);
      client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
    });
  
    client.on('stream-subscribed', function (evt) {
      var stream = evt.stream;
      console.log("Subscribe remote stream successfully: " + stream.getId());
      if ($('div#video #agora_remote'+stream.getId()).length === 0) {
        $('div#video').append('<div id="agora_remote'+stream.getId()+'" style="float:left;width:100vh;height:100vh;display:inline-block;"></div>');
      }
      stream.play('agora_remote' + stream.getId());
    });
  
    client.on('stream-removed', function (evt) {
      var stream = evt.stream;
      stream.stop();
      $('#agora_remote' + stream.getId()).remove();
      console.log("Remote stream is removed " + stream.getId());
    });
  
    client.on('peer-leave', function (evt) {
      var stream = evt.stream;
      if (stream) {
        stream.stop();
        $('#agora_remote' + stream.getId()).remove();
        console.log(evt.uid + " leaved from this channel");
      }
    });
      client.enableAudioVolumeIndicator(); // Triggers the "volume-indicator" callback event every two seconds.
      client.on("volume-indicator", function(evt){
      evt.attr.forEach(function(volume, index){
             // console.log(#{index} UID ${volume.uid} Level ${volume.level});
                       console.log(volume.level);
                       move(volume.level);
      });
      });
      changeSong('normal');
  }
  
  function leave() {
    document.getElementById("leave").disabled = true;
    client.leave(function () {
      console.log("Leavel channel successfully");
    }, function (err) {
      console.log("Leave channel failed");
    });
  }
  data = null;
  function publish() {
    document.getElementById("publish").disabled = true;
    document.getElementById("unpublish").disabled = false;
    client.publish(localStream, function (err) {
      console.log("Publish local stream error: " + err);
    });
    console.log(client.getLocalAudioStats(data));
  }
  
  function unpublish() {
    document.getElementById("publish").disabled = false;
    document.getElementById("unpublish").disabled = true;
    client.unpublish(localStream, function (err) {
      console.log("Unpublish local stream failed" + err);
    });
     console.log(client.getLocalAudioStats(data));
  }
  
  function getDevices() {
    AgoraRTC.getDevices(function (devices) {
      for (var i = 0; i !== devices.length; ++i) {
        var device = devices[i];
        var option = document.createElement('option');
        option.value = device.deviceId;
        if (device.kind === 'audioinput') {
          option.text = device.label || 'microphone ' + (audioSelect.length + 1);
          audioSelect.appendChild(option);
        } else if (device.kind === 'videoinput') {
          option.text = device.label || 'camera ' + (videoSelect.length + 1);
          videoSelect.appendChild(option);
        } else {
          console.log('Some other kind of source/device: ', device);
        }
      }
    });
  }
  
  //audioSelect.onchange = getDevices;
  //videoSelect.onchange = getDevices;
  getDevices();
  var a1,a2,a3,a4,a5,a6,a7,a8,a9;
  var audioSelect1 = document.querySelector('.detailsUser');
  function defaulting() {
      if(typeof client == "undefined") {
        var audioSelect1 = document.querySelector('p.detailsUser');
        audioSelect1.innerHTML="Please join a stream first!";
        return;
      }
      client.getNetworkStats(callbackSet);
     // client.getSystemStats(callbackSet2,a2);
   //   client.getRemoteAudioStats(callbackSet2, a3);
   //   client.getLocalAudioStats(callbackSet2, a4);
   //   client.getRemoteVideoStats(callbackSet2, a5);
   //   client.getLocalVideoStats(callbackSet2, a6);

     // client.getTransportStats(callbackSet3, a7);
  
  
      if (typeof localStream== 'undefined') {
      //	localStream.disableAudio();
      }
    var input = {filePath:"input.mp3", loop:"true", playTime:0 };
  
    //  localStream.startAudioMixing(input, errorCallback);
  }

  function changeSong(song) {
    finalSong = song + ".mp3";//input
    var input = {filePath:finalSong, loop:"true", playTime:0 };
      localStream.stopAudioMixing();
      localStream.startAudioMixing(input, errorCallback);
  }

  $('#mySelect').on('change', function() {
    var x = document.getElementById("mySelect").value;
    if(x == "heatingup") {
      document.documentElement.style.background = "#efce2c  !important";
    }else if (x == "fast") {
      document.documentElement.style.background = "##c1365d url('https://static.tumblr.com/03fbbc566b081016810402488936fbae/pqpk3dn/MRSmlzpj3/tumblr_static_bg3.png') repeat 0 0 !important";      
    }
    changeSong(x);

  });

  function disableAudio() {
    if (typeof localStream== 'undefined') {
      	localStream.disableAudio();
      }
  }

  function forCallback(data1, data2) {
      console.log(data1);
      console.log(data2);
  }
  function forCallback2(data1) {
      console.log(data1);
      return data1;
  }
  function errorCallback(data) {
      console.log(data);
  }
  function callbackSet(data ) {
      a1 = data;
      console.log(a1.NetworkType);
      client.getSystemStats(callbackSet10);
   //   client.getTransportStats(callbackSet3, a7);
  }
  function callbackSet2(data,toSet ) {
      toSet = data;
      audioSelect1.asset = data.NetworkType;
      
      //console.log(a1.NetworkType);
  }
  function callbackSet4(data,toSet ) {
      toSet = data;
      audioSelect1.asset = data.RTT;
      client.getTransportStats(callbackSet10);
      //console.log(a1.NetworkType);
  }
  function callbackSet3(data,toSet ) {
      toSet = data;
      //console.log(a1.NetworkType);
      var audioSelect1 = document.querySelector('p.detailsUser');
      audioSelect1.innerHTML = "This type of network is " + a1.NetworkType 
     +  "| The battery level is " + a2.BatteryLevel  + "%" +  "<br>" + 
     "The microphone is " +  ((a3[Object.keys(a3)[0]].MuteState == 0)? "not":"")   + " muted | " + 
     // a3[Object.keys(a3)[0]].RecvLevel  +
     "The viewer's microphone is " +  ((a4[Object.keys(a4)[0]].MuteState == 0)? "not":"")   + " muted <br>" +  
    //  a4[Object.keys(a4)[0]].RecvLevel + 
     "There are " + a5[Object.keys(a5)[0]].RenderFrameRate + " FPS " + 
     " | There resolution is  " +  a5[Object.keys(a5)[0]].RecvResolutionHeight + "x" + a5[Object.keys(a5)[0]].RecvResolutionHeight + 
     " | There viewer has  " +  a6[Object.keys(a6)[0]].SendFrameRate + " FPS " + 
     " | There resolution is  " +  a6[Object.keys(a6)[0]].SendResolutionHeight + "x" + a6[Object.keys(a6)[0]].SendResolutionHeight;// +
      //data.RTT 	;
    ;
  }

  function callbackSet10(data ) {
    a2 = data;
    client.getRemoteAudioStats(callbackSet11);
}

function callbackSet11(data ) {
    a3 = data;
    client.getLocalAudioStats(callbackSet12);
}
function callbackSet12(data ) {
    a4 = data;
    client.getRemoteVideoStats(callbackSet13);
}
function callbackSet13(data ) {
    a5 = data;
    client.getLocalVideoStats(callbackSet14);
}
function callbackSet14(data ) {
    a6 = data;
  //  client.getTransportStats(callbackSet3, a7);
    client.getTransportStats(callbackSet3, a7);
}

