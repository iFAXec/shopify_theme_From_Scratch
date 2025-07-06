class ProductForm extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        this.addToCartButton = this.querySelector('.add-to-cart');
        this.current_variant_id = this.getAttribute('variant-id');
        this.productHandle = this.getAttribute('product-handle');

        this.variants = JSON.parse(this.querySelector('#product-variants-json').innerText); // <- Make sure to include a script tag with id="product-variants-json" in your HTML that contains the variants data in JSON format.
        this.currentVariant = this.variants.find(variant => variant.id == this.getAttribute('variant-id'));
    }

    connectedCallback() {
        this.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.addEventListener('input', this.updateVariant.bind(this));

        // If JavaScript is working, hide the variant select dropdown and show the radios instead
        if (this.querySelector('#main-variant-select')) this.querySelector('#main-variant-select').style.display = 'none'; 
        if (this.querySelector('.product-variant-options')) this.querySelector('.product-variant-options').style.display = 'block';
    }

    disconnectedCallback() {
        this.removeEventListener('submit', this.handleFormSubmit.bind(this));
        this.removeEventListener('input', this.updateVariant.bind(this));
    }


    updateVariant() {
        this.currentVariant = this.variants.find(variant => variant.id == this.querySelector('[name="id"]:checked').value);

        // 1. Update history state
        window.history.replaceState({}, '', `/products/${this.productHandle}?variant=${this.currentVariant.id}`);

        // 2. Update image
        document.querySelector('.product-image').src = this.currentVariant.featured_image.src+'&width=400';

        // 3. Update price
        document.querySelector('.product-price').innerText = Shopify.formatMoney(this.currentVariant.price);

        // 4. Update button state
        const inputButton = this.querySelector('button[type="submit"]');
        if(!this.currentVariant.available) {
            inputButton.setAttribute('disabled', '');
            inputButton.value = 'SOLD OUT';
        } else {
            if(inputButton.hasAttribute('disabled')) inputButton.removeAttribute('disabled');
            inputButton.value = 'Add to cart';
        }
    }

    handleFormSubmit(evt) {
        evt.preventDefault();

        let formData = new FormData(this.form);
        document.querySelector('side-cart').classList.remove('loaded');
        fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            return response.json();
        })
        .then(json_response => {
            console.log(json_response);
            if(json_response.status != 'bad_request') {
                // alert('One '+json_response.product_title+' added to the cart ✓');
                document.querySelector('side-cart').addLineItem(json_response);
            } else {
                alert('Error: '+json_response.message);
            }
        })
        .catch((error) => {
            alert('Error: '+error);
            console.error('Error:', error);
        });
    }
}

customElements.define('product-form', ProductForm);