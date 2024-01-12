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
    <div class="container card shadow d-flex justify-content-center mt-5">
      <!-- nav options -->
      <ul class="nav nav-pills mb-3 shadow-sm text-center" id="pills-tab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Shift Permission Details</a>
        </li>
      </ul>

      <!-- content -->
      <div class="tab-content" id="pills-tabContent p-3">
        <!-- 1st card -->
        <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          <form class="search">
            <div class = 'shift_permission' >
                <input class="form-control mr-sm-2" type="search" placeholder="Employee Id" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Employee Name" aria-label="Search..." disabled/>
                <input class="form-control mr-sm-2" type="date" placeholder="Date" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Log Type" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Permission Type" aria-label="Search..." />
                <textarea class="form-control mr-sm-2" placeholder="Reason"></textarea>
            </div>
            <div class = 'shift_details' >
                <input class="form-control mr-sm-2" type="search" placeholder="Shift Assignment" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Roster Type" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Approver" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Arrival Time" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Shift" aria-label="Search..." />
                <input class="form-control mr-sm-2" type="search" placeholder="Shift Type" aria-label="Search..." />
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<style >
    body {
  background-color: #bcd9f5;
    }
/* nav */
.card {
  max-width: 80%;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  max-height: 750%;
}

a.active {
  border-bottom: 2px solid #55c57a;
}

.nav-link {
  color: rgb(110, 110, 110);
  font-weight: 500;
}
.nav-link:hover {
  color: #55c57a;
}

.nav-pills .nav-link.active {
  color: black;
  background-color: white;
  border-radius: 0.5rem 0.5rem 0 0;
  font-weight: 600;
}

.tab-content {
  padding-bottom: 1.3rem;
}

.form-control {
  background-color: rgb(241, 243, 247);
  border: none;
}

label {
  font-weight: 500;
  color: rgb(104, 104, 104);
}


.form-control:focus {
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.075) inset, 0px 0px 7px rgba(0, 0, 0, 0.2);
}

/* 1st card */

ul {
  list-style: none;
  margin-top: 1rem;
  padding-inline-start: 0;
}

.search {
  padding: 0 1rem 0 1rem;
}
</style>