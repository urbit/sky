# server.py
import os
import json
import cgi
import http.server
import socketserver
from urllib.parse import unquote


class FileServerHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        # Handle file upload
        if self.path == '/upload':
            # Parse multipart form data
            content_type = self.headers['Content-Type']
            if content_type and content_type.startswith('multipart/form-data'):
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST'}
                )

                # Find the file field and path field
                fileitem = form['file']
                pathitem = form['path']

                # Check if file was uploaded and path is provided
                if fileitem.filename and pathitem.value:
                    # Sanitize filename and path
                    safe_filename = os.path.basename(fileitem.filename)
                    safe_path = os.path.normpath(pathitem.value)
                    full_path = os.path.join(os.getcwd(), safe_path)

                    # Ensure the directory exists
                    os.makedirs(full_path, exist_ok=True)

                    # Write the uploaded file
                    filepath = os.path.join(full_path, safe_filename)
                    with open(filepath, 'wb') as f:
                        f.write(fileitem.file.read())

                    # Send success response
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    response = json.dumps(
                        {
                            'status': 'success',
                            'filename': safe_filename,
                            'path': safe_path
                        }
                    )
                    self.wfile.write(response.encode())
                    return

            # If file upload fails
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin',
                             'http://localhost:5173')
            self.end_headers()
            response = json.dumps(
                {'status': 'error', 'message': 'File upload failed'})
            self.wfile.write(response.encode())
            return

        # Default POST handler
        super().do_POST()

    def do_GET(self):
        # Decode the path to handle non-ASCII filenames
        decoded_path = unquote(self.path)

        self.path = decoded_path

        self.send_header('Access-Control-Allow-Origin', '*')
        super().do_GET()


def run_server(port=8000):
    with socketserver.TCPServer(("", port), FileServerHandler) as httpd:
        print(f"Serving at port {port}")
        httpd.serve_forever()


if __name__ == "__main__":
    run_server()
