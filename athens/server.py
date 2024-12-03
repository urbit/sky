from flask import Flask, request, send_file, abort
from flask_cors import CORS  # Import flask_cors
import os
import mimetypes

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Directory where files will be saved
UPLOAD_FOLDER = './uploads'

# Custom MIME types
CUSTOM_MIME_TYPES = {
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg'
}


@app.route('/<path:url_path>', methods=['GET', 'POST'])
def handle_file(url_path):
    if request.method == 'POST':
        # Check if the POST request has the file part
        if 'file' not in request.files:
            return 'No file part in the request', 400
        file = request.files['file']
        if file.filename == '':
            return 'No selected file', 400

        # Build the file path
        filename = url_path
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        filepath = os.path.normpath(filepath)  # Normalize path

        # Security check: Ensure the file path is within the UPLOAD_FOLDER
        upload_folder_abs = os.path.abspath(UPLOAD_FOLDER)
        filepath_abs = os.path.abspath(filepath)
        if not filepath_abs.startswith(upload_folder_abs):
            return 'Invalid path', 400

        # Ensure the directory exists
        dirname = os.path.dirname(filepath)
        os.makedirs(dirname, exist_ok=True)

        # Save the file
        file.save(filepath)

        # Determine the MIME type based on the file extension
        _, ext = os.path.splitext(file.filename)
        mime_type = CUSTOM_MIME_TYPES.get(ext, 'application/octet-stream')

        # Save the MIME type
        mime_file_path = filepath + '.mime'
        with open(mime_file_path, 'w') as mime_file:
            mime_file.write(mime_type)

        return 'File uploaded successfully', 201
    else:
        # Serve the file corresponding to the URL path
        filepath = os.path.join(UPLOAD_FOLDER, url_path)
        filepath = os.path.normpath(filepath)  # Normalize path

        # Security check: Ensure the file path is within the UPLOAD_FOLDER
        upload_folder_abs = os.path.abspath(UPLOAD_FOLDER)
        filepath_abs = os.path.abspath(filepath)
        if not filepath_abs.startswith(upload_folder_abs):
            abort(404)

        if os.path.isfile(filepath):
            # Try to read the stored MIME type
            mime_file_path = filepath + '.mime'
            if os.path.isfile(mime_file_path):
                with open(mime_file_path, 'r') as mime_file:
                    mime_type = mime_file.read().strip()
            else:
                # Fallback to guessing the MIME type
                mime_type, _ = mimetypes.guess_type(filepath)
                if mime_type is None:
                    mime_type = 'application/octet-stream'

            # Serve the file with the correct MIME type
            return send_file(filepath, mimetype=mime_type)
        else:
            # Return a 404 error if the file is not found
            abort(404)


if __name__ == '__main__':
    app.run(port=8000)
