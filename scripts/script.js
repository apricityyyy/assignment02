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
        console.log(json);
        data = json.products;

        // Assuming data is an array of objects
        const contentDiv = document.getElementsByClassName('container')[0];

        data.forEach(product => {
            const boxDiv = document.createElement('div');
            boxDiv.className = "box";

            const productDiv = document.createElement('div');
            productDiv.className = "products";

            let thumbnail = product.images.filter((link) => link.includes("thumbnail"));
            thumbnail = thumbnail.length == 0 ? product.images[0] : thumbnail[0];
            
            productDiv.innerHTML = `
                <img src="${thumbnail}" alt="${product.title}" />
                <p class="price">Price: ${product.price}</p>
                <p class="price">Discount: ${product.discountPercentage}%</p>
                <h2>${product.title}</h2>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
            `

            contentDiv.appendChild(boxDiv);
            boxDiv.appendChild(productDiv);
        });

    }).catch(error => {
        console.error('Error fetching data:', error);
    });
} catch (Error) {
    console.log("Error: " + Error);
}

class Product{
    constructor(title, price, discount, category, stock, thumbnail) {
        this.title = title;
        this.price = price;
        this.discount = discount;
        this.category = category;
        this.stock = stock;
        this.thumbnail = thumbnail;
    }
}