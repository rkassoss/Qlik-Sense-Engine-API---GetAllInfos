//MIT License
//Copyright (c) 2019 Yoichi Hirotake
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE`
//SOFTWARE.

//EngineGetAllInfos v1.0
// It is necessary to install, node.js and node.js components(ws, path, fs) to run this script.
//.Local Certificates folder needs to be expoerted from Qlik Sense Central Node
//wss://QlikServer1:4747/app/ is an example, please change the hostname which fits your environment
//UserDirectory and UserId is an example, please change it according to fit your environment

const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
var certPath =  path.join('C:', 'yheTemp', '.Local Certificates'); // The location of .Local Ceritificate folder
 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var certificates = {
	cert: fs.readFileSync(path.resolve(certPath, 'client.pem')),
	key: fs.readFileSync(path.resolve(certPath, 'client_key.pem')),
	root: fs.readFileSync(path.resolve(certPath, 'root.pem'))
	};
	

    function setup() {  


		const ws = new WebSocket('wss://QlikServer1:4747/app/', {
		ca: certificates.root,
		cert: certificates.cert,
		key: certificates.key,
		headers: {
			'X-Qlik-User':  'UserDirectory=internal; UserId=sa_engine'
		}

		});

        ws.onopen = function (e) {      
            console.log("Connected");      
			
					var request1 = {

					"method": "OpenDoc",
					"handle": -1,
					"params": [
					"bd8d8385-90cb-4d3c-a3ee-3984d9cff15a"
					],
				"jsonrpc": "2.0",
				"id": 2

					}
				
					var request2 = {

					"method": "GetAllInfos",
					"handle": 1,
					"params": [],
					"jsonrpc": "2.0",
					"id": 3

					}	
            
			sendMessage(request1);		
			wait ();
			sendMessage(request2);
				

        }

        // Listen for connection errors
        ws.onerror = function (e) {      
            console.log("Error ");  
        }

        // Listen for new messages arriving at the client
        ws.onmessage = function (e) { 


            console.log("Message received: " + e.data);

				fs.appendFile('GetAllInfos.txt', e.data, function(err){
				if(err) {
				return console.log(err);
				}
				console.log("GetAllInfos.txt saved successfully!");
				}
				);
			

			wait ();
			//Close connection
            ws.close();  
        }
    

		// Send a message on the WebSocket.
		function sendMessage(msg) {  
        ws.send(JSON.stringify(msg));      
        console.log("Message sent");  
		}

        // Listen for the close connection event
        ws.onclose = function (e) {      
           console.log("Disconnected: " + e.reason);  
        }

	}
    // Start running
    setup();


function wait (){
    var time1 = new Date().getTime();
    var time2 = new Date().getTime();
  
    while ((time2 -  time1)<2000){
        time2 = new Date().getTime();
    }
}
