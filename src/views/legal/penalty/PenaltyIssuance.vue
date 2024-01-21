<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'PenaltyIssuance',
  data(){
      return {
          employee_data: {},
          shifts: [],
          subordinates: [],
          selectedShift: '',
          selectedPenaltyCategory: '',
          selectedEmployees: [],
          currentDateTime: '',
          userCoordinates: null,
          penaltyTable: [],
          employeeDropdownOptions: [], 
          employeeTable: [],
          selectedOption: {},
          selectedEmployeeOption: {}
      };
    },
  mounted() {
    this.is_logged_in();
    this.loader.end();
    this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
    this.getData();
    this.updateCurrentDateTime();
    this.fetchDropdownOptions();

    setInterval(() => {
      this.updateCurrentDateTime();
    }, 1000);

    this.getUserLocation();
    setInterval(() => {
      this.getUserLocation();
    }, 8000);

    flatpickr("#penaltyOccurrenceTime", {
      enableTime: true,
      altInput: true, 
      altFormat: "F j, Y H:i", 
      dateFormat: "Y-m-dTH:i", 
    });
  },
  components: {
    Header,
    Footer
  },
  watch: {
    selectedPenaltyCategory(newCategory) {
      if (newCategory === 'performance') {
        this.fetchShifts();
      }
    },
  },
  methods: {
    async getData() {
      this.frappe.customApiCall("api/method/one_fm.api.v1.legal.get_subordinates",{
        employee: this.employee_data.name  
      }, "POST").then(res => {
        if (res.status_code == 200) {
          this.employeeDropdownOptions = res.data
        } else {
          this.notify.error("Error", "An error occurred while fetching the the subordinates, kindly contact aAmin")
        }
      })
    },
    fetchShifts(){
      this.frappe.customApiCall("api/method/one_fm.api.v1.legal.get_all_shifts", {
      }, "POST").then(res =>{
        if (res.status_code == 200){
          this.shifts = res.data
        } else {
          this.notify.error("Error", "An error occurred while fetching categories, kindly contact Admin")
        }
      })
    },
    fetchDropdownOptions() {
      // Replace 'your_api_endpoint' with the actual API endpoint URL
      this.frappe.customApiCall("api/method/one_fm.api.v1.legal.get_penalty_types", {}, "GET").then(res => {
        if (res.status_code === 200) {
          this.dropdownOptions = res.data;
        } else {
          this.notify.error("Error", "Failed to fetch dropdown options");
        }
      });
    },
    addToPenaltyTable() {
      if (this.selectedOption) {
        // Ensure penaltyTable is initialized as an array before pushing
        if (!Array.isArray(this.penaltyTable)) {
          this.penaltyTable = [];
        }

        // Push the selected option to the penaltyTable array
        this.penaltyTable.push({
          sn: this.penaltyTable.length + 1, // Incremental Serial Number
          name: this.selectedOption.name,
        });

        // Optionally, you can reset the selectedOption for the next selection
        this.selectedOption = null;
      }
    },
    addToEmployeeTable() {
      if (this.selectedEmployeeOption) {
        this.employeeTable.push({
          sn: this.employeeTable.length + 1,
          name: this.selectedEmployeeOption.employee_name,
          employee_id: this.selectedEmployeeOption.name,
          
        });
      }
    },
    updateCurrentDateTime() {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      this.currentDateTime = now.toLocaleDateString('en-US', options);
    },
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.successCallback,
          this.errorCallback
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    },
    successCallback(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.userCoordinates = { latitude, longitude };
    },
    errorCallback(error) {
      console.log("Error getting location:", error.message);
    },

    submitPenaltyIssuance() {
      console.log("to hell with you")
      const penaltyCategory = document.getElementById('penaltyCategory').value;
      const issuingLocation = document.getElementById('issuingLocation').value;
      const penaltyOccurrenceTime = document.getElementById('penaltyOccurrenceTime').value;
      const customerPropertyDamage = document.getElementById('customerPropertyDamage').checked;
      const companyDamage = document.getElementById('companyDamage').checked;
      const otherDamages = document.getElementById('otherDamages').checked;
      const assetDamages = document.getElementById('assetDamages').checked;

      console.log(this.selectedShift)

      if (this.selectedPenaltyCategory === 'performance') {
        selectedShiftDetails = this.selectedShift;
      }

      const shiftName = selectedShiftDetails ? selectedShiftDetails.name : null;
      const projectName = selectedShiftDetails ? selectedShiftDetails.project : null;
      const siteName = selectedShiftDetails ? selectedShiftDetails.site : null;
      const siteLocation = selectedShiftDetails ? selectedShiftDetails.site_location : null;

      console.log(shiftName, projectName, siteLocation, siteName)

      const selectedEmployeeElements = document.querySelectorAll('#employeeSelection option:checked');
      const selectedEmployeeIds = Array.from(selectedEmployeeElements).map(option => option.value);


      const fileInput = document.getElementById('fileUpload');
      const files = fileInput.files;
      const fileDataArray = [];

      if (files.length > 0) {
          for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const fileData = {
                  attachment_name: file.name,
                  attachments: file
              };
              fileDataArray.push(fileData);
          }
      }
    


    
    }
  }
}
</script>



<template>
    <!-- Header Start -->
    <Header />
    <!-- Header End -->


    <div class="section mt-4">
    <br>
    <br>
    <br>
    <h1 style="color: white;">Penalty Issuance </h1>
      <div class="grey-card">
        <div class="card rounded p-2 bg-light">
          <p class="mb-1">Issuing Time: &nbsp; &nbsp;{{ currentDateTime }}</p>
          <p v-if="userCoordinates" class="mb-0">Location: &nbsp; &nbsp;{{ userCoordinates.latitude }}, {{ userCoordinates.longitude }}</p>
        </div>
      </div>
    
    <form @submit.prevent="submitPenaltyIssuance">

      <div class="mb-3">
          <label for="penaltyCategory" class="form-label">Penalty Category</label>
          <select id="penaltyCategory" class="form-select" required v-model="selectedPenaltyCategory" style="background-color: white;">
              <option value="" disabled>Select Penalty Category</option>
              <option value="accommodation">Accommodation</option>
              <option value="performance">Performance</option>
              <option value="transportation">Transportation</option>
          </select>
      </div>

      <div v-if="selectedPenaltyCategory === 'performance'">
        <div class="mb-3">
          <label for="shift" class="form-label">Shift</label>
          <select id="shift" class="form-select" required v-model="selectedShift" style="background-color: white;">
            <option value="" disabled>Select Shift</option>
            <option v-for="shift in shifts" :key="shift.name" :value="shift.name">{{ shift.name }}</option>
          </select>
        </div>
      </div>



      
      <div class="mb-3">
        <label for="issuingLocation" class="form-label">Penalty Location</label>
        <input type="text" id="issuingLocation" class="form-control" placeholder="Place Where it happened " required>
      </div>

      <div class="mb-3">
        <label for="penaltyOccurrenceTime" class="form-label">Penalty Occurrence Time</label>
        <input type="text" id="penaltyOccurrenceTime" class="form-control" placeholder="Select date and time" required >
      </div>


      <div class="card mb-3" style="background-color: #ccc;">
        <div class="card-body">
          <label class="form-label">Employee Selection</label>
          <div class="mb-3">
            <select v-model="selectedEmployeeOption" style="background-color: white;" class="form-select">
              <option :value="option" v-for="option in employeeDropdownOptions" :key="option.value">{{ option.employee_name }} ({{ option.name }})</option>
            </select>
            <br>
            <button @click.prevent="addToEmployeeTable" class="btn btn-primary mt-2">Add to Table</button>
            <br><br>
          </div>
          <!-- Employee Table -->
          <label class="form-label">Employee Table</label>
          <table class="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
                <th>Employee ID</th>
              
              </tr>
            </thead>
            <tbody>
              <tr v-for="(employee, index) in employeeTable" :key="index">
                <td>{{ employee.sn }}</td>
                <td>{{ employee.name }}</td>
                <td>{{ employee.employee_id }}</td>
              
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
      <div class="card mb-3"  style="background-color: #ccc;">
        <div class="card-body">
          <label for="selectOption" class="form-label">Penalty Issuance Details</label>
          <select id="selectOption" style="background-color: white;" class="form-select" v-model="selectedOption">
            <option :value="option" v-for="option in dropdownOptions" :key="option.value">{{ option.name }}</option>
          </select>
          <br>
          <button @click.prevent="addToPenaltyTable" class="btn btn-primary mt-2">Add to Table</button>
        </div>

        <br>
        <div class="card-body">
          <label class="form-label">Penalty Table</label>
          <table class="table">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in penaltyTable" :key="index">
                <td>{{ entry.sn }}</td>
                <td>{{ entry.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <div class="grey-card">
        <div class="card rounded p-2 bg-light">
          <h2>Penalty Issuer Details</h2>
          <p class="mb-1">Employee:  &nbsp; &nbsp; {{ employee_data.name }}</p>
          <p class="mb-1">Employee Name: &nbsp; &nbsp; {{ employee_data.employee_name }}</p>
          <p class="mb-1">Designation: &nbsp; &nbsp; {{ employee_data.designation }}</p>
        </div>
      </div>


           
      <div class="mb-3">
          <label class="form-label">Additional Damages</label>

          <!-- Customer Property Damage Card -->
          <div class="card mb-2">
            <div class="card-body">
              <div class="form-check">
                <input type="checkbox" id="customerPropertyDamage" class="form-check-input">
                <label for="customerPropertyDamage" class="form-check-label">Customer Property Damage</label>
              </div>
            </div>
          </div>

          <!-- Company Damage Card -->
          <div class="card mb-2">
            <div class="card-body">
              <div class="form-check">
                <input type="checkbox" id="companyDamage" class="form-check-input">
                <label for="companyDamage" class="form-check-label">Company Damage</label>
              </div>
            </div>
          </div>

          <!-- Other Damages Card -->
          <div class="card mb-2">
            <div class="card-body">
              <div class="form-check">
                <input type="checkbox" id="otherDamages" class="form-check-input">
                <label for="otherDamages" class="form-check-label">Other Damages</label>
              </div>
            </div>
          </div>

          <!-- Asset Damages Card -->
          <div class="card mb-2">
            <div class="card-body">
              <div class="form-check">
                <input type="checkbox" id="assetDamages" class="form-check-input">
                <label for="assetDamages" class="form-check-label">Asset Damages</label>
              </div>
            </div>
          </div>

      </div>
           

      <div class="mb-3">
            <label for="fileUpload" class="form-label">Upload Files</label>
            <input type="file" id="fileUpload" class="form-control" multiple>
      </div>


      <button type="submit" class="btn btn-primary">Issue Penalty</button>

    </form>
  </div>
    





    <!-- Footer Start -->
    <!-- <Footer /> -->
    <!-- Footer End -->

</template>


<style scoped>

.grey-card {
    background-color: #3a3333; 
    border-radius: 10px; 
    padding: 15px; 
    margin-bottom: 20px; 
  }

  #fileUpload {
    width: 300px; 
  }

  .card {
    background-color: white; 
    color: black; 
    border-radius: 10px; 
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); 
  }

  .card-body {
    padding: 10px; 
  }

</style>