const credentials= localStorage.getItem('credentials');
console.log(credentials);


async function fetchBalance(username){
    try {
        const response = await fetch('http://localhost:8008/user/Balance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log('Balance:',data);
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}

async function fetchStatistics(username){
    try {
        const response = await fetch('http://localhost:8008/user/Statistics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        console.log('Statistics:',data);
        //return data; // Return fetched data
    } catch (error) {
        console.error("❌ Error fetching IT main business:", error);
        return null;
    }
}