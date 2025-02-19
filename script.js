class CMS {
    constructor() {
        this.content = {};
        this.editableElements = document.querySelectorAll('[data-editable]');
        this.loadContent();
        this.setupEditableContent();
    }

    loadContent() {
        const savedContent = localStorage.getItem('portfolioContent');
        if (savedContent) {
            this.content = JSON.parse(savedContent);
            this.updateContent();
        }
    }

    saveContent() {
        localStorage.setItem('portfolioContent', JSON.stringify(this.content));
    }

    setupEditableContent() {
        this.editableElements.forEach(element => {
            if (!element.querySelector('.edit-button')) {
                const editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => this.showEditor(element));
                element.appendChild(editButton);
            }
        });
    }

    showEditor(element) {
        const id = element.dataset.editable;
        const content = this.content[id] || element.innerHTML;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Content</h2>
                <textarea rows="10" class="editor-textarea">${content}</textarea>
                <button class="btn btn-primary save-btn">Save</button>
                <button class="btn btn-outline cancel-btn">Cancel</button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        modal.querySelector('.save-btn').addEventListener('click', () => {
            this.content[id] = modal.querySelector('.editor-textarea').value;
            element.innerHTML = this.content[id];
            this.saveContent();
            this.closeModal(modal);
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => this.closeModal(modal));
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }

    updateContent() {
        this.editableElements.forEach(element => {
            const id = element.dataset.editable;
            if (this.content[id]) {
                element.innerHTML = this.content[id];
                this.setupEditableContent();
            }
        });
    }
}

class ProjectFilter {
    constructor() {
        this.projects = document.querySelectorAll('.project-card');
        if (this.projects.length) {
            this.setupFilters();
        }
    }

    setupFilters() {
        const categories = new Set(Array.from(this.projects).map(project => project.dataset.category));
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All</button>
            ${[...categories].map(category => `<button class="filter-btn" data-filter="${category}">${category}</button>`).join('')}
        `;

        const projectsSection = document.querySelector('#projects');
        if (projectsSection) {
            projectsSection.insertBefore(filterContainer, projectsSection.querySelector('.projects-grid'));
            filterContainer.addEventListener('click', e => {
                if (e.target.classList.contains('filter-btn')) {
                    this.filterProjects(e.target.dataset.filter);
                    this.updateActiveFilter(e.target);
                }
            });
        }
    }

    filterProjects(category) {
        this.projects.forEach(project => {
            project.classList.toggle('hidden', category !== 'all' && project.dataset.category !== category);
        });
    }

    updateActiveFilter(clickedBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CMS();
    new ProjectFilter();
    
    const themeToggle = document.querySelector('.theme-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) document.body.classList.add('dark-mode');
    
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
    });
});