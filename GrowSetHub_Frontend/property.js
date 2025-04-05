const credentials= JSON.parse(localStorage.getItem('credentials'));
console.log(credentials);

const propertyList = document.querySelector('.property-list');
const filterButtons = document.querySelectorAll('.filter-btn');

fetchGetAllRealEstatesbelongingtoUser(credentials);

// Function to create property card HTML
function createPropertyCard(property) {
    return `
        <div class="property-card">
            <img src="${property.image}" alt="House">
            <div class="property-info">
                <h2 class="price">$ ${property.price.toLocaleString()}</h2>
                <div class="location">
                    <span class="location-icon">📍</span>
                    <span>${property.location}</span>
                </div>
                <button class="sell-btn sellbtn${property.idx}" onclick="sellProperty(credentials,${property.idx})">Sell</button>
            </div>
        </div>
    `;
}

// Function to render property list
function renderProperties(sortedProperties) {
    propertyList.innerHTML = sortedProperties.map(property => 
        createPropertyCard(property)
    ).join('');
}


filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        // Sort properties based on button text
        const sortedProperties = [...properties1].sort((a, b) => {
            if (button.textContent === 'Expensive first') {
                return b.price - a.price;
            } else {
                return a.price - b.price;
            }
        });

        // Render sorted properties
        renderProperties(sortedProperties);
    });
});


let properties1;
async function fetchGetAllRealEstatesbelongingtoUser(username){
    try {
        const response = await fetch('http://localhost:8008/investment/getAllRealEstatesBought', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username
            }),
        });
        properties1 = await response.json();
        console.log("propertiesList:",properties1);
        renderProperties([...properties1].sort((a, b) => b.price - a.price));
        //return data;
    } catch (error) {
        console.error("❌ Error fetching properties List :", error);
        return null;
    }
}

async function sellProperty(username,idx) {
    try {
        const response = await fetch('http://localhost:8008/investment/sellProperty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                idx: idx
            }),
        });
        const result = await response.json();
        console.log("Property sold successfully:", result);
    } catch (error) {
        console.error("❌ Error fetching properties List :", error);
        return null;
    }
}

