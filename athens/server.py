# Import Flask module for web application framework
from flask import Flask, request, send_file, abort
# Import CORS from flask_cors for handling cross-origin requests
from flask_cors import CORS
# Import the os module for file and directory handling
import os
# Import mimetypes to guess the MIME type of a file
import mimetypes

# Create an instance of the Flask application
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for all routes
CORS(app)

# Define the directory where uploaded files will be saved
UPLOAD_FOLDER = './uploads'

# Create an instance of the Flask application (duplicate instance creation)
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for all routes (duplicate setup)
CORS(app)

# Define the directory where uploaded files will be saved (duplicate definition)
UPLOAD_FOLDER = './uploads'

# Define a route to handle file operations based on the HTTP method


@app.route('/<path:url_path>', methods=['GET', 'PUT'])
def handle_file(url_path):
    # Handle PUT requests to upload files
    if request.method == 'PUT':
        # Check if the PUT request contains a file
        if 'file' not in request.files:
            # Return an error if no file is found in the request
            return 'No file part in the request', 400
        # Retrieve the uploaded file
        file = request.files['file']
        # Return an error if no file is selected
        if file.filename == '':
            return 'No selected file', 400

        # Use the original filename for saving the file
        filename = file.filename
        # Construct the file path for saving the file
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        # Normalize the file path to ensure consistency
        filepath = os.path.normpath(filepath)

        # Perform a security check to ensure the file path is within the upload folder
        upload_folder_abs = os.path.abspath(UPLOAD_FOLDER)
        filepath_abs = os.path.abspath(filepath)
        if not filepath_abs.startswith(upload_folder_abs):
            # Return an error if the file path is invalid
            return 'Invalid path', 400

        # Ensure the directory for the file path exists
        dirname = os.path.dirname(filepath)
        os.makedirs(dirname, exist_ok=True)

        # Save the uploaded file to the specified path
        file.save(filepath)

        # Return a success message with a 201 status code
        return 'File uploaded successfully', 201
    # Handle GET requests to serve files
    elif request.method == 'GET':
        # Construct the file path for the requested file
        filepath = os.path.join(UPLOAD_FOLDER, url_path)
        # Normalize the file path to ensure consistency
        filepath = os.path.normpath(filepath)

        # Perform a security check to ensure the file path is within the upload folder
        upload_folder_abs = os.path.abspath(UPLOAD_FOLDER)
        filepath_abs = os.path.abspath(filepath)
        if not filepath_abs.startswith(upload_folder_abs):
            # Return a 404 error if the file path is invalid
            abort(404)

        # Check if the requested file exists
        if os.path.isfile(filepath):
            # Guess the MIME type of the file
            mime_type, _ = mimetypes.guess_type(filepath)
            # Set a default MIME type if it cannot be guessed
            if mime_type is None:
                mime_type = 'application/octet-stream'

            # Serve the file with the determined MIME type
            return send_file(filepath, mimetype=mime_type)
        else:
            # Return a 404 error if the file is not found
            abort(404)


# Entry point for the application
if __name__ == '__main__':
    # Run the Flask application on port 8000
    app.run(port=8000)
