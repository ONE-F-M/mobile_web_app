<script type="module">
import Header from '@/components/Header.vue'

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
    Pagination
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
        console.log(shift_id)
        this.$router.push({ name: 'shift_permission',params:{'id':shift_id}});
        
      },
      newShiftPermission(){
        this.$router.push({ name: 'new_shift_permission' });
      },
      async getData(){
        // Get leave data
        
        console.log(this.employee_data.employee_id)
        this.frappe.customApiCall("api/method/one_fm.api.v2.shift_permission.list_shift_permission", {
            employee_id: this.employee_data.employee_id}, 'POST').then(res=>{
          if (res.status_code==200){
            console.log(res)
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
    <!-- Header Start -->
    <Header />
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
          <div class="balance">
            <div class="text-center">
              <h3 class="total text-center">Shift Permissions</h3>
            </div>
          </div>
          
          <div class="floating-icon">
            <a href ="#">
                <span title="Add Shift Permission" @click="newShiftPermission">
                    <ion-icon name="add-circle-outline"></ion-icon>
                </span>
                
            </a>
            
        </div>
          <!-- * Balance -->
        </div>
      </div>
  
      <!-- Wallet Card -->
  
      <!-- Transactions -->
      <div class="section mt-4">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Permission Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in displayedShifts" :key="item.id" class="clickable-row" @click="openShiftPermission(item.name)" >
              
              <td class="icon-box" :class="`bg-success`">
                <ion-icon :name="`play-${item.log_type=='IN' ? 'back':'forward'}`"></ion-icon>
              </td>
              <td>{{item.name}}</td>
              <td>{{item.emp_name}}</td>
              <td>{{item.date}}</td>
              <td>{{item.permission_type}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- * Transactions -->
  
    </div>
    <!-- * App Capsule -->
    <!-- Body End -->
  
    
    <pagination v-if="totalPages > 1"
    :current-page="currentPage"
    :total-pages="totalPages"
    @page-change="handlePageChange"
    />

    
  </template>
  
  <style>
  .floating-icon {
    position: absolute;
    top: 10%;
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
  </style>