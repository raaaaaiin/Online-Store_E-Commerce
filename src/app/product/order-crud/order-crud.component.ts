import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { Address, Order, Product } from '../../core/models/object-model';
declare var jQuery: any;

@Component({
  selector: 'order-product-crud',
  templateUrl: './order-crud.component.html',
    styleUrls: ['./order-crud.component.scss']
})

export class OrderCrudComponent implements OnInit {
    user_role:string;
  all_product_data;
  addEditProductForm: FormGroup;
  addEditProduct: boolean = false;//for form validation
  popup_header: string;
  add_product: boolean;
  edit_product: boolean;
    sale: Order[];
    order_dto: Order[];
    order_cdto: Order;
    product_data;
    order_data;
  product_dto: Product

  single_product_data;
  edit_product_id;




    orderid: number;
    orderuserId: number;
    orderbuyername: string;
    ordersellerId: number;
    orderproduct: Product;
    orderdeliveryAddress: Address;
    orderitemStatus: string;
    ordercontact: Number;
    orderdateTime: string;
    selectedorder: number;
  constructor(private formBuilder: FormBuilder, private router: Router, private product_service: ProductService) { }

  ngOnInit() {
    this.addEditProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      uploadPhoto: ['', Validators.required],
      productDesc: ['', Validators.required],
      mrp: ['', Validators.required],
      dp: ['', Validators.required],
      status: ['', Validators.required]
    })
      
      this.user_role = sessionStorage.getItem("role");
      if (this.user_role == "seller") {
          this.getSellersorder();
      } else if (this.user_role == "buyer") {
            this.getBuyerorders();
      } else if (this.user_role == "admin") {
          this.getAdminorders();
      }
     
      
  }

  get rf() { return this.addEditProductForm.controls; }
    getAdminorders() {

        this.product_service.adminOrder().subscribe(data => {
            this.all_product_data = data;
        }, error => {
            console.log("My error", error);
        })
    }
    getBuyerorders() {

      this.product_service.buyyerOrder(sessionStorage.getItem('user_session_id')).subscribe(data => {
      this.all_product_data = data;
    }, error => {
      console.log("My error", error);
    })
    }
    getSellersorder() {

        this.product_service.sellerOrder(sessionStorage.getItem('user_session_id')).subscribe(data => {
            this.all_product_data = data;
        }, error => {
            console.log("My error", error);
        })
    }
    getUpdateorder() {

    }
  addProductPopup() {
    this.add_product = true;
    this.edit_product = false;
    this.popup_header = "Add New Product";
    this.addEditProductForm.reset();
  }

 

  editProductPopup(id) {
    this.add_product = false;
    this.edit_product = true;
    this.popup_header = "Edit Product";
    this.addEditProductForm.reset();
    this.product_service.singleProduct(id).subscribe(data => {
      this.single_product_data = data;
      this.edit_product_id = data.id;
      // console.log("single_product_data", this.single_product_data)
      this.addEditProductForm.setValue({
        name: this.single_product_data.name,
        // uploadPhoto: '',
        uploadPhoto: this.single_product_data.uploadPhoto,
        productDesc: this.single_product_data.productDesc,
        mrp: this.single_product_data.mrp,
        dp: this.single_product_data.dp,
        status: this.single_product_data.status
      })
    })
  }

  updateProduct() {
    this.addEditProduct = true;
    if (this.addEditProductForm.invalid) {
      // alert('Error!! :-)\n\n' + JSON.stringify(this.addEditUserForm.value))
      return;
    }
    this.product_data = this.addEditProductForm.value;
    this.product_dto = {
      id: 0,
      name: this.product_data.name,
      uploadPhoto: this.product_data.uploadPhoto,
      productDesc: this.product_data.productDesc,
      mrp: this.product_data.mrp,
      dp: this.product_data.dp,
      status: this.product_data.status
    }
    this.product_service.updateProduct(this.edit_product_id, this.product_dto).subscribe(data => {
      // console.log(data);
      jQuery('#addEditProductModal').modal('toggle');
        this.getSellersorder();
    }, err => {
      alert("Some Error Occured");
    })
  }

  deleteOrder(id,index) {
    let r = confirm("Do you want to delete the Order Number : " + index + "?");
    if (r == true) {
        this.product_service.deleteOrder(id).subscribe(data => {
        console.log("deleted successfully", data);
          this.getSellersorder();
      }, err => {
        alert(err);
      })
    } else {
      alert("You pressed Cancel!");
    }

  }

    editOrderPopup(id) {
        this.selectedorder = id;
        this.product_service.getOrder(this.selectedorder).subscribe(data => {
            this.order_dto = data;
            for (let order of this.order_dto) {
                this.orderid = order.id;

                this.orderuserId= order.userId;
                this.orderbuyername=order.buyername;
                this.ordersellerId= order.sellerId;
                this.orderproduct= order.product;
                this.orderdeliveryAddress= order.deliveryAddress;
                this.orderitemStatus= order.itemStatus;
                this.ordercontact= order.contact;
                this.orderdateTime= order.dateTime;
            }
        }, error => {
            console.log("My error", error);
        })
    }
    updateOrder() {
        this.order_data = this.addEditProductForm.value;

        this.order_cdto = {
            id: this.orderid,
            userId: this.orderuserId,
            buyername: this.orderbuyername,
            sellerId: this.ordersellerId,
            product: this.orderproduct,
            deliveryAddress: this.orderdeliveryAddress,
            itemStatus: this.order_data.status,
            contact: this.ordercontact,
            dateTime: this.orderdateTime,
        }
        this.product_service.updateorder(this.selectedorder, this.order_cdto).subscribe(data => {
            alert("Update Success");
            jQuery('#addEditProductModal').modal('toggle');
            if (this.user_role == "seller") {
                this.getSellersorder();
            } else {
                this.getAdminorders();
            }
        }, err => {
                alert("LOH");
        })
    }
   
}
