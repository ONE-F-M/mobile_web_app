<script type="module">
import Header from '@/components/Header.vue'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';


export default {
    'name': 'ShiftPermissionDetail',
    data(){
        return {
          
          date :null,
          employee_data: {},
          selected_shift: null,

        }
    },
    mounted(){
      //   clear loader
      this.datepicker_obj = ref(Datepicker)
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.shift_permission_id = null
      this.getData() // fetch leave balance
    },
    components: {
      Header,
      Datepicker
      
    },
    methods:{
      handleDate(date){
        console.log(this.date)
        
      },
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
  <div class="contents ">
      <div class="container-fluid">
        <div class="row align-items-center justify-content-center">
          <div class="col-md-7 py-5">
            <h3>Shift Permission</h3>
            
            <form action="#" method="post">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="fname">Employee ID</label>
                    <input type="text" class="form-control" placeholder="Employee ID" id="fname">
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Employee Name</label>
                    <input type="text" class="form-control" placeholder="Employee Name" id="lname">
                  </div>    
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="fname">Permission Type</label>
                    <input type="text" class="form-control"  id="fname">
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Log Type</label>
                    <input type="text" class="form-control"  id="lname">
                  </div>    
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Date</label>
                    <Datepicker v-model="date" @click="$emit('close')"  format="yyyy/MM/dd" value-format="yyyy-MM-dd" auto-apply />
                    
                    
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Arrival Time</label>
                    <input type="text" class="form-control"  id="lname">
                  </div>    
                </div>
              </div>
              <div class="row">
                <div class="col-md-12">
                  <div class="form-group first">
                    <label for="email">Reason</label>
                    <textarea placeholder="Shift Assignment Reason" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                  </div>    
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Shift Assignment</label>
                    <input type="text" class="form-control" placeholder="Shift Assignment" id="lname">
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Shift</label>
                    <input type="text" class="form-control" placeholder="Shift" id="lname">
                  </div>    
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group last mb-3">
                    <label for="password">Roster Type</label>
                    <input type="input" class="form-control"  id="password">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group last mb-3">
                    <label for="re-password">Shift Type</label>
                    <input type="input" class="form-control"  id="re-password">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Approver</label>
                    <input type="text" class="form-control"  id="lname">
                  </div>    
                </div>
                <div class="col-md-6">
                  <div class="form-group first">
                    <label for="lname">Approver Name</label>
                    <input type="text" class="form-control"  id="lname">
                  </div>    
                </div>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
</template>


<style scoped>
.contents {
  background-color: azure;
}
.col-md-7.py-5{
  margin: 50px;
}



.form-group{
  padding:10px
}

</style>