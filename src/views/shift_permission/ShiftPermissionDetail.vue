<script type="module">
import Header from '@/components/Header.vue'


export default {
    'name': 'ShiftPermissionDetail',
    data(){
        return {
          employee_data: {},
          selected_shift: null,

        }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.shift_permission_id = null
      this.getData() // fetch leave balance
    },
    components: {
      Header,
    },
    methods:{
      async getData(){
        if(this.shift_permission_id){
            this.frappe.customApiCall("api/method/one_fm.api.v2.shift_permission.shift_permission_details", {
            shift_permission_id: this.shift_permission_id}, 'GET').then(res=>{
          if (res.status_code==200){
            console.log(res)
            this.shift = res.data
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
    <form class="needs-validation" style="max-width: 500px; margin: 0 auto;">
      <h2 class="text-center mb-4">New Shift Assignment</h2>
      <div class="form-group">
        <label for="employeeId">Employee ID:</label>
        <select class="form-control" id="employeeId" name="status_field">
          <option value="">Select an option</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
  
      <div class="form-group">
  
        
  <label
   
  for="employeeName">Employee Name:</label>
  
        
  <input
   
  type="text"
   
  class="form-control"
   
  id="employeeName"
   
  disabled>
  
      
  </div>
  
  
      
  <div class="form-group">
    <label for="date">Date:</label>
    <input type="date" class="form-control" id="date">
  
  </div>
  
  
      
  
  



      <div class="form-group">
        <label for="logType">Log Type:</label>
        <select class="form-control" id="logType">
          <option value="">Select an option</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
  
      <div class="form-group">
        <label for="permissionType">Permission Type:</label>
        <select class="form-control" id="permissionType">
          <option value="">Select an option</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>


    <div class="form-group">
            <label for="date">Shift Assignment:</label>
            <input type="input" class="form-control" id="date" disabled>
    </div>
    <div class="form-group">
            <label for="date">Roster Type:</label>
            <input type="input" class="form-control" id="date" disabled>
    </div>
    <div class="form-group">
            <label for="date">Approver:</label>
            <input type="input" class="form-control" id="date" disabled>
    </div>
    <div class="form-group">
            <label for="date">Approver Name:</label>
            <input type="input" class="form-control" id="date" disabled>
    </div>
    <div class="form-group">
            <label for="date">Shift:</label>
            <input type="input" class="form-control" id="date" disabled>
    </div>
    <div class="form-group">
            <label for="date">Shift Type:</label>
            <input type="input" class="form-control" id="date" disabled>
    </div>
    <div class="form-group">
            <label for="date">Arrival Time:</label>
            <input type="time" class="form-control" id="date" disabled>
    </div>
  

    <div class="form-group">      
        <label for="reason">Reason:</label>
        <textarea class="form-control" id="reason" rows="3"></textarea>
    </div>


      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </template>
  