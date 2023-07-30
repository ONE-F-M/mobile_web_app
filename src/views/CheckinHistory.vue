<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'CheckinHistory',
    data(){
        return {
          employee_data: {},
          start: '',
          end: '',
          checkin_history: [],
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
      Footer
    },
    methods:{
      async getData(){
        // Get leave data
        this.frappe.customApiCall("api/method/one_fm.api.v2.web.get_checkin_history", {
          employee: this.employee_data.name}, 'POST').then(res=>{

            console.log(res)
          if (res.status_code==200){
            this.checkin_history = res.data.logs;
            this.start = res.data.start;
            this.end = res.data.end;
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

  <!-- Body Start -->
    <!-- App Capsule -->
    <div id="appCapsule">

      <!-- Wallet Card -->
      <div class="section employee-card-section pt-1">
          <div class="employee-card">
              <!-- Balance -->
              <div class="balance">
                  <div class="left">
                      <h3 class="total">Checkin History</h3>
                      <span class="title">{{start}} - {{end}}</span>
                  </div>
              </div>
              <!-- * Balance -->
          </div>
      </div>
      <!-- Wallet Card -->

     <!-- Transactions -->
     <div class="section mt-4">
        <ul class="listview image-listview inset">
            <li v-for="item in checkin_history">
                <div class="item">
                    <div v-bind:class="`icon-box bg-${item.log_type=='IN' ? 'success':'danger'}`">
                      <ion-icon v-bind:name="`play-${item.log_type=='IN' ? 'back':'forward'}`"></ion-icon>
                    </div>
                    <div class="in">
                        <div>{{item.time.split('.')[0]}}</div>
                        <span class="text">{{item.log_type}}</span>
                    </div>
                </div>
            </li>
        </ul>
      </div>
      <!-- * Transactions -->


      </div>
      <!-- * App Capsule -->
  <!-- Body End -->

  <!-- Footer Start -->
  <Footer />
  <!-- Footer End -->

</template>
