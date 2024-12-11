// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

let originalFile = null;

// 处理拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#007AFF';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

// 处理点击上传
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// 处理图片上传
function handleImageUpload(file) {
    originalFile = file;
    originalSize.textContent = `文件大小：${formatFileSize(file.size)}`;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        compressImage(e.target.result, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
    
    previewArea.hidden = false;
}

// 压缩图片
function compressImage(dataUrl, quality) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
            compressedPreview.src = URL.createObjectURL(blob);
            compressedSize.textContent = `文件大小：${formatFileSize(blob.size)}`;
        }, originalFile.type, quality);
    };
    img.src = dataUrl;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 处理压缩质量滑块
qualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    qualityValue.textContent = quality + '%';
    if (originalFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            compressImage(e.target.result, quality / 100);
        };
        reader.readAsDataURL(originalFile);
    }
});

// 处理下载
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `compressed_${originalFile.name}`;
    link.href = compressedPreview.src;
    link.click();
}); 