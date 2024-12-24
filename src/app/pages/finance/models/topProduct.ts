export class Data {
    message?: string
    topProducts?: TopProduct[]
    topVendors?: TopVendor[]
    detailedSales?: DetailedSale[]
}

export class TopProduct {
    productId?: number
    productName?: string
    productImage?: string
    productDescription?: string
    product_sku?: string
    totalAmount?: number
}

export class TopVendor {
    vendorName?: string
    state_name?: string
    email?: string
    mobile?: string
    totalAmount?: number
}

export class DetailedSale {
    productID?: number
    productName?: string
    vendorName?: string
    totalAmount?: number
}
