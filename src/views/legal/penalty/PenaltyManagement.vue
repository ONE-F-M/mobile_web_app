<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
// import 'ionicons'; 


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
          currentTab: 'issuer'
        }
    },
    mounted(){
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.getPenalties() 
    },
    components: {
      Header,
      Footer
    },
    methods:{
      async getPenalties() {
          let role = null
          if (this.currentTab === 'issuer') {
              role = 'Issuance';
          }
          console.log(role)
          this.frappe.customApiCall("api/method/one_fm.api.v1.legal.get_penalties", {
              employee_id: this.employee_data.employee_id,
              role: role
          }, 'POST').then(res => {
            console.log(res.data, role)
              if (res.status_code === 200) {

                  this.penalties = res.data;
              } else {
                  this.notify.error('Error', res.message);
              }
          });
      },
      changeTab(tab) {
          this.currentTab = tab;
          this.getPenalties();
      }
    }
}
</script>



<template>
  <!-- Header Start -->
  <Header />
  <!-- Header End -->


    <!-- App Capsule -->
    <div id="appCapsule">

        <div class="section employee-card-section pt-1">
            <div class="employee-card">
                <!-- Balance -->
                <div class="balance">
                    <div class="left">
                        <h3 class="total">Penalty Management</h3>
                    </div>
                </div>
                <!-- * Balance -->
            </div>
        </div>


        <br><br>
        <div class="section">
            <div class="tabs">
              <button @click="changeTab('issuer')" :class="{ 'active-tab': currentTab === 'issuer' }">Issuer</button>
              <button @click="changeTab('receiver')" :class="{ 'active-tab': currentTab === 'receiver' }">Receiver</button>

            </div>
        </div>

        <div class="penalty-list">
            <ul>
              <li v-for="(item, index) in penalties" :key="index" class="penalty-item">
                <router-link :to="{ name: 'penalty_detail', params: { penaltyName: item.name } }">
                  <div class="penalty-details">
                    <div class="workflow-state">
                      <!-- Icons based on workflow_state -->
                      <span v-if="item.workflow_state === 'Penalty Accepted'">
                        <ion-icon name="checkmark-circle" style="color: #50474a;"></ion-icon>
                      </span>
                      <span v-else-if="item.workflow_state === 'Penalty Issued'">
                        <ion-icon name="hourglass" style="color: #50474a;"></ion-icon>
                      </span>
                      <span v-else>
                        <ion-icon name="close-circle" style="color: #50474a;"></ion-icon>
                      </span>
                    </div>

                    <div>
                      <div class="penalty-name">
                        {{ item.name }}
                      </div>

                      <div class="penalty-time">
                        {{ item.penalty_issuance_time }}
                      </div>

                      <div v-if="currentTab === 'issuer'">
                        <div class="recipient-name">
                          {{ item.recipient_name }}
                        </div>
                      </div>

                      <div v-else-if="currentTab === 'receiver'">
                        <div class="issuer-name">
                          {{ item.issuer_name }}
                        </div>
                      </div>

                      <div class="penalty-workflow">
                        {{ item.workflow_state }}
                      </div>
                    </div>
                  </div>
                </router-link>
              </li>
            </ul>
        </div>



            <router-link to="/penalty-management/issuance/" class="add-penalty-button bottom-right">
                <ion-icon name="add-circle" style="color: #8B4513; font-size: 8em;"></ion-icon>
            </router-link>


    </div>


  
  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>

<style scoped>


.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tabs button.active-tab {
  background-color: #50474a; /* Light brown when active */
}

.tab-content {
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
}



  .bottom-right {
        position: fixed;
        bottom: 100px;
        right: 20px;
    }

    .penalty-item {
        border-top: 1px solid #574141;
        border-bottom:  1px solid #574141;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .penalty-details {
        /* display: flex;
        flex-direction: column;
        width: 80%; Adjust as needed */
        display:grid;
        grid-template-columns:0.5fr 1.5fr;
    }

    .penalty-name {
        font-weight: bold;
    }

    /* .workflow-state {
        display: flex;
        align-items: center;
    } */


      .workflow-state ion-icon {
          margin-right: 1px;
          font-size: 3em; 
          margin-left: auto; 
      }

</style>

