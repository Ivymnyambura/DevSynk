
import { Component, computed, signal } from '@angular/core';

type EventCategory = 'ALL EVENTS' | 'TECH' | 'HACKATHONS' | 'MEETUPS' | 'WORKSHOPS';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
  templateUrl: './events.html',
  styleUrl: './events.css',
})
export class Events {
  readonly searchQuery = signal('');
  readonly activeCategory = signal<EventCategory>('ALL EVENTS');

  readonly categories: EventCategory[] = [
    'ALL EVENTS',
    'TECH',
    'HACKATHONS',
    'MEETUPS',
    'WORKSHOPS',
  ];

  
  // Calendar navigation and date selection
  readonly today = new Date();
  readonly displayedMonth = signal(
    new Date(this.today.getFullYear(), this.today.getMonth(), 1)
  );

  readonly selectedDate = signal<string | null>(null);

  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  readonly monthLabel = computed(() =>
    this.displayedMonth().toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric',
    })
  );

  readonly calendarDays = computed(() => {
    const month = this.displayedMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(year, monthIndex, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  });

  readonly todayKey = this.dateKey(this.today);

  
readonly discoveryEvents = [
  {
    id: 1,
    day: '12',
    month: 'NOV',
    title: 'AI & the Future of Building',
    category: 'TECH',
    type: 'AI Conference',
    location: 'Online',
    description: 'Explore creative tools, intelligent systems, and the future of software.',
    host: 'NVIDIA',
    hostInitials: 'NV',
    tag: 'AI / ML',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    day: '18',
    month: 'NOV',
    title: 'The Developer Meetup',
    category: 'MEETUPS',
    type: 'Community Meetup',
    location: 'Nairobi, Kenya',
    description: 'Meet fellow developers, share ideas, and make meaningful connections.',
    host: 'ALX Africa',
    hostInitials: 'ALX',
    tag: 'COMMUNITY',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    day: '24',
    month: 'NOV',
    title: 'Building Better APIs',
    category: 'WORKSHOPS',
    type: 'Workshop',
    location: 'Nairobi, Kenya',
    description: 'Learn practical API design through collaborative development.',
    host: 'Moringa School',
    hostInitials: 'MS',
    tag: 'BACKEND',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    day: '05',
    month: 'DEC',
    title: 'Code Beyond Limits',
    category: 'HACKATHONS',
    type: 'Hackathon',
    location: 'Online',
    description: 'Bring your boldest ideas to life in a creative coding challenge.',
    host: 'NVIDIA',
    hostInitials: 'NV',
    tag: 'TEAM EVENT',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=700&auto=format&fit=crop&q=80'
  },
  {
    id: 5,
    day: '12',
    month: 'DEC',
    title: 'AI Builders Challenge',
    category: 'HACKATHONS',
    type: 'AI Hackathon',
    location: 'Hybrid',
    description: 'Experiment with AI, prototype solutions, and collaborate with builders.',
    host: 'ALX Africa',
    hostInitials: 'ALX',
    tag: 'AI / ML',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&auto=format&fit=crop&q=80'
  }
];

  readonly filteredEvents = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const category = this.activeCategory();

    return this.discoveryEvents.filter((event) => {
      const matchesCategory =
        category === 'ALL EVENTS' || event.category === category;

      const matchesSearch =
        !query ||
        [
          event.title,
          event.category,
          event.type,
          event.location,
          event.description,
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  });

  readonly trendingEvents = computed(() =>
    this.filteredEvents().filter(
      (event) => event.category !== 'HACKATHONS'
    )
  );

  readonly hackathonEvents = computed(() =>
    this.filteredEvents().filter(
      (event) => event.category === 'HACKATHONS'
    )
  );

  changeMonth(offset: number): void {
    const current = this.displayedMonth();

    this.displayedMonth.set(
      new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );

    this.selectedDate.set(null);
  }

  selectDay(day: number): void {
    const month = this.displayedMonth();
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    this.selectedDate.set(this.dateKey(date));
  }

  isToday(day: number): boolean {
    const month = this.displayedMonth();

    return (
      day === this.today.getDate() &&
      month.getMonth() === this.today.getMonth() &&
      month.getFullYear() === this.today.getFullYear()
    );
  }

  isSelected(day: number): boolean {
    const month = this.displayedMonth();
    const date = new Date(month.getFullYear(), month.getMonth(), day);

    return this.selectedDate() === this.dateKey(date);
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  readonly activeFilters = computed(() => ({
    query: this.searchQuery().trim().toLowerCase(),
    category: this.activeCategory(),
  }));

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  setCategory(category: EventCategory): void {
    this.activeCategory.set(category);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.activeCategory.set('ALL EVENTS');
  }
}
