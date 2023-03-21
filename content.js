
const alreadyUsed = [];

const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '10px';
container.style.right = '10px';
container.style.zIndex = '9999';

window.addEventListener("load", function() {
    setTimeout(function() {

      chrome.storage.sync.get('state', function(data) {
        if (data.state == 'on') {
          //console.log('Toggle is on');

      
          const filteredParagraphs = getText()
          // loop through each filtered paragraph
          for (let i = 0; i < filteredParagraphs.length; i++) {
            const keywords = extractKeywords(filteredParagraphs[i], 3, 3);
            if(keywords != undefined){
            getPicture(keywords, filteredParagraphs[i])
            console.log(keywords)
            
            //console.log(filteredParagraphs[i])
            }

          }
          document.body.appendChild(container);


      } else {
        //console.log('Toggle is off');
      }
    });
      
    }, 3000);
  });
  
  const css = `
  body {
    padding-top: 50px;
  }
  html::before {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    height: 50px;
    width: 50px;
    background-color: white;
  }
`;

const style = document.createElement('style');
style.innerHTML = css;
document.head.appendChild(style);



function isNoun(word) {
  
  var hasNumber = /\d/;   
  if(hasNumber.test(word)) return false;
  if(word.includes("+")) return false;
  if(word.includes("cookies")) return false;

  //const tagged = nltk.pos_tag([word])[0][1];
  //return (tagged.startsWith("NN"))

  return true
  }


  function getText(){

    const textContent = document.body.innerText;
    const paragraphs = textContent.split("\n");   
     const filteredParagraphs = paragraphs.filter(function(paragraph) {
      const sentences = paragraph.split(/[.!?]/);
      const filteredSentences = sentences.filter(function(sentence) {
        return sentence.trim().split(" ").length > 2;
      });
      return filteredSentences.length >= 2;
    });

    return filteredParagraphs
  }

  function extractKeywords(text, minWords, maxWords) {
    // define stop words
    const stopWords = ["a", "an", "here", "redirects", "other", "site", "cookies", "have", "and", "are", "as", "also", "then", "than", "at", "be", "by", "for", "from", "has", "he", "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were", "will", "with"];
    
    text = text.toLowerCase()
   // console.log(text)
    if(text.includes("published") || text.includes("citation") || text.includes("cookies")) return;
    
    // split text into words
    const words = text.trim().split(/\s+/);
    
    // remove stop words from the array of words
    const filteredWords = words.filter(function(word) {
      return !stopWords.includes(word.toLowerCase());
    });
    
    // count occurrences of each word
    const counts = {};
    for (let i = 0; i < filteredWords.length; i++) {
      const word = filteredWords[i];
      counts[word] = counts[word] ? counts[word] + 1 : 1;
    }
    
    // sort words by count
    const sortedWords = Object.keys(counts).sort(function(a, b) {
      return counts[b] - counts[a];
    });
    
    // filter out words that are too short or too long
    const finalWords = sortedWords.filter(function(word) {
      return word.length > 2 && word.length <= 15;
    });

    const nounsOnly = finalWords.filter(function(word) {
      return isNoun(word)
    })
    
    // join 2-4 words into a string and return
    return nounsOnly.slice(0, maxWords).filter(function(word) {
      return word.length > 2;
    }).slice(0, minWords).join("+");
  }

  function getPicture(keywords, totalPara){

    //console.log(totalPara)
    const APIcall = "https://pixabay.com/api/?key=34376048-2f9ac2d7ccc79a73414965560&q=" + keywords + "&image_type=photo&safesearch=true&pretty=true";
    //console.log(APIcall)
    fetch(APIcall)
    .then(response => response.json())
    .then(data => 
        {
          if(!alreadyUsed.includes(data.hits[0].largeImageURL)){
            //console.log(keywords)
            //console.log(data.hits[0].tags)
            //console.log(data.hits[0].largeImageURL)

            alreadyUsed.push(data.hits[0].largeImageURL)

                
                  // Create the first image element
                  var img = document.createElement("img")
                  img.src = data.hits[0].largeImageURL
                  img.width = 300;
                  img.height = 300;


                      // Create a div to hold the images
                      const imageContainer = document.createElement("div");
                      imageContainer.style.display = "flex"; // set flex display to align images side by side
                      imageContainer.appendChild(img);
                      container.appendChild(img);

                      
          }
          
        }
    )
    .catch(error => 
      
      console.log()
      
      );


  }

