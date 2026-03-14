document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Load Projects IMMEDIATELY on page load
    loadProjects();

    // 2. Tab Switching Logic
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');

            // Note: We do NOT reload here because we already loaded everything on line 6.
            // This prevents flickering or double-loading.
        });
    });

    // 3. UI Elements
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const textPopup = document.getElementById('textPopup');
    const popupText = document.getElementById('popupText');

    // 4. Load Projects Function
    async function loadProjects() {
        const contentContainer = document.getElementById('dynamic-content');
        contentContainer.innerHTML = '<p style="text-align:center;">Loading projects...</p>';

        try {
            const response = await fetch('data.json');
            
            // If fetch fails (e.g. CORS), show error
            if (!response.ok) {
                console.error("Fetch failed:", response.statusText);
                throw new Error('CORS Error: Please ensure you are using Live Server or a local web server.');
            }

            const projects = await response.json();
            contentContainer.innerHTML = ''; // Clear loading text

            // Group by Section
            const groupedProjects = {};
            projects.forEach(p => {
                if (!groupedProjects[p.section]) groupedProjects[p.section] = [];
                groupedProjects[p.section].push(p);
            });

            // Build HTML
            for (const sectionName in groupedProjects) {
                const sectionWrapper = document.createElement('div');
                sectionWrapper.className = 'works-subsection';
                
                const h3 = document.createElement('h3');
                h3.innerText = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
                sectionWrapper.appendChild(h3);

                const ul = document.createElement('ul');
                
                groupedProjects[sectionName].forEach(project => {
                    ul.appendChild(createProjectTreeItem(project));
                });

                sectionWrapper.appendChild(ul);
                contentContainer.appendChild(sectionWrapper);
            }

        } catch (error) {
            console.error(error);
            contentContainer.innerHTML = `<p style="color:red;">Error: ${error.message}<br>Please open in Live Server.</p>`;
        }
    }

    // 5. Create Tree Item Function
    function createProjectTreeItem(project) {
        const li = document.createElement('li');
        li.className = 'project-item';

        // Trigger (Year, Role, Title)
        const trigger = document.createElement('div');
        trigger.className = 'project-trigger';
        
        const triggerHeader = document.createElement('div');
        triggerHeader.className = 'trigger-header';

        // Year & Role
        const yearRoleRow = document.createElement('div');
        yearRoleRow.className = 'trigger-year-role';
        
        const yearText = project.year ? project.year + ' - ' : '';
        const roleText = project.role ? project.role : '';
        yearRoleRow.innerText = yearText + roleText;

        // Title
        const titleSpan = document.createElement('h4');
        titleSpan.className = 'trigger-title';
        titleSpan.innerText = project.title;

        triggerHeader.appendChild(yearRoleRow);
        triggerHeader.appendChild(titleSpan);

        trigger.appendChild(triggerHeader);
        li.appendChild(trigger);

        // Details (Hidden)
        const details = document.createElement('div');
        details.className = 'project-details';

        // Description
        if (project.description) {
            const desc = document.createElement('div');
            desc.className = 'project-description';
            desc.innerHTML = project.description;
            details.appendChild(desc);
        }

        // Images
        if (project.images && project.images.length > 0) {
            const gallery = document.createElement('div');
            gallery.className = 'project-gallery';
            
            project.images.forEach(imgPath => {
                const img = document.createElement('img');
                img.src = imgPath;
                img.alt = project.title;
                img.loading = "lazy";
                gallery.appendChild(img);
            });
            details.appendChild(gallery);
        }

        // Links
        if (project.links && project.links.length > 0) {
            const linksContainer = document.createElement('div');
            linksContainer.className = 'project-links';

            project.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.className = 'link-btn';
                
                const iconSvg = `
                    <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                `;
                
                a.innerHTML = iconSvg + link.title;
                linksContainer.appendChild(a);
            });

            details.appendChild(linksContainer);
        }

        li.appendChild(details);

        // Toggle Logic
        trigger.addEventListener('click', function() {
            li.classList.toggle('open');
        });

        return li;
    }

    // 6. Dark Mode Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check for saved user preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    themeToggleBtn.addEventListener('click', function() {
        // Toggle class
        document.body.classList.toggle('dark-mode');
        
        // Save preference
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

});
