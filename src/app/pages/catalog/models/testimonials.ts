export class Testimonials {
    id?: number;
    name?: string;
    content?: string;
    image?: string;
    status?: string;
    createdAt?: number;
    updatedAt?: number;
  }
  export class TestimonialsPaginate {
    datas?: Testimonials[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }
  