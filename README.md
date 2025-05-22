# Voice Vista - Emotion Recognition from Speech

A web application that recognizes emotions from speech using an Artificial Neural Network (ANN) model.

## Overview

Voice Vista is a deep learning-based emotion recognition system that analyzes audio input to detect human emotions. The system processes speech signals and predicts emotions such as happiness, sadness, anger, and more.

## Features

- Real-time audio recording
- Audio file upload support (WAV, MP3)
- Visual feedback through mel spectrograms
- Emotion probability visualization using polar plots
- Responsive web interface

## Technical Architecture

### Frontend
- Built with React + Vite
- Real-time audio recording using react-media-recorder
- File upload handling with react-dropzone
- Interactive visualizations using Chart.js

### Backend
- Express.js server
- Python-based inference engine
- LibROSA for audio feature extraction 

### Model Architecture
The emotion recognition model uses an Artificial Neural Network (ANN) with:
- Input features: MFCCs, Chroma, Spectral Contrast, Zero-Crossing Rate, etc.
- Multiple dense layers with ReLU activation
- Softmax output layer for emotion classification
- Trained on speech emotion recognition datasets

## Audio Features Extracted
- Mel-frequency cepstral coefficients (MFCCs)
- Chromagram
- Spectral Contrast
- Zero-Crossing Rate
- Spectral Centroid
- Spectral Rolloff
- RMS Energy

