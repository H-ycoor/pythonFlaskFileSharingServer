// 处理文件上传
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const uploadButton = e.target.querySelector('button[type="submit"]');
    
    if (!fileInput.files.length) {
        alert('请先选择要上传的文件');
        return;
    }
    
    // 显示上传状态
    const originalButtonText = uploadButton.innerHTML;
    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 上传中...';
    uploadButton.disabled = true;
    
    try {
        const formData = new FormData(e.target);
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // 上传成功，显示提示并刷新页面
            showNotification('文件上传成功！', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            const errorText = await response.text();
            showNotification(`上传失败: ${errorText}`, 'error');
        }
    } catch (error) {
        showNotification(`网络错误: ${error.message}`, 'error');
    } finally {
        // 恢复按钮状态
        uploadButton.innerHTML = originalButtonText;
        uploadButton.disabled = false;
    }
});

// 显示选择的文件名
document.getElementById('fileInput').addEventListener('change', function() {
    const fileNameElement = document.getElementById('fileName');
    if (this.files.length > 0) {
        fileNameElement.textContent = this.files[0].name;
        fileNameElement.style.color = '#4361ee';
    } else {
        fileNameElement.textContent = '未选择文件';
        fileNameElement.style.color = '#6c757d';
    }
});

// 拖放功能
const uploadArea = document.querySelector('.upload-area');
const fileLabel = document.querySelector('.file-label');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '#4361ee';
    fileLabel.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
    fileLabel.style.borderColor = '#ced4da';
    fileLabel.style.backgroundColor = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileLabel.style.borderColor = '#ced4da';
    fileLabel.style.backgroundColor = '';
    
    const fileInput = document.getElementById('fileInput');
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        const fileNameElement = document.getElementById('fileName');
        fileNameElement.textContent = fileInput.files[0].name;
        fileNameElement.style.color = '#4361ee';
    }
});

// 显示通知函数
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加CSS样式到头部
const style = document.createElement('style');
style.textContent = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1000;
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification.success {
    background-color: #4BB543;
}

.notification.error {
    background-color: #FF3333;
}

.notification.info {
    background-color: #4361ee;
}

.notification i {
    font-size: 1.2rem;
}
`;
document.head.appendChild(style);