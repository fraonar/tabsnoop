<h1>TabSnoop: Your Personal Browser Tab Time Tracker</h1>

TabSnoop is a lightweight and privacy-focused Chrome extension designed to help users understand and manage their Browse habits by providing detailed insights into time spent on each unique website domain. It's an ideal tool for fostering digital wellness, identifying time sinks, and gaining a clearer picture of your online productivity.

✨ Features
Automatic Time Tracking: Silently and accurately monitors active tab duration across different websites.

Domain-Based Aggregation: Aggregates time spent on unique domains (e.g., google.com, youtube.com), providing a comprehensive view of total engagement.

Intuitive Dashboard: A clean popup UI (accessible via the extension icon) presents a visual summary:

Dynamic chart (e.g., bar chart) illustrating time distribution across top domains.

Ranked list of top websites by total time spent, with precise durations.

Real-time daily summary of Browse activity.

Local & Private Data Storage: All tracking data is stored securely in the browser's chrome.storage.local, ensuring user privacy and persistence across sessions.

Data Management: Includes an option to clear all historical Browse data, allowing for a fresh start.

Offline Capable: Functions entirely client-side, requiring no internet connection for core tracking functionality.

Export Functionality (Optional/Future): (If you implement it) Ability to export raw usage data for custom analysis.

🚀 Getting Started
Installation (for Users)
Download the latest release from the Chrome Web Store (once published).

Alternatively, load it as an unpacked extension:

Clone this repository or download the ZIP.

Open Chrome, navigate to chrome://extensions.

Enable "Developer mode".

Click "Load unpacked" and select the tabsnoop project folder.

Development Setup (for Contributors/Developers)
Clone the repository:

Bash

git clone https://github.com/fraonar/TabSnoop.git
cd TabSnoop
Install Dependencies:

This project is built with vanilla JavaScript, HTML, and CSS.

It uses Chart.js (included locally in lib/chart.umd.js to comply with Chrome's Content Security Policy). No npm install is typically required unless adding build tools.

Load as Unpacked Extension: Follow the "Installation (for Users)" steps above.

Debugging:

For background.js logs, click "service worker" on the chrome://extensions page.

For popup.html/popup.js logs, right-click the extension popup and select "Inspect".

🛡️ Privacy & Data
TabSnoop is designed with user privacy in mind. All Browse data is processed and stored locally within your browser. No data is transmitted to external servers or collected by the extension developer.

🤝 Contributing
Contributions are welcome! If you have ideas for features, bug fixes, or improvements, please:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature-name).

Make your changes and commit them (git commit -m 'feat: Add new awesome feature').

Push to your branch (git push origin feature/your-feature-name).

Open a Pull Request.

📄 License
This project is licensed under the MIT License (or choose your preferred open-source license).
