window.onload = async function fetchData(){
  let data = null

  try{
    data = await fetch("https://eulerity-hackathon.appspot.com/pets")
  }catch(err){
    console.error("There was an error fetching the API.")
    console.error(err)
    const errorContainerEle = document.getElementById("errorContainer")
    errorContainerEle.style.display = "block"
    errorContainerEle.innerText = "Whoops! There was an error retrieving the cute animals, sorry about that."
    return
  }

  data = await data.json()
  data.forEach(item => {
    createPetSubItem(item)
  })

  if(document.getElementById("errorContainer").style !== "block"){ //Only add back to top button if there is data
    const backToTopEle = document.createElement("button")
    const divEle = document.createElement("div")
    divEle.className = "backToTopContainer"
    backToTopEle.innerText = "Back to top"
    backToTopEle.className = "backToTopButton"
    backToTopEle.onclick = () => window.scrollTo({top: 0, behavior:'smooth'})
    divEle.appendChild(backToTopEle)
    document.body.appendChild(divEle)
  }

}

async function convertImageToBlob(url){ //Helper function to turn the image from the URL into a blob
  const imageData = await fetch(url)
  return await imageData.blob()
}

function get_url_extension( url ) { //Get the file extension of the URL
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

let imagesToDownload = [] //Array of objects to download

function createPetSubItem(item){
  const petContainerEle = document.getElementById("petsContainer")
  const petSubItemDiv = document.createElement("div")
  petSubItemDiv.className = "petSubItem"

  const titleSpan = document.createElement("span")
  titleSpan.className = "titleSpan"
  titleSpan.innerText = item.title

  const descriptionSpan = document.createElement("span")
  descriptionSpan.innerText = item.description

  const petImageDiv = document.createElement("div")
  petImageDiv.className = "petImageDiv"
  petImageDiv.style.backgroundImage = `url(${item.url})`

  const petImageText = document.createElement("span")
  petImageText.style.display = "none"
  petImageText.innerText = "Click to select"
  petImageText.className = "petImageText"

  petImageDiv.appendChild(petImageText)

  petImageDiv.onmousemove = () => {
    petImageText.style.display = "block"
    petImageDiv.style.opacity = ".6"
  }

  petImageDiv.onmouseleave = () => {
    petImageText.style.display = "none"
    petImageDiv.style.opacity = "1"
  }
  
  petSubItemDiv.appendChild(petImageDiv)
  petSubItemDiv.appendChild(titleSpan)
  petSubItemDiv.appendChild(descriptionSpan)

  const downloadButtonEle = document.getElementById("downloadButton")
  downloadButtonEle.className = "downloadButtonDisabled"

  petImageDiv.onclick = async () => {
    if(petImageDiv.className === "petImageDivSelected"){
      petImageDiv.className = "petImageDiv"
      petImageText.innerText = "Click to select"
      imagesToDownload = imagesToDownload.filter(downloadObj => downloadObj.url !== item.url) //Remove unselected URL
    }else{
      petImageDiv.className = "petImageDivSelected"
      petImageText.innerText = "Click to unselect"
      imagesToDownload.push({
        title : item.title,
        url : item.url
      }) 
    }
    if(imagesToDownload.length === 0){
      downloadButtonEle.className = "downloadButtonDisabled"
      downloadButtonEle.innerText = "Select images to download"
    }else{
      downloadButtonEle.innerText = `Download ${imagesToDownload.length} images`
      downloadButtonEle.className = "downloadButtonStyle"
      downloadButtonEle.onclick = () => {
        imagesToDownload.forEach(async urlItem => {
          const anchor = document.createElement("a")
          const url = window.URL.createObjectURL(await convertImageToBlob(urlItem.url))
          anchor.href = url
          anchor.download = `${urlItem.title}.${get_url_extension(urlItem.url)}`
          anchor.click()
        })
      }
    }
  }
  
  petContainerEle.appendChild(petSubItemDiv) 
}