// Copyright (c) [2024] [mprojects]
// Licensed under the MIT License.

// Wait until the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('clipboard-list');

  // Check if electronAPI is available
  if (!window.electronAPI) {
    console.error('window.electronAPI is not defined');
    return;
  }

  // Update the clipboard history list
  window.electronAPI.onUpdateClipboard((clipboardHistory) => {
    list.innerHTML = ''; // Clear the previous list

    // Iterate over each item in the clipboard history
    clipboardHistory.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add('clipboard-item');
      li.setAttribute('title', item.data); // Show full text when hovering over the item

      // Create the "Copied!" animation container
      const copiedAnimation = document.createElement('div');
      copiedAnimation.classList.add('copied-animation');
      copiedAnimation.textContent = 'Copied!';
      li.appendChild(copiedAnimation);

      // Display image or text based on item type
      if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.data;
        img.classList.add('no-drag');
        li.appendChild(img);

        // Make images clickable to copy
        li.onclick = () => {
          window.electronAPI.copyImage(item.data); // Copy the image
          showCopiedAnimation(li);
        };

      } else {
        const span = document.createElement('span');
        span.textContent = item.data.length > 50 
          ? item.data.slice(0, 47)  // Limit to 47 characters, adding "..." if longer
          : item.data;
        span.classList.add('text-content', 'no-drag');
        li.appendChild(span);

        // Make text clickable to copy
        li.onclick = () => {
          window.electronAPI.copyText(item.data); // Copy the text
          showCopiedAnimation(li);
        };
      }

      list.appendChild(li); // Add the item to the list
    });
  });

  // Function to show the "Copied!" animation
  function showCopiedAnimation(element) {
    element.classList.add('copied'); // Add the class to activate the animation

    // Remove the animation after 1 second
    setTimeout(() => {
      element.classList.remove('copied');
    }, 1000); // Animation duration, adjustable
  }

  // Function to apply the chosen theme
  function applyTheme(theme) {
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }

  // Listen for theme change events and apply the theme
  window.electronAPI.onThemeChanged((theme) => {
    applyTheme(theme);
  });

});