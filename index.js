// Single page portfolio with icon functionality
document.addEventListener('DOMContentLoaded', function() {
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const textPopup = document.getElementById('textPopup');
    const popupText = document.getElementById('popupText');
    const icons = document.querySelectorAll('.icon');

    icons.forEach(icon => {
        const type = icon.getAttribute('data-type');
        
        if (type === 'images') {
            // Handle image hover
            icon.addEventListener('mouseenter', function(e) {
                const images = this.getAttribute('data-images');
                if (images) {
                    const imageList = images.split(',');
                    const firstImage = imageList[0].trim();
                    
                    previewImg.src = firstImage;
                    imagePreview.style.display = 'block';
                    
                    // Position the preview near the mouse
                    updateImagePreviewPosition(e);
                }
            });

            icon.addEventListener('mousemove', function(e) {
                updateImagePreviewPosition(e);
            });

            icon.addEventListener('mouseleave', function() {
                imagePreview.style.display = 'none';
            });
            
        } else if (type === 'description') {
            // Handle text description hover
            icon.addEventListener('mouseenter', function(e) {
                const description = this.getAttribute('data-description');
                if (description) {
                    popupText.textContent = description;
                    textPopup.style.display = 'block';
                    
                    // Position the popup near the mouse
                    updateTextPopupPosition(e);
                }
            });

            icon.addEventListener('mousemove', function(e) {
                updateTextPopupPosition(e);
            });

            icon.addEventListener('mouseleave', function() {
                textPopup.style.display = 'none';
            });
            
        } else if (type === 'link') {
            // Handle link clicks
            icon.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            });
        }
    });

    function updateImagePreviewPosition(e) {
        const x = e.clientX + 10;
        const y = e.clientY - (imagePreview.offsetHeight / 2);
        
        // Make sure preview doesn't go off screen
        const maxX = window.innerWidth - imagePreview.offsetWidth - 20;
        const maxY = window.innerHeight - imagePreview.offsetHeight - 20;
        const minY = 10;
        
        imagePreview.style.left = Math.min(x, maxX) + 'px';
        imagePreview.style.top = Math.max(minY, Math.min(y, maxY)) + 'px';
    }

    function updateTextPopupPosition(e) {
        const x = e.clientX + 10;
        const y = e.clientY + 10;
        
        // Make sure popup doesn't go off screen
        const maxX = window.innerWidth - textPopup.offsetWidth - 20;
        const maxY = window.innerHeight - textPopup.offsetHeight - 20;
        
        textPopup.style.left = Math.min(x, maxX) + 'px';
        textPopup.style.top = Math.min(y, maxY) + 'px';
    }
});