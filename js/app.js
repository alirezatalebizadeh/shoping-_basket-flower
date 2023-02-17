'use strict'

let $ = document;
//create a object for save data
let allProducts = [
    { id: 1, name: 'گل نرگس', price: 12_500, count: 30, img: '/Images/1.jpg' },
    { id: 2, name: 'گل داوودی', price: 16_500, count: 30, img: '/Images/2.jpg' },
    { id: 3, name: 'گل محمدی', price: 10_000, count: 30, img: '/Images/3.jpg' },
    { id: 4, name: 'گل اتشین', price: 14_000, count: 30, img: '/Images/4.jpg' },
    { id: 5, name: 'گل حسن یوسف', price: 15_000, count: 30, img: '/Images/5.jpg' },
    { id: 6, name: 'گل نیلوفر', price: 22_000, count: 30, img: '/Images/6.jpg' },
    { id: 7, name: 'گل نرگس', price: 26_000, count: 30, img: '/Images/7.jpg' },
    { id: 8, name: 'گل حسن یوسف', price: 3_000, count: 30, img: '/Images/8.jpg' },
]

let productsBasket = []
//دسترسی به المنت هایی که لازم داریم 
let containerItemsShop = $.querySelector('.shop-items')
let containerItemsBasket = $.querySelector('.cart-items')
let totalPriceElem = $.querySelector('.cart-total-price')
let removeAllProduct = $.querySelector('.btn-purchase')

//add products to dom
function addProductToDom() {
    allProducts.forEach(product => {
        containerItemsShop.insertAdjacentHTML('beforeend', `
        <div class="shop-item">
        <span class="shop-item-title">${product.name}</span>
        <img class="shop-item-image" src="${product.img}" />
        <div class="shop-item-details">
        <span class="shop-item-price">$ ${product.price}</span>
        <button class="btn btn-primary shop-item-button" onclick="addToBasket(${product.id})" type="button">اضافه کردن به سبد </button>
        </div>
        </div>`)
    })
}

//وارد کردن محصول در صورت موجود بودن به سبد خرید
function addToBasket(productId) {

    let mainProduct = allProducts.find(product => {
        if (product.id === productId) {
            return product
        }
    })

    let isInProduct = productsBasket.some(product => {
        if (product.id === mainProduct.id) {
            return product
        }
    })
    if (!isInProduct) {
        mainProduct.count = 1
        productsBasket.push(mainProduct)
    } else if (isInProduct) {
        productsBasket.forEach(product => {
            if (product.id === mainProduct.id) {
                product.count += 1
            }
        })
    }
    // console.log(isInProduct);

    calcTotalPrice(productsBasket)
    addProductBasketToDom(productsBasket)
}

//add products of baskets to dom
function addProductBasketToDom(productsBasketArray) {
    containerItemsBasket.innerHTML = ''
    //create fragment for  manipulation
    let productsBasketFragment = document.createDocumentFragment()

    productsBasketArray.forEach(product => {

        let divCart_row = $.createElement('div')
        divCart_row.className = 'cart-row'

        let divItem_column = $.createElement('div')
        divItem_column.className = 'cart-item cart-column'

        let imgElem = $.createElement('img')
        imgElem.className = 'cart-item-image'
        imgElem.src = product.img;
        imgElem.width = '100'
        imgElem.height = '100'

        let spanElem = $.createElement('span')
        spanElem.className = 'cart-item-title'
        spanElem.innerHTML = product.name

        divItem_column.append(imgElem, spanElem)

        let spanElemPrice = $.createElement('span')
        spanElemPrice.className = 'cart-price cart-column'
        spanElemPrice.innerHTML = `$ ${product.price}`

        let divCartQuantity = $.createElement('div')
        divCartQuantity.className = 'cart-quantity cart-column'

        let inputElemCount = $.createElement('input')
        inputElemCount.className = 'cart-quantity-input'
        inputElemCount.type = 'number'
        inputElemCount.value = product.count
        inputElemCount.addEventListener('change', function () {
            updateCountProduct(product.id, Number(inputElemCount.value))
        })

        let btnRemoveProduct = $.createElement('button')
        btnRemoveProduct.className = 'btn btn-danger'
        btnRemoveProduct.innerHTML = 'حذف'
        btnRemoveProduct.addEventListener('click', function () {
            removeProductBasket(product.id)
        })

        divCartQuantity.append(inputElemCount, btnRemoveProduct)
        divCart_row.append(divItem_column, spanElemPrice, divCartQuantity)

        productsBasketFragment.appendChild(divCart_row)

    })

    containerItemsBasket.append(productsBasketFragment)
    setToLocalStorage(productsBasket)
    calcTotalPrice(productsBasketArray)
}

//حذف محصول از سبد خرید
function removeProductBasket(productId) {
    let dataBasket = getDataLocalStorage()
    let newData = dataBasket.filter(product => {
        return product.id !== productId
    })
    productsBasket = []
    productsBasket = newData
    setToLocalStorage(productsBasket)
    addProductBasketToDom(productsBasket)
}



//محاسبهی قیمت کل در سبد خرید
function calcTotalPrice(productBasket) {
    let totalPriceValue = 0

    productBasket.forEach(product => {
        totalPriceValue += product.count * product.price
    })
    totalPriceElem.innerHTML = `$ ${totalPriceValue}`
}


//ذخیره اطلاعات در دیتابیس
function setToLocalStorage(productsBasket) {
    localStorage.setItem('products', JSON.stringify(productsBasket))
}

//نشان دادن دیتای سبد خرید به محض بارگذاری صفحه طبق اطلاعات دیتا بیس
function showProductBasket() {
    let dataBasket = getDataLocalStorage()
    addProductBasketToDom(dataBasket)
}

//دریافت اطلاعات از دیتابیس 
function getDataLocalStorage() {
    let dataLocal = JSON.parse(localStorage.getItem('products'))
    productsBasket = dataLocal
    return productsBasket
}

//حذف همه ی دیتاهای سبد خرید 
function removeAllProductsFunc() {
    productsBasket = []
    setToLocalStorage(productsBasket)

    showProductBasket()
}

//اپدیت قیمت محصولات سبد خرید به واسطه ی اینپوت
function updateCountProduct(productId, newCount) {
    let dataLocal = getDataLocalStorage()
    productsBasket = dataLocal

    productsBasket.forEach(product => {
        if (product.id === productId) {
            product.count = newCount
        }
    })
    // console.log(productId, newCount);
    setToLocalStorage(productsBasket)
    showProductBasket()
}

window.addEventListener('load', showProductBasket)
window.addEventListener('load', addProductToDom)
removeAllProduct.addEventListener('click', removeAllProductsFunc)