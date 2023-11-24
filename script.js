let data = [];

// When the request is cancelled before it is complete
const controller = new AbortController();
const signal = controller.signal;

// Cancel the fetch request in 1s (in-flight request)
setTimeout(() => controller.abort(), 1000);

try {
    fetch('https://dummyjson.com/products', {signal})
    .then(res => {
        // When the network status code is not in the range 200 to 299
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        return res.json();
    })
    .then((json) => {
        data = json;
        console.log(data);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
} catch (Error) {
    console.log("Error: " + Error);
}