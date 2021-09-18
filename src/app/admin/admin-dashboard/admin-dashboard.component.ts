import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { CustomerService } from '../../customer/services/customer.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  user_dashboard_data;
  total_user: number = 0;
  admin_user: number = 0;
  seller_user: number = 0;
  buyer_user: number = 0;

  product_dashboard_data;
  total_product: number = 0;
  publish_product: number = 0;
  inactive_product: number = 0;
    draft_product: number = 0;

    order_dashboard_data;
    total_order: number = 0;
    recieved_order: number = 0;
    fordelivery_order: number = 0;
    delivered_order: number = 0;
    last_order_date;


    constructor(private router: Router, private adminService: AdminService, private customerService: CustomerService) { }

  ngOnInit() {
    this.adminUserDashboardData();
      this.adminProductDashboardData();
      this.sellerOrderDashboardData();
  }

  userDashboard() {
    this.router.navigateByUrl("/admin/user")
  }

  productDashboard() {
    this.router.navigateByUrl("/admin/product")
  }

  adminUserDashboardData() {
    this.adminService.userDashboardData().subscribe(data => {
      this.user_dashboard_data = data;
      for (let user in this.user_dashboard_data) {
        // console.log(this.user_dashboard_data[status].status);
        if (this.user_dashboard_data[user].role == 'admin') {
          ++this.admin_user;
        } else if (this.user_dashboard_data[user].role == 'seller') {
          ++this.seller_user;
        } else if (this.user_dashboard_data[user].role == 'buyer') {
          ++this.buyer_user;
        }
        ++this.total_user;
      }
    }, error => {
      console.log("My error", error);
    })
  }

  adminProductDashboardData() {
    this.adminService.productDashboardData().subscribe(data => {
      this.product_dashboard_data = data;
      console.log(this.product_dashboard_data);

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
    }, error => {
      console.log("My error", error);
    })
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
    sellerOrderDashboard() {
        this.router.navigateByUrl("/all-order");
    }
}
