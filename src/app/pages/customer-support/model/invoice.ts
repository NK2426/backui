import { ORDER } from './order';
import { ORDERDETAIL } from './order-detail';
import { Product } from './product';
import { USER } from './user';
export namespace INVOICE {
  export interface Item {
    name: string;
    path: string;
  }

  export interface Invoiceorderitem {
    id: number;
    uuid: string;
    invoice_id: number;
    invoice_uuid: string;
    user_id: number;
    product_id: number;
    orderitem_uuid: string;
    hsncode: string;
    skuid: string;
    item_uuid: string;
    itemslist_uuid: string;
    psid: string;
    quantity: number;
    mrp: number;
    price: number;
    subtotal: number;
    discount: number;
    discounttotal: number;
    total: number;
    ifigst: number;
    ctax: number;
    ctaxval: number;
    stax: number;
    staxval: number;
    itax: number;
    itaxval: number;
    taxamount: number;
    taxpercentage: number;
    shiptax: number;
    shippingamount: number;
    grandtotal: number;
    status: string;
    item: Item;
    orderitem: ORDERDETAIL.Orderitem;
    invoice: InvoiceDetail;
    product: Product;
    deliverycharge: number;
    codcharge: number;
    delcodcharge: number;
  }

  export interface Address {
    id: number;
    uuid: string;
    user_id: number;
    name: string;
    mobile: string;
    mobile2: string;
    address: string;
    email: string;
    type: string;
    address2: string;
    city: string;
    state: string;
    code: string;
    zipcode: string;
    landmark: string;
    houseno: string;
    isdefault: number;
    status: number;
  }

  export interface InvoiceDetail {
    id: number;
    uuid: string;
    user_id: number;
    invoiceno: string;
    awbnumber: string;
    orderID: string;
    orderdatetime: Date;
    invoicedate: Date;
    shppingAddress: string;
    billingAddress: string;
    setting_id: number;
    subtotalamount: number;
    discountamt: number;
    deliverycharge: number;
    codcharge: number;
    ifigst: number;
    ctax: number;
    ctaxval: number;
    stax: number;
    staxval: number;
    itax: number;
    itaxval: number;
    taxamount: number;
    totalamount: number;
    shipctax: number;
    shipctaxval: number;
    shipstax: number;
    shipstaxval: number;
    shipitax: number;
    shipitaxval: number;
    shiptaxamount: number;
    handctax: number;
    handctaxval: number;
    handstax: number;
    handstaxval: number;
    handitax: number;
    handitaxval: number;
    handtaxamount: number;
    grandtotal: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    invoiceorderitems?: Invoiceorderitem[];
    address: Address;
    order?: ORDER.CustomerOrder;
    user?: USER.UserDetail;
    modeofpayment?: string;
  }

  export interface AWBDetail {
    invoiceno: string;
    awbnumber: string;
    orderID: string;
    length: number;
    dimentions: string;
    weight: string;
    createdAt: string;
  }

  export interface ReturnInvoiceDetail {
    id: number;
    uuid: string;
    user_id: number;
    invoiceno: string;
    awbnumber: string;
    orderID: string;
    orderdatetime: Date;
    invoicedate: Date;
    shppingAddress: string;
    billingAddress: string;
    setting_id: number;
    subtotalamount: number;
    discountamt: number;
    deliverycharge: number;
    codcharge: number;
    ifigst: number;
    ctax: number;
    ctaxval: number;
    stax: number;
    staxval: number;
    itax: number;
    itaxval: number;
    taxamount: number;
    totalamount: number;
    shipctax: number;
    shipctaxval: number;
    shipstax: number;
    shipstaxval: number;
    shipitax: number;
    shipitaxval: number;
    shiptaxamount: number;
    grandtotal: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    skuid: string;
    invoiceorderitems?: Invoiceorderitem[];
    address: Address;
    order?: ORDER.CustomerOrder;
    user?: USER.UserDetail;
    modeofpayment?: string;
  }

  export interface ReturnInvoiceorderitem {
    id: number;
    uuid: string;
    revinvoice_id: number;
    return_uuid: string;
    revinvoice_uuid: string;
    invoice_id: number;
    user_id: number;
    product_id: number;
    invoiceno: string;
    revinvoiceno: string;
    orderitem_uuid: string;
    hsncode: string;
    skuid: string;
    item_uuid: string;
    itemslist_uuid: string;
    psid: string;
    quantity: number;
    mrp: number;
    price: number;
    subtotal: number;
    discount: number;
    discounttotal: number;
    total: number;
    ifigst: number;
    ctax: number;
    ctaxval: number;
    stax: number;
    staxval: number;
    itax: number;
    itaxval: number;
    taxamount: number;
    taxpercentage: number;
    shiptax: number;
    shippingamount: number;
    grandtotal: number;
    status: string;
    item: Item;
    returninvoice: ReturnInvoiceDetail;
  }

  export interface ReturnDetail {
    id: number;
    amount: number;
    orderID: string;
    juspayOrderID: string;
    juspaystatus: string;
    status: string;
    type: string;
    modifiedBy: number;
    createdAt: Date;
    updatedAt: Date;
    returninvoiceitem?: ReturnInvoiceorderitem;
    order?: ORDER.CustomerOrder;
    user?: USER.UserDetail;
    modeofpayment?: string;
  }

  export interface InvoicePaginate {
    datas: InvoiceDetail[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    status: string | number;
    message: string;
  }

  export interface AWBPaginate {
    datas: AWBDetail[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    status: string | number;
    message: string;
  }

  export interface InvoiceitemPaginate extends Paginate {
    datas: Invoiceorderitem[];
  }

  export interface Paginate {
    datas: any;
    totalItems: number;
    totalPages: number;
    currentPage: number;
    status: string | number;
    message: string;
  }

  export interface InvoiceHttpResponse extends GenericInvoiceHttpResponse {
    data: InvoiceDetail;
  }
  export interface ReportsResponse extends GenericInvoiceHttpResponse {
    data: { filename: string };
  }
  export interface GenericInvoiceHttpResponse {
    status: string | number;
    code?: string;
    message: string;
    data: any;
  }
}