// When the request is cancelled before it is complete
const controller = new AbortController();
const signal = controller.signal;

// Cancel the fetch request in 1s (in-flight request)
setTimeout(() => controller.abort(), 1000);

try {
    fetch('https://dummyjson.com/products?limit=100', { signal })
        .then(res => {
            // When the network status code is not in the range 200 to 299
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }

            return res.json();
        })
        .then((json) => {
            let data = [];

            // Beginning page number
            let currentPage = 1;
            let productsPerPage = 10;

            // Determining if the search is called
            let searchFlag = false;

            // Creating search data for keeping track of searched products
            let search_data = [];

            data = json.products;

            // Display products according to their current page
            function displayProducts(start, end, disp_data) {
                let needed_data = [];
                console.log("Start", start);
                console.log("End", end);
                const contentDiv = document.getElementsByClassName('container')[0];
                contentDiv.innerHTML = '';
                console.log("Display data", disp_data);

                // Get the subset of data
                for (let i = start, j = 0; i < end; i++, j++) {
                    if (disp_data[i]) {
                        needed_data[j] = disp_data[i];
                    }
                }

                console.log("Needed display data", needed_data);

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

            function updatePagination(pag_data) {
                productsPerPage = 10;
                let totalPages = Math.ceil(pag_data.length / productsPerPage);
                productsPerPage = (productsPerPage < pag_data.length) ? productsPerPage : pag_data.length;

                const paginationDiv = document.getElementsByClassName('pagination')[0];
                paginationDiv.innerHTML = ''; // Renew the div before locating new products per page

                console.log("Data inside pagination", pag_data);
                console.log("Search flag inside pagination", searchFlag);

                for (let i = 1; i <= totalPages; i++) {
                    let pageButton = document.createElement('a')
                    pageButton.textContent = i; // "Buttons" that show each page
                    pageButton.id = `order${i}`; // For tracking which page is activated
                    pageButton.addEventListener('click', () => {
                        console.log("Data when clicking", pag_data);
                        currentPage = i;
                        
                    displayProducts((currentPage - 1) * productsPerPage, currentPage * productsPerPage, pag_data);
                        // Remove 'active' class from all buttons
                        document.querySelectorAll('.pagination a').forEach(button => {
                            button.classList.remove('active');
                        });
                        // Add 'active' class to the clicked button
                        pageButton.classList.add('active');
                    });

                    displayProducts((currentPage - 1) * productsPerPage, currentPage * productsPerPage, pag_data);

                    paginationDiv.appendChild(pageButton);
                }

                // Add 'active' class to the initial current page button
                let currentEl = document.getElementById(`order${currentPage}`);
                if (currentEl) {
                    currentEl.classList.add('active');
                }
            }

            function searchTheProduct() {
                search_data = [];
                searchFlag = true;
                let inputEl = document.getElementById('search');
                let filterInputEl = document.getElementById('category');
                filterInputEl.value = '--';  // Reset the filter option when search is called

                data.forEach(product => {
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

                        search_data = search_data.filter(function (item) {
                            return item !== product;
                        })
                    } else {
                        // If found, show the corresponding product
                        let boxDiv = document.getElementById(`"${product.id}"`);
                        if (boxDiv) {
                            boxDiv.style.display = "block";
                        }
                        search_data.push(product);
                    }
                });

                updatePagination(search_data);
            }

            function filterTheProduct(filter_data) {
                console.log("Filter data BEFORE", filter_data);
                let inputEl = document.getElementById('category');

                // If the input element is not default or all
                if (inputEl.value !== "--" && inputEl.value !== "all") {
                    filter_data.forEach(product => {
                        let filterData = inputEl.value;
                        let productData = product.category;
                        console.log("Product data inside filter", productData);
                        console.log("Filter data inside filter", filterData);

                        // Check if the product satisfies both search and filter criteria
                        let boxDiv = document.getElementById(`"${product.id}"`);
                        // let searchCriteriaMet = productData.toLowerCase().includes(inputEl.value.toLowerCase());
                        let filterCriteriaMet = (productData === filterData);

                        if (filterCriteriaMet) {
                            // If the product satisfies both criteria, show it
                            if (boxDiv) {
                                boxDiv.style.display = "block";
                            }

                            console.log("This product is included", product);
                        } else {
                            // If not, hide the corresponding product
                            if (boxDiv) {
                                boxDiv.style.display = "none";
                            }

                            console.log("This product is NOT included", product);

                            filter_data = filter_data.filter(element => element !== product);

                            console.log("Filter data now", filter_data);
                        }
                    });
                } else if (inputEl.value == "all") { // Show all the products per page if "all" option is selected
                    filter_data.forEach(product => {
                        let boxDiv = document.getElementById(`"${product.id}"`);
                        boxDiv.style.display = "block";
                    })
                }

                updatePagination(filter_data);
                console.log("Filter data AFTER", filter_data);

            }

            // When the page is loaded, start with first products per page
            displayProducts(0, productsPerPage, data);

            // Call updatePagination to set up pagination buttons
            updatePagination(data);

            // Either the user clicks on the button or uses "Enter" key, search function is called
            $("#search-button").on("click", searchTheProduct);

            $("#search").on("keydown", function (event) {
                if (event.which === 13) {
                    searchTheProduct();
                }
            });

            // Depending on user's choice, filter function is called
            $(".select-box").on('change', () => {
                console.log("Filter data", data);
                if (!searchFlag) filterTheProduct(data);
                else filterTheProduct(search_data);
            });

            // get a reference to our predefined button
            let scrollToTopBtn = document.querySelector(".scrollToTopBtn");

            document.addEventListener("scroll", handleScroll);

            function handleScroll() {
                var scrollableHeight = document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight;
                var GOLDEN_RATIO = 0.5;

                if ((document.scrollingElement.scrollTop / scrollableHeight) > GOLDEN_RATIO) {
                    // show button
                    scrollToTopBtn.style.display = "block";
                } else {
                    // hide button
                    scrollToTopBtn.style.display = "none";
                }
            }

            scrollToTopBtn.addEventListener("click", scrollToTop);

            function scrollToTop() {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

        }).catch(error => {
            console.error('Error fetching data:', error);
            displayError(error.message);
        });
} catch (Error) {
    console.log("Error: " + Error);
    displayError(Error.message);
}

function displayError(error) {
    const errDiv = document.getElementsByClassName('error-section')[0];

    // Clear existing error content
    errDiv.innerHTML = '<img id="err-icon" />';

    const errIcon = document.getElementById("err-icon");
    errIcon.src = './assets/icons/error.svg';

    const errEl = document.createElement('p');
    errEl.innerHTML = error;
    errEl.id = "error";

    errDiv.appendChild(errEl);
}
