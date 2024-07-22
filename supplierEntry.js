let api = "https://script.google.com/macros/s/AKfycbxmtcd_i-95KnjfIMlTxGISUdpgodKik9OW5xZYJRHQD3AKspUjqJ4hjIRPXVYTVByk/exec";
let form = document.querySelector("form");
let add = document.querySelector(".add");
let update = document.querySelector(".update");
let tbody = document.querySelector("tbody");

const PASSWORD = "123"; 
let deleteId = null;

function addData() {
    if (!validateForm()) return;

    let obj = {
        tinSde: form[0].value,
        nameSde: form[1].value,
        addressSde: form[2].value,
        registrationSde: form[3].value,
        contactNoSde: form[4].value,
        dateSde: form[5].value
    };

    fetch(api, {
        method: "POST",
        body: JSON.stringify(obj)
    })
    .then(res => res.text())
    .then(() => {
        readData();
        form.reset();
        showAddSuccessModal();
    });
}

function readData() {
    fetch(api)
    .then(res => res.json())
    .then(dataSde => {
        let sdeData = dataSde.sdeData;
        let trtd = sdeData.reverse().map(each => {
            let formattedDate = new Date(each[6]).toLocaleDateString('en-CA');
            return `
                <tr>
                    <td class="tinData">${each[1]}</td>
                    <td class="nameData">${each[2]}</td>
                    <td class="addressData">${each[3]}</td>
                    <td class="registrationData">${each[4]}</td>
                    <td class="contactData">${each[5]}</td>
                     <td class="dateData">${formattedDate}</td>
                </tr>
            `;
        });
        tbody.innerHTML = trtd.join("");
    });
}

readData();



function delData(supplierId) {
   

    const url = api + `?del=true&supplierId=${supplierId}`;

    fetch(url)
        .then(res => res.text())
        .then(() => {
            readData();
            form.reset();
            showDelSuccessModal();
        });
}

/*
function updateCall(elm, id) {
   
    let tin = elm.parentElement.querySelector(".tinData").textContent;
    form[0].value = tin;

    let name = elm.parentElement.querySelector(".nameData").textContent;
    form[1].value = name;

    let address = elm.parentElement.querySelector(".addressData").textContent;
    form[2].value = address;

    let registration = elm.parentElement.querySelector(".registrationData").textContent;
    form[3].value = registration;

    let contactNo = elm.parentElement.querySelector(".contactData").textContent;
    form[4].value = contactNo;


    update.setAttribute("onclick", `updateData(${id})`);
}
*/
function updateData(supplierId) {
    if (!validateForm()) return;


    fetch(api + `?update=true&supplierId=${supplierId}&tin=${form[0].value}&name=${form[1].value}&address=${form[2].value}&registration=${form[3].value}&contact=${form[4].value}&date=${form[5].value}`)
    .then(res => res.text())
    .then(() => {
        readData();
        form.reset();
        showUpdateSuccessModal();
       
    });
}

function validateForm() {
    if (form[0].value.trim() === '' || form[1].value.trim() === '' || form[2].value.trim() === '' || form[3].value.trim() === '' || form[4].value.trim() === '') {
        showValModal();
        return false;
    }
   
    return true;
}
/*
function searchData() {
    const searchQuery = document.getElementById('searchQuery').value;
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {

        const tin = row.querySelector('.tinData');
        const name = row.querySelector('.nameData');
        const address = row.querySelector('.addressData');
        const registration = row.querySelector('.registrationData');
        const contactNo = row.querySelector('.contactData');

        if (tin.includes(searchQuery) || (name.includes(searchQuery) || address.includes(searchQuery) || registration.includes(searchQuery) || contactNo.includes(searchQuery))) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
    */

function searchExactData() {
    const searchBtn = document.querySelector(".searchbtnID");
    searchBtn.innerHTML = '<i class="fa-solid fa-spinner"></i>';
    
    const searchQuery = document.getElementById('searchQuery').value;
    let found = false;

    fetch(api)
    .then(res => res.json())
    .then(dataSde => {
        let sdeData = dataSde.sdeData;
        sdeData.forEach(each => {
            let tin = each[1];
            if (tin === searchQuery) { 
                let formattedDate = new Date(each[6]).toLocaleDateString('en-CA');
                
                form.querySelector(".tin").value = each [1];
                form.querySelector(".name").value = each[2];
                form.querySelector(".address").value = each[3];
                form.querySelector(".registration").value = each[4];
                form.querySelector(".contact").value = each[5];
                form.querySelector(".date").value = formattedDate;
               
                form.querySelector(".update").style.display = "inline";
                form.querySelector(".delete").style.display = "inline";

                form.querySelector(".update").setAttribute("onclick", `showUpdateModal(${each[0]})`);
                form.querySelector(".delete").setAttribute("onclick", `showModal(${each[0]})`);

                found = true;
                return;
            }
        });

        if (!found) {
           showSearchModal();
        }
    })
    .finally(() => {
        searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    });
}

document.querySelector('.searchbtnID').onclick = searchExactData;

function searchGenData() {
    const searchQuery = document.getElementById('searchGenQuery').value.toLowerCase().trim();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const name = row.querySelector('.nameData').textContent.toLowerCase();
        const address = row.querySelector('.addressData').textContent.toLowerCase();
        const registration = row.querySelector('.registrationData').textContent.toLowerCase();
        const contact = row.querySelector('.contactData').textContent.toLowerCase();
        const date = row.querySelector('.dateDate').textContent.toLowerCase();

        if (name.includes(searchQuery) || address.includes(searchQuery) || registration.includes(searchQuery) || contact.includes(searchQuery) || date.includes(searchQuery)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function updateTimestamp() {
    const timestampElement = document.getElementById('timestamp');
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    const formattedTime = now.toLocaleDateString('en-US', options);
    timestampElement.textContent = formattedTime;
}
setInterval(updateTimestamp, 1000);

updateTimestamp();

function searchDateRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const endDay = nextDay.toISOString().split('T')[0];

    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const dateData = row.querySelector('.dateData').textContent.trim();
        const rowDate = new Date(dateData);

        if (rowDate >= new Date(startDate) && rowDate < new Date(endDay)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}


function resetTable() {
    
    document.getElementById('searchQuery').value = '';

   
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.style.display = '';
    })
}


function showModal(id) {
    if (!validateForm()) return;
    deleteId = id;
    document.getElementById('myModal').style.display = "block";
}

function hideModal() {
    const modal = document.getElementById("myModal");
    const modalContent = document.querySelector(".modal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}

    document.getElementById('modalPassword').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    deleteId = null;
}

document.querySelector('#modalCancel').onclick = hideModal;
document.querySelector('#modalSubmit').onclick = function() {
    let password = document.getElementById('modalPassword').value;
    if (password === PASSWORD) {
        delData(deleteId);
        hideModal();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }
};

function showAddModal() {
    if (!validateForm()) return;
    document.getElementById('addModal').style.display = "block";
}

function hideAddModal() {
    const modal = document.getElementById("addModal");
    const modalContent = document.querySelector(".addModal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}
}

document.querySelector('#modalAddCancel').onclick = hideAddModal;
document.querySelector('#modalAddSubmit').onclick = function() {
    addData();
    hideAddModal();
};

function showAddSuccessModal() {
    document.getElementById('addSuccessModal').style.display = "block";
}

function hideAddSuccessModal() {
    const modal = document.getElementById("addSuccessModal");
    const modalContent = document.querySelector(".addSuccessModal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}
}

document.querySelector('#modalAddSuccessConfirm').onclick = hideAddSuccessModal;

function showDelSuccessModal() {
    document.getElementById('delSuccessModal').style.display = "block";
}

function hideDelSuccessModal() {
    const modal = document.getElementById("delSuccessModal");
    const modalContent = document.querySelector(".delSuccessModal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}
}

document.querySelector('#modalDelSuccessConfirm').onclick = hideDelSuccessModal;

function showSearchModal() {
    document.getElementById('searchModal').style.display = "block";
}

function hideSearchModal() {
    const modal = document.getElementById("searchModal");
    const modalContent = document.querySelector(".searchModal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}
}

document.querySelector('#modalSearchConfirm').onclick = hideSearchModal;

function showValModal() {
    document.getElementById('valModal').style.display = "block";
}

function hideValModal() {
    const modal = document.getElementById("valModal");
    const modalContent = document.querySelector(".valModal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}
}

document.querySelector('#modalValConfirm').onclick = hideValModal;

function showUpdateModal(id) {
    customerId = id;
    if (!validateForm()) return;
    document.getElementById('updateModal').style.display = "block";
}

function hideUpdateModal() {
    const modal = document.getElementById("updateModal");
    const modalContent = document.querySelector(".updateModal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}
}

document.querySelector('#modalUpdateCancel').onclick = hideUpdateModal;
document.querySelector('#modalUpdateSubmit').onclick = function() {
    updateData(customerId);
    hideUpdateModal();
};

function showUpdateSuccessModal() {
    document.getElementById('updateSuccessModal').style.display = "block";
}

function hideUpdateSuccessModal() {
    const modal = document.getElementById("updateSuccessModal");
    const modalContent = document.querySelector(".updateSuccessModal-content");
    modalContent.style.animation = "bounceOut 0.6s forwards";
    modalContent.addEventListener('animationend', () => {
        if (modalContent.style.animationName === 'bounceOut') {
            modal.style.display = "none";
            modalContent.style.animation = ''; // Reset animation
        }
    }, { once: true }); // Ensure the event listener is removed after being called}
}

document.querySelector('#modalSuccessUpdateConfirm').onclick = hideUpdateSuccessModal;

    
   

    




