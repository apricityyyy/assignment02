// When the request is cancelled before it is complete
const controller = new AbortController();
const signal = controller.signal;

// Cancel the fetch request in 1s (in-flight request)
setTimeout(() => controller.abort(), 1000);


// get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');

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
            let product = json;

            document.querySelector('title').textContent = product.title;
            document.querySelector('#product-title').innerHTML = product.title;

            let mainImage = document.querySelector('#main-image')
            let main = product.images.filter((link) => link.includes("thumbnail"));
            main = main.length == 0 ? product.images[product.images.length - 1] : main[0];
            console.log(main);
            mainImage.innerHTML = `
            <img src="${main}" alt="${product.title}" />
            `;

            let sideImages = document.querySelector('#side-images');
            let side = product.images.filter((link) => link != main);
            console.log(side);
            let cnt = side.length;
            while (cnt != 0) {
                let newImg = document.createElement('img');
                newImg.src = side[cnt - 1];
                newImg.alt = product.title;
                newImg.className = "side-images-below"
                sideImages.appendChild(newImg);
                cnt--;
            }

            // Handle the click event on side images
            sideImages.addEventListener('click', function (event) {
                    // Swap main image with the clicked side image
                    mainImage.innerHTML = event.target.outerHTML;

                    // Swap clicked side image with the main image
                    event.target.src = mainImage.querySelector('img').src;
            });

            //     productDiv.innerHTML = `
            //     <img src="${thumbnail}" alt="${product.title}" class="thumbnail" />
            //     <p class="price" id="percentage">-${product.discountPercentage}% ⚡</p>
            //     <p class="price">$${product.price}</p>
            //     <h2>${product.title}</h2>
            //     <p>${product.category}</p>
            //     <p>${product.stock} left!</p>
            // `
        })
} catch (Error) {
    console.log("Error: " + Error);
}