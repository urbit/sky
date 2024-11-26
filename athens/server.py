import os
import json
import cgi
import http.server
import socketserver
from urllib.parse import unquote


class FileServerHandler(http.server.SimpleHTTPRequestHandler):

    def send_custom_headers(self):
        # Add CORS headers to every response
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def end_headers(self):
        # Ensure custom headers are included with end_headers call
        self.send_custom_headers()
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_custom_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/upload':
            form = cgi.FieldStorage(fp=self.rfile, headers=self.headers, environ={
                                    'REQUEST_METHOD': 'POST'})
            fileitem = form['file']
            pathitem = form['endpoint']

            if fileitem.filename and pathitem.value:
                safe_filename = os.path.basename(fileitem.filename)
                safe_path = os.path.normpath(pathitem.value)
                full_path = os.path.join(os.getcwd(), *safe_path.split(os.sep))
                os.makedirs(full_path, exist_ok=True)
                filepath = os.path.join(full_path, safe_filename)

                with open(filepath, 'wb') as f:
                    f.write(fileitem.file.read())

                self.send_response(200)
                self.send_custom_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                response = json.dumps(
                    {'status': 'success', 'filename': safe_filename, 'path': safe_path})
                self.wfile.write(response.encode())
                return

            self.send_response(400)
            self.send_custom_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = json.dumps(
                {'status': 'error', 'message': 'File upload failed'})
            self.wfile.write(response.encode())
            return

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        self.send_response(200)
        self.send_custom_headers()
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        try:
            post_data_str = post_data.decode('utf-8')
            response = f"POST request received: {post_data_str}"
        except UnicodeDecodeError:
            response = "POST request received with non-UTF-8 data"
        self.wfile.write(response.encode())

    def do_GET(self):
        decoded_path = unquote(self.path)
        self.path = decoded_path
        super().do_GET()  # Calls SimpleHTTPRequestHandler do_GET which handles sending the file or directory contents


def run_server(port=8000):
    with socketserver.TCPServer(("", port), FileServerHandler) as httpd:
        print(f"Serving at port {port}")
        httpd.serve_forever()


if __name__ == "__main__":
    run_server()
