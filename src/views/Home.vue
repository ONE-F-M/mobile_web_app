<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'Home',
    data(){
        return {
          employee_data: {},
          leave_balance: {},
          attendance_list: [],
          page: document,
          shift: {
            site_name: '',
            
          },
          dashboard_details: {
            present:'',
            absent:'',
            leave:'',
            penalties:'',
            start_time: '',
            end_time:'',
          }
        }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getData() // fetch leave balance
      this.initialize()
    },
    components: {
      Header,
      Footer
    },
    methods:{
        async initialize(){
            let me = this;
            me.page = document;
            me.get_location(me.page);
        },
        async getData(){
            // Get leave data
            this.frappe.customApiCall("api/method/one_fm.api.v2.leave_application.get_leave_balance", {
            employee_id: this.employee_data.employee_id,
            leave_type: "Sick Leave"
            }, 'POST').then(res=>{
                console.log(res)
                if (res.status_code==200){
                    this.leave_balance = res.data
                } else {
                    this.notify.error('Error', res.message)
                }
            })
            // End get leave 

            // // Get attendance data
            this.frappe.customApiCall(`api/method/one_fm.api.v2.attendance.get_attendance_list`, {
            employee:this.employee_data.name
            }, 'POST').then(res=>{
                console.log(res)
            if (res.status_code==200){
                this.attendance_list = res.data;
                // this.dataBank.attendance_list = res.data;
            } else {
                this.notify.error('Error', res.message)
            }
            })
            // // end get attendance
            this.frappe.customApiCall(`api/method/one_fm.api.v2.dashboard_utils.get_employee_shift`, {
                employee_id:this.employee_data.name,
                date_type: "month"
            }, 'POST').then(res=>{
                console.log(res)
            if (res.status_code==201){
                var e_detail = res.data;
                console.log(e_detail)
                this.dashboard_details.leave = e_detail.leave_balance
                this.dashboard_details.present = e_detail.days_worked
                this.dashboard_details.penalties = e_detail.penalties
                this.dashboard_details.start_time = e_detail.shift_time_from.slice(0,5)
                this.dashboard_details.end_time = e_detail.shift_time_to.slice(0,5)

                // this.dataBank.attendance_list = res.data;
            } else {
                this.notify.error('Error', res.message)
            }
            })

        },
     
        get_location(page){
            let me = this;
            if (navigator.geolocation) {
                window.markers = [];
                window.circles = [];
                // JS API is loaded and available
                console.log("Called")
                navigator.geolocation.getCurrentPosition(
                    position => {
                        page.position = position;
                        // check for get_site_lication before checkin
                        this.frappe.customApiCall(`api/method/one_fm.api.v1.face_recognition.get_site_location`,
                            {employee_id:this.employee_data.employee_id, latitude:position.coords.latitude,
                            longitude:position.coords.longitude}, 'POST').then(res=>{
                                if(res.status_code==200){
                                    if (res.data.user_within_geofence_radius){
                                        this.shift = res.data;                                        
                                        // show buttons
                                        $('#button-controls').show();                                    
                                        // show map
                                        this.load_gmap(this.shift);
                                        $('#sync-location').hide();
                                    } else {
                                        this.notify.error('Oops', 'You are outside the site location. Please try again')
                                    }
                                } else {
                                    this.notify.error('Oops', res.error)
                                }
                        })
                        // end check location
                    },
                    error => {
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                this.notify.html('Geolocation',`
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
                                this.notify.error('Geolocation',"Location information is unavailable.");
                                break;
                            case error.TIMEOUT:
                                this.notify.error('Geolocation',"The request to get user location timed out.");
                                break;
                            case error.UNKNOWN_ERROR:
                                this.notify.error('Error',"An unknown error occurred.");
                                break;
                        }
                    }
                );
            } else { 
                this.notify.error('Geolocation',"Geolocation is not supported by this browser.");
            }
            
        },
        load_gmap(position){
            console.log(position);
            let me = this;
            let {latitude, longitude, geofence_radius} = position;
            var map = new google.maps.Map(document.getElementById('map_home'), {
                zoom: 15,
                center: {lat: latitude, lng: longitude}
            });
            let locationMarker = new google.maps.Circle({
                map: map,
                animation: google.maps.Animation.DROP,
                fillColor: "red",
                center: {lat: latitude, lng: longitude},
                radius: geofence_radius
            });
            markers.push(locationMarker);
            // this.addYourLocationButton(map, locationMarker);
        },
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

      <!-- Wallet Card -->
      <div class="section employee-card-section pt-1">
          <div class="employee-card">
              <!-- Wallet Footer -->
              <div class="employee-footer">
                  <div class="item">
                      <a href="#" data-bs-toggle="modal" data-bs-target="#withdrawActionSheet">
                          <div class="icon-wrapper bg-success">
                              <ion-icon name="arrow-down-outline"></ion-icon>
                          </div>
                          <strong>Present</strong>
                          <h1 class="total text-success">{{ dashboard_details.present }}</h1>
                      </a>
                  </div>
                  <div class="item">
                      <a href="app-cards.html">
                          <div class="icon-wrapper bg-warning">
                              <ion-icon name="card-outline"></ion-icon>
                          </div>
                          <strong>Leave</strong>
                          <h1 class="total text-warning">{{ dashboard_details.leave }}</h1>
                      </a>
                  </div>
                  <div class="item">
                      <a href="#" data-bs-toggle="modal" data-bs-target="#exchangeActionSheet">
                          <div class="icon-wrapper bg-danger">
                              <ion-icon name="swap-vertical"></ion-icon>
                          </div>
                          <strong>Penalty</strong>
                          <h1 class="total text-danger">{{ dashboard_details.penalties }}</h1>
                      </a>
                  </div>
              </div>
              <!-- * Wallet Footer -->
          </div>
      </div>
      <!-- Wallet Card -->

      <!-- Deposit Action Sheet -->
      <!-- <div class="modal fade action-sheet" id="depositActionSheet" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Add Balance</h5>
                  </div>
                  <div class="modal-body">
                      <div class="action-sheet-content">
                          <form>
                              <div class="form-group basic">
                                  <div class="input-wrapper">
                                      <label class="label" for="account1">From</label>
                                      <select class="form-control custom-select" id="account1">
                                          <option value="0">Savings (*** 5019)</option>
                                          <option value="1">Investment (*** 6212)</option>
                                          <option value="2">Mortgage (*** 5021)</option>
                                      </select>
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <label class="label">Enter Amount</label>
                                  <div class="input-group mb-2">
                                      <span class="input-group-text" id="basic-addona1">$</span>
                                      <input type="text" class="form-control" placeholder="Enter an amount"
                                          value="100">
                                  </div>
                              </div>


                              <div class="form-group basic">
                                  <button type="button" class="btn btn-primary btn-block btn-lg"
                                      data-bs-dismiss="modal">Deposit</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div> -->
      <!-- * Deposit Action Sheet -->

      <!-- Withdraw Action Sheet -->
      <!-- <div class="modal fade action-sheet" id="withdrawActionSheet" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Withdraw Money</h5>
                  </div>
                  <div class="modal-body">
                      <div class="action-sheet-content">
                          <form>
                              <div class="form-group basic">
                                  <div class="input-wrapper">
                                      <label class="label" for="account2d">From</label>
                                      <select class="form-control custom-select" id="account2d">
                                          <option value="0">Savings (*** 5019)</option>
                                          <option value="1">Investment (*** 6212)</option>
                                          <option value="2">Mortgage (*** 5021)</option>
                                      </select>
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <div class="input-wrapper">
                                      <label class="label" for="text11d">To</label>
                                      <input type="email" class="form-control" id="text11d" placeholder="Enter IBAN">
                                      <i class="clear-input">
                                          <ion-icon name="close-circle"></ion-icon>
                                      </i>
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <label class="label">Enter Amount</label>
                                  <div class="input-group mb-2">
                                      <span class="input-group-text" id="basic-addonb1">$</span>
                                      <input type="text" class="form-control" placeholder="Enter an amount"
                                          value="100">
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <button type="button" class="btn btn-primary btn-block btn-lg"
                                      data-bs-dismiss="modal">Withdraw</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div> -->
      <!-- * Withdraw Action Sheet -->

      <!-- Send Action Sheet -->
      <!-- <div class="modal fade action-sheet" id="sendActionSheet" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Send Money</h5>
                  </div>
                  <div class="modal-body">
                      <div class="action-sheet-content">
                          <form>
                              <div class="form-group basic">
                                  <div class="input-wrapper">
                                      <label class="label" for="account2">From</label>
                                      <select class="form-control custom-select" id="account2">
                                          <option value="0">Savings (*** 5019)</option>
                                          <option value="1">Investment (*** 6212)</option>
                                          <option value="2">Mortgage (*** 5021)</option>
                                      </select>
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <div class="input-wrapper">
                                      <label class="label" for="text11">To</label>
                                      <input type="email" class="form-control" id="text11"
                                          placeholder="Enter bank ID">
                                      <i class="clear-input">
                                          <ion-icon name="close-circle"></ion-icon>
                                      </i>
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <label class="label">Enter Amount</label>
                                  <div class="input-group mb-2">
                                      <span class="input-group-text" id="basic-addon1">$</span>
                                      <input type="text" class="form-control" placeholder="Enter an amount"
                                          value="100">
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <button type="button" class="btn btn-primary btn-block btn-lg"
                                      data-bs-dismiss="modal">Send</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div> -->
      <!-- * Send Action Sheet -->

      <!-- Exchange Action Sheet -->
      <!-- <div class="modal fade action-sheet" id="exchangeActionSheet" tabindex="-1" role="dialog">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Exchange Money</h5>
                  </div>
                  <div class="modal-body">
                      <div class="action-sheet-content">
                          <form>
                              <div class="row">
                                  <div class="col-6">
                                      <div class="form-group basic">
                                          <div class="input-wrapper">
                                              <label class="label" for="currency1">From</label>
                                              <select class="form-control custom-select" id="currency1">
                                                  <option value="1">EUR</option>
                                                  <option value="2">USD</option>
                                                  <option value="3">AUD</option>
                                                  <option value="4">CAD</option>
                                              </select>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="col-6">
                                      <div class="form-group basic">
                                          <div class="input-wrapper">
                                              <label class="label" for="currency2">To</label>
                                              <select class="form-control custom-select" id="currency2">
                                                  <option value="1">USD</option>
                                                  <option value="1">EUR</option>
                                                  <option value="2">AUD</option>
                                                  <option value="3">CAD</option>
                                              </select>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              <div class="form-group basic">
                                  <label class="label">Enter Amount</label>
                                  <div class="input-group mb-2">
                                      <span class="input-group-text" id="basic-addon2">$</span>
                                      <input type="text" class="form-control" placeholder="Enter an amount"
                                          value="100">
                                  </div>
                              </div>



                              <div class="form-group basic">
                                  <button type="button" class="btn btn-primary btn-block btn-lg"
                                      data-bs-dismiss="modal">Exchange</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div> -->
      <!-- * Exchange Action Sheet -->

      <!-- Stats -->
      <!-- <div class="section">
          <div class="row mt-2">
              <div class="col-6">
                  <div class="stat-box">
                      <div class="title">Leave Balance</div>
                      <div class="value text-primary">{{leave_balance.remaining_leaves}}</div>
                  </div>
              </div>
              <div class="col-6">
                  <div class="stat-box">
                      <div class="title">Days Worked</div>
                      <div class="value text-success">{{attendance_list ? attendance_list.length : 0}}</div>
                  </div>
              </div>
          </div>
      </div> -->
          <!-- <div class="row mt-2">
              <div class="col-6">
                  <div class="stat-box">
                      <div class="title">Total Bills</div>
                      <div class="value">$ 53.25</div>
                  </div>
              </div>
              <div class="col-6">
                  <div class="stat-box">
                      <div class="title">Savings</div>
                      <div class="value">$ 120.99</div>
                  </div>
              </div>
          </div> -->
      
      <div class="section">      
        <div class="shift-details-card mt-2">
            <div class="shift-time">
                <div style="margin:2px">
                    <h5>From:</h5>
                    <h3>{{dashboard_details.start_time}}</h3>
                </div>
                <div style="margin:2px">
                    <h5>To:</h5>
                    <h3>{{dashboard_details.end_time}}</h3>
                </div>
            </div>

            <div class="shift-location">
                <h5>Location</h5>
                <h3>{{shift.site_name}}</h3> 
            </div>   
            <div id="map_home" style="height:300px">
            </div>
        </div>
    </div>
      <!-- * Stats -->

      </div>
      <!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>
