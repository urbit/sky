# server.py
import os
import json
import cgi
import http.server
import socketserver
from urllib.parse import unquote

# Directory to store uploaded files
UPLOAD_DIRECTORY = 'uploads'


class FileServerHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        # TODO restrict Access-Control-Allow-Origin
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
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

                # Find the file field
                fileitem = form['file']

                # Check if file was uploaded
                if fileitem.filename:
                    # Sanitize filename
                    safe_filename = os.path.basename(fileitem.filename)
                    filepath = os.path.join(UPLOAD_DIRECTORY, safe_filename)

                    # Write the uploaded file
                    with open(filepath, 'wb') as f:
                        f.write(fileitem.file.read())

                    # Send success response
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response = json.dumps(
                        {'status': 'success', 'filename': safe_filename})
                    self.wfile.write(response.encode())
                    return

            # If file upload fails
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
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

        # Serve files from current directory or uploads directory
        if decoded_path.startswith('/uploads/'):
            self.path = decoded_path

        super().do_GET()

    def __init__(self, *args, **kwargs):
        # Ensure upload directory exists
        os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
        super().__init__(*args, directory=os.getcwd(), **kwargs)


def run_server(port=8000):
    with socketserver.TCPServer(("", port), FileServerHandler) as httpd:
        print(f"Serving at port {port}")
        print(f"Upload directory: {os.path.abspath(UPLOAD_DIRECTORY)}")
        httpd.serve_forever()


if __name__ == "__main__":
    run_server()
