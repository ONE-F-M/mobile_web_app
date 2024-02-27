# mobile_web_app
Web version of ONE FM mobile app.

Installation guide: 

```
git clone https://github.com/ONE-F-M/mobile_web_app.git
```

Check the port on which the application is running after executing yarn dev. 
e.g. Local: http://localhost:5173/ will be shown. 

In your frappe/erpnext installation, add the below to bench/sites/[site-name]/site_config.json

```
"allow_cors": ["http://localhost:5173"]
```

Update src/main.js line 12 with the correct url and id. 
```
const frappe = new utils.Frappe("url", "id")
```

After making the above changes to src/main.js, run the below commands. 

```
yarn build
yarn dev
```



To test the app on a mobile device: 

1. Make sure your machine and mobile device are using the same network. 
2. Download and install ngrok. Follow the instruction on the following link: https://ngrok.com/docs/getting-started/
3.  In your frappe/erpnext installation, modify the "allow_cors" parameter in bench/sites/[site-name]/site_config.json. This should only be done on local machine and never on staging/test-production/production environments. 
```
"allow_cors": ["*"]
```
4. Use the steps in the following link to add your local frappe/erpnext server url to be treated as secure origin by the browser. https://stackoverflow.com/a/53388534/6614548
For chrome, you can access by chrome://flags.
For edge, you can access by edge://flags.

