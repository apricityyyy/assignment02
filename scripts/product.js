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
            <img src="${main}" alt="${product.title}" id="mainimageid" />
            `;

            let sideImages = document.querySelector('#side-images');
            let side = product.images;
            console.log(side);

            let cnt = side.length;
            while (cnt !== 0) {
                let newImg = document.createElement('img');
                newImg.src = side[cnt - 1];
                newImg.alt = product.title;
                newImg.className = "side-images-below";
                sideImages.appendChild(newImg);
                cnt--; // Move the decrement here
            }

            // Handle the click event on side images
            sideImages.addEventListener('click', function (event) {
                let mainImg = document.getElementById('mainimageid');
                mainImg.src = event.target.src;
            });

            let description =  document.querySelector('#product-description')

            let priceEl = document.createElement('h2');
            priceEl.textContent = "$" + product.price;
            priceEl.className = 'price';
            priceEl.style = "padding-left: 0";
            description.appendChild(priceEl);

            let categoryEl = document.createElement('p');
            categoryEl.innerHTML = `<b>Category:</b> ${product.category}`;
            categoryEl.style = "padding-left: 0";
            description.appendChild(categoryEl);

            let stockEl = document.createElement('p');
            stockEl.innerHTML = `${product.stock} items are left. If you want to order, click <a href="#addtocart">Add to Cart</a>.`;
            stockEl.style = "padding-left: 0";
            description.appendChild(stockEl);
        })
} catch (Error) {
    console.log("Error: " + Error);
}