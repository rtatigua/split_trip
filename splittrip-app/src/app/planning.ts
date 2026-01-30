import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planning.html',
  styleUrls: ['./planning.css']
})
export class Planning {
  tripName = signal('');
  destination = signal('');
  startDate = signal('');
  endDate = signal('');
  members = signal('');
  budget = signal('');
  showSuccess = signal(false);

  constructor(private router: Router) {}

  createTrip() {
    if (this.tripName() && this.destination()) {
      this.showSuccess.set(true);
      setTimeout(() => {
        this.router.navigate(['/my-trips']);
      }, 2000);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
