let data = [];

// When the request is cancelled before it is complete
const controller = new AbortController();
const signal = controller.signal;

// Cancel the fetch request in 1s (in-flight request)
setTimeout(() => controller.abort(), 1000);

try {
    fetch('https://dummyjson.com/products', { signal })
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

            const contentDiv = document.getElementsByClassName('container')[0];

            data.forEach(product => {
                console.log(product.title);

                const boxDiv = document.createElement('div');
                boxDiv.className = "box";

                const productDiv = document.createElement('div');
                productDiv.className = "products";

                const link = document.createElement('a');
                link.src = "./product.html";
                link.target = "_blank";

                let thumbnail = product.images.filter((link) => link.includes("thumbnail"));
                thumbnail = thumbnail.length == 0 ? product.images[product.images.length - 1] : thumbnail[0];

                productDiv.innerHTML = `
                <img src="${thumbnail}" alt="${product.title}" class="thumbnail" />
                <p class="price" id="percentage">-${product.discountPercentage}% ⚡</p>
                <p class="price">$${product.price}</p>
                <h2>${product.title}</h2>
                <p>${product.category}</p>
                <p>${product.stock} left!</p>
                `

                // Add an event listener to the product div
                productDiv.addEventListener('click', () => {
                    // Set the new URL when the product is clicked
                    window.open(`./public/product.html?productId=${product.id}`, '_blank');
                });

                contentDiv.appendChild(boxDiv);
                boxDiv.appendChild(link);
                link.appendChild(productDiv);
            });

        }).catch(error => {
            console.error('Error fetching data:', error);
        });
} catch (Error) {
    console.log("Error: " + Error);
}

class Product {
    constructor(title, price, discount, category, stock, thumbnail) {
        this.title = title;
        this.price = price;
        this.discount = discount;
        this.category = category;
        this.stock = stock;
        this.thumbnail = thumbnail;
    }
}