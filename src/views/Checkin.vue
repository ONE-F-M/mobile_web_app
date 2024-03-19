<script type="module">

import { getCurrentInstance } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import VideoJSRecord from '@/components/VideoJSRecord.vue'

export default {
    'name': 'Checkin',
    data(){
        return {
          employee_data: {},
          enrolled: 0,
          csrf_token: '',
          page: document,
          recordTimer: 0,
          shift: {
            site_name: ''
          }
        }
    },
    mounted(){
      //   clear loader
      let me = this;
      me.is_logged_in();
      me.loader.end();
      me.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      me.url = JSON.parse(localStorage.frappeUser).url;
      me.csrf_token = me.generate_hash(56);
      me.initialize()
    },
    components: {
      Header,
      Footer,
      VideoJSRecord
    },
    methods:{
        async initialize(){
            let me = this;
            let preview = document.getElementById("preview");
            let enroll_preview = document.getElementById("enroll_preview");
            let startButton = document.getElementById("startButton");
            let endButton = document.getElementById("endButton");
            let hourlyButton = document.getElementById("hourlyButton");
            let locationButton = document.getElementById("locationButton");
            let errorButton = document.getElementById("errorButton");
            let enrollButton = document.getElementById("enrollButton");
            me.page = document;

            // Check enrollment
            me.frappe.customApiCall(`api/resource/Employee?filters=[["name","=","${me.employee_data.name}"]]&fields="*"`,
                {}, 'GET').then(res=>{
                if (res.data){
                    let {image, employee_name, company, department, designation, enrolled} = res.data[0];
                    if(!image){
                        image = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png";
                    } else {
                        image = this.url+image
                    }
                    
                    let card = `
                    <div class="col-md-12 col-xs-12 px-2 py-2 employee-card employee-details" style="text-align:center">
                        <div class="d-flex flex-row justify-content-around align-items-center">
                            <img src="${image}" alt="Profile" style="width:125px" height="125px">
                            <div class="title text-dark">${employee_name}</div>
                        </div>
                        <span id="__site_name__"></span>
                    </div>`;
                    $('#profile-card .employee-details').remove();
                    $('#profile-card').prepend(card);
                    document.enrolled = enrolled;
                    // start verification/enrollment
                    me.get_location(me.page, this.prepare);
                    locationButton.addEventListener("click", function() {
                        me.get_location(me.page, this.prepare);
                    }, false);
                    
                }
            })

            

            errorButton.addEventListener("click", function() {
                $('#profile-card').hide();
                me.make_support_issue();
            }, false);	
            
            hourlyButton.addEventListener("click", function() {
                $('#profile-card').hide();
                me.send_log('IN', 1)
            }, false);		

        },
        ready_checkin(res){
            let me = this;
            $('#profile-card').show();
            if (me.page.enrolled){
                this.recordTimer = 5;
                $('#enrollSection').hide();
                if(me.res.data.log_type=='OUT'){
                    $('#endButton').show();
                    // $('#hourlyButton').show();
                    $('#enrollButton').hide();
                    $('#startButton').hide();
                    endButton.addEventListener("click", function() {
                        $('#profile-card').hide();
                        $('.verification').show();
                        $('.vjs-record.vjs-device-button.vjs-control.vjs-icon-video-perm').click();
                        me.countdown();
                    }, false);
                }
                else{
                    $('#endButton').hide();
                    // $('#hourlyButton').show();
                    $('#enrollButton').hide();
                    $('#startButton').show();
                    // enable record
                    startButton.addEventListener("click", function() {
                        $('#profile-card').hide();
                        $('.verification').show();
                        $('.vjs-record.vjs-device-button.vjs-control.vjs-icon-video-perm').click();
                        me.countdown();
                    }, false);
                }
            } else {
                this.recordTimer = 13;
                $('#enrollButton').show()
                document.querySelector('#enrollButton').addEventListener("click", function() {
                    $('#profile-card').hide();
                    $('#enrollButton').hide();
                    $('.verification').show();
                    $('.vjs-record.vjs-device-button.vjs-control.vjs-icon-video-perm').click();
                    me.show_cues();
                }, false);
            }
        },
        prepare(res){
            let me = this;
            // show buttons
            $('#button-controls').show();
            // add shift assignment to screen
            let start_time = new Date(me.shift.start_datetime).toLocaleString('en-in');
            let end_time = new Date(me.shift.end_datetime).toLocaleString('en-in');

            document.querySelector('#__site_name__').innerHTML = `
                <table class="table table-sm table-striped">
                        <tbody>
                        <tr>
                            <td class="text-dark bg-white">Site:</td>
                            <td class="px-0 text-dark bg-white text-center">${me.shift.site}</td>
                        </tr>    
                        <tr>
                            <td class="text-dark bg-white">Shift: </td>
                            <td class="px-0 text-dark bg-white text-center"> ${me.shift.shift}</td>
                        </tr>    
                        <tr>
                            <td class="text-dark bg-white">Start: </td>
                            <td class="px-0 text-dark bg-white text-center"><i class="text-success">${start_time}</i></td>
                        </tr>    
                        <tr>
                            <td class="text-dark bg-white">End: </td>
                            <td class="px-0 text-dark bg-white text-center"><i class="text-danger">${end_time}</i></td>
                        </tr>    
                        </tbody>
                    </table>    
                `;
            // show map
            me.load_gmap(me.res.data);
            $('#sync-location').hide();
            me.ready_checkin(me.res);

        },

        get_location(page, execute_func){
            let me = this;
            if (navigator.geolocation) {
                window.markers = [];
                window.circles = [];
                // JS API is loaded and available
                navigator.geolocation.getCurrentPosition(
                    position => {
                        page.position = position;

                        // check for get_site_lication before checkin
                        me.frappe.customApiCall(`api/method/one_fm.api.v1.face_recognition.get_site_location`,
                            {employee_id:me.employee_data.employee_id, latitude:position.coords.latitude,
                            longitude:position.coords.longitude}, 'POST').then(res=>{
                                if(res.status_code==200){
                                    if (res.data.user_within_geofence_radius){
                                        me.res = res;
                                        me.shift = res.data.shift;
                                        
                                        execute_func();
                                    } else {
                                        me.notify.error('Oops', 'You are outside the site location. Please try again')
                                    }
                                } else {
                                    me.notify.error('Oops', res.error)
                                }
                        })
                        // end check location
                    },
                    error => {
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                me.notify.html('Geolocation',`
                                    <b>Please enable location permissions to proceed further.</b>
                                    1. <b>Firefox</b>:
                                    <br> Tools > Page Info > Permissions > Access Your Location. Select Always Ask.<br>
                                    2. <b>Chrome</b>: 
                                    <br> Hamburger Menu > Settings > Show advanced settings.<br> 
                                        In the Privacy section, click Content Settings. <br>
                                        In the resulting dialog, find the Location section and select Ask when a site tries to... .<br>
                                        Finally, click Manage Exceptions and remove the permissions you granted to the sites you are interested in.<br><br>
                                    <b>After enabling, click on the <i>Get Location</i> button</b> or <b>Reload</b>.`);
                                break;
                            case error.POSITION_UNAVAILABLE:
                                me.notify.error('Geolocation',"Location information is unavailable.");
                                break;
                            case error.TIMEOUT:
                                me.notify.error('Geolocation',"The request to get user location timed out.");
                                break;
                            case error.UNKNOWN_ERROR:
                                me.notify.error('Error',"An unknown error occurred.");
                                break;
                        }
                    }
                );
            } else { 
                me.notify.error('Geolocation',"Geolocation is not supported by this browser.");
            }
        },
        process_video(videoBlob){
            let me = this;
            if (me.page.enrolled){
                // Get current location again and then resume the checkin/out process
                me.get_location(me.page, () => me.upload_file(videoBlob, "verify", me.res.data.log_type, 0))
            } else {
                me.upload_file(videoBlob, "enroll", me.res.data.log_type, 0)
            }
            
        },
        load_gmap(position){
            let me = this;
            let {latitude, longitude, geofence_radius} = position;
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: {lat: latitude, lng: longitude},
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true
            });

            // Set user's current location on the map
            let userLat = me.page.position.coords.latitude;
            let userLng = me.page.position.coords.longitude;
            const svgMarker = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: "blue",
                fillOpacity: 0.6,
                strokeWeight: 0,
                rotation: 0,
                scale: 5,
            };
            let marker = new google.maps.Marker({
                map: map,
                title: "Your location",
                icon: svgMarker,
                position: new google.maps.LatLng(userLat, userLng)
            });

            let locationMarker = new google.maps.Circle({
                map: map,
                animation: google.maps.Animation.DROP,
                fillColor: "red",
                center: {lat: latitude, lng: longitude},
                radius: geofence_radius
            });
            markers.push(locationMarker);

            me.addYourLocationButton(map, locationMarker);
        },
        addYourLocationButton(map, marker){
            let me = this;
            var controlDiv = document.createElement('div');

            var firstChild = document.createElement('button');
            firstChild.style.backgroundColor = '#fff';
            firstChild.style.border = 'none';
            firstChild.style.outline = 'none';
            firstChild.style.width = '40px';
            firstChild.style.height = '40px';
            firstChild.style.borderRadius = '2px';
            firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
            firstChild.style.cursor = 'pointer';
            firstChild.style.marginRight = '10px';
            firstChild.style.padding = '0';
            firstChild.title = 'Click to get your location.';
            controlDiv.appendChild(firstChild);

            var secondChild = document.createElement('div');
            secondChild.style.margin = 'auto';
            secondChild.style.width = '19px';
            secondChild.style.height = '19px';
            secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
            secondChild.style.backgroundSize = '180px 18px';
            secondChild.style.backgroundPosition = '0 0';
            secondChild.style.backgroundRepeat = 'no-repeat';
            firstChild.appendChild(secondChild);

            google.maps.event.addListener(map, 'center_changed', function () {
                secondChild.style['background-position'] = '0 0';
            });

            firstChild.addEventListener('click', function () {
                var imgX = '0',
                    animationInterval = setInterval(function () {
                        imgX = imgX === '-18' ? '0' : '-18';
                        secondChild.style['background-position'] = imgX+'px 0';
                    }, 500);

                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            me.page.position = position;
                            let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            map.setCenter(latlng);
                            clearInterval(animationInterval);
                            secondChild.style['background-position'] = '-144px 0';
                        },
                        error => {
                            switch(error.code) {
                                case error.PERMISSION_DENIED:
                                    me.notify.html('Geolocation',`
                                        <b>Please enable location permissions to proceed further.</b>
                                        1. <b>Firefox</b>:
                                        <br> Tools > Page Info > Permissions > Access Your Location. Select Always Ask.<br>
                                        2. <b>Chrome</b>: 
                                        <br> Hamburger Menu > Settings > Show advanced settings.<br> 
                                            In the Privacy section, click Content Settings. <br>
                                            In the resulting dialog, find the Location section and select Ask when a site tries to... .<br>
                                            Finally, click Manage Exceptions and remove the permissions you granted to the sites you are interested in.<br><br>
                                        <b>After enabling, click on the <i>Get Location</i> button</b> or <b>Reload</b>.`);
                                    break;
                                case error.POSITION_UNAVAILABLE:
                                    me.notify.error('Geolocation',"Location information is unavailable.");
                                    break;
                                case error.TIMEOUT:
                                    me.notify.error('Geolocation',"The request to get user location timed out.");
                                    break;
                                case error.UNKNOWN_ERROR:
                                    me.notify.error('Geolocation',"An unknown error occurred.");
                                    break;
                            }
                        }
                    );
                } else {
                    clearInterval(animationInterval);
                    secondChild.style['background-position'] = '0 0';
                }
            });

            controlDiv.index = 1;
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
        },
        send_log(log_type, skip_attendance){
            let me = this;
            $('.verification').show();
            $('.enrollment').hide();
            me.countdown();		
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 360 },
                    frameRate: {ideal: 5, max: 10},
                    facingMode: 'user'
                },
                audio: false
            })
            .then((stream) => {			
                window.localStream = stream;
                me.stream = window.localStream;
                preview.srcObject = stream;
                preview.captureStream = preview.captureStream || preview.mozCaptureStream;
                return new Promise(resolve => preview.onplaying = resolve);
            })
            .then(() => {
                let recorder = new MediaRecorder(preview.captureStream());

                setTimeout(function(){ 
                    $('#cover-spin').show(0);
                    recorder.stop(); 
                    stop(preview);
                }, 5000);
                let data = [];

                recorder.ondataavailable = event => data.push(event.data);
                recorder.start();

                let stopped = new Promise((resolve, reject) => {
                    recorder.onstop = resolve;
                    recorder.onerror = event => reject(event.name);
                });

                return Promise.all([ stopped ]).then(() => data);
            })
            .then ((recordedChunks) => {
                let recordedBlob = new Blob(recordedChunks, {
                    type: "video/mp4",
                });
                
                me.upload_file(recordedBlob, 'verify', log_type, skip_attendance);
            })
        },
        upload_file(file, method, log_type, skip_attendance){
            $('#cover-spin').show();
            let me = this;
            let method_map = {
                'enroll': me.frappe.url+'/api/method/one_fm.api.v1.web.enroll',
                'verify': me.frappe.url+'/api/method/one_fm.api.v1.web.verify'
            }
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", method_map[method], true);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("X-Frappe-CSRF-Token", me.csrf_token);
                xhr.setRequestHeader("Authorization", JSON.parse(localStorage.frappeUser).token);

                let form_data = new FormData();
                form_data.append("file", file, me.employee_data.user_id+".mp4");
                form_data.append("employee_id", me.employee_data.employee_id);
                if(method == 'verify'){
                    // let {timestamp} = cur_page.page.page.position;
                    let {latitude, longitude} = me.page.position.coords;
                    form_data.append("latitude", latitude);
                    form_data.append("longitude", longitude);
                    // form_data.append("timestamp", timestamp);
                    form_data.append("log_type", log_type);
                    form_data.append("skip_attendance", skip_attendance);
                } 

                xhr.onreadystatechange = () => {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        $('#cover-spin').hide();
                        if ([200, 201].includes(xhr.status)) {
                        let r = null;
                        try {
                            r = JSON.parse(xhr.responseText);
                            console.log(r);
                            me.notify.success("Successful", r.data);
                            // if(method=="verify"){}
                            $('.verification').hide();  
                            // me.initialize()
                            me.$router.push('/checkin');
                            setTimeout(()=>{
                               window.location.href='/checkin' 
                            }, 10000)
                        } catch (e) {
                            r = xhr.responseText;
                        }
                    } else if (xhr.status === 403) {
                        $('#cover-spin').hide();
                        let response = JSON.parse(xhr.responseText);
                        me.notify.error("Not permitted", response._error_message)
                    } else if (xhr.status === 500) {
                        $('#cover-spin').hide();
                        console.log(xhr)
                        let response = JSON.parse(xhr.responseText);
                        me.notify.error("Error", response._error_message)
                    } else {
                        $('#cover-spin').hide();
                        let error = null;
                        try {
                            error = JSON.parse(xhr.responseText);
                            console.log(error)
                        } catch (e) {
                        // pass
                        }
                    }
                    }
                };
                xhr.send(form_data);
            });
        },
        sendVideoToAPI (blob) {
            let me = this;
            let file = new File([blob], 'recording');

            const reader = new FileReader();
            reader.addEventListener('loadend', () => {
                console.log(reader);
            // reader.result contains the contents of blob as a typed array
            });
            reader.readAsArrayBuffer(blob);
            const fileurl = URL.createObjectURL(blob);
            let form = new FormData();
            form.append('video', file);
            
            me.frappe.customApiCall(`api/method/one_fm.api.v2.web.upload_image`,
            {file: fileurl}, 'POST').then(res=>{
                if (!res.exc) {
                    // code snippet
                }
            })
            
        },
        countdown(){
            let timeleft = 5;
            let downloadTimer = setInterval(function(){
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                $("#countdown").empty();
            } else {
                $("#countdown").empty().append(`<div class="alert alert-info"><span class="cues">Blink your eyes. <span class="countdown">${timeleft}</span><span></div>`);
            }
            timeleft -= 1;
            }, 1000);
        },
        stop(videoEl){
            localStream.getTracks().forEach( (track) => {
                track.stop();	
            });
            // stop only video
            localStream.getVideoTracks()[0].stop();
            videoEl.srcObject = null;
        },
        show_cues(){
            let timeleft = 13;
            let downloadTimer = setInterval(function(){
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                $("#cues").empty()
            } else if(timeleft > 10) {
                $("#cues").empty().append(`<div class="alert alert-info"> <span class="cues"> ${'Look Straight at the camera.'} <span class="countdown">${timeleft - 10}</span><span></div>`);
            } else if(timeleft <= 10 && timeleft > 5) {
                $("#cues").empty().append(`<div class="alert alert-info"><i class="fa fa-arrow-left fa-icon"></i> <span class="cues"> ${'Turn your face left slowly and return to straight position.'} <span class="countdown">${timeleft - 5}</span></span></div>`);
            } else if(timeleft <= 5) {
                $("#cues").empty().append(`<div class="alert alert-info"><i class="fa fa-arrow-right fa-icon"></i> <span class="cues"> ${'Turn your face right slowly and return to straight position.'} <span class="countdown">${timeleft}</span></span></div>`);
            } 
            timeleft -= 1;
            }, 1000);	
        },
        make_support_issue(){
            let me = this;
            let user = me.employee_data.user_id;
            let {latitude, longitude} = me.page.position.coords;
            let loc = `${latitude},${longitude}`;
            me.frappe.customApiCall(`api/method/one_fm.api.doc_methods.notification_log.make_support_issue`,
            {user, loc}, 'POST').then(res=>{
                console.log(res)
            })
            me.notify.error("Please inform your in-line supervisor in person or via direct call about the issue and confirm attendance/exit.")
        }
        // end
    }
}
</script>

<template>
  <!-- Header Start -->
  <Header />
  <!-- Header End -->

  <!-- Body Start -->
      <!-- App Capsule -->
    <div id="appCapsule">

        <div class="section mt-2">
            <div class="card">
                <div id="page-wrap-content">
                    <div class="page-wrap">
                        <div id="cover-spin"></div>

                        <div class="col-md-3 col-xs-12" id="profile-card">
                            <div id="sync-location">
                                <div class="row">
                                    <div class="col-xs-12">
                                        <button class="btn btn-sm btn-primary btn-start" id="locationButton">
                                            Get Location
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div id="button-controls">
                                <div class="row"  id="enrollSection">
                                    <div class="col-xs-12 alert alert-danger">
                                        Please remove your spectacles. Follow the instructions here after clicking Enroll button.
                                    </div>
                                    <div class="col-xs-12">
                                        <button class="btn btn-sm btn-start" id="enrollButton"
                                            style="background-color: green;">
                                            Start Enrollment
                                        </button>
                                    </div>
                                </div>
                                <div class="row start">
                                    <div class="col-xs-12">
                                        <button class="btn btn-sm btn-success btn-start" id="startButton">
                                            Check In
                                        </button>
                                    </div>
                                </div>
                                <div class="row end">
                                    <div class="col-xs-12">
                                        <button class="btn btn-sm btn-danger btn-start" id="endButton">
                                            Check Out
                                        </button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <button class="btn btn-sm btn-warning btn-start" id="hourlyButton">
                                            Hourly Check In
                                        </button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <button class="btn btn-sm btn-primary btn-start" id="errorButton">
                                            Not Working? Click here.
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-9 col-xs-12 verification" style="display:none">
                            <div style="text-align:center">
                                <div id="countdown"></div>
                                <div id="cues"></div>
                                <VideoJSRecord @get-video="process_video" :recordTimer="recordTimer"
                                v-if="recordTimer>0"/>
                            </div>
                        </div>
                        <div class="col-md-9 col-xs-12">
                            <div id="map" style="height:300px"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
<!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>


<style>
/*--------------------------------------------------*/
/*---------------------SPINNER----------------------*/
#myVideo {
  background-color: #95DDF5;
}

#cover-spin {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.952);
  z-index: 9999;
  display: none;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

#cover-spin::after {
  content: "";
  display: grid;
  place-items: center;
  position: absolute;
  left: 48%;
  top: 40%;
  width: 40px;
  height: 40px;
  border-style: solid;
  border-color: #a4a7aa;
  border-top-color: transparent;
  border-width: 4px;
  border-radius: 50%;
  -webkit-animation: spin 0.8s linear infinite;
  animation: spin 0.8s linear infinite;
}
/*--------------------------------------------------*/
/*--------------------------------------------------*/
.button1 {
  border-radius: 0px;
  background-color: #1a1a1a;
  color: white;
}
.button1:hover {
  border-radius: 0px;
  background-color: #a3a7aa;
  color: white;
}
/*---------------------------------------------------*/
/* .card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  max-width: 300px;
  margin: auto;
  text-align: center;
} */

.employee-details .title {
    color: grey;
    font-size: 18px;
}

.btn-start {
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  display: block;
  margin: 5px auto;
}

/* a {
  text-decoration: none;
  /* font-size: 22px; */
/* color: black;
} */

button:hover,
a:hover {
  opacity: 0.7;
}
div#countdown {
  font-size: 18px;
  /* color: red; */
  text-transform: uppercase;
}
.verification,
.enrollment {
  padding-top: 10px;
}

video {
  max-width: 100%;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}

.cues {
  font-size: 16px;
}
.countdown {
  color: red;
  border: 1px solid;
  padding: 0 5px;
  border-radius: 4px;
}
.fa-icon {
  font-size: 24px;
  font-weight: 600;
}

@media (max-width: 991px) {
  #profile-card .card {
    display: none;
    text-align: center;
  }
}

#button-controls {
  display: none;
}

#startButton,
#endButton,
#enrollButton,
#hourlyButton {
  display: none;
}

#__site_name__ .table {
    line-height: 1em;
    margin-top: 8px;
}
</style>