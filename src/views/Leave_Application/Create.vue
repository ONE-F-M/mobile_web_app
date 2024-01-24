<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'LeaveApplication',
    data(){
        return {
          employee_data: {},
          yesterday:"",
          leaveTypeOptions: [],
          leave_type: "",
          total_leaves: 0,
          expired_leaves: 0,
          leaves_taken: 0,
          leaves_pending_approval: 0,
          remaining_leaves: 0,
          leave_balance : false,
          total_leave_days: "",
          from_date: "",
          to_date: "",
          reason:"",
          proof_document:{},
          base64:""
        }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getData() // fetch leave balance
      
    },
    components: {
      Header,
      Footer
    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.get_leave_types",{
          employee_id: this.employee_data.employee_id}, 'POST').then(res=>{
          if (res.message != "Resource Not Found"){
             var options = []
            for(let r in res.data){
                options.push({ text: res.data[r], value: res.data[r] })
              }
              
            this.leaveTypeOptions = options
            document.getElementById("fromDate").min = new Date().toISOString().split("T")[0];
            document.getElementById("toDate").min = new Date().toISOString().split("T")[0];

          } else {
            this.notify.error('Error', res.message)
          }
        })
        
      },
      onLeaveTypeChange(event) {
        this.leave_type = event.target.value
        this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.get_leave_balance",{
          employee_id: this.employee_data.employee_id, leave_type: this.leave_type}, 'POST').then(res=>{
          if (res.message != "Resource Not Found"){
            this.leave_balance = true
            this.total_leaves = res.data.total_leaves
            this.expired_leaves =  res.data.expired_leaves
            this.leaves_taken = res.data.leaves_taken
            this.leaves_pending_approval = res.data.leaves_pending_approval
            this.remaining_leaves = res.data.remaining_leaves
          } else {
            this.notify.error('Error', res.message)
          }
        })
        },
        onChange(event, type){
          if(type ==='from'){
            this.from_date = event.target.value
          }
          else if(type ==='to'){
            this.to_date = event.target.value
          }
          
          if(this.from_date  && this.to_date && this.leave_type){
              this.frappe.customApiCall("api/method/hrms.hr.doctype.leave_application.leave_application.get_number_of_leave_days",{
                "employee": this.employee_data.name,
                "leave_type": this.leave_type,
                "from_date": this.from_date,
                "to_date": this.to_date}, 'POST').then(res=>{
                if (res.message != undefined){
                  this.total_leave_days = res.message
                } else {
                  this.notify.error('Error', res.message)
                }
            })
          }
        },
        submit : function(){
          this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.create_new_leave_application",{
            "employee_id": this.employee_data.employee_id, "from_date": this.from_date, "to_date": this.to_date, "leave_type": this.leave_type, "reason": this.reason, "proof_document": JSON.stringify([this.proof_document])}, 'POST').then(res=>{
                if (res.message === "Success"){
                  this.notify.success("Successfully Applied!")
                  window.location.reload();

                } else {
                  this.notify.error('Error', res.message)
                }
            })
        },
        async fetchFile(event){
          var file =  event.target.files[0]
          let result = await this.convertToBase64(file);
          this.proof_document.attachment_name = event.target.files[0].name
          this.proof_document.attachment = result.replace('data:application/pdf;base64,','')  
        },
        convertToBase64(file) {
          return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onerror = reject
          reader.onload = () => {
            resolve(reader.result)
          }
          reader.readAsDataURL(file)
        })
        }
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
          <div style="display:flex;padding-bottom: 5px;">
            <h5 style="color:white"> Leave Type: </h5>
            <select v-model="selected" name="leavetype" @change="onLeaveTypeChange($event)" style="margin-left: auto;">
              <option disabled value="">Select Leave Type.</option>
              <option v-for="option in leaveTypeOptions" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div v-if="this.leave_balance" class="form_card" >
            <h3 style="color: white;">Available Leaves:</h3>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;"> Total Leaves:</h5> <h5 style="margin-left: auto;color: white;">{{this.total_leaves}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;"> Leaves Taken: </h5> <h5 style="margin-left: auto;color: white;">{{this.leaves_taken}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;"> Expired Levaes:</h5> <h5 style="margin-left: auto;color: white;">{{this.expired_leaves}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;">  Pending Leaves: </h5> <h5 style="margin-left: auto;color: white;">{{this.leaves_pending_approval}}</h5>
            </div>
            <div style="display:flex; padding:10px;">
              <h5 style="color: white;">  Available Leaves:</h5> <h5 style="margin-left: auto;color: white;">{{this.remaining_leaves}}</h5>
            </div>
          </div>
          <div v-if="this.leave_type === 'Sick Leave'">
            <h5 style="color:#B87852;"> Proof Document:</h5>
            <input id="upload-file" class="upload-file" type="file"  @change="fetchFile($event)"/>
          </div>
          <div>
            <h5 style="color:white;"> From Date:</h5>
              <input type="date" id="fromDate" style="width:90vw;" pattern="\d{4}-\d{2}-\d{2}" @change="onChange($event, 'from')" />
          </div>
          <div >
            <h5 style="color:white;"> To Date:</h5>
            <input type="date" id="toDate" style="width:90vw;" pattern="\d{4}-\d{2}-\d{2}" @change="onChange($event, 'to')"/>
          </div>
          <div class="form_card" style="display:flex; color:white;">
            <h5  style="color:white;"> Total Leave Days</h5> <h5 style="margin-left: auto;color:white">{{this.total_leave_days}}</h5> 
          </div>
          <div >
            <h5 style="color:white;"> Reason:</h5>
            <textarea id="reason" v-model="reason" name="reason" rows="5" cols="40">
            </textarea>
          </div>
          <button v-on:click="submit" style="background-color: #B87852;border-radius: 10px;padding: 10px; width: 95vw;"> Sumbit </button>
      </div>
    
      
      
    </div>
      <!-- * Transactions -->


      <!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>
