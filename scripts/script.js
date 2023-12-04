let data = [];
let needed_data = []; 

// Beginning page number
let currentPage = 1;
const productsPerPage = 10;

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

            // Display products according to their current page
            function displayProducts(start, end) {
                const contentDiv = document.getElementsByClassName('container')[0];
                contentDiv.innerHTML = '';

                // Get the subset of data
                for (let i = start, j = 0; i < end; i++, j++) {
                    needed_data[j] = data[i];
                }

                needed_data.forEach(product => {
                    // For grouping products in flex display
                    const boxDiv = document.createElement('div');
                    boxDiv.className = "box";
                    boxDiv.id = `"${product.id}"`;

                    // For representing product
                    const productDiv = document.createElement('div');
                    productDiv.className = "products";

                    // For linking to the product page
                    const link = document.createElement('a');
                    link.src = "./product.html";
                    link.target = "_blank";

                    let thumbnail = product.thumbnail;

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
            }

            function updatePagination() {
                const totalPages = Math.ceil(data.length / productsPerPage);
                const paginationDiv = document.getElementByClassName('pagination');
                paginationDiv.innerHTML = ''; // Renew the div before locating new products per page

                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.textContent = i; // "Buttons" that show each page
                    pageButton.id = `order${i}`; // For tracking which page is activated

                    pageButton.addEventListener('click', () => {
                        currentPage = i;
                        displayProducts((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
                        // Remove 'active' class from all buttons
                        document.querySelectorAll('.pagination a').forEach(button => {
                            button.classList.remove('active');
                        });

                    // Add 'active' class to the clicked button
                    pageButton.classList.add('active');

                    });

                    paginationDiv.appendChild(pageButton);
                }

                // Add 'active' class to the initial current page button
                document.getElementById(`order${currentPage}`).classList.add('active');
            }

            // When the page is loaded, start with first products per page
            displayProducts(0, productsPerPage);

            // Call updatePagination to set up pagination buttons
            updatePagination();

            function searchTheProduct() {
                let inputEl = document.getElementById('search');

                needed_data.forEach(product => {
                    // Convert the search criteria to lowercase for case-insensitive comparison
                    let lowercaseSearch = inputEl.value.toLowerCase();
                    // Get all the search criteria together
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

                // If the input element is not default
                if (inputEl.value !== "--") {
                    needed_data.forEach(product => {
                        let filterData = inputEl.value;
                        let productData = product.category

                        if (productData !== filterData) {
                            // If not found, hide the corresponding product
                            let boxDiv = document.getElementById(`"${product.id}"`);
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
                } else { // Show all the products per page if the default option is selected
                    needed_data.forEach(product => {
                        let boxDiv = document.getElementById(`"${product.id}"`);
                        boxDiv.style.display = "block";
                    })
                }
            }

            // Either the user clicks on the button or uses "Enter" key, search function is called
            $("#search-button").on("click", searchTheProduct);

            $("#search").on("keydown", function (event) {
                if (event.which === 13) {
                    searchTheProduct();
                }
            });

            // Depending on user's choice, filter function is called
            $(".select-box").on('click', filterTheProduct);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
} catch (Error) {
    console.log("Error: " + Error);
}