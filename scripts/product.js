// When the request is cancelled before it is complete
const controller = new AbortController();
const signal = controller.signal;

// Cancel the fetch request in 1s (in-flight request)
setTimeout(() => controller.abort(), 1000);


// get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');
console.log(productId);

try {
    fetch(`https://dummyjson.com/products/${productId}`, { signal })
        .then(res => {
            // When the network status code is not in the range 200 to 299
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }

            return res.json();
        })
        .then(json => {
            product = json;
            document.querySelector('title').textContent = product.title;


            
        })
} catch (Error) {
    console.log("Error: " + Error);
}