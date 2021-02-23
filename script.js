let imagesToDownload = []

window.onload = async function fetchData(){
  let data = null
  try{
    data = await fetch("https://eulerity-hackathon.appspot.com/pets")
  }catch(err){
    console.error("There was an error fetching the API.")
    console.error(err)
    return
  }
  data = await data.json()
  data.forEach(item => {
    createPetSubItem(item)
  })
}

async function downloadImage(url){
  const imageData = await fetch(url)
  return await imageData.blob()
}

async function createPetSubItem(item){
  const petContainerEle = document.getElementById("petsContainer")
  const petSubItemDiv = document.createElement("div")

  const titleSpan = document.createElement("span")
  titleSpan.className = "titleSpan"
  const descriptionSpan = document.createElement("span")

  const imageHoverDiv = document.createElement("div")
  const imageText = document.createElement("span")
  imageText.style.display = "none"
  imageText.className = "imageHoverText"
  imageHoverDiv.appendChild(imageText)
  imageText.innerText = "Click to select"
  
  imageHoverDiv.className = "imageHoverDiv"
  imageHoverDiv.style.backgroundImage = `url(${item.url})`
  
  
  petSubItemDiv.className = "petSubItem"
  titleSpan.innerText = item.title
  descriptionSpan.innerText = item.description
  
  imageHoverDiv.onmousemove = () => {
    imageText.style.display = "block"
    imageHoverDiv.style.opacity = ".6"
  }
  imageHoverDiv.onmouseleave = () => {
    imageText.style.display = "none"
    imageHoverDiv.style.opacity = "1"
  }
  
  petSubItemDiv.appendChild(imageHoverDiv)
  petSubItemDiv.appendChild(titleSpan)
  petSubItemDiv.appendChild(descriptionSpan)

  const downloadButtonEle = document.getElementById("downloadButton")
  downloadButtonEle.style.backgroundColor = "gray"
  imageHoverDiv.onclick = async () => {
    if(imageHoverDiv.style.borderColor === "lightgreen"){
      imageHoverDiv.style.borderColor = "white"
      imageText.innerText = "Click to select"
      imagesToDownload = imagesToDownload.filter(url => url !== item.url)
    }else{
      imageText.innerText = "Click to unselect"
      imageHoverDiv.style.borderWidth = "thick"
      imageHoverDiv.style.borderStyle = "solid"
      imageHoverDiv.style.borderColor = "lightgreen"
      imagesToDownload.push(item.url)
    }
    if(imagesToDownload.length === 0){
      downloadButtonEle.style.backgroundColor = "gray"
      downloadButtonEle.innerText = "Select images to download"
    }else{
      downloadButtonEle.innerText = `Download ${imagesToDownload.length} images`
      downloadButtonEle.style.backgroundColor = "rgb(69, 177, 204)"
      downloadButtonEle.onclick = () => {
        imagesToDownload.forEach( async urlItem => {
          const anchor = document.createElement("a")
          const url = window.URL.createObjectURL(await downloadImage(urlItem))
          anchor.href = url
          anchor.download = "text.jpg"
          anchor.click()
        })
      }
    }
  }
  petContainerEle.appendChild(petSubItemDiv) 
}