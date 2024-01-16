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
          selectedEmployees: []
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
          this.subordinates = res.data
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



    <!-- Penalty Issuance Form -->
    <div class="section mt-4">
    <br>
    <br>
    <br>
    <h1 style="color: white;">Penalty Issuance Form</h1>
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

      <!-- Additional fields for Performance category -->
      <!-- Additional fields for Performance category -->
<div v-if="selectedPenaltyCategory === 'performance'">
  <div class="mb-3">
    <label for="shift" class="form-label">Shift</label>
    <select id="shift" class="form-select" required v-model="selectedShift" style="background-color: white;">
      <option value="" disabled>Select Shift</option>
      <option v-for="shift in shifts" :key="shift.name" :value="shift.name">{{ shift.name }}</option>
    </select>
  </div>
  <!-- Add more additional fields as needed -->
</div>



      <!-- Issuing Location -->
      <div class="mb-3">
        <label for="issuingLocation" class="form-label">Issuing Location</label>
        <input type="text" id="issuingLocation" class="form-control" required>
      </div>

      <!-- Penalty Occurrence Time -->
      <div class="mb-3">
        <label for="penaltyOccurrenceTime" class="form-label">Penalty Occurrence Time</label>
        <input type="datetime-local" id="penaltyOccurrenceTime" class="form-control" required placeholder="">
      </div>

      <!-- Damage Types -->
      <div class="mb-3">
        <label class="form-label">Damage Types</label>
        <div class="form-check">
          <input type="checkbox" id="customerPropertyDamage" class="form-check-input">
          <label for="customerPropertyDamage" class="form-check-label">Customer Property Damage</label>
        </div>
        <br>
        <div class="form-check">
          <input type="checkbox" id="companyDamage" class="form-check-input">
          <label for="companyDamage" class="form-check-label">Company Damage</label>
        </div>
        <br>
        <div class="form-check">
          <input type="checkbox" id="otherDamages" class="form-check-input">
          <label for="otherDamages" class="form-check-label">Other Damages</label>
        </div>
        <br>
        <div class="form-check">
          <input type="checkbox" id="assetDamages" class="form-check-input">
          <label for="assetDamages" class="form-check-label">Asset Damages</label>
        </div>
        <br>
      </div>

        
      <div class="mb-3">
        <label class="form-label">Employee Selection</label>
        <br>

        <!-- Dropdown for Employee Selection with multiple attribute -->
        <select v-model="selectedEmployees" multiple @change="addEmployee" id="employeeSelection">
            <option v-for="employee in subordinates" :key="employee.name" :value="employee.employee_id">{{ employee.employee_name }} ({{ employee.employee_id }})</option>
        </select>

      </div>

      <div class="mb-3">
            <label for="fileUpload" class="form-label">Upload Files</label>
            <input type="file" id="fileUpload" class="form-control" multiple>
      </div>



      <button type="submit" class="btn btn-primary">Submit</button>

    </form>
  </div>
    





    <!-- Footer Start -->
    <!-- <Footer /> -->
    <!-- Footer End -->

</template>


<style scoped>

  #fileUpload {
    width: 300px; 
    /* box-sizing: border-box;  */
  }

</style>