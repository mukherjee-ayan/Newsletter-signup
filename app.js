
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
const credentials = require(__dirname + "/credentials.js");

const app = express();
app.use(express.static("public")); // public folder allows our server to serve up static files like styles.css, image files etc.
app.use(bodyParser.urlencoded({extended: true}));

app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };//This is JavaScript Object

  const jsonData = JSON.stringify(data);

  const url = credentials.getUrl() + credentials.getListId();

  const options = {
    method: "POST",
    auth: "Ayan:" + credentials.getApiKey()
  };

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

  // client.setConfig({
  //   apiKey: credentials.getApiKey(),
  //   server: "us14",
  // });
  //
  // const addListMember = async () => {
  //
  //   try {
  //
  //     const response = await client.lists.batchListMembers(credentials.getListId(), {
  //       members: [
  //         {
  //           email_address: email,
  //           status: "subscribed",
  //           merge_fields: {
  //             FNAME: firstName,
  //             LNAME: lastName
  //           }
  //         }
  //       ],
  //     });
  //     console.log(response);
  //     res.send("success");
  //
  //   } catch (e) {
  //       console.log(e);
  //       res.send("failed");
  //   }
  //
  // };
  //
  // addListMember();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running.");
});
