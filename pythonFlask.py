from flask import Flask, render_template, request, send_from_directory  
import subprocess
import threading
import os
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'  #


os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)  # 修正括号和@

@auth.verify_password
def verify_password(username, password):
    """验证用户名和密码"""
    return username == "admin" and password == "password"

@app.route('/')
@auth.login_required
def index():
    """主页路由，显示文件列表"""
    files = os.listdir(app.config['UPLOAD_FOLDER'])  
    print("当前文件列表：", files)  # 终端打印实时文件列表
    return render_template('index.html', files=files)

@app.route('/upload', methods=['POST'])
def upload_file():
    """处理文件上传"""
    if 'file' not in request.files:
        return "未上传文件", 400
    file = request.files['file']
    if file.filename == '':
        return "未选择文件", 400
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return "文件上传成功", 200
def run_ngrok():
    subprocess.run(["ngrok", "http", "5000"])  # 启动ngrok，将本地5000端口映射到公网

@app.route('/download/<filename>')
def download_file(filename):
    """处理文件下载"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)  # 生产环境关闭debug
    # 在后台线程中启动ngrok
    threading.Thread(target=run_ngrok, daemon=True).start()
    # 启动Flask
    app.run(port=5000)
