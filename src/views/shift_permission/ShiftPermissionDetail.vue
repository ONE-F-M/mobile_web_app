<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {  ref } from 'vue';


export default {
    'name': 'ShiftPermissionDetail',
    computed:{
      showTime(){
        return ['Arrive Late','Leave Early'].includes(this.permission_type)
      },
      isCheckin(){
        let label = null
        this.log_type=="IN"?  label =  true : label = false
        return label
      },
      getPermission(){
        this.permission_type==''
        if(!this.log_type){
          return []
        }
        else if(this.log_type=="IN"){
          return ["Arrive Late",'Forget to Checkin','Checkin Issue']
        }
        else if(this.log_type=="OUT"){
          return ["Leave Early",'Forget to Checkout','Checkout Issue']
        }
        
      },
      
    },
    data(){
        return {
          employee:null,
          employee_id:null,
          leaving_time:null,
          employee_name:null,
          permission_type:null,
          log_type:null,
          arrival_time:null,
          reason:null,
          shift_assignment:null,
          shift_type:null,
          shift:null,
          roster_type:null,
          approver:null,
          approver_name:null,
          id:null,
          approval_action:null,
          is_new:null,
          isManager:false,
          workflow_state:null,
          date :null,
          employee_data: {},
          isReadonly:null,
          docstatus : null,
          latitude:null,
          longitude:null,
          dialogVisible:null,
          approvalVisible:null,
          isPageFrozen: false,
        }
    },
    created(){
      if(this.$route.params.id){
        this.id = this.$route.params.id
        this.getData()
      }
      else{
        this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
        this.docstatus = 0
        this.isReadonly = false
        this.employee_name= this.employee_data.employee_name
        this.employee_id = this.employee_data.name
        this.date = new Date()
        this.is_new = true
        this.getApproverDetails(this.employee_data.name)
      }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      
      
       // fetch leave balance
    },
    components: {
      Header,
      Datepicker,
      Footer
      
    },
    methods:{
      
      cancelSave(){
        this.dialogVisible = false;
        this.approvalVisible = false
      },
      freezePage() {
      this.isPageFrozen = true;
      },

    // Function to unfreeze the page
    unfreezePage() {
      this.isPageFrozen = false;
    },
      getCurrentLocation(){
            let me = this;
            if (navigator.geolocation) {
                window.markers = [];
                window.circles = [];
                
              navigator.geolocation.getCurrentPosition(
                    position => {
                        me.position = position;
                        
                        // check for get_site_lication before checkin
                        this.latitude = String(position.coords.latitude)
                        this.longitude = String(position.coords.longitude)
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
                                    `);
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
      validateFields() {
        
        this.date = new Date(this.date).toISOString().slice(0, 10);
        let fieldsToCheck = []
        this.dialogVisible = false;
        if(this.permission_type=='Arrive Late'){
           fieldsToCheck=['employee_id', 'permission_type', 'log_type', 'date', 'reason','arrival_time'];
        }
        else if(this.permission_type=='Leave Early'){
           fieldsToCheck=['employee_id', 'permission_type', 'log_type', 'date', 'reason','leaving_time'];
        }
        else{
           fieldsToCheck = ['employee_id', 'permission_type', 'log_type', 'date', 'reason'];
        }
        const emptyFields = fieldsToCheck.filter((field) => {
          let field_value = this[field]
          return this[field] === '' || !this[field] ;
        });
        if (emptyFields.length > 0) {
          let errorMessage = 'Please fill in all required fields: ' + this.formatStrings(emptyFields).join(', ');
          this.notify.error('Incomplete Form', errorMessage)
        }
        else{
            let data = {
              'employee_id':this.employee_data.employee_id,
              'permission_type':this.permission_type,
              'log_type':this.log_type,
              'date':this.date,
              'reason':this.reason
            }
            if(this.permission_type=='Arrive Late'){
              data['arrival_time'] = this.arrival_time+':00'
            }
            if(this.permission_type=='Leave Early'){
              data['leaving_time'] = this.leaving_time+':00'
            }
            if(this.permission_type=='Checkin Issue'){
              data['latitude'] = this.latitude
              data['longitude'] = this.longitude
            }
            if(this.permission_type=='Checkout Issue'){
              data['longitude'] = this.longitude
              data['latitude'] = this.latitude
            }
            this.createShiftPermission(data)
        }  
        },
      saveData(){
        this.validateFields()
      },
      approveRejectShift(){
        this.freezePage()
        if(this.approval_action=="Approve"){
          this.frappe.customApiCall("api/method/one_fm.api.v1.shift_permission.approve_shift_permission", {
            employee_id: this.employee_data.employee_id,shift_permission_id:this.$route.params.id
          }, 'POST').then(res=>{
              if (res.status_code==201){
                this.unfreezePage()
                this.$router.push({ name: 'shift_permission_list' });
                this.notify.html(`Shift Permission ${res.data.name} Approved`,
                `<b>Shift Permission Approved successfully!</b>
                `             
                )
              }
              else{
                this.unfreezePage()
                this.notify.error('Error', res.message)
              }
            })
        }
        else if(this.approval_action=="Reject"){
          this.frappe.customApiCall("api/method/one_fm.api.v1.shift_permission.reject_shift_permission", {
            employee_id: this.employee_data.employee_id,shift_permission_id:this.$route.params.id
          }, 'POST').then(res=>{
              if (res.status_code==201){
                this.unfreezePage()
                this.$router.push({ name: 'shift_permission_list' });
                this.notify.html(`Shift Permission ${res.data.name} Rejected`,
                `<b>Shift Permission Approved successfully!</b>
                `             
                )
              }
              else{
                this.unfreezePage()
                
                this.notify.error('Error', res.message)
              }
            })
        }
        
      },
      approveReject(){
        this.approvalVisible = false
        this.approveRejectShift()
      },
      showConfirmDialog(action=null) {
        
        if(action=='Save'){
          this.dialogVisible = true;
        }
        else{
          this.approval_action = action
          
          this.approvalVisible = true
        }
    },
      handlePermTypeChange(){
        
        if(['Checkin Issue','Checkout Issue'].includes(this.permission_type)){
          
          this.getCurrentLocation()
        }
      },
      handleLogTypeChange(){
        this.permission_type = ''
      },
      formatStrings(strings) {
        return strings.map((str) =>
          str
            .split(/_/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        );
      },
      async createShiftPermission(data){
        this.freezePage()
        this.frappe.customApiCall("api/method/one_fm.api.v1.shift_permission.create_shift_permission", {
            employee_id: data['employee_id'],log_type: data['log_type'],permission_type: data['permission_type'],
            date: data['date'],reason: data['reason'],leaving_time: data['leaving_time'],
            arrival_time: data['arrival_time'],latitude: data['latitude'],longitude: data['longitude']}, 'POST').then(res=>{
              if (res.status_code==201){
                this.unfreezePage()
                this.$router.push({ name: 'shift_permission_list' });
                this.notify.html(`Shift Permission ${res.data.name} Created`,
                `<b>Shift Permission created successfully!</b>
                `             
                )
              }
              else{
                this.unfreezePage()
                this.notify.error('Error', res.message)
              }
            })
      },
      async getApproverDetails(employee_id){
        this.frappe.customApiCall("api/method/one_fm.api.v1.shift_permission.get_approver_details", {
            employee_id: employee_id}, 'POST').then(res=>{
              if (res.status_code==200){
                this.approver_name = res.data.approver_name
                this.shift = res.data.shift
                this.approver = res.data.approver
              }
              else{
                this.notify.error('Error', res.message)
              }
            })
      },
      async getData(){
        if(this.id){
          this.freezePage()
            this.frappe.customApiCall("api/method/one_fm.api.v1.shift_permission.shift_permission_details", {
            shift_permission_id: this.id}, 'POST').then(res=>{
          if (res.status_code==200){
            
            this.employee_id= res.data.employee
            this.employee_name= res.data.emp_name
            this.date = res.data.date
            this.permission_type = res.data.permission_type
            this.log_type = res.data.log_type
            this.latitude = res.data.latitude
            this.longitude = res.data.longitude
            if(res.data.arrival_time){
              if(res.data.arrival_time.length<8){
              this.arrival_time= '0'+res.data.arrival_time
              }
              else{
                this.arrival_time= res.data.arrival_time
              }
            }
            if(res.data.leaving_time){
              
              if(res.data.leaving_time.length<8){
                
              this.leaving_time= '0'+res.data.leaving_time
              
              }
            else{
              
              this.leaving_time= res.data.leaving_time
            }
            }
            this.reason= res.data.reason
            this.shift_assignment= res.data.assigned_shift
            this.shift_type= res.data.shift_type
            this.shift= res.data.shift
            this.is_new = false
            this.roster_type= res.data.roster_type
            this.approver= res.data.shift_supervisor
            
            this.approver_name= res.data.approver_name
            this.workflow_state = res.data.workflow_state
            this.docstatus = res.data.docstatus
            res.data.workflow_state == "Approved" ? this.isReadonly = true: this.isReadonly = false
            if(this.approver===this.employee_data.name){
              this.isManager=true;
              this.isReadonly=true;
            }
            this.unfreezePage()
            
          } else {
            this.notify.error('Error', res.message)
          }
        })
        }
        
      }
    }
}
</script>

<template>
  <Header/>
  <div class="contents ">
    
      <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7 py-5">
            <h3>Shift Permission</h3>
            <div v-if="isPageFrozen" class="loading-overlay">
                  <div class="loading-spinner"></div>
            </div>
            
            <v-card>
              <v-dialog v-model="dialogVisible" max-width="400">
                <v-card>
                  <v-card-title>Confirm Save</v-card-title>
                  <v-card-text>Are you sure you want to save? You will be unable to modify later</v-card-text>
                  <v-card-actions>
                    <v-btn @click="saveData">Yes</v-btn>
                    <v-btn @click="cancelSave">No</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="approvalVisible" max-width="400">
                <v-card>
                  <v-card-title>Confirm Action</v-card-title>
                  <v-card-text>Are you sure you want perform this action? You will be unable to modify later</v-card-text>
                  <v-card-actions>
                    <v-btn @click="approveReject">Yes</v-btn>
                    <v-btn @click="cancelSave">No</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            <form action="#" method="post" style="   background-color: rgb(60, 60, 60);">
              <div class="row" >
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-select
                     style="background-color: white;"
                      clearable
                      dense
                      :readonly="isReadonly"
                      auto-select-first
                      :label="'Employee Name'"  v-model="employee_name"
                      hide-details
                        ></v-select>
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Date</label>
                    <Datepicker  label = "Date" style="background-color: white;" v-model="date"   format="yyyy-MM-dd" :readonly="isReadonly" value-format="yyyy-MM-dd" auto-apply />
                    
                  </div>    
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-select
                    style="background-color: white;"
                      clearable
                      :readonly="isReadonly"
                      :label="'Log Type'"  v-model="log_type"
                      @update:modelValue="handleLogTypeChange"
                      :items="['IN','OUT']"  ></v-select>
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-select
                    style="background-color: white;"
                      clearable
                      :readonly="isReadonly"
                      :label="'Permission Type'"  v-model="permission_type"
                      @update:modelValue="handlePermTypeChange"
                      :items="getPermission"  ></v-select>
                  </div>    
                </div>
              </div>
              <div class="row">
                <div v-if ="showTime" class="col-md-6">
                  <div class="form-group first">
                    <label v-if="permission_type==='Arrive Late'">Arrival Time</label>
                    <label v-else-if="permission_type==='Leave Early'">Leaving Time</label>
                    <input style="background-color: white;" v-if="permission_type==='Arrive Late'" v-model = "arrival_time"   type="time" :readonly="isReadonly"  class="form-control"  >
                    <input  style="background-color: white;" v-else-if="permission_type==='Leave Early'" v-model = "leaving_time"   type="time" :readonly="isReadonly"  class="form-control" >      
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-textarea style="background-color: white;" v-model = "reason" :readonly="isReadonly" label="Shift Permission Reason"></v-textarea>
                  </div>    
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-text-field style="background-color: white;" :readonly="true" v-model = "shift" label="Shift"></v-text-field>
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-text-field style="background-color: white;" :readonly="true" v-model = "approver_name" label="Approver Name"></v-text-field>
                  </div>    
                </div>
              </div>
              <div v-if="permission_type=='Checkin Issue'||permission_type=='Checkout Issue'" class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-text-field style="background-color: white;" :readonly="true" v-model = "latitude" label="Latitude"></v-text-field>
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <v-text-field style="background-color: white;" :readonly="true" v-model = "longitude" label="Longitude "></v-text-field>
                  </div>    
                </div>
              </div>
              <v-card>
                <v-row class="text-right">
                  
                  <v-col class="text-center">
                    <v-btn @click="showConfirmDialog('Save')" v-if="is_new"  style="background-color: #B87852; color: white; width: 100%; ">Save Shift Permission</v-btn>
                    <v-btn @click="showConfirmDialog('Approve')" color ="#B87852" v-if="docstatus == 0 && isManager && workflow_state == 'Pending' "  style="background-color:  #ad7e63; color: white; width: 100%; ">Approve Shift Permission</v-btn>
                    <v-btn @click="showConfirmDialog('Reject')" color ="#B87852"  v-if="docstatus == 0 && workflow_state == 'Pending' && isManager" style="background-color: red; color: white; width: 100%;" >Reject Shift Permission</v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </form>
          </v-card>
          </div>
        </div>
      </div>
    </div>

    <Footer/>
</template>


<style scoped>

.col-md-7.py-5{
  margin: 50px;
}
.form-group{
  padding:13px
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .loading-spinner {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  h3{
    color : #B87852;
    text-align: center;
  }
  label{
    color :white;
  }
  
</style>