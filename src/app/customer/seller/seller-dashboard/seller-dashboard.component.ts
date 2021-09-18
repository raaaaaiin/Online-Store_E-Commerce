import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent implements OnInit {

  order_dashboard_data;
  last_order_date;

  product_dashboard_data;
  total_product: number = 0;
  publish_product: number = 0;
  inactive_product: number = 0;
    draft_product: number = 0;
  total_order: number = 0;
    recieved_order: number = 0;
  fordelivery_order: number = 0;
  delivered_order: number = 0;

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit() {
    this.sellerOrderDashboardData();
    this.sellerProductDashboardData();
  }
  sellerProductDashboard() {
    this.router.navigateByUrl("/seller/product");
  }
  sellerOrderDashboard() {
      this.router.navigateByUrl("/orders");
  }
  sellerOrderDashboardData() {
    this.customerService.orderDashboardData().subscribe(data => {

        this.order_dashboard_data = data;

        for (status in this.order_dashboard_data) {
            // console.log(this.product_dashboard_data[status].status);
            if (this.order_dashboard_data[status].itemStatus == 'For Delivery') {
                ++this.fordelivery_order;
            } else if (this.order_dashboard_data[status].itemStatus == 'Delivered') {
                ++this.delivered_order;
            } else if (this.order_dashboard_data[status].itemStatus == 'Recieved') {
                ++this.recieved_order;
            }
            ++this.total_order;
        }
      this.last_order_date = this.order_dashboard_data[this.total_order - 1].dateTime;
      // console.log("product_dashboard_data", this.order_dashboard_data);
    }, error => {
      console.log("My error", error);
    })
  }

  sellerProductDashboardData() {
    this.customerService.productDashboardData().subscribe(data => {
      this.product_dashboard_data = data;
      for (status in this.product_dashboard_data) {
        // console.log(this.product_dashboard_data[status].status);
        if (this.product_dashboard_data[status].status == 'publish') {
          ++this.publish_product;
        } else if (this.product_dashboard_data[status].status == 'inactive') {
          ++this.inactive_product;
        } else if (this.product_dashboard_data[status].status == 'draft') {
          ++this.draft_product;
        }
        ++this.total_product;
      }
      // console.log(this.publish_product);

      // console.log("product_dashboard_data", this.product_dashboard_data[this.product_dashboard_data.length - 1]);
    }, error => {
      console.log("My error", error);
    })
  }
}
