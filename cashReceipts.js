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
        customerCr: form[0].value,
        reference: form[1].value,
        datePaid: form[2].value,
        sourceDoc: form[3].value,
        discount: form[4].value,
        particulars: form[5].value,
        amount: form[6].value,
        wTax: form[7].value,
    };

    fetch(api, {
        method: "POST",
        body: JSON.stringify(obj)
    })
    .then(() => {
        readData();
      
        form.reset();
        showAddSuccessModal();
      
    });
}


function readData() {
    fetch(api)
    .then(res => res.json())
    .then(dataCr => {
        let crData = dataCr.crData;
        let trtd = crData.reverse().map(each => {
            let formattedDate = new Date(each[3]).toLocaleDateString('en-CA');
            return `
                <tr>
                    <td class="customerData">${each[1]}</td>
                    <td class="referenceData">${each[2]}</td>
                    <td class="datePaidData">${formattedDate}</td>
                    <td class="sourceDocData">${each[4]}</td>
                    <td class="discountData">${each[5]}</td>
                    <td class="particularsData">${each[6]}</td>
                    <td class="amountData">${each[7]}</td>
                    <td class="w/tax">${each[8]}</td>
                 
                    
                </tr>
            `;
        });
        tbody.innerHTML = trtd.join("");
    });
}

readData();


function delData(cashReceiptId) {
   
    const url = api + `?del=true&cashReceiptId=${cashReceiptId}`;

    fetch(url)
        .then(res => res.text())
        .then(() => {
            readData();
            form.reset();
           showDelSuccessModal();
        });
}


function updateData(cashReceiptId) {
    if (!validateForm()) return;

   
  

    fetch(api + `?update=true&cashReceiptId=${cashReceiptId}&customer=${form[0].value}&reference=${form[1].value}&datePaid=${form[2].value}&sourceDoc=${form[3].value}&discount=${form[4].value}&particulars=${form[5].value}&amount=${form[6].value}&wTax=${form[7].value}`)
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


function searchExactData() {
    const searchBtn = document.querySelector(".searchbtnID");
    searchBtn.innerHTML =  '<i class="fa-solid fa-spinner"></i>';
    
    const searchQuery = document.getElementById('searchQuery').value;
    let found = false;

    fetch(api)
    .then(res => res.json())
    .then(dataCr => {
        let crData = dataCr.crData;
        crData.forEach(each => {
            let customer = each[1];
            if (customer === searchQuery) { 

                let formattedDate = new Date(each[3]).toLocaleDateString('en-CA');
                
                form.querySelector(".customer").value = each [1];
                form.querySelector(".reference").value = each[2];
                form.querySelector(".datePaid").value = formattedDate;
                form.querySelector(".sourceDoc").value = each[4];
                form.querySelector(".discount").value = each[5];
                form.querySelector(".particulars").value = each[6];
                form.querySelector(".amount").value = each[7];
                form.querySelector(".wTax").value = each[8];
               
               
                form.querySelector(".update").style.display = "inline";
                form.querySelector(".delete").style.display = "inline";

                form.querySelector(".update").setAttribute("onclick", `showUpdateModal(${each[0]})`);
                form.querySelector(".delete").setAttribute("onclick", `showModal(${each[0]})`);

                found = true;
                return;
            }
        });

        if (!found) {
            alert("No matching record found.");
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
        const customer = row.querySelector('.customerData').textContent.toLowerCase();
        const reference = row.querySelector('.referenceData').textContent.toLowerCase();
        const datePaid = row.querySelector('.datePaidData').textContent.toLowerCase();
        const soureDoc = row.querySelector('.sourceDocData').textContent.toLowerCase();
        const discount = row.querySelector('.discountData').textContent.toLowerCase();
        const particulars = row.querySelector('.particularsData').textContent.toLowerCase();
        const amount = row.querySelector('.amountData').textContent.toLowerCase();
        const wTax = row.querySelector('.wTaxData').textContent.toLowerCase();
        

        if (customer.includes(searchQuery) || reference.includes(searchQuery) || datePaid.includes(searchQuery) || soureDoc.includes(searchQuery) || discount.includes(searchQuery) || particulars.includes(searchQuery) || amount.includes(searchQuery) || wTax.includes(searchQuery)) {
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
        const datePaidData = row.querySelector('.datePaidData').textContent.trim();
        const rowDate = new Date(datePaidData);

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
    cashReceiptId = id;
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




