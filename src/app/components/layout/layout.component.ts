import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faHome,
  faUser,
  faBox,
  faBoxes,
  faLeaf,
  faConciergeBell,
  faMoneyCheckAlt,
  faSignOutAlt,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  faHome = faHome;
  faUser = faUser;
  faBox = faBox;
  faBoxes = faBoxes;
  faLeaf = faLeaf;
  faConciergeBell = faConciergeBell;
  faMoneyCheckAlt = faMoneyCheckAlt;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  isCollapsed = false;
  userRole: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
