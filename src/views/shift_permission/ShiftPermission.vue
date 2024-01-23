<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import Pagination from '@/views/Pagination.vue';



export default {
    'name': 'ShiftPermissionList',
    data(){
        return {
            currentPage: 1,
         itemsPerPage: 10,
          employee_data: {},
          shifts: [],
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
      Pagination,
      Footer
    },
    computed: {
    totalShifts() {
      return this.shifts.length;
    },
    totalPages() {
      return Math.ceil(this.totalShifts / this.itemsPerPage);
    },
    displayedShifts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.shifts.slice(start, end);
    },
    },
    methods:{
      handlePageChange(newPage) {
        this.currentPage = newPage;
      },
      openShiftPermission(shift_id){
        
        this.$router.push({ name: 'shift_permission',params:{'id':shift_id}});
        
      },
      newShiftPermission(){
        this.$router.push({ name: 'new_shift_permission' });
      },
      async getData(){
        // Get leave data
        
        
        this.frappe.customApiCall("api/method/one_fm.api.v1.shift_permission.list_shift_permission", {
            employee_id: this.employee_data.employee_id}, 'POST').then(res=>{
          if (res.status_code==200){
            
            this.shifts = res.data
          } else {
            this.notify.error('Error', res.message)
          }
        })
        // End get leave 
      }
    }
}
</script>



<template>
  <Header/>
    <!-- Header Start -->
    
    <!-- Header End -->
  
    <!-- Floating Icon -->
    
    <!-- * Floating Icon -->
  
    <!-- Body Start -->
    <!-- App Capsule -->
    <div id="appCapsule">
  
      <!-- Wallet Card -->
      <div class="section employee-card-section pt-1">
        <div class="employee-card">
          
          <!-- Balance -->
          <div class="balance text-center">
            <div >
              <h3 class="total">Shift Permissions</h3>
            </div>
          </div>
          
          
          <!-- * Balance -->
        </div>
      </div>
  
      <!-- Wallet Card -->
  
      <!-- Transactions -->
      
      <!-- * Transactions -->
  
    </div>
    
    <div class="section mt-4">
      <ul class="listview image-listview inset">
        <li  v-for="item in displayedShifts" :key="item.id" class="mb-3 clickable-row">
          <div class="item d-flex">
            <v-row  @click="openShiftPermission(item.name)" justify="space-between">
              <v-col cols="2">
                <div v-bind:class="`icon-box bg-${item.log_type=='IN' ? 'success':'danger'}`">
                  <ion-icon v-bind:name="`play-${item.log_type=='IN' ? 'back':'forward'}`"></ion-icon>
                  
                </div>
              </v-col>
              <v-col cols="4">
                <div>
                  <p class="text">{{item.emp_name}}</p>
                </div>
              </v-col>
              <v-col cols="3">
                <div class="in">
                  <p class="text">{{item.date}}</p>
                  
                </div>
              </v-col>
              <v-col cols="3">
                <div class="in">
                  
                  <span class="text">{{item.workflow_state}}</span>
                </div>
              </v-col>
            </v-row>
          </div>
        </li>
      </ul>
  </div>
  <div class="floating-icon">
        <a href ="#">
                <span title="Add Shift Permission" @click="newShiftPermission">
                  <ion-icon id ="addButton" href="/shift_permission" name="add-circle-sharp"></ion-icon>
                </span>
                
          </a>
  </div>



    <!-- * App Capsule -->
    <!-- Body End -->
  
    
    
    <div class="pagination-container">
      <pagination v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="handlePageChange"
        />
    </div>
    <br>
    <br>
    <Footer />
    
  </template>
  
  <style>
  .floating-icon {
    position: fixed;
    bottom: 10%;
    right: 3.5%;
    font-size:60px;
  }
  
  .table {
    width: 100%;
    
    margin-top: 20px; /* Adjust as needed */
  }
  
  .table th, .table td {
    background-color: #f2f2f2;
    text-align: left;
    padding: 8px;
    color: black;
    border: none;
  }
  
  .table th {
    
    color: black;
    
  }

  .clickable-row {
  cursor: pointer;
}

.clickable-row :hover {
  background-color:#3f2ca0; /* Add a hover effect if needed */
}
  

ion-icon {
    pointer-events: none;
    }

#addButton{
  
  color: #B87852;;
}


.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px; /* Adjust as needed */
  }
  
  </style>