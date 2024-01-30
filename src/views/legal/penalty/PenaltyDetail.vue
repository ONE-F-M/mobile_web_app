<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import VideoJSRecord from '@/components/VideoJSRecord.vue'

export default {
  name: 'PenaltyDetail',
  props: ['penaltyName'],
  data(){
      return {
          employee_data: {},
          penalty_details: {},
          currentRejectedItem: {},
          rejectionMessage: "",
          recordTimer: 1,
          csrf_token: ""

      };
    },
  mounted() {
    this.is_logged_in();
    this.loader.end();
    this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
    this.getData();
  },
  components: {
    Header,
    Footer,
    VideoJSRecord
  },
  computed: {
    showActionButtons() {
      return (this.penalty_details.recipient_employee === this.employee_data.name) && (this.penalty_details.workflow_state === "Penalty Issued");
    }
  },
  methods: {
    async getData() {
      this.frappe.customApiCall("api/method/one_fm.api.v1.legal.get_penalty_details",{
        penalty_name: this.penaltyName 
      }, "POST").then(res => {
        if (res.status_code == 200) {
          this.penalty_details = res.data
        } else {
          this.notify.error("Error", "An error occurred while fetching the the Penalty Details")
        }
      })
    },
    acceptPenalty(item) {
          this.frappe.customApiCall("api/method/one_fm.api.v1.legal.accept_penalty", {
            employee_id: this.employee_data.employee_id,
            docname: item.name}, 'POST').then(res=>{

            if (res.status_code == 201){
              this.notify.success("Success", "Hooray! You've accepted your penalty. Taking responsibility is a step towards improvement!")
            } else {
              this.notify.error('Error', res.message)
            }
          })
        },
    rejectPenalty() {
        $('#rejectionModal').modal('hide');
        if (this.currentRejectedItem && this.rejectionMessage){
            this.frappe.customApiCall("api/method/one_fm.api.v1.legal.reject_penalty", {
            employee_id: this.employee_data.employee_id,
            docname: this.currentRejectedItem.name,
            rejection_reason: this.rejectionMessage}, 'POST').then(res=>{

            if (res.status_code == 201){
                this.notify.success("Success", "Protest noted! You've rejected the penalty. Please contact your supervisor for clarification.")
                setTimeout(() => {
                window.location.reload();
                }, 5000);
            } else {
                this.notify.error('Error', res.message)
            }
            })
        } else{
            this.notify.error("Error", "Penalty cannot be rejected without a reason")
        }
    },
    openRejectionModal(item) {
        this.currentRejectedItem = item;
        this.rejectionMessage = '';
        $('#rejectionModal').modal('show');
      },

    acceptPenaltyWithRecording(item) {
    $('#recordingModal').modal('show');

    this.startRecording(item);
    },
    startRecording(item) {
      const penaltyDetails = { ...item }
      this.process_video(penaltyDetails)
      $('#recordingModal').modal('hide');
    },
    process_video(videoBlob) {
      if (videoBlob instanceof Blob){
        return new Promise((resolve, reject) => {
                let me = this;
                console.log(videoBlob, 8888888888888888888888)
                let xhr = new XMLHttpRequest();
                let method =  me.frappe.url+'/api/method/one_fm.api.v1.legal.new_accept_penalty'
                console.log(method)
                xhr.open("POST", method, true);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("X-Frappe-CSRF-Token", me.csrf_token);
                xhr.setRequestHeader("Authorization", JSON.parse(localStorage.frappeUser).token);

                let form_data = new FormData();
                form_data.append("file", videoBlob);
                form_data.append("docname", me.penalty_details.name);
                console.log(form_data)
                
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        if ([200, 201].includes(xhr.status)) {
                        let r = null;
                        try {
                            r = JSON.parse(xhr.responseText);
                            console.log(r);
                            me.notify.success("Successful", "Accepted! Penalty successfully acknowledged. Way to go!");
                            // me.$router.push('/penalty-management');
                            setTimeout(()=>{
                               window.location.href='/penalty-management' 
                            }, 5000)
                        } catch (e) {
                            r = xhr.responseText;
                        }
                    } else if (xhr.status === 401) {
                        let response = JSON.parse(xhr.responseText);
                        me.notify.error("Unauthorized", response._error_message)
                        setTimeout(()=>{
                               window.location.reload()
                            }, 5000)
                    } else if (xhr.status === 500) {
                        let response = JSON.parse(xhr.responseText);
                        me.notify.error("Error", response._error_message)
                        setTimeout(()=>{
                               window.location.reload()
                            }, 5000)
                    } else {
                        let error = null;
                        try {
                            error = JSON.parse(xhr.responseText);
                            console.log(error)
                        } catch (e) {
                        // pass
                        }

                        setTimeout(()=>{
                               window.location.reload()
                            }, 5000)
                    }
                    }
                };
                xhr.send(form_data);
            });
      }
      
    },
  }
}
</script>



<template>
    <!-- Header Start -->
    <Header />
    <!-- Header End -->
    
  
    <div class="center-container">
      <div class="penalty-details-container">
        <h2 class="penalty-heading">{{ penalty_details.name }}</h2>
        <div class="penalty-details">
          <div class="penalty-field">
            <strong class="label">Issuer Name:</strong> <p>{{ penalty_details.issuer_name }}</p>
          </div>
          <div class="penalty-field">
            <strong class="label">Recipient Name:</strong> <p>{{ penalty_details.recipient_name }}</p>
          </div>
          <div class="penalty-field">
            <strong class="label">Penalty Issuance Time:</strong> <p>{{ penalty_details.penalty_issuance_time }}</p>
          </div>
          <div class="penalty-field">
            <strong class="label">Penalty Occurrence Time:</strong> <p>{{ penalty_details.penalty_occurence_time }}</p>
          </div>
          <div class="penalty-field">
            <strong class="label">Workflow State:</strong> <p>{{ penalty_details.workflow_state }}</p>
          </div>
  
          <!-- Additional fields based on availability -->
          <div v-if="penalty_details.shift" class="penalty-field">
            <strong class="label">Shift:</strong> <p>{{ penalty_details.shift }}</p>
          </div>
          <div v-if="penalty_details.site" class="penalty-field">
            <strong class="label">Site:</strong> <p>{{ penalty_details.site }}</p>
          </div>
          <div v-if="penalty_details.location" class="penalty-field">
            <strong class="label">Location:</strong> <p>{{ penalty_details.location }}</p>
          </div>
          <br>
          <br>
  
          <!-- Accept and Reject buttons -->
          <div v-if="showActionButtons" class="action-buttons">
          <button @click="acceptPenaltyWithRecording(penalty_details)" class="accept-button">Accept</button>
          <button @click="openRejectionModal(penalty_details)" class="reject-button">Reject</button>
        </div>
        </div>
      </div>
    </div>


     <!-- Rejection Modal -->
    <div class="modal fade" id="rejectionModal" tabindex="-1" role="dialog" aria-labelledby="rejectionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="rejectionModalLabel">Provide Rejection Reason</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <label for="rejectionMessage">Rejection Reason:</label>
                <textarea id="rejectionMessage" v-model="rejectionMessage" class="form-control"></textarea>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button @click="rejectPenalty()" class="btn btn-danger">Reject with Reason</button>
              </div>
          </div>
        </div>
    </div>



    <!-- Recording Modal -->
    <div class="modal fade" id="recordingModal" tabindex="-1" role="dialog" aria-labelledby="recordingModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
          <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="recordingModalLabel">Video Recording</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <!-- <div class="modal-body"> -->
              <!-- You can customize the modal body based on your video recording requirements -->
              <!-- <p>Video recording is in progress...</p> -->
              <!-- Add any necessary video recording UI elements here -->
          <!-- </div> -->

          <div class="col-md-9 col-xs-12 verification" >
                  <div style="text-align:center">
                      <div id="countdown"></div>
                      <div id="cues"></div>
                      <VideoJSRecord @get-video="process_video" :recordTimer="recordTimer"
                      v-if="recordTimer>0"/>
                  </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
          </div>
      </div>
    </div>
  
    <!-- Footer Start -->
    <Footer />
    <!-- Footer End -->
  </template>
  
<style scoped>
  .center-container {
    margin-top:50px;
    padding:10px;
  }
  
  .penalty-details-container {

    padding: 20px;
    border-radius: 10px;
    color: white; 
  }
  
  .penalty-heading {
    color: #E28A38;
    margin-bottom: 15px;
  }
  
  .penalty-details {
    width: 100%;
    max-width: 400px; 
  }
  
  .penalty-field {
    margin-bottom: 10px;
  }
  
  .label {
    color: #C1C1C1;
 
  }
  
  .action-buttons {
    margin-top: 20px;
  }
  
  .accept-button {
  background-color: #1E941E; 
  color: white; /* White text */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  float:left;
  width:190px;
}

.reject-button {
  background-color: #EF4141;
  color: white; /* White text */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 190px;
  float: right;
}

p{
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;

}

.modal-dialog {
  margin-top: 300px;
  border-radius: 120px;
}

</style>


