
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

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

  const url = "https://us14.api.mailchimp.com/3.0/lists/5eed24e3ca";

  const options = {
    method: "POST",
    auth: "Ayan:e67bfe9bf7a26b8f7c09cf38028456b0-us14"
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
  //   apiKey: "e67bfe9bf7a26b8f7c09cf38028456b0-us14",
  //   server: "us14",
  // });
  //
  // const addListMember = async () => {
  //
  //   try {
  //
  //     const response = await client.lists.batchListMembers("5eed24e3ca", {
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


// API Key: e67bfe9bf7a26b8f7c09cf38028456b0-us14
// ListId: 5eed24e3ca
