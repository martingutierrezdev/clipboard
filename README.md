# Smart Clipboard

This application, currently available only in English, stores up to 10 copied clipboard items, including images. You can view the complete history of your recent copies, and by simply hovering over an item, you can see all the content (full text or image).

## Features
- Stores up to 10 copied items.
- Compatible with text and images.
- Full content preview on hover.
- Click animation to copy an item again.

## Installation Instructions

Click the button below to download the `.dmg` installation file for macOS.

[![Download Smart Clipboard](https://img.shields.io/badge/Download%20.dmg-Install-blue?style=for-the-badge)](https://github.com/martingutierrezdev/clipboard/releases/download/Dmg_file/Clipboard-1.0.0-arm64.dmg)

## Auto-Launch at Startup on macOS

To have the application launch automatically when you start your Mac:

1. Open **System Preferences** > **Users & Groups**.
2. Select your user, then the **Login Items** tab.
3. Click the `+` button and add the Smart Clipboard application to the list.

Now, the application will start automatically every time you turn on your Mac.

## Smart Clipboard: Assign a Keyboard Shortcut to Open the Application

You can assign a custom keyboard shortcut to open the application quickly:

1. Open **Automator** from **Applications** and select **Service** as the document type.
2. Set the service to receive no input in **any application**.
3. Add the **Open Application** action and select **Smart Clipboard** from the list.
4. Save the service with a name, like **Open Smart Clipboard**.
5. Open **System Preferences** > **Keyboard** > **Shortcuts** > **Services**.
6. Find the service you created and assign a keyboard shortcut to open the application.

With this, you can quickly open the application using the configured keyboard shortcut.

## License

This project is licensed under the terms of the MIT License. See the [LICENSE](./LICENSE) file for more details.

---