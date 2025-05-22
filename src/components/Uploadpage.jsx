import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import inputfileLogo from '../assets/inputfile.svg';
import { Client } from "@gradio/client";

function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [melSpectrogramUrl, setMelSpectrogramUrl] = useState(null);
  const [polarPlotUrl, setPolarPlotUrl] = useState(null);
  const [waveformPlotUrl, setWaveformPlotUrl] = useState(null); // Add waveform plot URL to state
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setPrediction(null);
      setMelSpectrogramUrl(null);
      setPolarPlotUrl(null);
      setWaveformPlotUrl(null); // Clear waveform plot URL
      setError("");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'audio/wav': ['.wav'],
      'audio/mpeg': ['.mp3'],
      'video/mp4': ['.mp4']
    },
    maxSize: 10485760,
  });

  const handlePrediction = async () => {
    if (!uploadedFile) {
      setError("Please upload an audio/video file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log("Sending file:", uploadedFile);
      
      const client = await Client.connect("KingInTheNorth/audio-emotion-detector");
      const result = await client.predict("/predict_emotion", { 
        audio_file: uploadedFile
      });
      
      console.log("Full result:", result);
      console.log("Raw result:", result); // Log the raw response for debugging
      
      // IMPORTANT: Extract data correctly from the nested structure
      if (result && result.data) {
        const data = result.data;
        
        // Get the emotion string
        const emotion = data[0]; // e.g. "fear"
        
        // Convert the confidences array to an object format for your UI
        const confidencesArray = data[1].confidences;
        const probabilities = {};
        confidencesArray.forEach(item => {
          probabilities[item.label] = item.confidence;
        });
        
        setPrediction({
          emotion: emotion,
          probabilities: probabilities
        });
        
        // Set image URLs directly
        setMelSpectrogramUrl(data[2].url);
        setPolarPlotUrl(data[3].url);
        setWaveformPlotUrl(data[4].url); // Extract waveform plot URL
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Error predicting emotion:", error);
      setError(`Failed to predict emotion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setUploadedFileName("");
    setPrediction(null);
    setMelSpectrogramUrl(null);
    setPolarPlotUrl(null);
    setWaveformPlotUrl(null); // Clear waveform plot URL
    setError("");
  };

  return (
    <div className="upload-page">
      <h2>Upload Audio File</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      <div {...getRootProps({ className: 'upload-zone' })}>
        <input {...getInputProps({ disabled: loading })} /> {/* Disable input when loading */}
        <p style={{ color: uploadedFile ? 'gray' : 'black' }}>
          <img src={inputfileLogo} alt='' style={{ marginRight: '10px' }} />
          {uploadedFile ? "" : "Click to upload or drag and drop WAV, MP3, MP4 up to 10MB"}
        </p>
        {uploadedFileName && <p>Uploaded File: {uploadedFileName}</p>}
      </div>

      {uploadedFile && (
        <div className="preview">
          <h3>Preview Audio</h3>
          <audio controls src={URL.createObjectURL(uploadedFile)}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="button-container">
        {uploadedFile && (
          <button onClick={clearUpload} className="predict-button">
            Clear Upload
          </button>
        )}
        <button 
          onClick={handlePrediction} 
          className="predict-button" 
          disabled={loading || !uploadedFile}
        >
          {loading ? "Predicting..." : "Predict Emotion"}
        </button>
      </div>

      {prediction && (
        <div className="prediction-result">
          <h3>
            Predicted Emotion: {prediction.emotion.toUpperCase()}
            {prediction.probabilities && prediction.probabilities[prediction.emotion] && 
              ` (${(prediction.probabilities[prediction.emotion] * 100).toFixed(2)}%)`}
          </h3>

          <div className="probabilities-table">
            <h4>All Emotion Probabilities</h4>
            <table>
              <thead>
                <tr>
                  <th>Emotion</th>
                  <th>Probability</th>
                </tr>
              </thead>
              <tbody>
                {prediction.probabilities &&
                  Object.entries(prediction.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, probability]) => (
                      <tr key={emotion} className={emotion === prediction.emotion ? 'predicted-emotion' : ''}>
                        <td>{emotion.toUpperCase()}</td>
                        <td>{(probability * 100).toFixed(2)}%</td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          <div className="plots-container">
            {melSpectrogramUrl && (
              <div className="plot-item">
                <h4>Mel Spectrogram</h4>
                <div className="mel-spectrogram">
                  {/* Use the URL directly instead of base64 */}
                  <img src={melSpectrogramUrl} alt="Mel Spectrogram" />
                </div>
              </div>
            )}
            {polarPlotUrl && (
              <div className="plot-item">
                <h4>Emotion Probabilities</h4>
                <div className="emotion-chart">
                  {/* Use the URL directly instead of base64 */}
                  <img src={polarPlotUrl} alt="Emotion Probabilities" />
                </div>
              </div>
            )}
            {waveformPlotUrl && ( // Add waveform plot display
              <div className="plot-item">
                <h4>Waveform</h4>
                <div className="mel-spectrogram">
                  <img src={waveformPlotUrl} alt="Waveform" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
