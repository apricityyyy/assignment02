// get all products
fetch('https://dummyjson.com/products')
.then(res => res.json())
.then(console.log);