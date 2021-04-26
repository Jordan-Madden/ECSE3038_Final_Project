function createPatientCards(){
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

    var patientIdDiv = document.createElement("DIV");
    patientIdDiv.classList.add("patient_id");
    var patientIdSpan1 = document.createElement("SPAN");
    patientIdSpan1.innerHTML = "Patient ID";
    var patientIdSpan2 = document.createElement("SPAN");
    patientIdSpan2.innerHTML = "15:C2:4E:91";
    patientIdDiv.append(patientIdSpan1);
    patientIdDiv.append(patientIdSpan2);

    var positionDiv = document.createElement("DIV");
    positionDiv.classList.add("position");
    var positionSpan1 = document.createElement("SPAN");
    positionSpan1.innerHTML = "Position";
    var positionSpan2 = document.createElement("SPAN");
    positionSpan2.innerHTML = 150;
    positionDiv.append(positionSpan1);
    positionDiv.append(positionSpan2);

    var tempDiv = document.createElement("DIV");
    tempDiv.classList.add("temperature");
    var tempSpan1 = document.createElement("SPAN");
    tempSpan1.innerHTML = "Temperature";
    var tempSpan2 = document.createElement("SPAN");
    tempSpan2.innerHTML = 36;
    tempDiv.append(tempSpan1);
    tempDiv.append(tempSpan2);

    displayDiv.append(patientIdDiv);
    displayDiv.append(positionDiv);
    displayDiv.append(tempDiv);          

    patientDataDiv.append(patientImgDiv);
    patientDataDiv.append(displayDiv);

    return patientDataDiv;
}

function getPatientData(){
    return fetch("http://192.168.1.7:5000/data")
        .then(res => res.json)
        .then(json => json);
}

async function displayPatientData(){
    // let patients = await getPatientData();
    // console.log(patients);
    let i = 0;
    while(i < 5){
        var content = document.querySelector(".content");
        content.append(createPatientCards());
        i++;
    }
}

window.onload = function(){
    console.log("[INFO] Working...");
    displayPatientData();
}