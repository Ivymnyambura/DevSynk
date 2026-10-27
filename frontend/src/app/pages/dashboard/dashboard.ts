
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

type OverviewKey = 'projects' | 'tasks' | 'completed' | 'due';

type ProjectStatus = 'planning' | 'active';

interface OverviewDetail {
  title: string;
  description: string;
  emptyTitle: string;
  emptyMessage: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  // OVERVIEW DETAIL PANELS

  activePanel: OverviewKey | null = null;

  readonly overviewDetails: Record<OverviewKey, OverviewDetail> = {
    projects: {
      title: 'Active Projects',
      description: 'Your ongoing development projects',
      emptyTitle: 'No active projects yet',
      emptyMessage: 'Create your first project to start building in DevSynk.',
    },
    tasks: {
      title: 'My Tasks',
      description: 'Tasks currently assigned to you',
      emptyTitle: 'All clear for now',
      emptyMessage: 'Your assigned tasks will appear here.',
    },
    completed: {
      title: 'Completed',
      description: 'Your finished work',
      emptyTitle: 'Your milestones start here',
      emptyMessage: 'Completed tasks will appear here as you make progress.',
    },
    due: {
      title: 'Due Soon',
      description: 'Keep track of upcoming deadlines',
      emptyTitle: 'No upcoming deadlines',
      emptyMessage: 'Tasks with approaching due dates will appear here.',
    },
  };

  get selectedDetail(): OverviewDetail | null {
    return this.activePanel
      ? this.overviewDetails[this.activePanel]
      : null;
  }

  openPanel(panel: OverviewKey): void {
    this.activePanel = panel;
  }

  closePanel(): void {
    this.activePanel = null;
  }

  // NEW PROJECT MODAL

showProjectModal = false;

projectCreationMode: 'new' | 'import' = 'new';

  projectName = '';
  projectDescription = '';
  projectStatus: ProjectStatus = 'planning';
  statusDropdownOpen = false;

toggleStatusDropdown(): void {
  this.statusDropdownOpen = !this.statusDropdownOpen;
}

selectProjectStatus(status: ProjectStatus): void {
  this.projectStatus = status;
  this.statusDropdownOpen = false;
}

  projects: Project[] = [];

  openProjectModal(): void {
  this.statusDropdownOpen = false;
  this.projectName = '';
  this.projectDescription = '';
  this.projectStatus = 'planning';
  this.projectCreationMode = 'new';
  this.showProjectModal = true;
}
  closeProjectModal(): void {
    this.showProjectModal = false;
  }

  createProject(): void {
    const name = this.projectName.trim();

    if (!name) {
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      name,
      description: this.projectDescription.trim(),
      status: this.projectStatus,
    };

    this.projects = [newProject, ...this.projects];

    this.closeProjectModal();
  }

  // PROJECT STATISTICS

  get activeProjectCount(): number {
    return this.projects.filter(
      project => project.status === 'active'
    ).length;
  }

  // KEYBOARD INTERACTIONS

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showProjectModal) {
      this.closeProjectModal();
    } else {
      this.closePanel();
    }
  }
}
