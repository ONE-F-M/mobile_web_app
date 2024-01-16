<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'PenaltyManagement',
    data(){
        return {
          employee_data: {},
          start: '',
          end: '',
          penalties: [],
          currentRejectedItem: null,
          rejectionMessage: '',
        }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getData() // Fetch Pending Penalties
    },
    components: {
      Header,
      Footer
    },
    methods:{
      async getData(){
        this.frappe.customApiCall("api/method/one_fm.api.v1.legal.get_pending_penalties", {
          employee_id: this.employee_data.employee_id}, 'POST').then(res=>{

          if (res.status_code==200){
            this.penalties = res.data
          } else {
            this.notify.error('Error', res.message)
          }
        })
      },
      openRejectionModal(item) {
        this.currentRejectedItem = item;
        this.rejectionMessage = '';
        $('#rejectionModal').modal('show');
      },
      acceptPenalty(item) {
            // Accept Penalty
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


            <!-- Wallet Card -->
            <div class="section employee-card-section pt-1">
                <div class="employee-card">
                    <!-- Balance -->
                    <div class="balance">
                        <div class="left">
                            <h3 class="total">Penalty Management</h3>
                        </div>
                    </div>
                    <!-- * Balance -->

                  <div class="issue-penalty-button">
                      <a href="/penalty-management/issuance/"><button class="btn btn-primary">Issue Penalty</button></a>
                  </div>
                </div>
                
            </div>
            <!-- Wallet Card -->





          <!-- Transactions -->
          <div class="section mt-4">
              <!-- Check if there are pending penalties -->
              <h2 style="color: white;">Pending Penalties</h2> 
              <template v-if="penalties.length > 0">
                  <!-- Penalty Table -->
                  <table class="penalty-table">
                      <thead>
                          <tr>
                              <th>S/N</th>
                              <th>Penalty</th>
                              <th>Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr v-for="(item, index) in penalties" :key="index">
                              <td>{{ index + 1 }}</td>
                              <td>
                                  <router-link :to="`/penalty-details/${item.name}`" style="text-decoration: none; color: inherit;">
                                      {{ item.name }}
                                  </router-link>
                              </td>
                              <td>
                                  <button @click="acceptPenalty(item)" class="btn btn-success">Accept</button>
                                  <button @click="openRejectionModal(item)" class="btn btn-danger">Reject</button>
                              </td>
                          </tr>
                      </tbody>
                  </table>
                  <!-- * Penalty Table -->
          

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
                      <!-- * Rejection Modal -->
                  

              </template>
              
              <template v-else>
                  <p>No pending penalties available.</p>
              </template>

          
            </div>

            <!-- * Transactions -->


    </div>
      <!-- * App Capsule -->
  <!-- Body End -->


  
  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>

<style scoped>
  .penalty-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px; 
  }

  .penalty-table th, .penalty-table td {
    padding: 10px; 
    text-align: left;
    border: 1px solid #ddd; 
  }

  .penalty-table th {
    background-color: #f2f2f2; 
  }

  .penalty-table td {
    width: 30%; 
  }

  .penalty-table td button {
    margin-right: 50px; 
  }

  .issue-penalty-button {
    margin-top: 15px; 
  }

</style>

