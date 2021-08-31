// Import the v2 api and rename it to cloudinary
import { v2 as cloudinary } from "cloudinary";

// Initialize the sdk with cloud_name, api_key and api_secret
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const FOLDER_NAME = "boomerang-videos/";

export const handleGetCloudinaryUploads = () => {
  return new Promise((resolve, reject) => {
    cloudinary.api.resources(
      {
        type: "upload",
        prefix: FOLDER_NAME,
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );
  });
};

export const handleCloudinaryUpload = (path) => {
  // Create and return a new Promise
  return new Promise((resolve, reject) => {
    // Use the sdk to upload media
    cloudinary.uploader.upload(
      path,
      {
        // Folder to store video in
        folder: FOLDER_NAME,
        // Type of resource
        resource_type: "auto",
        // Formats we want to allow
        allowed_formats: ["mp4"],
        // Transformations to run on the video
        transformation: [
          // Set the video to be trimmed at 2 seconds
          { end_offset: "2.0" },
          // Set the boomerang effect
          { effect: "boomerang" },
          // Set the boomerang effect to be looped 3 times
          { effect: "loop:3" },
        ],
      },
      (error, result) => {
        if (error) {
          // Reject the promise with an error if any
          return reject(error);
        }

        // Resolve the promise with a successful result
        return resolve(result);
      }
    );
  });
};

export const handleCloudinaryDelete = async (ids) => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(
      ids,
      {
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      }
    );
  });
};
