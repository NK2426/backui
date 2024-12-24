import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Documents } from '../models/documents';
import { Product, Productimage, Productpaginate } from '../models/product';
import {
  Department,
  Paymentterm,
  Poproess,
  Purchaseorder,
  Purchaseorderpaginate,
  Shipper,
  Tax,
  Vendor,
  Warehouse
} from '../models/purchaseorder';
import { EnvService } from './env.service';
const PARAMS = new HttpParams({
  fromObject: {}
});
@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {
  ProductApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}products`;
  PurchaseApiUrl: string = `${environment.PURCHASE_BASE_URL}/orders`;
  categoryHeadUrl: string = environment.CATEGORY_HEAD_BASE_URL;
  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Purchaseorderpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    // console.log(type,"insseckdsjfnk");

    return this.http.get<Purchaseorderpaginate>(this.PurchaseApiUrl + '/po/' + type, option);
  }

  taxlists(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(environment.CATEGORY_HEAD_BASE_URL + 'products/taxlist', option).pipe(map((res) => res.data));
  }

  search(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http
      .get<any>(environment.CATEGORY_HEAD_BASE_URL + 'groups/search', { params: PARAMS.set('search', term) })
      .pipe(map((res) => res['data']));
  }

  create(data: Product): Observable<Product> {
    return this.http.post<any>(this.PurchaseApiUrl, data, this.env.httpOptions).pipe(map((res) => res.data));
  }



  createvendorvarpo(data: Product): Observable<Product> {
    return this.http.post<any>(this.PurchaseApiUrl + '/createvar', data, this.env.httpOptions).pipe(map((res) => res.data));
  }

  createProduct(data: any): Observable<any> {
    return this.http.post<any>(this.categoryHeadUrl + 'products/poadd', data, this.env.httpOptions).pipe(map((res) => res.data));
  }

  update(data: Product): Observable<Product> {
    return this.http.put<any>(this.PurchaseApiUrl + '/' + data.uuid, data, this.env.httpOptions).pipe(map((res) => res.data));
  }

  updatevenvar(data: Product): Observable<Product> {
    return this.http.put<any>(this.PurchaseApiUrl + '/editvenvar/' + data.uuid, data, this.env.httpOptions).pipe(map((res) => res.data));
  }

  autopo(data: Product): Observable<Product> {
    return this.http.put<any>(this.PurchaseApiUrl + '/autopo/' + data.uuid, data, this.env.httpOptions).pipe(map((res) => res.data));
  }
  delete(data: Product): Observable<Product> {
    return this.http.delete<Product>(this.PurchaseApiUrl + '/' + data.uuid);
  }
  deleteorderitem(id: any): Observable<any> {
    return this.http.delete<any>(this.PurchaseApiUrl + '/orderitem/' + id);
  }
  addtax(data: any): Observable<Tax> {
    return this.http.post<any>(this.PurchaseApiUrl + '/tax', data, this.env.httpOptions).pipe(map((res) => res.data));
  }
  taxlist(): Observable<Tax[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/taxes', option).pipe(map((res) => res.data));
  }

  addshipper(data: any): Observable<Shipper> {
    return this.http.post<any>(this.PurchaseApiUrl + '/shipper', data, this.env.httpOptions).pipe(map((res) => res.data));
  }

  addshipperID(data: any): Observable<Shipper> {
    return this.http.put<any>(this.PurchaseApiUrl + '/shipperID', data, this.env.httpOptions).pipe(map((res) => res.data));
  }

  shipperlist(): Observable<Shipper[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/shippers', option).pipe(map((res) => res.data));
  }

  getParams(): Observable<Product> {
    //console.log(this.http.get<Product>(this.PurchaseApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Product>(this.PurchaseApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/' + uuid, option).pipe(map((res) => res.data));
  }
  productfind(puid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/viewproduct/' + puid, option).pipe(map((res) => res.data));
  }
  fulldetail(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/fulldetail/' + uuid, option).pipe(map((res) => res.data));
  }
  fulldetailvar(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/fulldetailvar/' + uuid, option).pipe(map((res) => res.data));
  }
  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/' + did + '/listall', option).pipe(map((res) => res.data));
  }
  departmentlist(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/department/list', option).pipe(map((res) => res.data));
  }
  getwarehouseTax(id: any): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/getwarehousetax/' + id, option).pipe(map((res) => res.data));


  }
  documentlist(): Observable<Documents[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/document/list', option).pipe(map((res) => res.data));
  }
  paymenttermlist(): Observable<Paymentterm[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/paymenterm/list', option).pipe(map((res) => res.data));
  }

  productlist(did: string): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/product/' + did, option).pipe(map((res) => res.data));
  }
  vendorproductlist(uid: string, did: string): Observable<Product[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/vendorproduct/' + uid + '/' + did, option).pipe(map((res) => res.data));
  }

  vendorvarproductlist(uid: string, did: string, cid: string, sid: string): Observable<Product[]> {
    let option = this.env.httpOptions;
    return this.http
      .get<any>(this.PurchaseApiUrl + '/vendorvarproduct/' + uid + '/' + did + '?category_id=' + cid + '&subcategory_id=' + sid, option)
      .pipe(map((res) => res.data));
  }

  vendorlist(pid: string): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    let vendor = this.http.get<any>(this.PurchaseApiUrl + '/vendor/' + pid, option).pipe(map((res) => res.data));
    return vendor;
  }
  allvendor(did: string): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/allvendors/' + did, option).pipe(map((res) => res.data));
  }
  allvendors(): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/vendor', option).pipe(map((res) => res.data));
  }
  allvendorsbyState(id: any): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/vendor/' + id, option).pipe(map((res) => res.data));
  }
  allvendorAgent(did: any, id: any): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/allvendors/agent/' + did + '/' + id, option).pipe(map((res) => res.data));
  }
  variantlist(gid: string): Observable<any[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/variant/' + gid, option).pipe(map((res) => res.data));
  }
  getProducts(params: {}): Observable<Productpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productpaginate>(this.PurchaseApiUrl + '/products', option);
  }
  mapping(data: any, uuid: string): Observable<Product> {
    return this.http.post<any>(this.PurchaseApiUrl + '/mapping/' + uuid, data, this.env.httpOptions).pipe(map((res) => res.data));
  }
  fileupload(formdata: any, uuid: string): Observable<any> {
    return this.http.post<any>(this.PurchaseApiUrl + '/uploadfile/' + uuid, formdata, this.env.uploadhttpOptions);
  }
  approve(data: Purchaseorder): Observable<Purchaseorder> {
    return this.http.put<any>(this.PurchaseApiUrl + '/approve/' + data.uuid, data, this.env.httpOptions).pipe(map((res) => res.data));
  }
  headapproval(uuid: any, formdata: any): Observable<Purchaseorder> {
    return this.http.put<any>(this.PurchaseApiUrl + '/headapprove/' + uuid, formdata, this.env.httpOptions).pipe(map((res) => res.data));
  }
  purchaserorderproess(pid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<Poproess>(this.PurchaseApiUrl + '/poprocess/' + pid, option).pipe(map((res) => res.data));
  }

  analytics(pid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<Poproess>(this.PurchaseApiUrl + '/analytics/' + pid, option).pipe(map((res) => res.data));
  }

  poanalytics(id: any, vid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<Poproess>(this.PurchaseApiUrl + '/poanalytics/' + id + '/' + vid, option).pipe(map((res) => res.data));
  }

  productsview(uuid: any, { }): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/viewproducts/' + uuid, option).pipe(map((res) => res.data));
  }
  findsetting(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/findsetting', option).pipe(map((res) => res));
  }
  Warehouse(data: string): Observable<Warehouse> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/warehouse/' + data, option).pipe(map((res) => res.data));
  }

  download(did: any, vid: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/download/' + did + '/' + vid, this.env.httpOptions);
  }

  downloadvenvar(did: any, vid: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/downloadvenvar/' + did + '/' + vid, this.env.httpOptions);
  }

  import(formdata: any): Observable<any> {
    return this.http.post<any>(this.PurchaseApiUrl + '/import', formdata).pipe(map((res) => res));
  }

  importvenvar(formdata: any): Observable<any> {
    return this.http.post<any>(this.PurchaseApiUrl + '/importvenvar', formdata).pipe(map((res) => res));
  }

  downloadpdf(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/pdf/' + id, this.env.httpOptions);
  }

  downloadvarpdf(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/varpdf/' + id, this.env.httpOptions);
  }

  downloadxl(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/xlpurchaseorders/' + id, this.env.httpOptions);
  }

  downloadvarxl(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/xlvarpurchaseorders/' + id, this.env.httpOptions);
  }

  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(this.PurchaseApiUrl + '/warehouses', this.env.httpOptions);
  }
  saveProductImage(formdata: any, uuid: any): Observable<Productimage> {
    return this.http.post<any>(this.categoryHeadUrl + 'products/pogallery/' + uuid, formdata).pipe(map((res) => res.data));
  }
  // getLocation(): Observable<any> {
  //   return this.http.get<any[]>('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=&key=AIzaSyB5oxrkmD-V1hwP3Z2GyNayi9N0pbG9F8c&sessiontoken=122344');
  // }
  saveGallery(pid: any, formdata: any): Observable<Productimage> {
    return this.http.put<any>(this.ProductApiUrl + '/imgallery/' + pid, formdata)
      .pipe(map(res => res.data))
  }

  setImage(formdata: any): Observable<Productimage> {
    return this.http.put<any>(this.ProductApiUrl + '/img/setimage', formdata)
      .pipe(map(res => res.data))
  }
  getImageAll(id: any): Observable<any> {
    return this.http.get<any>(this.ProductApiUrl + '/getimage/' + id, this.env.httpOptions);
  }
  getImgBlob(url: any) {
    return this.http.get(url, { responseType: 'blob' })
      .subscribe((blob: any) => {
        const reader = new FileReader();
        const binaryString = reader.readAsDataURL(blob);
        // console.log(binaryString)

        reader.onload = (event: any) => {
          //console.log('Image in Base64: ', event.target.result);
          return event.target.result
        };
        reader.onerror = (event: any) => {
          //console.log("File could not be read: " + event.target.error.code);
          return "";
        };
      });
  }
  imageUrlToBase64(urL: string) {
    return this.http.get(urL, {
      observe: 'body',
      responseType: 'arraybuffer',
    })
      .pipe(
        take(1),
        map((arrayBuffer: any) =>
          btoa(
            Array.from(new Uint8Array(arrayBuffer))
              .map((b) => String.fromCharCode(b))
              .join('')
          )
        ),
      )
  }
}
