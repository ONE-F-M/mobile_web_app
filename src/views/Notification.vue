<script type="module">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
    'name': 'Notification',
    data(){
        return {
          employee_data: {},
          notification: [],
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
        this.frappe.customApiCall("api/method/one_fm.api.notification.get_notification_list", 'POST').then(res=>{

            console.log(res)
          if (res.success==true){
            this.notification = res.data.slice(0,10);
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
                      <h3 class="total">Notification</h3>
                  </div>
              </div>
              <!-- * Balance -->
          </div>
      </div>
      <!-- Wallet Card -->

     <!-- Transactions -->
     <div class="section mt-4">
        <ul class="listview inset">
            <li v-for="item in notification">
                <div class="item">
                    <div class="in">
                        <h2>{{item.title}}</h2>
                        <h4> {{ item.body }}</h4>
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
