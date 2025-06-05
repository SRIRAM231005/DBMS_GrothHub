const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);

BusinessDetails = JSON.parse(localStorage.getItem('UserBusinessInfo'));
console.log("check12",BusinessDetails);

let BankDetails;

BankDetails = JSON.parse(localStorage.getItem('BankDetails'));

document.querySelector('.bank-name h1').textContent = BusinessDetails.BusinessName;

const socket = io("http://localhost:8008");
socket.on('updateBanks', (bank) => {
    let data;
    console.log('Received updated bank details:', bank);
    bank.forEach((ele) =>{
        if(ele.BusinessName == BusinessDetails.BusinessName && ele.Usernme == credentials){
            data = ele;
            UpdateAllDetails(ele);
        }
    })
    //console.log("BankDetails:",data);
    //UpdateAllDetails(BankDetails); 
});


document.addEventListener("DOMContentLoaded", function () {
    const navItems = [
        { img: "chart-no-axes-combined", text: "Investing", badge: "1", link: "stocksProfile.html" },//images/Investing.png
        { img: "building-2", text: "Business", badge: "8", link: "business.html" },//images/Business.png
        { img: "circle-dollar-sign", text: "Earnings", badge: null, link: "home.html" },//images/Earnings.png
        { img: "circle-user-round", text: "Profile", badge: "1", link: "profile.html", active: true }//images/Profile.png
    ];

    const bottomNav = document.getElementById("bottomNav");

    navItems.forEach(item => {
        const navDiv = document.createElement("div");
        navDiv.classList.add("nav-item");
        if (item.active) navDiv.classList.add("active");

        navDiv.innerHTML = `
            <i data-lucide="${item.img}" class="icon"></i>
            <span class="text">${item.text}</span>
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ""}
        `;//<img src="${item.img}">

        bottomNav.appendChild(navDiv);

        navDiv.addEventListener("click", () => {
            window.location.href = item.link;
        });
    });

    lucide.createIcons();
});

/*function openDialog() {
    document.getElementById('settings-dialog').classList.remove('hidden');
}
function closeDialog() {
    document.getElementById('settings-dialog').classList.add('hidden');
}*/



// Set up event listeners for the settings dialog
function setupSettingsDialog() {
    const settingsButton = document.querySelector('.settings-button');
    const dialog = document.getElementById('settings-dialog');
    const closeButton = document.querySelector('.close-dialog');
    const cancelButton = document.querySelector('.cancel-button');
    const saveButton = document.querySelector('.save-button');
    
    // Slider elements
    const depositRateSlider = document.getElementById('deposit-rate-slider');
    const depositRateValue = document.getElementById('deposit-rate-value');
    const creditRateSlider = document.getElementById('credit-rate-slider');
    const creditRateValue = document.getElementById('credit-rate-value');
    
    // Keep track of original values
    let originalDepositRate = depositRateSlider.value;
    let originalCreditRate = creditRateSlider.value;
    
    // Open the dialog
    settingsButton.addEventListener('click', () => {
      // Store original values when opening
      originalDepositRate = depositRateSlider.value;
      originalCreditRate = creditRateSlider.value;
      
      dialog.classList.add('active');
    });
    
    // Close the dialog
    function closeDialog() {
      dialog.classList.remove('active');
    }
    
    closeButton.addEventListener('click', closeDialog);
    cancelButton.addEventListener('click', () => {
      // Reset to original values when canceling
      depositRateSlider.value = originalDepositRate;
      creditRateSlider.value = originalCreditRate;
      updateRateDisplay(depositRateSlider, depositRateValue);
      updateRateDisplay(creditRateSlider, creditRateValue);
      closeDialog();
    });
    
    // Also close when clicking outside the dialog
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeDialog();
      }
    });
    
    // Update values as sliders change
    depositRateSlider.addEventListener('input', () => {
      updateRateDisplay(depositRateSlider, depositRateValue);
    });
    
    creditRateSlider.addEventListener('input', () => {
      updateRateDisplay(creditRateSlider, creditRateValue);
    });
    
    // Save changes
    saveButton.addEventListener('click', () => {
      // Update the displayed rates on the dashboard
      const depositRateElement = document.getElementById('deposit-rate');
      const creditRateElement = document.getElementById('credit-rate');
      
      depositRateElement.textContent = depositRateSlider.value + '%';
      creditRateElement.textContent = creditRateSlider.value + '%';
      
      // Simulate some financial calculations and update the dashboard
      SettingInterestsRates(depositRateSlider.value, creditRateSlider.value);
      
      closeDialog();
    });
  }

// Set up event listeners for the settings dialog
setupSettingsDialog();

// Helper function to update the rate display as slider moves
function updateRateDisplay(slider, valueDisplay) {
    valueDisplay.textContent = slider.value + '%';
  }


async function SettingInterestsRates(DebitInterestRate,CreditInterestRate){
    // DebitInterestRate = document.getElementById('deposit-rate').value;
    // CreditInterestRate = document.getElementById('credit-rate').value;
    console.log('DebitInterestRate:',DebitInterestRate);
    console.log('CreditInterestRate:',CreditInterestRate);

    try {
        const response = await fetch('http://localhost:8008/Bank-Corporationbusiness/SettingInterestsRates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                businessname: BusinessDetails.BusinessName,
                creditInterest: CreditInterestRate,
                debitInterest: DebitInterestRate,
            })
        });
    
        let SettingInterestsRates = await response.json();
        if(SettingInterestsRates.retry){
            setTimeout(SettingInterestsRates(depositRateSlider.value, creditRateSlider.value), 1000);
        }else{
            console.log('SettingInterestsRates:',SettingInterestsRates);
        }
    } catch (error) {
        console.error("❌ Error Setting Interests Rates:", error);
        return null;
    }
    closeDialog();
}

async function fetchDisplayBankDetails(){
    try {
        const response = await fetch('http://localhost:8008/Bank-Corporationbusiness/DisplayBankDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: credentials,
                businessname: BusinessDetails.BusinessName,
            })
        });
        let DisplayBankDetails = await response.json();
        if(DisplayBankDetails.retry){
            setTimeout(fetchDisplayBankDetails(), 1000);
        }else{
            console.log('DisplayBankDetails:',DisplayBankDetails);
            UpdateAllDetails(DisplayBankDetails[0]);
        }
    } catch (error) {
        console.error("❌ Error Setting Interests Rates:", error);
        return null;
    }
}

fetchDisplayBankDetails();

function UpdateAllDetails(BankDetails){
    console.log("hii");
    document.querySelector(".main-balance h2").textContent = `${formatNumberWithCommas(Number(BankDetails.TotalDeposits) - Number(BankDetails.TotalCredits))}`;
    document.getElementById("deposit-rate").textContent = `${BankDetails.DebitInt}%`;
    document.getElementById("credit-rate").textContent = `${BankDetails.CreditInt}%`;
    document.querySelector(".DepositsMoney").textContent = `${formatNumberWithCommas(BankDetails.TotalDeposits)}`;
    document.querySelector(".CreditsMoney").textContent = `${formatNumberWithCommas(BankDetails.TotalCredits)}`;
    document.querySelector(".vault-amount").textContent = `${formatNumberWithCommas(BankDetails.TotalAmount)}`;
    document.querySelector(".turnover-amount").textContent = `${formatNumberWithCommas(BankDetails.TotalAmount)}`;
    localStorage.setItem("BankDetails", JSON.stringify(BankDetails));
}



// Helper function to format numbers with commas
function formatNumberWithCommas(number) {
    number = Number(number);
    return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
