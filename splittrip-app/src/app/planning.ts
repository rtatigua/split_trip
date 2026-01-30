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
  errors = signal<string[]>([]);

  constructor(private router: Router) {}

  isFormValid(): boolean {
    this.errors.set([]);
    const validationErrors: string[] = [];

    if (!this.tripName().trim()) {
      validationErrors.push('Trip name is required');
    }
    if (!this.destination().trim()) {
      validationErrors.push('Destination is required');
    }
    if (!this.startDate()) {
      validationErrors.push('Start date is required');
    }
    if (!this.endDate()) {
      validationErrors.push('End date is required');
    }
    if (this.startDate() && this.endDate() && new Date(this.startDate()) >= new Date(this.endDate())) {
      validationErrors.push('End date must be after start date');
    }
    if (!this.members().trim()) {
      validationErrors.push('Number of members is required');
    } else if (isNaN(Number(this.members())) || Number(this.members()) < 1) {
      validationErrors.push('Members must be a valid number greater than 0');
    }
    if (!this.budget().trim()) {
      validationErrors.push('Budget is required');
    } else if (isNaN(Number(this.budget())) || Number(this.budget()) <= 0) {
      validationErrors.push('Budget must be a valid amount greater than 0');
    }

    if (validationErrors.length > 0) {
      this.errors.set(validationErrors);
      return false;
    }

    return true;
  }

  createTrip() {
    if (this.isFormValid()) {
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
