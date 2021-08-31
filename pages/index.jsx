import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState([]);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const getVideos = useCallback(async () => {
    try {
      const response = await fetch(`/api/videos`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setVideos(data.result.resources);
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    getVideos();
  }, [getVideos]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      // Get the form data
      const formData = new FormData(e.target);

      // Post the form data to the /api/videos endpoint
      const response = await fetch("/api/videos", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      e.target[0].value = "";
      setFile(null);
      getVideos();
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResource = async (resourceUrl, assetId, format) => {
    try {
      setLoading(true);
      const response = await fetch(resourceUrl, {});

      if (response.status >= 200 && response.status < 300) {
        const blob = await response.blob();

        const fileUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = `${assetId}.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }

      throw await response.json();
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/videos/?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        return getVideos();
      }

      throw data;
    } catch (error) {
      // TODO: Show error message to user
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Videos to Boomerangs Using Cloudinary</title>
        <meta
          name="description"
          content="Videos to Boomerangs Using Cloudinary"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="header">
          <h1>Videos to Boomerangs Using Cloudinary</h1>
        </div>
        <hr />
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="video">
            <b>Select video for upload</b>
          </label>
          <input
            type="file"
            name="video"
            id="video"
            multiple={false}
            accept=".mp4"
            required
            disabled={loading}
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <button type="submit" disabled={loading || !file}>
            Upload Video
          </button>
        </form>
        <hr />
        {loading && (
          <div className="loading">
            <p>Please be patient as the action is performed...</p>
            <hr />
          </div>
        )}
        <div className="videos-wrapper">
          {videos.map((video, index) => (
            <div className="video-wrapper" key={`video-${index}`}>
              <video
                src={video.secure_url}
                loop
                preload="none"
                controls
                poster={video.secure_url.replace(".mp4", ".gif")}
              ></video>
              <div className="video-info">
                <a href={video.secure_url}>Link to video</a>
                <div className="actions">
                  <button
                    disabled={loading}
                    onClick={() => {
                      handleDownloadResource(
                        video.secure_url,
                        video.asset_id,
                        video.format
                      );
                    }}
                  >
                    Download
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      handleDeleteResource(video.public_id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <style jsx>{`
        main {
        }
        main .header {
          min-height: 100px;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }
        main form {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          background-color: #ebebeb;
        }
        main form button {
          min-width: 300px;
          min-height: 50px;
          margin-top: 20px;
        }
        main div.videos-wrapper {
          width: 100%;
          display: flex;
          flex-flow: row wrap;
          gap: 20px;
        }
        main div.videos-wrapper div.video-wrapper {
          flex: 0 0 calc((100% / 3) - 20px);
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
          border-radius: 5px;
          background-color: #fafafa;
        }
        main div.videos-wrapper div.video-wrapper video {
          width: 100%;
          height: 300px;
          border-radius: 5px 5px 0 0;
        }
        main div.videos-wrapper div.video-wrapper div.video-info {
          height: 100px;
          padding: 10px;
        }
        main
          div.videos-wrapper
          div.video-wrapper
          div.video-info
          div.actions
          button {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
}
