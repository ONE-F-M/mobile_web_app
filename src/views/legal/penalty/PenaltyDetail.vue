<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'PenaltyDetail',
  props: ['penaltyName'],
  data(){
      return {
          employee_data: {},
          penalty_details: {},
          currentRejectedItem: {},
          rejectionMessage: ""

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
    Footer
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
        console.log(res.data)
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
    // Open the recording modal
    $('#recordingModal').modal('show');

    // Start the video recording process
    this.startRecording(item);
  },
  startRecording(item) {
    // Your video recording logic goes here
    // You can use the existing code related to video recording
    // For example, the logic in the `send_log` method or a similar method
    // Make sure to handle stopping the recording and any UI updates
    // based on the recording process.

    // Once recording is complete or if there is an error, close the modal
    $('#recordingModal').modal('hide');
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
            <strong class="label">Issuer Name:</strong> {{ penalty_details.issuer_name }}
          </div>
          <div class="penalty-field">
            <strong class="label">Recipient Name:</strong> {{ penalty_details.recipient_name }}
          </div>
          <div class="penalty-field">
            <strong class="label">Penalty Issuance Time:</strong> {{ penalty_details.penalty_issuance_time }}
          </div>
          <div class="penalty-field">
            <strong class="label">Penalty Occurrence Time:</strong> {{ penalty_details.penalty_occurrence_time }}
          </div>
          <div class="penalty-field">
            <strong class="label">Workflow State:</strong> {{ penalty_details.workflow_state }}
          </div>
  
          <!-- Additional fields based on availability -->
          <div v-if="penalty_details.shift" class="penalty-field">
            <strong class="label">Shift:</strong> {{ penalty_details.shift }}
          </div>
          <div v-if="penalty_details.site" class="penalty-field">
            <strong class="label">Site:</strong> {{ penalty_details.site }}
          </div>
          <div v-if="penalty_details.location" class="penalty-field">
            <strong class="label">Location:</strong> {{ penalty_details.location }}
          </div>
  
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
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <!-- You can customize the modal body based on your video recording requirements -->
            <p>Video recording is in progress...</p>
            <!-- Add any necessary video recording UI elements here -->
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh; /* Full height of the viewport */
  }
  
  .penalty-details-container {
    background-color: #333333; /* Dark grey background */
    padding: 20px;
    border-radius: 10px;
    color: white; /* Text color */
  }
  
  .penalty-heading {
    color: #8B4513; /* Light brown color for the heading */
    margin-bottom: 15px;
  }
  
  .penalty-details {
    width: 100%;
    max-width: 400px; /* Adjust as needed */
  }
  
  .penalty-field {
    margin-bottom: 10px;
  }
  
  .label {
    color: #B0C4DE; /* Light grey color for labels */
  }
  
  .action-buttons {
    margin-top: 20px;
  }
  
  .accept-button {
  background-color: #4CAF50; /* Green background */
  color: white; /* White text */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  float:left
}

.reject-button {
  background-color: #FF6347; /* Red background */
  color: white; /* White text */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  float: right;
}
</style>
  