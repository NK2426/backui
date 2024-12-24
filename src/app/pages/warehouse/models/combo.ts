export namespace BULKORDER {
  export interface Combo {
    id: number;
    name: string;
    description: string;
    name_ta?: string;
    description_ta?: string;
    status: string;
    updatedAt: string;
    comboitems?: ComboItem[];
    //productSkuid: ProductSKUID[];
  }

  export interface ComboItem {
    id: number;
    combo_id: number;
    group_id: number;
    product_id: number;
    product_val?: number;
    itemlist_id: number;
    //productSkuid: ProductSKUID[];
  }

  export interface ProductSKUID {
    productName: string;
    skuid: string;
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

  export interface GenericComboResponse {
    status: string;
    data?: any;
    datas?: any[];
    message: string;
  }
}
