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
UPLOAD_FOLDER = './namespace'

# Define a route to handle file operations based on the HTTP method


@app.route('/<path:url_path>', methods=['GET', 'PUT'])
def handle_file(url_path):
    # Log the received URL path
    # print(f"url_path: {url_path}")

    # Handle PUT requests to upload files
    if request.method == 'PUT':
        # Log the request method
        # print(f"request.method: {request.method}")

        # Check if the PUT request contains a file
        if 'file' not in request.files:
            # Log the absence of the file part in the request
            # print(f"request.files: {request.files}")
            return 'No file part in the request', 400

        # Retrieve the uploaded file
        file = request.files['file']
        # Log the uploaded file
        # print(f"file: {file}")

        # Return an error if no file is selected
        if file.filename == '':
            # Log the absence of a selected file
            # print(f"file.filename: {file.filename}")
            return 'No selected file', 400

        # Use the original filename for saving the file
        filename = file.filename
        # Log the filename
        # print(f"filename: {filename}")

        # Construct the directory path from the URL path
        dirpath = os.path.join(UPLOAD_FOLDER, url_path)
        # Log the directory path
        # print(f"dirpath: {dirpath}")

        # Ensure the directory for the URL path exists
        dirpath = os.path.normpath(dirpath)
        # Log the normalized directory path
        # print(f"normalized dirpath: {dirpath}")
        os.makedirs(dirpath, exist_ok=True)

        # Construct the full file path
        filepath = os.path.join(dirpath, filename)
        # Log the full file path
        # print(f"filepath: {filepath}")

        # Perform a security check to ensure the file path is within the upload folder
        upload_folder_abs = os.path.abspath(UPLOAD_FOLDER)
        filepath_abs = os.path.abspath(filepath)
        # Log the absolute paths
        # print(f"upload_folder_abs: {upload_folder_abs}")
        # print(f"filepath_abs: {filepath_abs}")

        if not filepath_abs.startswith(upload_folder_abs):
            # Log the invalid path error
            # print(f"Invalid file path detected: {filepath_abs}")
            return 'Invalid path', 400

        # Clear any existing files in the directory
        existing_files = [f for f in os.listdir(dirpath) if os.path.isfile(os.path.join(dirpath, f))]
        for existing_file in existing_files:
            existing_filepath = os.path.join(dirpath, existing_file)
            if existing_filepath != filepath:  # Don't delete the file we're about to write if it exists
                os.remove(existing_filepath)

        # Save the uploaded file to the specified path
        file.save(filepath)
        # Log the successful file save
        # print(f"File saved to: {filepath}")

        return 'File uploaded successfully', 201

    # Handle GET requests to serve files
    elif request.method == 'GET':
        # Log the request method
        # print(f"request.method: {request.method}")

        # Construct the file path from the URL path
        dirpath = os.path.join(UPLOAD_FOLDER, url_path)
        # Log the directory path
        # print(f"dirpath: {dirpath}")

        # Normalize the directory path
        dirpath = os.path.normpath(dirpath)
        # Log the normalized directory path
        # print(f"normalized dirpath: {dirpath}")

        # Perform a security check to ensure the directory path is within the upload folder
        upload_folder_abs = os.path.abspath(UPLOAD_FOLDER)
        dirpath_abs = os.path.abspath(dirpath)
        # Log the absolute paths
        # print(f"upload_folder_abs: {upload_folder_abs}")
        # print(f"dirpath_abs: {dirpath_abs}")

        if not dirpath_abs.startswith(upload_folder_abs):
            # Log the invalid path error
            # print(f"Invalid directory path detected: {dirpath_abs}")
            abort(404)

        # Check if the requested path is a directory
        if os.path.isdir(dirpath):
            # Log the directory existence
            # print(f"Directory exists: {dirpath}")

            # Look for files in the directory (ignoring subdirectories)
            files = [f for f in os.listdir(
                dirpath) if os.path.isfile(os.path.join(dirpath, f))]
            # Log the files in the directory
            # print(f"Files in directory: {files}")

            if files:
                # Select the first file (arbitrary decision)
                filepath = os.path.join(dirpath, files[0])
                # Log the selected file path
                # print(f"Selected file: {filepath}")

                # Guess the MIME type of the file
                mime_type, _ = mimetypes.guess_type(filepath)
                # Log the guessed MIME type
                # print(f"mime_type: {mime_type}")

                # Set a default MIME type if it cannot be guessed
                if mime_type is None:
                    mime_type = 'application/octet-stream'
                    # Log the default MIME type
                    # print(f"default mime_type: {mime_type}")

                # Serve the file with the determined MIME type
                return send_file(filepath, mimetype=mime_type)
            else:
                # Log the case of no files found
                # print(f"No files found in directory: {dirpath}")
                abort(404)

        # If the path is not a directory, check if it's a file and serve it
        elif os.path.isfile(dirpath):
            # Log the case of serving the file directly
            # print(f"Serving file: {dirpath}")

            # Guess the MIME type of the file
            mime_type, _ = mimetypes.guess_type(dirpath)
            # Log the guessed MIME type
            # print(f"mime_type: {mime_type}")

            # Set a default MIME type if it cannot be guessed
            if mime_type is None:
                mime_type = 'application/octet-stream'
                # Log the default MIME type
                # print(f"default mime_type: {mime_type}")

            # Serve the file with the determined MIME type
            return send_file(dirpath, mimetype=mime_type)
        else:
            # Log the case of path not found
            # print(f"Path not found: {dirpath}")
            abort(404)


# Entry point for the application
if __name__ == '__main__':
    # Log the start of the application
    # print("Starting Flask application on port 8000")
    app.run(port=8000)
