<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'LeaveApplicationDetails',
    data(){
        return {
          employee_data: {},
          name:"",
          status: "",
          leave_type: "",
          posting_date: "",
          from_date: "",
          to_date: "",
          leave_balance: "",
          proof_document: "",
          reason: "",
          approver: "",
          applied_by: "",
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
        // Get leave data
        this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.get_leave_detail",
        {employee_id: this.employee_data.employee_id, leave_id: this.$route.params.leave_id}, 'POST').then(res=>{
          if (res.message != "Resource Not Found"){
            this.name = this.$route.params.leave_id
            this.status = res.data.status
            this.employee = res.data.employee
            this.employee_name = res.data.employee_name
            this.leave_type = res.data.leave_type
            this.posting_date = res.data.posting_date
            this.from_date = res.data.from_date
            this.to_date = res.data.to_date
            this.total_leave_days = res.data.total_leave_days
            this.proof_document = res.data.proof_document
            this.reason = res.data.reason
            this.approver = res.data.leave_approver
          }
        })
        // End get leave 
      },
      TakeAction(status){
        console.log(status)
        this.frappe.customApiCall("api/method/one_fm.api.v1.leave_application.leave_approver_action",{
          leave_id: this.name, status: status}, 'POST').then(res=>{
            console.log(res)
            if(res.message == "Success"){
              this.notify.success("Success", `Leave Application ${status}`)
              window.location.reload();
            }
            else{
              this.notify.error("Error", 'There was an error while approving the leave.')
            }

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
      <div class="section mt-4  detail_card">
        <div>
          <div class="item" >
              <div class="in">
                <h3 style="color:#B87852">{{this.name}}</h3>
                <div style="display:flex; padding:10px">
                    <h4 > Employee: </h4> <h5 style="margin-left: auto;">{{this.employee}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > Employee Name: </h4> <h5 style="margin-left: auto;">{{this.employee_name}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > Status: </h4> <h5 style="margin-left: auto;">{{this.status}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4> Leave Type:</h4> <h5 style="margin-left: auto;">{{this.leave_type}}</h5> 
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > Posting Date: </h4> <h5 style="margin-left: auto;">{{this.posting_date}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4> From Date:</h4> <h5 style="margin-left: auto;">{{this.from_date}}</h5> 
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4 > To Date: </h4> <h5 style="margin-left: auto;">{{this.to_date}}</h5>
                  </div>
                  <div style="display:flex; padding:10px">
                    <h4>  Total Leave Days:</h4> <h5 style="margin-left: auto;">{{this.total_leave_days}}</h5> 
                  </div>
                  
                  <div v-if="this.proof_document" style="display:flex; padding:10px">
                    <h4 > Proof Document: </h4> <h5 style="margin-left: auto;">{{this.proof_document}}</h5>
                  </div>

                  <div v-if="this.reason" style="display:flex; padding:10px">
                    <h4> Reason:</h4> <h5 style="margin-left: auto;">{{this.reason}}</h5> 
                  </div>
                </div>
          </div>
        </div>
      </div>
      <div v-if="this.approver === this.employee_data.user_id && this.status === 'Open'" style="display:flex; padding:10px">
          <button class="button-style" v-on:click="TakeAction(`Approved`)"> Approve </button>
          <button class="button-style"  v-on:click="TakeAction(`Rejected`)"> Reject</button>
      </div>
    </div>
      <!-- * Transactions -->


      <!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>
