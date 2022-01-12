// When the button is clicked, inject setTextToGifs into current page
changeColour.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: setTextToGifs,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function setTextToGifs() {
    replaceTag("p");

    function replaceTag(tag){
        let pTags = document.getElementsByTagName(tag);
        for(let i = 0; i < pTags.length; i++){
          let splitHTML = pTags[i].innerText.split(" ");
          pTags[i].innerText = "";
  
          for(let j = 0; j < splitHTML.length; j++){
              let id = "gif-"+ tag +"-"+ i +"-"+ j;
              pTags[i].innerHTML += "<img width=40 id='"+ id +"' src='https://c.tenor.com/OdB60pI5DO4AAAAd/letter-x.gif' alt=''>";
              grab_data(splitHTML[j], id);
              console.log("LOOP");
          }
        }
    }

    // url Async requesting function
    function httpGetAsync(theUrl, callback, id)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function()
        {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                callback(xmlHttp.responseText, id);
            }
            else if(xmlHttp.readyState == 429){
                console.log("RATE LIMITED");
            }
        }
        xmlHttp.open("GET", theUrl, true);
        xmlHttp.send(null);
        return;
    }

    // callback for the response
    function tenorCallback_search(responsetext, id)
    {
        var response_objects = JSON.parse(responsetext);
        top_10_gifs = response_objects["results"];

        let index = Math.floor(Math.random() * 6);
        document.getElementById(id).src = top_10_gifs[index]["media"][0]["nanogif"]["url"];
        return;
    }

    // function to call the trending and category endpoints
    function grab_data(search_term, id)
    {
        var apikey = "PV9VQALVSTL4";
        var lmt = 6;

        // using default locale of en_US
        var search_url = "https://g.tenor.com/v1/search?q=" + search_term + "&key=" +
                apikey + "&limit=" + lmt;

        httpGetAsync(search_url,tenorCallback_search, id);
        return;
    }
  }