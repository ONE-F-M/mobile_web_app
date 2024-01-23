<script type="module">
import profilePlaceholder from '@/assets/profile_placeholder.jpg';
import Header from '@/components/Header.vue'
// import Footer from '@/components/Footer.vue'

export default {
    data(){
        return {
          employee: {
            employee_name:'',
            employee_id:''
          },
          image:''
        }
    },
    mounted(){
      //   clear loader
      this.is_logged_in();
      this.loader.end();
      this.employee_data = JSON.parse(localStorage.frappeUser).employee_data;
      this.url = JSON.parse(localStorage.frappeUser).url;
      this.getData() // fetch leave balance
    },
    components: {
      Header,
    },
    methods:{
        async getData(){
            this.employee.employee_name = this.employee_data.employee_name
            this.employee.employee_id = this.employee_data.employee_id
            this.employee_data.image ? this.image = this.url+this.employee_data.image : this.image = profilePlaceholder
                
        },
    }
}
</script>
<template>
    <!-- App Bottom Menu -->
    <div class="appBottomMenu">
        <router-link to="/home" class="item">
            <div class="col">
                <ion-icon name="home-outline"></ion-icon>
                <strong>Home</strong>
            </div>
        </router-link>
        <router-link to="/checkin" class="item">
            <div class="col">
                <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                <strong>Mark Attendance</strong>
            </div>
        </router-link>
        <router-link to="/checkin_history" class="item">
            <div class="col">
                <ion-icon name="document-text-outline"></ion-icon>
                <strong>Checkin History</strong>
            </div>
        </router-link>
    </div>
    <!-- * App Bottom Menu -->

    <!-- App Sidebar -->
    <div class="modal fade panelbox panelbox-left" id="sidebarPanel" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body p-0">
                    <!-- profile box -->
                    <div class="profileBox pt-2 pb-2">
                        <div class="image-wrapper">
                            
                            <img :src="image"  alt="image" class="imaged  w36">
                            
                        </div>
                        <div class="in">
                            <strong>{{ employee.employee_name }}</strong>
                            <div class="text-muted">{{ employee.employee_id }}</div>
                        </div>
                        <a href="#" class="btn btn-link btn-icon sidebar-close" data-bs-dismiss="modal">
                            <ion-icon name="close-outline"></ion-icon>
                        </a>
                    </div>
                    <!-- * profile box -->
                    <!-- balance -->
                    <!-- <div class="sidebar-balance">
                        <div class="listview-title">Balance</div>
                        <div class="in">
                            <h1 class="amount">$ 2,562.50</h1>
                        </div>
                    </div> -->
                    <!-- * balance -->

                    <!-- action group -->
                    <!-- <div class="action-group">
                        <a href="index.html" class="action-button">
                            <div class="in">
                                <div class="iconbox">
                                    <ion-icon name="add-outline"></ion-icon>
                                </div>
                                Deposit
                            </div>
                        </a>
                        <a href="index.html" class="action-button">
                            <div class="in">
                                <div class="iconbox">
                                    <ion-icon name="arrow-down-outline"></ion-icon>
                                </div>
                                Withdraw
                            </div>
                        </a>
                        <a href="index.html" class="action-button">
                            <div class="in">
                                <div class="iconbox">
                                    <ion-icon name="arrow-forward-outline"></ion-icon>
                                </div>
                                Send
                            </div>
                        </a>
                        <a href="app-cards.html" class="action-button">
                            <div class="in">
                                <div class="iconbox">
                                    <ion-icon name="card-outline"></ion-icon>
                                </div>
                                My Cards
                            </div>
                        </a>
                    </div> -->
                    <!-- * action group -->

                    <!-- menu -->
                    <!-- <div class="listview-title mt-1">Menu</div>
                    <ul class="listview flush transparent no-line image-listview">
                        <li>
                            <a href="index.html" class="item">
                                <div class="icon-box ">
                                    <ion-icon name="pie-chart-outline"></ion-icon>
                                </div>
                                <div class="in">
                                    Overview
                                    <span class="badge badge-primary">10</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="app-pages.html" class="item">
                                <div class="icon-box ">
                                    <ion-icon name="document-text-outline"></ion-icon>
                                </div>
                                <div class="in">
                                    Pages
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="app-components.html" class="item">
                                <div class="icon-box ">
                                    <ion-icon name="apps-outline"></ion-icon>
                                </div>
                                <div class="in">
                                    Components
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="app-cards.html" class="item">
                                <div class="icon-box ">
                                    <ion-icon name="card-outline"></ion-icon>
                                </div>
                                <div class="in">
                                    My Cards
                                </div>
                            </a>
                        </li>
                    </ul> -->
                    <!-- * menu -->

                    <!-- others -->
                    <div class="listview-title mt-1">Others</div>
                    <ul class="listview flush transparent no-line image-listview">
                        <li>
                            <a href="#" class="item" data-bs-dismiss="modal">
                                <div class="icon-box ">
                                    <ion-icon name="home-outline" ></ion-icon>
                                </div>

                                <div class="in">
                                    Dashboard
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/checkin" class="item">
                                <div class="icon-box ">
                                    <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                                </div>
                                
                                <div class="in">
                                    Mark Attendance
                                </div>
                            </a>
                        </li>
                        <li>
                            <a href="/checkin_history" class="item">
                                <div class="icon-box ">
                                    <ion-icon name="checkmark-done-circle-outline"></ion-icon>
                                </div>
                                
                                <div class="in">
                                    Checkin History
                                </div>
                            </a>
                        </li>
                        <li>
                            <div class="dropdown" style="width: 100vw;font-size: medium;">
                                    <a class="item" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div class="icon-box ">
                                            <ion-icon name="medkit-outline"></ion-icon>
                                        </div>
                                        <div class="in">
                                            Shift Permission
                                        </div>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" href="/shift_permission">New Shift Permission</a>
                                        <a class="dropdown-item" href="/shift_permission_list">Shift Permissions</a>
                                    </div>
                                </div>
                        
                        </li>
                        <li>
                            <a href="/" class="item">
                                <div class="icon-box ">
                                    <ion-icon name="log-out-outline"></ion-icon>
                                </div>
                                <div class="in">
                                    Log out
                                </div>
                            </a>
                        </li>


                    </ul>
                    <!-- * others -->

                </div>
            </div>
        </div>
    </div>
    <!-- * App Sidebar -->



    <!-- iOS Add to Home Action Sheet -->
    <div class="modal inset fade action-sheet ios-add-to-home" id="ios-add-to-home-screen" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add to Home Screen</h5>
                    <a href="#" class="close-button" data-bs-dismiss="modal">
                        <ion-icon name="close"></ion-icon>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="action-sheet-content text-center">
                        <div class="mb-1"><img src="/assets/img/icon/192x192.png" alt="image" class="imaged w64 mb-2">
                        </div>
                        <div>
                            Install <strong>Finapp</strong> on your iPhone's home screen.
                        </div>
                        <div>
                            Tap <ion-icon name="share-outline"></ion-icon> and Add to homescreen.
                        </div>
                        <div class="mt-2">
                            <button class="btn btn-primary btn-block" data-bs-dismiss="modal">CLOSE</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <!-- * iOS Add to Home Action Sheet -->


    <!-- Android Add to Home Action Sheet -->
    <div class="modal inset fade action-sheet android-add-to-home" id="android-add-to-home-screen" tabindex="-1"
        role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add to Home Screen</h5>
                    <a href="#" class="close-button" data-bs-dismiss="modal">
                        <ion-icon name="close"></ion-icon>
                    </a>
                </div>
                <div class="modal-body">
                    <div class="action-sheet-content text-center">
                        <div class="mb-1">
                            <img src="/assets/img/icon/192x192.png" alt="image" class="imaged w64 mb-2">
                        </div>
                        <div>
                            Install <strong>Finapp</strong> on your Android's home screen.
                        </div>
                        <div>
                            Tap <ion-icon name="ellipsis-vertical"></ion-icon> and Add to homescreen.
                        </div>
                        <div class="mt-2">
                            <button class="btn btn-primary btn-block" data-bs-dismiss="modal">CLOSE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- * Android Add to Home Action Sheet -->
</template>