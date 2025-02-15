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
        supplier: form[0].value,
        amount: form[1].value,
        sourceDoc: form[2].value,
        particulars: form[3].value,
        discount: form[4].value,
        date: form[5].value,
        account: form[6].value,
        wTax: form[7].value,
        tin: form[8].value
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
    .then(dataPc => {
        let pcData = dataPc.pcData;
        let trtd = pcData.reverse().map(each => {
            let formattedDate = new Date(each[6]).toLocaleDateString('en-CA');
            return `
                <tr>
                    <td class="supplierData">${each[1]}</td>
                    <td class="amountData">${each[2]}</td>
                    <td class="soureDocData">${each[3]}</td>
                    <td class="particularsData">${each[4]}</td>
                    <td class="discountData">${each[5]}</td>
                    <td class="dateData">${formattedDate}</td>
                    <td class="accountData">${each[7]}</td>
                    <td class="wTaxData">${each[8]}</td>
                    <td class="tinData">${each[9]}</td>
                    
                </tr>
            `;
        });
        tbody.innerHTML = trtd.join("");
    });
}

readData();

function delData(pettyCashId) {

    const url = api + `?del=true&pettyCashId=${pettyCashId}`;

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
   
    let custom = elm.parentElement.querySelector().textContent;
    form[0].value = tin;

    let customer = elm.parentElement.querySelector(".customerData").textContent;
    form[1].value = customer;

    let address = elm.parentElement.querySelector(".addressData").textContent;
    form[2].value = address;

    let registration = elm.parentElement.querySelector(".registrationData").textContent;
    form[3].value = registration;

    let date = elm.parentElement.querySelector(".dateData").textContent;
    form[4].value = date;


    update.setAttribute("onclick", `updateData(${id})`);
}
    */  


function updateData(pettyCashId) {
    if (!validateForm()) return;



    fetch(api + `?update=true&pettyCashId=${pettyCashId}&supplier=${form[0].value}&amount=${form[1].value}&sourceDoc=${form[2].value}&particulars=${form[3].value}&discount=${form[4].value}&date=${form[5].value}&account=${form[6].value}&wTax=${form[7].value}&tin=${form[8].value}`)
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
    errorMessage.style.display = "none";
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
    .then(dataPc => {
        let pcData = dataPc.pcData;
        pcData.forEach(each => {
            let tin = each[9];
            if (tin === searchQuery) { 

                let formattedDate = new Date(each[6]).toLocaleDateString('en-CA');
                
                form.querySelector(".supplier").value = each [1];
                form.querySelector(".amount").value = each[2];
                form.querySelector(".sourceDoc").value = each[3];
                form.querySelector(".particulars").value = each[4];
                form.querySelector(".discount").value = each[5];
                form.querySelector(".date").value = formattedDate;
                form.querySelector(".account").value = each[7];
                form.querySelector(".wTax").value = each[8];
                form.querySelector(".tin").value = each[9];
               
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
        const supplier = row.querySelector('.suppliertData').textContent.toLowerCase();
        const amount = row.querySelector('.amountData').textContent.toLowerCase();
        const sourceDoc = row.querySelector('.sourceDocData').textContent.toLowerCase();
        const particulars = row.querySelector('.particularsData').textContent.toLowerCase();
        const discount = row.querySelector('.discountData').textContent.toLowerCase();
        const date = row.querySelector('.dateData').textContent.toLowerCase();
        const account = row.querySelector('.accountData').textContent.toLowerCase();
        const wTax = row.querySelector('.wTaxData').textContent.toLowerCase();
        const tin = row.querySelector('.tinData').textContent.toLowerCase();
        

        if (supplier.includes(searchQuery) || amount.includes(searchQuery) || sourceDoc.includes(searchQuery) || particulars.includes(searchQuery) || discount.includes(searchQuery) || date.includes(searchQuery) || account.includes(searchQuery) || wTax.includes(searchQuery) || tin.includes(searchQuery)) {
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

    // Adjust endDate to include records on the same day by setting it to the next day
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1); // Move to the next day
    const endDay = nextDay.toISOString().split('T')[0]; // Format to YYYY-MM-DD

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
    });

    

    
}

function showModal(id) {
    
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


