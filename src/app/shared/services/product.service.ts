import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    /*prod_url = http://localhost:3000/orders?userId=/ */
  public product_url = environment.server_url + '/products/';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  allProduct(): Observable<any> {
    return this.apiService.get(this.product_url)
  }
  sellerProduct(id): Observable<any> {
        return this.apiService.get(this.product_url)
    }
  sellerOrder(id): Observable<any> {
      return this.apiService.get('http://localhost:3000/orders?sellerId=' + id)
  }
  buyyerOrder(id): Observable<any> {
      return this.apiService.get('http://localhost:3000/orders?userId='+id)
  }
    adminOrder(): Observable<any> {
        return this.apiService.get('http://localhost:3000/orders');
    }
  addNewProduct(product_dto): Observable<any> {
    return this.apiService.post(this.product_url, product_dto);
  }

  singleProduct(id) {
    return this.apiService.get(this.product_url + id)
  }
  updateProduct(id, product_dto): Observable<any> {
    return this.apiService.put(this.product_url + id, product_dto);
  }
  updateorder(id, order_dto): Observable<any> {
      return this.apiService.put('http://localhost:3000/orders/'+ id, order_dto);
  }
  getOrder(id): Observable<any> {
        return this.apiService.get('http://localhost:3000/orders?id=' + id)
  }
  deleteProduct(id): Observable<any> {
    return this.apiService.delete(this.product_url + id);
  }
    deleteOrder(id): Observable<any> {
        return this.apiService.delete('http://localhost:3000/orders/' + id);
    }
}
