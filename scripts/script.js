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
            data = json.products;

            const contentDiv = document.getElementsByClassName('container')[0];

            data.forEach(product => {
                const boxDiv = document.createElement('div');
                boxDiv.className = "box";
                boxDiv.id = `"${product.id}"`;

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

            function searchTheProduct() {
                let inputEl = document.getElementById('search');
            
                data.forEach(product => {
                    // Convert the search criteria to lowercase for case-insensitive comparison
                    let lowercaseSearch = inputEl.value.toLowerCase();
                    let productData = [product.title, product.description, product.category].map(item => item.toLowerCase());
            
                    // Check if the lowercase search term is included in any of the lowercase product data
                    if (!productData.some(item => item.includes(lowercaseSearch))) {
                        // If not found, hide the corresponding product
                        let boxDiv = document.getElementById(`"${product.id}"`);
                        if (boxDiv) {
                            boxDiv.style.display = "none";
                        }
                    } else {
                        // If found, show the corresponding product
                        let boxDiv = document.getElementById(`"${product.id}"`);
                        if (boxDiv) {
                            boxDiv.style.display = "block";
                        }
                    }
                });
            }

            function filterTheProduct() {
                let inputEl = document.getElementById('category');
                console.log(inputEl.value);
            
                if (inputEl.value !== "--") {
                    data.forEach(product => {
                        let searchData = inputEl.value;
                        console.log(searchData)
                        let productData = product.category
                
                        // Check if the lowercase search term is included in any of the lowercase product data
                        if (productData !== searchData) {
                            // If not found, hide the corresponding product
                            let boxDiv = document.getElementById(`"${product.id}"`);
                            console.log("boxDiv: " + boxDiv);
                            if (boxDiv) {
                                boxDiv.style.display = "none";
                            }
                        } else {
                            // If found, show the corresponding product
                            let boxDiv = document.getElementById(`"${product.id}"`);
                            console.log("boxDiv: " + boxDiv);
                            if (boxDiv) {
                                boxDiv.style.display = "block";
                            }
                        }
                    });
                } else {
                    data.forEach(product => {
                        let boxDiv = document.getElementById(`"${product.id}"`);
                        boxDiv.style.display = "block";
                    })
                }                
            }
            
            let buttonEl = document.getElementById("search-button");
            buttonEl.addEventListener('click', searchTheProduct);
            
            let selectBoxDiv = document.querySelector(".select-box");
            selectBoxDiv.addEventListener('click', filterTheProduct);
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