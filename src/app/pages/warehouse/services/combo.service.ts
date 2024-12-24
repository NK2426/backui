import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';


const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable({
    providedIn: 'root'
})
export class ComboService {

    ComboAPIURL: string = `${environment.WAREHOUSE_BASE_URL}combo`;

    constructor(private http: HttpClient, private env: EnvService) { }

    getComboList(params: {}): Observable<any> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return of({ "status": 200, "message": "Success", "datas": [{ "id": 9, "name": "test", "description": "testt", "status": 1, "createdBy": 0, "createdAt": "2023-03-01T15:10:08.000Z", "updatedAt": "2023-03-02T17:07:26.000Z" }, { "id": 13, "name": "SHR", "description": "shr000100", "status": 1, "createdBy": 0, "createdAt": "2023-03-06T17:05:07.000Z", "updatedAt": "2023-03-06T17:07:21.000Z" }], "totalItems": 2, "totalPages": 1, "currentPage": 0 })
    }


    getComboItem(): Observable<any> {
        return of([
            {
                "id": 10401,
                "uuid": "b9ae5071-6dfe-4602-b940-7d27552ded1d",
                "skuid": "18175_1217",
                "purchaseorder_id": 1040,
                "product_id": 100,
                "productselectimage_id": 511,
                "quantity": 10,
                "receivedqty": 0,
                "inwarditemcount": 0,
                "disputeqty": 0,
                "price": 400,
                "subtotal": 4000,
                "discounttype": 1,
                "discount": 0,
                "discounttotal": 0,
                "total": 4000,
                "ifigst": 1,
                "ctax": 0,
                "ctaxval": 0,
                "stax": 0,
                "staxval": 0,
                "itax": 5,
                "itaxval": 200,
                "grandtotal": 4200,
                "product": {
                    "pid": 100,
                    "productId": "000100",
                    "uuid": "shr000100",
                    "name": "Shree Shyam Rayon Embroidered Work With Floral Print Flared Long Women Gown",
                    "department_id": 3
                },
                "purchaseitemdetails": [
                    {
                        "id": 104011,
                        "purchaseorder_id": 1040,
                        "item_id": 10401,
                        "variant_id": 23,
                        "value_id": 18175,
                        "productvariant": {
                            "id": 23,
                            "uuid": "f6738769-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Size",
                            "displayname": "Size",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Text",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Size",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": "2022-10-07T17:39:19.000Z",
                            "updatedAt": "2022-10-06T18:30:00.000Z"
                        },
                        "productvariantvalue": {
                            "id": 18175,
                            "variant_id": 23,
                            "value": "M",
                            "imgicon": "",
                            "ordering": 0,
                            "status": 1
                        }
                    },
                    {
                        "id": 104012,
                        "purchaseorder_id": 1040,
                        "item_id": 10401,
                        "variant_id": 24,
                        "value_id": 1217,
                        "productvariant": {
                            "id": 24,
                            "uuid": "fa5afd15-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Color",
                            "displayname": "Color",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Image",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Color",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": null,
                            "updatedAt": null
                        },
                        "productvariantvalue": {
                            "id": 1217,
                            "variant_id": 24,
                            "value": "Blue",
                            "imgicon": "",
                            "ordering": 8,
                            "status": 1
                        }
                    }
                ],
                "vendormapping": {
                    "id": 83,
                    "product_id": 100,
                    "vendor_id": 119,
                    "vendorproId": "1997",
                    "price": 400,
                    "deliveryscore": 0,
                    "qualityscore": 0,
                    "pendingstock": 0,
                    "notransitstock": "Yes",
                    "noactivepo": "Yes",
                    "taxfilling": "Yes",
                    "status": 1
                },
                "productselectimage": {
                    "id": 511,
                    "product_id": 100,
                    "image_id": 255,
                    "path": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1665555497845__DSC02348+copy.jpg"
                }
            },
            {
                "id": 10402,
                "uuid": "95b6adbb-9f36-4af6-8d1d-00980fe06a16",
                "skuid": "18176_1217",
                "purchaseorder_id": 1040,
                "product_id": 100,
                "productselectimage_id": 511,
                "quantity": 10,
                "receivedqty": 0,
                "inwarditemcount": 0,
                "disputeqty": 0,
                "price": 400,
                "subtotal": 4000,
                "discounttype": 1,
                "discount": 0,
                "discounttotal": 0,
                "total": 4000,
                "ifigst": 1,
                "ctax": 0,
                "ctaxval": 0,
                "stax": 0,
                "staxval": 0,
                "itax": 5,
                "itaxval": 200,
                "grandtotal": 4200,
                "product": {
                    "pid": 100,
                    "productId": "000100",
                    "uuid": "shr000100",
                    "name": "Shree Shyam Rayon Embroidered Work With Floral Print Flared Long Women Gown",
                    "department_id": 3
                },
                "purchaseitemdetails": [
                    {
                        "id": 104021,
                        "purchaseorder_id": 1040,
                        "item_id": 10402,
                        "variant_id": 23,
                        "value_id": 18176,
                        "productvariant": {
                            "id": 23,
                            "uuid": "f6738769-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Size",
                            "displayname": "Size",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Text",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Size",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": "2022-10-07T17:39:19.000Z",
                            "updatedAt": "2022-10-06T18:30:00.000Z"
                        },
                        "productvariantvalue": {
                            "id": 18176,
                            "variant_id": 23,
                            "value": "L",
                            "imgicon": "",
                            "ordering": 0,
                            "status": 1
                        }
                    },
                    {
                        "id": 104022,
                        "purchaseorder_id": 1040,
                        "item_id": 10402,
                        "variant_id": 24,
                        "value_id": 1217,
                        "productvariant": {
                            "id": 24,
                            "uuid": "fa5afd15-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Color",
                            "displayname": "Color",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Image",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Color",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": null,
                            "updatedAt": null
                        },
                        "productvariantvalue": {
                            "id": 1217,
                            "variant_id": 24,
                            "value": "Blue",
                            "imgicon": "",
                            "ordering": 8,
                            "status": 1
                        }
                    }
                ],
                "vendormapping": {
                    "id": 83,
                    "product_id": 100,
                    "vendor_id": 119,
                    "vendorproId": "1997",
                    "price": 400,
                    "deliveryscore": 0,
                    "qualityscore": 0,
                    "pendingstock": 0,
                    "notransitstock": "Yes",
                    "noactivepo": "Yes",
                    "taxfilling": "Yes",
                    "status": 1
                },
                "productselectimage": {
                    "id": 511,
                    "product_id": 100,
                    "image_id": 255,
                    "path": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1665555497845__DSC02348+copy.jpg"
                }
            },
            {
                "id": 10403,
                "uuid": "4364650a-14b0-4ea9-96dd-487b73d4354d",
                "skuid": "18177_1217",
                "purchaseorder_id": 1040,
                "product_id": 100,
                "productselectimage_id": 511,
                "quantity": 10,
                "receivedqty": 0,
                "inwarditemcount": 0,
                "disputeqty": 0,
                "price": 400,
                "subtotal": 4000,
                "discounttype": 1,
                "discount": 0,
                "discounttotal": 0,
                "total": 4000,
                "ifigst": 1,
                "ctax": 0,
                "ctaxval": 0,
                "stax": 0,
                "staxval": 0,
                "itax": 5,
                "itaxval": 200,
                "grandtotal": 4200,
                "product": {
                    "pid": 100,
                    "productId": "000100",
                    "uuid": "shr000100",
                    "name": "Shree Shyam Rayon Embroidered Work With Floral Print Flared Long Women Gown",
                    "department_id": 3
                },
                "purchaseitemdetails": [
                    {
                        "id": 104031,
                        "purchaseorder_id": 1040,
                        "item_id": 10403,
                        "variant_id": 23,
                        "value_id": 18177,
                        "productvariant": {
                            "id": 23,
                            "uuid": "f6738769-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Size",
                            "displayname": "Size",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Text",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Size",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": "2022-10-07T17:39:19.000Z",
                            "updatedAt": "2022-10-06T18:30:00.000Z"
                        },
                        "productvariantvalue": {
                            "id": 18177,
                            "variant_id": 23,
                            "value": "XL",
                            "imgicon": "",
                            "ordering": 0,
                            "status": 1
                        }
                    },
                    {
                        "id": 104032,
                        "purchaseorder_id": 1040,
                        "item_id": 10403,
                        "variant_id": 24,
                        "value_id": 1217,
                        "productvariant": {
                            "id": 24,
                            "uuid": "fa5afd15-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Color",
                            "displayname": "Color",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Image",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Color",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": null,
                            "updatedAt": null
                        },
                        "productvariantvalue": {
                            "id": 1217,
                            "variant_id": 24,
                            "value": "Blue",
                            "imgicon": "",
                            "ordering": 8,
                            "status": 1
                        }
                    }
                ],
                "vendormapping": {
                    "id": 83,
                    "product_id": 100,
                    "vendor_id": 119,
                    "vendorproId": "1997",
                    "price": 400,
                    "deliveryscore": 0,
                    "qualityscore": 0,
                    "pendingstock": 0,
                    "notransitstock": "Yes",
                    "noactivepo": "Yes",
                    "taxfilling": "Yes",
                    "status": 1
                },
                "productselectimage": {
                    "id": 511,
                    "product_id": 100,
                    "image_id": 255,
                    "path": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1665555497845__DSC02348+copy.jpg"
                }
            },
            {
                "id": 10404,
                "uuid": "911e058a-5e84-4679-85f0-039247c070e2",
                "skuid": "18178_1217",
                "purchaseorder_id": 1040,
                "product_id": 100,
                "productselectimage_id": 511,
                "quantity": 10,
                "receivedqty": 0,
                "inwarditemcount": 0,
                "disputeqty": 0,
                "price": 400,
                "subtotal": 4000,
                "discounttype": 1,
                "discount": 0,
                "discounttotal": 0,
                "total": 4000,
                "ifigst": 1,
                "ctax": 0,
                "ctaxval": 0,
                "stax": 0,
                "staxval": 0,
                "itax": 5,
                "itaxval": 200,
                "grandtotal": 4200,
                "product": {
                    "pid": 100,
                    "productId": "000100",
                    "uuid": "shr000100",
                    "name": "Shree Shyam Rayon Embroidered Work With Floral Print Flared Long Women Gown",
                    "department_id": 3
                },
                "purchaseitemdetails": [
                    {
                        "id": 104041,
                        "purchaseorder_id": 1040,
                        "item_id": 10404,
                        "variant_id": 23,
                        "value_id": 18178,
                        "productvariant": {
                            "id": 23,
                            "uuid": "f6738769-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Size",
                            "displayname": "Size",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Text",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Size",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": "2022-10-07T17:39:19.000Z",
                            "updatedAt": "2022-10-06T18:30:00.000Z"
                        },
                        "productvariantvalue": {
                            "id": 18178,
                            "variant_id": 23,
                            "value": "XXL",
                            "imgicon": "",
                            "ordering": 0,
                            "status": 1
                        }
                    },
                    {
                        "id": 104042,
                        "purchaseorder_id": 1040,
                        "item_id": 10404,
                        "variant_id": 24,
                        "value_id": 1217,
                        "productvariant": {
                            "id": 24,
                            "uuid": "fa5afd15-4664-11ed-b2eb-907fcb7d11dd",
                            "name": "Color",
                            "displayname": "Color",
                            "department_id": 3,
                            "type": 0,
                            "showtype": "Image",
                            "refimg": "",
                            "reflabel": "",
                            "description": "Gown Color",
                            "status": 1,
                            "createdBy": 0,
                            "modifiedBy": 0,
                            "createdAt": null,
                            "updatedAt": null
                        },
                        "productvariantvalue": {
                            "id": 1217,
                            "variant_id": 24,
                            "value": "Blue",
                            "imgicon": "",
                            "ordering": 8,
                            "status": 1
                        }
                    }
                ],
                "vendormapping": {
                    "id": 83,
                    "product_id": 100,
                    "vendor_id": 119,
                    "vendorproId": "1997",
                    "price": 400,
                    "deliveryscore": 0,
                    "qualityscore": 0,
                    "pendingstock": 0,
                    "notransitstock": "Yes",
                    "noactivepo": "Yes",
                    "taxfilling": "Yes",
                    "status": 1
                },
                "productselectimage": {
                    "id": 511,
                    "product_id": 100,
                    "image_id": 255,
                    "path": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1665555497845__DSC02348+copy.jpg"
                }
            }
        ])
    }





}
