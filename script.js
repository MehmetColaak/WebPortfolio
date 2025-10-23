// Single page portfolio with icon functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });

    const icons = document.querySelectorAll('.icon');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const textPopup = document.getElementById('textPopup');
    const popupText = document.getElementById('popupText');

    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function(e) {
            const type = this.getAttribute('data-type');
            
            if (type === 'images') {
                const images = this.getAttribute('data-images');
                if (images) {
                    const imageArray = images.split(',');
                    previewImg.src = imageArray[0].trim();
                    imagePreview.style.display = 'block';
                }
            } else if (type === 'description') {
                const description = this.getAttribute('data-description');
                if (description) {
                    popupText.innerHTML = description;
                    textPopup.style.display = 'block';
                }
            }
        });

        icon.addEventListener('mousemove', function(e) {
            const type = this.getAttribute('data-type');
            
            if (type === 'images' && imagePreview.style.display === 'block') {
                const x = e.clientX + 10;
                const y = e.clientY - (imagePreview.offsetHeight / 2);
                const maxY = window.innerHeight - imagePreview.offsetHeight - 10;
                const minY = 10;
                
                imagePreview.style.left = x + 'px';
                imagePreview.style.top = Math.max(minY, Math.min(y, maxY)) + 'px';
            } else if (type === 'description' && textPopup.style.display === 'block') {
                const x = e.clientX + 10;
                const y = e.clientY - (textPopup.offsetHeight / 2);
                
                textPopup.style.left = x + 'px';
                textPopup.style.top = y + 'px';
            }
        });

        icon.addEventListener('mouseleave', function() {
            imagePreview.style.display = 'none';
            previewImg.src = '';
            textPopup.style.display = 'none';
        });

        icon.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const url = this.getAttribute('data-url');
            
            if (type === 'link' && url) {
                window.open(url, '_blank');
            }
        });
    });
});