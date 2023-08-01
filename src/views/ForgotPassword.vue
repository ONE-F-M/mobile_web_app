<template>
    <Header />
    <div id="appCapsule">

        <div class="section mt-2 text-center">
            <img src="/assets/img/one_logo.png" alt="logo" class="logo" style="max-height:100px">
        </div>
        <div class="section mb-5 p-2">

            <form @submit.prevent="forgot_password">
                <div class="card">
                    <div class="card-body pb-1 reset_password">
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
                                <label class="label" for="otp_source" aria-label="Select OTP Source">OTP Source</label>
                                <select class="form-control"  name="otp_source" placeholder="" v-model="auth.otp_source"> 
                                    <option value="email">Email</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="sms">SMS</option>
                                </select>

                            </div>
                        </div>

                        <div class="transparent">
                            <button  class="btn btn-primary btn-block btn-lg" id="submit_source">Submit</button>
                        </div>
                    </div>
                </div>
                </form>

                <form @submit.prevent="set_token_id">
                    <div class="card verify_code" style="display:none">
                    <div class="card-body pb-1 " >
                        <div class="form-group basic">
                            <div class="input-wrapper">
                                <label class="label" for="email1">Verify Code</label>
                                <input type="text" class="form-control" id="verification_code" placeholder="" v-model="auth.verify_code">
                                <i class="clear-input">
                                    <ion-icon name="close-circle"></ion-icon>
                                </i>
                            </div>
                        </div>


                            <div class="transparent">
                                <button class="btn btn-primary btn-block btn-lg" id="verify">Verify</button>
                            </div>
                        </div>
                    </div>
                </form>

                    
                <form @submit.prevent="update_password">
                    <div class="card update_new_password" style="display:none">
                        <div class="card-body pb-1">
                            <div class="form-group basic">
                                <div class="input-wrapper">
                                    <label class="label" for="password">New Password</label>
                                    <input type="password" class="form-control" id="password" autocomplete="off"
                                        v-model="auth.new_password">
                                    <i class="clear-input">
                                        <ion-icon name="close-circle"></ion-icon>
                                    </i>
                                </div>
                            </div>


                            <div class="transparent">
                                <button class="btn btn-primary btn-block btn-lg" id="update_password">Reset Password</button>
                            </div>
                        </div>
                    </div>
                </form>
                    
        </div>

        </div>

</template>


<script>
import Header from '@/components/authentication/components/Header.vue'

  // console.log('session')
  export default {
      name: 'ForgotPassword',
      props: {
          // this.$frappe: {
          //     required: true
          // }
      },
      initialize(){
        // // let submit_source = document.getElementById("submit_source");
        // let verify = document.getElementById("verify");
        // let update_password = document.getElementById("update_password");
        // // submit_source.addEventListener("click", function() {
        // //     this.forgot_password()
        // // }, false);
        // // verify.addEventListener("click", function() {
               
        // //         // $('#cues').empty().append(`<div class="alert alert-danger">Please remove your spectacles. Follow the instructions here after clicking Enroll button.</div>`);
        // //     }, false);
        // update_password.addEventListener("click", function() {
        //     this.update_password()
        // }, false);
      },
      data(){
          return {
              auth: {
                employee_id: "",
                otp_source:'',
                verify_code:'',
                id:'',
                new_password:''
              }
          }
      },
      methods:{
        async forgot_password(){
        // Get leave data
        this.frappe.customApiCall("api/method/one_fm.api.v2.authentication.forgot_password",{
            employee_id:this.auth.employee_id, otp_source:this.auth.otp_source }, 'POST').then(res=>{
          if (res.status_code==201){
            $('.verify_code').show()
            $('.reset_password').hide()
            this.auth.id = res.data['temp_id']
            console.log(this.auth.id)
          } else {
            this.notify.error('Error', res.message)
          }
        })
        // End get leave 
      },
      async set_token_id(){
             $('.verify_code').hide();
            $('.update_new_password').show();
      },
      async update_password(){
        console.log(this.auth.verify_code)
        console.log(this.auth.id)
        // Update Password
        this.frappe.customApiCall("api/method/one_fm.api.v2.authentication.update_password",{
            otp: this.auth.verify_code, id: this.auth.id, employee_id:this.auth.employee_id, new_password:this.auth.new_password}, 'POST').then(res=>{
          if (res.message.message=="Password Updated!"){
            this.notify.success("Success", 'Password Updated!')
            this.$router.push('/')

          } else {
            this.notify.error('Error', res.message)
          }
        })
        // End get leave 
      }

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
