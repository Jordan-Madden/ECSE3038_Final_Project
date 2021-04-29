// Get id from session and clear the session
var id = sessionStorage.getItem("patient_id");
console.log(id);
sessionStorage.removeItem("patient_id");
sessionStorage.clear();

let button = document.querySelector(".button");
button.addEventListener("click", function(event){
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let age = document.getElementById("age").value;
    let patient_id = document.getElementById("patient_id").value;

    if((first_name == "")||(last_name == "")||(patient_id == "")||(age == "")){
        // If any of the fields are left blank then make PATCH request
        console.log("Make PATCH Request");

        jsonBody = {};

        for(i=0; i< 4; i++){
            if (first_name != ""){
                jsonBody["first_name"] = first_name;
            }
            if (last_name != ""){
                jsonBody["last_name"] = last_name;
            }
            if (age != ""){
                jsonBody["age"] = age;
            }
            if (patient_id != ""){
                jsonBody["patient_id"] = patient_id;
            }                    
        }
        fetch("http://192.168.1.11:5000/api/patient/" + id, {
            method: "PATCH",
            body: JSON.stringify(jsonBody),
            headers:{
                 "Content-type": "application/json",
            },
        })
        .then((res) => res.json)
        .then((json) => console.log(json));

        // Clear the boxes so the user knows his request has gone through
        document.getElementById("first_name").value = "";
        document.getElementById("last_name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("patient_id").value = "";
    }
    else{
        // If all fields are full, then make POST request
        console.log("Make POST Request");

        jsonBody = {
            "first_name": first_name,
            "last_name": last_name,
            "age": age,
            "patient_id": patient_id,
        };

        fetch("http://192.168.1.11:5000/api/patient", {
            method: "POST",
            body: JSON.stringify(jsonBody),
            headers:{
                 "Content-type": "application/json",
            },
        })
        .then((res) => res.json)
        .then((json) => console.log(json));

        // Clear the boxes so the user knows his request has gone through
        document.getElementById("first_name").value = "";
        document.getElementById("last_name").value = "";
        document.getElementById("age").value = "";
        document.getElementById("patient_id").value = "";
    }
});