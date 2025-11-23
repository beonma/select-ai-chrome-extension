# Google Chrome Built-in AI Challenge 2025 Extension – Local Build Guide

This guide helps you set up a local build of the Chrome extension for the Google Chrome Built-in AI Challenge 2025. Use this to test new features, access changes, or experiment with unreleased builds.

## Prerequisites

-   Node.js **v18.19.1**

-   npm

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment

-   Create a `.env.prod` file in the root folder.
-   Add the following variable:

```bash
WORKER_URL=https://select-ai-worker.beonma.workers.dev
```

### 4. Build the extension

Ensure Node.js version matches **v18.19.1** for best **compatibility**.

```bash
npm run build
```

### 5. Load the extension in Chrome

-   Open Chrome and go to `chrome://extensions`.

-   Enable **Developer mode**.

-   Click **Load unpacked** and select the generated `dist` folder or `dist.zip`.
