
export default {
    name: 'utils',
    Frappe: class Frappe {
        constructor(url, client_id){
            this.url = url;
            this.client_id = client_id;
            this.grant_type= "password";
            this.token = '';
            this.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: ''
            };
        }
        async login(body){
            let res = await fetch(`${this.url}/api/method/one_fm.api.v2.authentication.user_login`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(body)
            })
            if(res.status==200){
                let auth = await res.json()
                // // end authenticate via email
                this.token = auth.data.token;
                this.headers.Authorization = this.token;
                
                // // set storage
                localStorage.setItem('frappeUser', JSON.stringify(
                    {token: this.token, employee_data: auth.data, url: this.url})
                )
                return {status: res.status, message:res.message, data:auth.data}
            } else {
                let auth = await res.json()
                return {status: res.status, message:auth.error}
            }
        }
        // get updated headers
        getHeader(){
            let token = JSON.parse(localStorage.frappeUser).token;
            this.headers.Authorization = token
            // return this.headers;
        }

        // handleResponse
        async handleResponse(res){
            if(res.status_code==200){
                let data = await res.json();
                return await {'status_code': res.status, 'data': data.data};
            } else {
                // not found
                return {'status_code': res.status_code, 'text': res.statusText}
            }
        }

        // get_doc
        async get_doc(doctype, docname){
            try {
                // this.getHeader();
                let res = await fetch(`${this.url}/api/resource/${doctype}/${docname}`, {
                    method: 'GET',
                    headers: this.headers
                })
                return await res.json();
            } catch (e) {
                console.log(e)
            }
        }
        // update doc
        async update_doc(doctype, docname, body){
            try {
                this.getHeader();
                let res = await fetch(`${this.url}/api/resource/${doctype}/${docname}`, {
                    method: 'PUT',
                    headers: this.headers,
                    body: JSON.stringify(body)
                })
                return await this.handleResponse(res);
            } catch (e) {
                console.log(e)
            }
        }
        // create doc
        async new_doc(doctype, body){
            try {
                this.getHeader();
                let res = await fetch(`${this.url}/api/resource/${doctype}`, {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify(body)
                })
                return await this.handleResponse(res);
            } catch (e) {
                console.log(e)
            }
        }
        // DELETE doc
        async delete_doc(doctype, docname){
            try {
                this.getHeader();
                let res = await fetch(`${this.url}/api/resource/${doctype}/${docname}`, {
                    method: 'DELETE',
                    headers: this.headers
                })
                return await this.handleResponse(res);
            } catch (e) {
                console.log(e)
            }
        }
        // get list
        async get_list(doctype, filters=null){
            try {
                this.getHeader();
                let url = `${this.url}/api/resource/${doctype}`
                if(filters){
                    url = url + '?' + filters;
                }
                let res = await fetch(url, {
                    method: 'GET',
                    headers: this.headers
                })
                return await this.handleResponse(res);
            } catch (e) {
                console.log(e)
            } finally {

            }
        }

        // get pdf
        async getPDF(
                doctype, docname, format, Standard,
                no_letterhead, letterhead, lang
            ){
            format = format ? format : 'Standard';
            no_letterhead = no_letterhead ? no_letterhead : 1;
            letterhead = letterhead ? letterhead : 'No Letterhead';
            lang = lang ? lang : 'en';

            let url = `${this.url}/api/method/frappe.utils.print_format.download_pdf?doctype=${doctype}&name=${docname}&format=${format}&no_letterhead=${no_letterhead}&letterhead=${letterhead}&settings=%7B%7D&_lang=${lang}`
            // process download
            this.getHeader();
            let res = await fetch(url, {
                method: 'GET',
                headers: this.headers
            })
            if(res.status==200){
                let blob = await res.blob();
                let file = await window.URL.createObjectURL(blob);
                window.location.assign(file);
            } else {
                this.$popIt.error('Error', res.statusText);
            }
        }

        // custom API call
        async customApiCall(api, body, method){
            try {
                this.getHeader();
                let args = {
                    method: method,
                    headers: this.headers,
                }
                if (method=='POST'){
                    args['body'] = JSON.stringify(body);
                }
                let res = await fetch(`${this.url}/${api}`, args)
                
                if(res.status==401){
                    // Unauthorized Request or expired Token
                    this.handle401();
                } else {
                    return await res.json();
                }
                
            } catch (e) {
                console.log(e, 'blablabla')
            }
        }
        // In the case token expires, redirect to home
        handle401(){
            localStorage.clear()
            location.href= '/';
        }
    },
    Notify: class Notifiy {
        constructor(Swal){
            this.swal = Swal;
        }
        success(title, msg){
            this.swal.fire(
              title,
              msg,
              'success'
            )
        }
        error(title, msg){
            this.swal.fire(
              title,
              msg,
              'warning'
            )
        }
        html(title, msg){
            this.swal.fire({
                title: title,
                icon: 'info',
                html:msg,
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
                confirmButtonText:
                  'Ok',
              })
        }
    }
}

// export default new Frappe()