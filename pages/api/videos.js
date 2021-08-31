// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IncomingForm, Fields, Files } from "formidable";
import {
  handleCloudinaryDelete,
  handleCloudinaryUpload,
  handleGetCloudinaryUploads,
} from "../../lib/cloudinary";

// Custom config for our API route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  switch (req.method) {
    case "GET": {
      try {
        const result = await handleGetRequest();

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }

    case "POST": {
      try {
        const result = await handlePostRequest(req);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }

    case "DELETE": {
      try {
        const { id } = req.query;

        if (!id) {
          throw "id param is required";
        }

        const result = await handleDeleteRequest(id);

        return res.status(200).json({ message: "Success", result });
      } catch (error) {
        return res.status(400).json({ message: "Error", error });
      }
    }

    default: {
      return res.status(405).json({ message: "Method not allowed" });
    }
  }
}

const handleGetRequest = () => handleGetCloudinaryUploads();

const handlePostRequest = async (req) => {
  // Get the form data using the parseForm function
  const data = await parseForm(req);

  const uploadResult = await handleCloudinaryUpload(data.files.video.path);

  return uploadResult;
};

const handleDeleteRequest = async (id) => handleCloudinaryDelete([id]);

/**
 *
 * @param {*} req
 * @returns {Promise<{ fields:Fields; files:Files; }>}
 */
const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });

    form.parse(req, (error, fields, files) => {
      if (error) {
        return reject(error);
      }

      return resolve({ fields, files });
    });
  });
};
