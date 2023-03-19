window.onload=function(){
    let toggleButton = document.getElementById('toggleButton');

    toggleButton.addEventListener('click', function() {
        chrome.storage.sync.get('state', function(data) {
          if (data.state == 'on') {
            chrome.storage.sync.set({state: 'off'});
            chrome.action.setBadgeText({text: 'OFF'});
          } else {
            chrome.storage.sync.set({state: 'on'});
            chrome.action.setBadgeText({text: 'ON'});
          }
        });
      });
      
}

chrome.storage.sync.get('state', function(data) {
  if (data.state == 'on') {
    chrome.action.setBadgeText({text: 'ON'});
    
  } 
  if (data.state == 'off') {
    chrome.action.setBadgeText({text: 'OFF'});
    
  }else {
    chrome.action.setBadgeText({text: 'OFF'});
    chrome.storage.sync.set({state: 'off'});

  }
});

