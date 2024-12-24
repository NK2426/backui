export namespace BULKORDER {
  export interface Combo {
    id: number
    name: string
    description: string
    status: number
    createdBy: number
    createdAt: string
    updatedAt: string
    combosets: ComboSet[];
    returnable?: boolean;
    replacable?: boolean;
    terms: string;
    //productSkuid: ProductSKUID[];
  }

  export interface ComboSet {
    id: number
    combo_id: number
    name: string
    title: string
    title_ta: string
    description: string
    description_ta: string
    path: string
    itemslist_uuid: string
    item_uuid: string
    status: number
    createdBy: number
    itemsimages: ComboImage[]
    comboitems: ComboItem[]
    item: Item
    itemlist: Itemslist
    mrp: number
    price: number
    offer: number;
  }

  export interface ComboItem {
    id: number
    combo_id: number
    group_id: number
    product_id: number
    comboset_id: number
    itemlist_id: number
    product: Product
    itemslist: Itemslist
    item: Item
    group: Group
    mrp: number
    price: number
  }

  export interface Product {
    pid: number
    name: string
  }

  export interface Item {
    name: string
    description: string
    uuid: string
    path: string
    designId: string
  }

  export interface Itemslist {
    id: number
    description: string
    skuid: string
  }

  export interface Group {
    id: number
    name: string
  }

  export interface ProductSKUID {
    productName: string;
    skuid: string;
  }

  export interface ComboImage {
    id: number
    item_id: number
    itemslist_uuid: string
    product_id: number
    image_id: number
    variant_id: number
    variantvalue_id: number
    path: string
    cpath: string
  }

  export interface ComboImageHttpResponse extends ComboHttpResponse {
    data: ComboImage[] | any;
  }


  export interface ComboPaginate {
    datas?: Combo[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }

  export interface ComboHttpResponse extends GenericComboResponse {
    data: Combo | any;
  }


  export interface ComboSetHttpResponse extends GenericComboResponse {
    data: ComboSet | any;
  }
  export interface GenericComboResponse {
    status: string;
    data?: any;
    datas?: any[];
    message: string;
  }
}
