import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trips.html',
  styleUrls: ['./trips.css']
})
export class Trips {
  trips = signal([
    {
      id: 1,
      title: 'Paris City Break',
      destination: '🇫🇷 Paris',
      duration: '5 days',
      members: 4,
      budget: '$2,400',
      image: '🗼',
      status: 'Ongoing'
    },
    {
      id: 2,
      title: 'Tokyo Adventure',
      destination: '🇯🇵 Tokyo',
      duration: '7 days',
      members: 3,
      budget: '$3,200',
      image: '🗾',
      status: 'Planning'
    },
    {
      id: 3,
      title: 'Barcelona Beach',
      destination: '🇪🇸 Barcelona',
      duration: '4 days',
      members: 5,
      budget: '$1,800',
      image: '🏖️',
      status: 'Planning'
    },
    {
      id: 4,
      title: 'New York Exploration',
      destination: '🇺🇸 NYC',
      duration: '6 days',
      members: 2,
      budget: '$2,800',
      image: '🗽',
      status: 'Completed'
    }
  ]);

  selectedFilter = signal<'All' | 'Ongoing' | 'Planning' | 'Completed'>('All');

  constructor(private router: Router) {}

  setFilter(filter: string) {
    this.selectedFilter.set(filter as 'All' | 'Ongoing' | 'Planning' | 'Completed');
  }

  getFilteredTrips() {
    if (this.selectedFilter() === 'All') {
      return this.trips();
    }
    return this.trips().filter(trip => trip.status === this.selectedFilter());
  }

  viewTrip(tripId: number) {
    console.log('Viewing trip:', tripId);
    // Navigate to trip details
  }

  editTrip(tripId: number) {
    console.log('Editing trip:', tripId);
  }

  deleteTrip(tripId: number) {
    console.log('Deleting trip:', tripId);
    this.trips.set(this.trips().filter(trip => trip.id !== tripId));
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
