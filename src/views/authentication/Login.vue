<template>
    <Header />
    <div id="appCapsule">

        <div class="section mt-2 text-center">
            <img src="/assets/img/one_logo.png" alt="logo" class="logo" style="max-height:100px">
        </div>
        <div class="section mb-5 p-2">

            <form @submit.prevent="login">
                <div class="card">
                    <div class="card-body pb-1">
                        <div class="form-group basic">
                            <div class="input-wrapper">
                                <label class="label" for="email1">Employee ID</label>
                                <input type="text" class="form-control" id="employeeID" placeholder=""
                                v-model="auth.employee_id">
                                <i class="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>

                        <div class="form-group basic">
                            <div class="input-wrapper">
                                <label class="label" for="password1">Password</label>
                                <input type="password" class="form-control" id="password" autocomplete="off"
                                    v-model="auth.password">
                                <i class="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>

                        <div class="transparent">
                            <button type="submit" class="btn btn-primary btn-block btn-lg">Log in</button>
                        </div>
                    </div>

                    
                </div>


                <div class="form-links mt-2">
                    <!-- <div>
                        <a href="app-register.html">Register Now</a>
                    </div> -->
                    <div><a href="/forgot_password" class="text-muted">Forgot Password?</a></div>
                </div>

               

            </form>
        </div>

        </div>

</template>


<script>
import Header from '@/components/authentication/components/Header.vue'

  // console.log('session')
  export default {
      name: 'Login',
      props: {
          // this.$frappe: {
          //     required: true
          // }
      },
      data(){
          return {
              auth: {
                employee_id: "", client_id: this.frappe.client_id, 
                grant_type: this.frappe.grant_type, password: ""
              }
          }
      },
      methods: {
          async login(){
            this.loader.start();
            this.frappe.login(this.auth)
            .then(response => {
                if (response.status_code == 200){
                    this.loader.end();
                    // this.notify.success(response.message, 'Logged in successfully')
                    this.$router.push('/home')
                } else {
                    this.loader.end();
                    this.notify.error('Error', response.message)
                }
            })
            .catch(error => console.log(error))
          }
      },
      computed:{
      },
      async created(){
        //   if(this.$route.path=='/login' || this.$route.path=='/signup'){
        //       this.switchWrapper = 'login-box';
        //       this.disableLoginDiv = false;
        //       // console.log('true talk')
        //   } else {
        //       this.switchWrapper = 'wrapper';
        //       this.disableLoginDiv = true;
        //       // console.log('true lies')
        //   }


          // alert(this.$route.path)

      },
      mounted(){
        //   clear loader
        this.loader.end();
      },
      components: {
        Header
      }
  }
</script>
