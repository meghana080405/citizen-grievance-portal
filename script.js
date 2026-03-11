// LOGIN

function loginUser(e){

e.preventDefault()

let email=document.getElementById("email").value
let password=document.getElementById("password").value
let role=document.getElementById("role").value

let storedUser=JSON.parse(localStorage.getItem("user"))

if(storedUser && storedUser.email===email && storedUser.password===password){

if(role==="citizen"){
window.location="citizen-home.html"
}else{
window.location="admin-dashboard.html"
}

}else{

alert("Invalid login credentials")

}

}
function toggleProfile(){

let dropdown = document.getElementById("profileDropdown")

if(dropdown.style.display === "block"){

dropdown.style.display = "none"

}else{

dropdown.style.display = "block"

}

}

// REGISTER

function registerUser(e){

e.preventDefault()

let user={

name:document.getElementById("name").value,
email:document.getElementById("email").value,
password:document.getElementById("password").value,
role:document.getElementById("role").value

}

localStorage.setItem("user",JSON.stringify(user))

alert("Registration Successful")

window.location="login.html"

}


// GOOGLE LOGIN (demo)

function googleLogin(){

let name=prompt("Enter your name")
let email=prompt("Enter your email")

if(!name || !email) return

let user={

name:name,
email:email,
role:"citizen"

}

localStorage.setItem("user",JSON.stringify(user))

window.location="citizen-home.html"

}


// PROFILE LOAD

function loadProfile(){

let user=JSON.parse(localStorage.getItem("user"))

if(!user) return

document.getElementById("profileName").innerText=user.name
document.getElementById("profileNameCard").innerText=user.name
document.getElementById("profileEmail").innerText=user.email

let first=user.name.charAt(0).toUpperCase()

let a1=document.getElementById("avatarLetter")
let a2=document.getElementById("avatarLarge")

if(a1) a1.innerText=first
if(a2) a2.innerText=first

let welcome=document.getElementById("welcomeText")
if(welcome) welcome.innerText="Welcome back, "+user.name

}


// LOGOUT

function logoutUser(){

localStorage.removeItem("user")
window.location="login.html"

}


// COMPLAINT SUBMISSION

function submitComplaint(e){

e.preventDefault()

let title=document.getElementById("title").value
let description=document.getElementById("description").value
let location=document.getElementById("location").value

let complaints=JSON.parse(localStorage.getItem("complaints")) || []

let complaintId="GRV-"+Date.now()

let complaint={

complaintId:complaintId,
title:title,
description:description,
location:location,
category:selectedCategory,
status:"Pending",
department:"Not Assigned"

}

complaints.push(complaint)

localStorage.setItem("complaints",JSON.stringify(complaints))

alert("Complaint Submitted")

window.location="complaints.html"

}


// GPS LOCATION

function getLocation(){

if(navigator.geolocation){
navigator.geolocation.getCurrentPosition(showPosition)
}

}

function showPosition(position){

let lat=position.coords.latitude
let long=position.coords.longitude

document.getElementById("location").value="Lat: "+lat+" , Long: "+long

}


// IMAGE PREVIEW

function previewImage(event){

let file=event.target.files[0]

if(file){

let reader=new FileReader()

reader.onload=function(){

let img=document.getElementById("preview")

img.src=reader.result
img.style.display="block"

}

reader.readAsDataURL(file)

}

}


// LOAD COMPLAINTS

function loadComplaints(){

let complaints=JSON.parse(localStorage.getItem("complaints")) || []

let container=document.getElementById("complaintsContainer")

container.innerHTML=""

if(complaints.length===0){

container.innerHTML="<p>No complaints found</p>"
return
filterComplaints()
}

complaints.forEach((c,index)=>{

let card=`
<div class="complaint-card">

<h4>${c.title}</h4>

<p><strong>ID:</strong> ${c.complaintId}</p>

<p>${c.description}</p>

<p><strong>Location:</strong> ${c.location}</p>

<p>Status: ${c.status}</p>

<a href="complaint-details.html?id=${index}">
View Details
</a>

</div>
`

container.innerHTML+=card

})

}


// ADMIN DASHBOARD

function loadAdminDashboard(){

let complaints=JSON.parse(localStorage.getItem("complaints")) || []

let container=document.getElementById("adminComplaintsContainer")

container.innerHTML=""

complaints.forEach((c,index)=>{

let card=`

<div class="complaint-card">

<h4>${c.title}</h4>

<p>ID: ${c.complaintId}</p>

<p>${c.description}</p>

<p>Status: ${c.status}</p>

<button onclick="assignDepartment(${index})">
Assign Department
</button>

<button onclick="setInProgress(${index})">
Start Work
</button>

<button onclick="resolveComplaint(${index})">
Resolve
</button>

</div>

`

container.innerHTML+=card

})

}


// ASSIGN DEPARTMENT

function assignDepartment(index){

let complaints=JSON.parse(localStorage.getItem("complaints"))

let dept=prompt("Enter Department")

if(!dept) return

complaints[index].department=dept
complaints[index].status="Assigned"

localStorage.setItem("complaints",JSON.stringify(complaints))

loadAdminDashboard()

}


// STATUS UPDATE

function setInProgress(index){

let complaints=JSON.parse(localStorage.getItem("complaints"))

complaints[index].status="In Progress"

localStorage.setItem("complaints",JSON.stringify(complaints))

loadAdminDashboard()

}

function resolveComplaint(index){

let complaints=JSON.parse(localStorage.getItem("complaints"))

complaints[index].status="Resolved"

localStorage.setItem("complaints",JSON.stringify(complaints))

loadAdminDashboard()

}
function loadDashboardStats(){

let complaints = JSON.parse(localStorage.getItem("complaints")) || []

let total = complaints.length
let resolved = 0
let progress = 0
let pending = 0

complaints.forEach(c => {

if(c.status === "Resolved"){
resolved++
}
else if(c.status === "In Progress"){
progress++
}
else{
pending++
}

})

document.getElementById("totalComplaints").innerText = total
document.getElementById("resolvedComplaints").innerText = resolved
document.getElementById("progressComplaints").innerText = progress
document.getElementById("pendingComplaints").innerText = pending

}



function loadRecentComplaints(){

let complaints = JSON.parse(localStorage.getItem("complaints")) || []

let container = document.getElementById("recentComplaintsContainer")

container.innerHTML = ""

if(complaints.length === 0){

container.innerHTML = "<p>No complaints yet</p>"

return
}

let recent = complaints.slice(-3).reverse()

recent.forEach(c => {

let card = `
<div class="complaint-card">

<h4>${c.title}</h4>

<p>ID: ${c.complaintId}</p>

<p>${c.description}</p>

<p>Status: ${c.status}</p>

</div>
`

container.innerHTML += card

})

}
let selectedCategory = ""

function selectCategory(button){

// remove previous selection
let buttons = document.querySelectorAll(".category-btn")

buttons.forEach(btn => {
btn.classList.remove("selected-category")
})

// add selection style
button.classList.add("selected-category")

// store category
selectedCategory = button.innerText

}
function loadAdminDashboardStats(){

let complaints = JSON.parse(localStorage.getItem("complaints")) || []

let total = complaints.length
let resolved = 0
let progress = 0
let pending = 0

complaints.forEach(c => {

if(c.status === "Resolved"){
resolved++
}
else if(c.status === "In Progress"){
progress++
}
else{
pending++
}

})

document.getElementById("adminTotal").innerText = total
document.getElementById("adminResolved").innerText = resolved
document.getElementById("adminProgress").innerText = progress
document.getElementById("adminPending").innerText = pending

}
function filterComplaints(){

let complaints = JSON.parse(localStorage.getItem("complaints")) || []

let search = document.getElementById("searchInput").value.toLowerCase()

let filter = document.getElementById("statusFilter").value

let container = document.getElementById("complaintsContainer")

container.innerHTML = ""

let filtered = complaints.filter(c => {

let matchesSearch =
c.title.toLowerCase().includes(search) ||
(c.complaintId && c.complaintId.toLowerCase().includes(search))

let matchesStatus =
filter === "All" || c.status === filter

return matchesSearch && matchesStatus

})

if(filtered.length === 0){

container.innerHTML = "<p>No complaints found</p>"

return
}

filtered.forEach((c,index)=>{

let card = `
<div class="complaint-card">

<h4>${c.title}</h4>

<p><strong>ID:</strong> ${c.complaintId}</p>

<p>${c.description}</p>

<p>Status: ${c.status}</p>

</div>
`

container.innerHTML += card

})

}