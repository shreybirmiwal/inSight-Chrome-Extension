
function isNoun(word) {
  
  var hasNumber = /\d/;   
  if(hasNumber.test(word)) return false;
  if(word.includes("+")) return false;
  if(word.includes("cookies")) return false;

  //const tagged = nltk.pos_tag([word])[0][1];
  //return (tagged.startsWith("NN"))

  return true
}

const alreadyUsed = [];


window.addEventListener("load", function() {
    setTimeout(function() {

      const filteredParagraphs = getText()
      
      // loop through each filtered paragraph
      for (let i = 0; i < filteredParagraphs.length; i++) {
        const keywords = extractKeywords(filteredParagraphs[i], 3, 3);
        if(keywords != undefined)
        getPicture(keywords)

      }
      
    }, 3000);
  });
  

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
    console.log(text)
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


  function getPicture(keywords){

    const APIcall = "https://pixabay.com/api/?key=34376048-2f9ac2d7ccc79a73414965560&q=" + keywords + "&image_type=photo&safesearch=true&pretty=true";
    //console.log(APIcall)
    fetch(APIcall)
    .then(response => response.json())
    .then(data => 
        {
          if(!alreadyUsed.includes(data.hits[0].largeImageURL)){
            console.log(keywords)
            console.log(data.hits[0].tags)
            console.log(data.hits[0].largeImageURL)
            alreadyUsed.push(data.hits[0].largeImageURL)
          }
          
        }
    )
    .catch(error => 
      
      console.log()
      
      );


  }