export class video {
    id?: number;
    date?: string;
    c_code?: string;
    phone?: string;
    slot?: string;
    status?: string;
  
  }
  export class videoPaginate {
    datas?: video[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }
  