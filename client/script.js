function createPatientCards(patient){
    var patientDataDiv = document.createElement("DIV");
    patientDataDiv.classList.add("patient_data");

    // Patient Image Div
    var patientImgDiv = document.createElement("DIV");
    patientImgDiv.classList.add("patient_img");

    var patientImgImg = document.createElement("IMG");
    patientImgImg.src = "images/user.png";
    patientImgDiv.append(patientImgImg);

    // Display Div
    var displayDiv = document.createElement("DIV");
    displayDiv.classList.add("display");

    var firstNameDiv = document.createElement("DIV");
    firstNameDiv.classList.add("first_name");
    var firstNameSpan1 = document.createElement("SPAN");
    firstNameSpan1.innerHTML = "First Name";
    var firstNameSpan2 = document.createElement("SPAN");
    firstNameSpan2.innerHTML = "John";
    firstNameDiv.append(firstNameSpan1);
    firstNameDiv.append(firstNameSpan2);

    var lastNameDiv = document.createElement("DIV");
    lastNameDiv.classList.add("last_name");
    var lastNameSpan1 = document.createElement("SPAN");
    lastNameSpan1.innerHTML = "Last Name";
    var lastNameSpan2 = document.createElement("SPAN");
    lastNameSpan2.innerHTML = "Doe";
    lastNameDiv.append(lastNameSpan1);
    lastNameDiv.append(lastNameSpan2);

    var positionDiv = document.createElement("DIV");
    positionDiv.classList.add("position");
    var positionSpan1 = document.createElement("SPAN");
    positionSpan1.innerHTML = "Position";
    var positionSpan2 = document.createElement("SPAN");
    positionSpan2.innerHTML = 350;
    positionDiv.append(positionSpan1);
    positionDiv.append(positionSpan2);
    

    var patientIdDiv = document.createElement("DIV");
    patientIdDiv.classList.add("patient_id");
    var patientIdSpan1 = document.createElement("SPAN");
    patientIdSpan1.innerHTML = "Patient ID";
    var patientIdSpan2 = document.createElement("SPAN");
    patientIdSpan2.innerHTML = "15:C2:4E:91";
    patientIdDiv.append(patientIdSpan1);
    patientIdDiv.append(patientIdSpan2);

    displayDiv.append(firstNameDiv);
    displayDiv.append(lastNameDiv);   
    displayDiv.append(positionDiv); 
    displayDiv.append(patientIdDiv);      

    patientDataDiv.append(patientImgDiv);
    patientDataDiv.append(displayDiv);

    return patientDataDiv;
}

function getPatientData(){
    return fetch("http://192.168.1.11:5000/api/patient").then(res => res.json()).then(json => json)
}

async function displayPatientData(){
    let patients = await getPatientData();
    console.log(patients);

    patients.forEach(patient => {
        var content = document.querySelector(".content");
        content.append(createPatientCards(patient));
    });
}

window.onload = function(){
    //console.log("[INFO] Working...");
    displayPatientData();
}