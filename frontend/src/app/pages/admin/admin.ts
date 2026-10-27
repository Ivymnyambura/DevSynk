
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ListingType = 'event' | 'hackathon';
type ListingStatus = 'draft' | 'published';

interface EventListing {
  id: string;
  type: ListingType;
  status: ListingStatus;

  title: string;
  category: string;
  description: string;
  additionalInfo: string;

  organizer: string;
  organizerWebsite: string;
  imageUrl: string;

  startDate: string;
  endDate: string;
  startTime: string;
  timezone: string;
  locationType: string;
  venue: string;

  admission: string;
  currency: string;
  ticketPrice: number | null;
  registrationLink: string;

  requirements: string;
  eligibility: string;
  registrationDeadline: string;
  teamSize: string;
  tracks: string;
  prizes: string;
  submissionLink: string;

  featured: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  private readonly storageKey = 'devsynk-admin-events-v1';

  readonly listings = signal<EventListing[]>(this.loadListings());

  readonly searchQuery = signal('');
  readonly statusFilter = signal('all');
  readonly modalOpen = signal(false);
  readonly isSaving = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly filteredListings = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    return this.listings().filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.organizer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      const matchesStatus =
        this.statusFilter() === 'all' ||
        item.status === this.statusFilter();

      return matchesSearch && matchesStatus;
    });
  });

  readonly totalEvents = computed(() => this.listings().length);

  readonly publishedEvents = computed(
    () => this.listings().filter(item => item.status === 'published').length
  );

  readonly draftEvents = computed(
    () => this.listings().filter(item => item.status === 'draft').length
  );

  form: EventListing = this.emptyForm();

  private emptyForm(): EventListing {
    return {
      id: '',
      type: 'event',
      status: 'draft',

      title: '',
      category: 'TECH',
      description: '',
      additionalInfo: '',

      organizer: '',
      organizerWebsite: '',
      imageUrl: '',

      startDate: '',
      endDate: '',
      startTime: '',
      timezone: 'Africa/Nairobi',
      locationType: 'online',
      venue: '',

      admission: 'free',
      currency: 'KES',
      ticketPrice: null,
      registrationLink: '',

      requirements: '',
      eligibility: '',
      registrationDeadline: '',
      teamSize: '',
      tracks: '',
      prizes: '',
      submissionLink: '',

      featured: false,
      createdAt: ''
    };
  }

  openCreateModal(type: ListingType = 'event'): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.form.type = type;
    this.modalOpen.set(true);
  }

  openEditModal(item: EventListing): void {
    this.editingId.set(item.id);
    this.form = { ...item };
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (this.isSaving()) return;

    this.modalOpen.set(false);
    this.editingId.set(null);
  }

  saveListing(status: ListingStatus): void {
    if (!this.form.title.trim() || !this.form.organizer.trim()) {
      alert('Please enter an event title and organizer.');
      return;
    }

    this.isSaving.set(true);

    try {
      const existing = this.listings().find(
        item => item.id === this.editingId()
      );

      const listing: EventListing = {
        ...this.form,
        id: existing?.id ?? crypto.randomUUID(),
        status,
        createdAt: existing?.createdAt ?? new Date().toISOString()
      };

      const updated = existing
        ? this.listings().map(item =>
            item.id === existing.id ? listing : item
          )
        : [listing, ...this.listings()];

      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      this.listings.set(updated);
      this.modalOpen.set(false);
      this.editingId.set(null);
    } catch (error) {
      console.error('Unable to save listing:', error);
      alert('The listing could not be saved. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  deleteListing(id: string): void {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    const updated = this.listings().filter(item => item.id !== id);

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      this.listings.set(updated);
    } catch (error) {
      console.error('Unable to delete listing:', error);
      alert('The listing could not be deleted.');
    }
  }

  private loadListings(): EventListing[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed) ? parsed as EventListing[] : [];
    } catch {
      return [];
    }
  }
}
