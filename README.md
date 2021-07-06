# Tenant WebApp
View at https://sandbox.renthero.com or https://renthero.com

![49704134_2174343786005835_2551578961758912512_n](https://user-images.githubusercontent.com/22982964/124578056-6fee4b00-de80-11eb-84ee-4772d395bd4c.jpeg)


## To Run Localhost on Mobile Device
1. Connect mobile device to laptop
2. On laptop chrome go to the url `chrome://inspect/#devices`
3. On this screen you can see connected devices with their chrome tabs (make sure the mobile device is on mobile chrome)
4. Click "inspect" on a desired tab and you will be able to see the mobile browser's console.log and inspect element
5. Now we need to connect our `localhost:8888` to the devices' mobile browser
6. Open this folder in terminal and start localhost in http with `$ npm run start-http`
7. Open a new terminal and run ngrok to expose a url to the internet `$ ngrok http 8888 -host-header="localhost:8888"`
8. On mobile device browser, go to the generated ngrok url (it points to `localhost:8888` on your computer)
9. Now you can see localhost:8888 via ngrok at `chrome://inspect/#devices`
