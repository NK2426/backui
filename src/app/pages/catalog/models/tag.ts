import { Categories } from "./categories";
import { Department } from "./department";
import { Group } from "./inventory";
import { Subcategories } from "./subcategories";

export namespace TAGS {
  export interface Tag {
    id: number;
    uuid: string;
    name: string;
    name_ta?: string;
    group_id: number;
    path: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    slug?:string;
    tagitems?: TagItem[];
    group:group
  }
  export interface group {
  
    name: string;
    
  }

  export interface Product {
    pid: number;
    productId: string;
    uuid: string;
    department_id: number;
    category_id: number;
    subcategory_id: number;
    brand_id: number;
    group_id: number;
    name: string;
    cod: number;
    showcontent: number;
    returnable: number;
    returntime: number;
    terms: number;
    freeship: number;
    supercoins: number;
    description: string;
    keywords: string;
    tags: string;
    status: string;
    department: Department;
    category: Categories;
    subcategory: Subcategories;
    group: Group;
  }

  export interface TagItem {
    id: number;
    tag_id: number;
    group_id: number;
    product_id: number;
    product: Product;
  }

  export interface TagPaginate extends GenericTagResponse {
    datas?: Tag[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }

  export interface TagHttpResponse extends GenericTagResponse {
    data: Tag;
  }

  export interface GenericTagResponse {
    status: string;
    data?: any;
    datas?: any[];
    message: string;
  }
}
