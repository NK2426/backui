export class Newsletter {
    id?: number;
    title?: string;
    content?: string;
    image?: string;
    date?:string
    status?: string;
    createdAt?: number;
    link?:string;
    type?:string
    updatedAt?: number;
  }
  export class NewsletterPaginate {
    datas?: Newsletter[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }
  