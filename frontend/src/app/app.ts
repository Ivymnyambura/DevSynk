
import { Component, OnDestroy, OnInit, signal } from '@angular/core';

interface FeaturedEvent {
  category: string;
  title: string;
  description: string;
  location: string;
  image: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  readonly activeSlide = signal(0);
  readonly menuOpen = signal(false);
  readonly aiPreviewOpen = signal(false);

openAiPreview(): void {
  this.aiPreviewOpen.update(value => !value);
}

closeAiPreview(): void {
  this.aiPreviewOpen.set(false);
}

  
readonly activeTechCategory = signal('FOR YOU');

readonly techCategories = [
  'FOR YOU',
  'AI',
  'DEVELOPMENT',
  'STARTUPS',
  'SECURITY'
];

readonly techStories = [
  {
    id: 1,
    category: 'AI',
    source: 'TechCrunch',
    title: 'The latest developments in artificial intelligence',
    description: 'Exploring how AI is transforming software development.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    published: 'SAMPLE STORY'
  },
  {
    id: 2,
    category: 'DEVELOPMENT',
    source: 'The Verge',
    title: 'How new developer tools are changing the way we build',
    description: 'A look at modern development workflows and tools.',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
    published: 'SAMPLE STORY'
  },
  {
    id: 3,
    category: 'STARTUPS',
    source: 'WIRED',
    title: 'The ideas and startups shaping the next generation of tech',
    description: 'Discovering emerging products and creative founders.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    published: 'SAMPLE STORY'
  },
  {
    id: 4,
    category: 'SECURITY',
    source: 'Ars Technica',
    title: 'Why cybersecurity matters more than ever for developers',
    description: 'Understanding security in modern software engineering.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    published: 'SAMPLE STORY'
  }
];

get filteredTechStories() {
  const category = this.activeTechCategory();

  return category === 'FOR YOU'
    ? this.techStories
    : this.techStories.filter(story => story.category === category);
}

setTechCategory(category: string): void {
  this.activeTechCategory.set(category);
}


  readonly events: FeaturedEvent[] = [
    {
      category: 'HACKATHONS',
      title: 'Build something extraordinary.',
      description: 'Find your next hackathon and meet your future teammates.',
      location: 'Nairobi & online',
      image:
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop',
    },
    {
      category: 'TECH CONFERENCES',
      title: 'Be part of the conversation.',
      description: 'Discover talks, workshops and inspiring technology communities.',
      location: 'Local & virtual',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop',
    },
    {
      category: 'DEVELOPER MEETUPS',
      title: 'Meet the people behind the code.',
      description: 'Connect with developers, designers and startup founders.',
      location: 'Around you',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop',
    },
  ];

  private slideTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.slideTimer = setInterval(() => this.nextSlide(), 6500);
  }

  ngOnDestroy(): void {
    if (this.slideTimer) clearInterval(this.slideTimer);
  }

  nextSlide(): void {
    this.activeSlide.update(index => (index + 1) % this.events.length);
  }

  previousSlide(): void {
    this.activeSlide.update(
      index => (index - 1 + this.events.length) % this.events.length
    );
  }

  goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}

