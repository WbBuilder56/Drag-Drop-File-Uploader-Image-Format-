const dropArea = document.querySelector('.drop-section');
const listSection = document.querySelector('.list-section');
const listContainer = document.querySelector('.list');
const fileSelector = document.querySelector('.file-selector');
const fileSelectorInput = document.querySelector('.file-selector-input');

// Load stored images on page load
window.onload = () => {
    loadStoredImages();
};

// Upload files with browse button
fileSelector.onclick = () => fileSelectorInput.click();
fileSelectorInput.onchange = () => {
    handleFiles([...fileSelectorInput.files]);
};

// Handle drag and drop
dropArea.ondragover = (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over-effect');
};

dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect');
};

dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect');
    handleFiles([...e.dataTransfer.files]);
};

// Handle file processing
function handleFiles(files) {
    files.forEach((file) => {
        if (typeValidation(file.type)) {
            simulateUpload(file);
        } else {
            alert('Invalid file type. Please upload an image!');
        }
    });
}

// Validate image type
function typeValidation(type) {
    return type.split('/')[0] === 'image';
}

// Simulate progress before uploading file
function simulateUpload(file) {
    const li = document.createElement('li');
    li.classList.add('uploading');
    listSection.style.display = 'block';

    li.innerHTML = `
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span class="progress-text">0%</span>
            </div>
        </div>
        <div class="file-progress">
                <span class="progress-bar" style="width: 0%;"></span>
            </div>
    `;

    listContainer.prepend(li);

    let progress = 0;
    const progressBar = li.querySelector('.progress-bar');
    const progressText = li.querySelector('.progress-text');

    // Fake progress animation
    const interval = setInterval(() => {
        progress += 10;
        progressBar.style.width = `${progress}%`;
        progressText.innerText = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            uploadFile(file, li); // Upload image after progress completes
        }
    }, 200);
}

// Upload file function
function uploadFile(file, li) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageUrl = e.target.result;
        saveImageToLocal(file.name, imageUrl);

        // Update UI to show the uploaded image
        li.classList.remove('uploading');
        li.classList.add('complete');

        li.innerHTML = `
            <div class="col">
                <img src="${imageUrl}" alt="image-icon" class="image-icon">
            </div>
            <div class="col">
                <div class="file-name">
                    <div class="name">${file.name}</div>
                </div>
            </div>
            <div class="col">
                <img src="icons/icons8-cross-30.png" width="25px" height="25px" class="cross" alt="cross-icon">
            </div>
        `;

        // Handle image removal
        li.querySelector('.cross').onclick = () => {
            li.remove();
            removeImageFromLocal(file.name);
        };
    };

    reader.readAsDataURL(file);
}

// Save image to localStorage
function saveImageToLocal(name, url) {
    const images = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    images.push({ name, url });
    localStorage.setItem('uploadedImages', JSON.stringify(images));
}

// Load stored images on refresh
function loadStoredImages() {
    const images = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    images.forEach((img) => renderImage(img.name, img.url));
}

// Render image in the list
function renderImage(name, url) {
    listSection.style.display = 'block';
    const li = document.createElement('li');
    li.classList.add('complete');

    li.innerHTML = `
        <div class="col">
            <img src="${url}" alt="image-icon" class="image-icon">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${name}</div>
            </div>
        </div>
        <div class="col">
            <img src="icons/icons8-cross-30.png" width="20px" height="20px" class="cross" alt="cross-icon">
        </div>
    `;

    listContainer.prepend(li);

    // Handle image removal
    li.querySelector('.cross').onclick = () => {
        li.remove();
        removeImageFromLocal(name);
    };
}

// Remove image from localStorage
function removeImageFromLocal(name) {
    const images = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    const updatedImages = images.filter((img) => img.name !== name);
    localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
}
